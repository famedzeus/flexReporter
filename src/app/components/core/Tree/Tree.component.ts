import { Component, EventEmitter, Input, Output, ViewChild, OnChanges, AfterViewInit, SimpleChanges, ViewEncapsulation } from '@angular/core'
import { Log } from 'services'
import { hierarchy, select, tree, Selection } from 'd3'
import { max } from 'lodash'
import { getBoundOffset } from '../../../services/browser-utils';

/** Recursive tree data structure */
export interface ITree {
  name?: string,
  children ?: Array<ITree>
}

const diaganol = (s, d) => `
  M ${s.y} ${s.x}
  C ${(s.y + d.y) / 2} ${s.x},
    ${(s.y + d.y) / 2} ${d.x},
    ${d.y} ${d.x}
`
/**
 * An interactive SVG tree visualisation component.  Uses D3
 */
@Component({
  selector: 'tree',
  styleUrls: ['./Tree.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
  <div #divContainer>
    <svg #container
      (click)="maybeAction($event)"
      viewBox="0 0 950 300"
      preserveAspectRatio="xMinYMin meet"></svg>
  </div>
  `
})
export class TreeComponent implements AfterViewInit, OnChanges {
  @Input() treeDataset: ITree = {}
  @Input() collapsible = true
  @Output() onClickNode = new EventEmitter()
  @ViewChild('container') container
  @ViewChild('divContainer') divContainer
  svg: Selection<any, any, any, any>
  margin = {top: 20, right: 90, bottom: 30, left: 90}
  width = 950 - 180
  height = 300 - 50

  private tree = tree()
  private root
  private i = 0
  private duration = 750
  private clickPending = false

  /**
   * Angular life cycle event handler
   *
   * Finds svg element and initialisated data structure / first rendering pass
   */
  ngAfterViewInit () {
    const { nativeElement } = this.container
    this.svg = select(nativeElement)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)

    this.tree.size([this.height, this.width])
    this.initialiseRender()
  }

  ngOnChanges (changes: SimpleChanges) {
    const datasetChanges = changes['treeDataset']

    if (!datasetChanges) return

    if (this.treeDataset && this.svg) {
      this.initialiseRender()
    }
  }

  /**
   * Render tree, set tree transition animations and click callbacks
   * @param source
   */
  updateTree (source) {
    const treeData = this.tree(this.root)

    const nodes = treeData.descendants()
    const links = treeData.descendants().slice(1)

    // Create nodes & transitions
    const node = this.svg.selectAll('g.node')
      .data(nodes, d => d['id'] || (d['id'] = ++this.i))

    const nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${source.y0}, ${source.x0})`)
      .on('click', d => this.onNodeClick(d))

    nodeEnter
      .append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style('fill', (d: any) => d._children ? 'lightsteelblue' : '#fff')

    nodeEnter
      .append('text')
      .attr('dy', '.35em')
      .attr('x', d => d.children || d['_children'] ? -13 : 13)
      .attr('text-anchor', d => d.children || d['_children'] ? 'end' : 'start')
      .text(d => d.data['name'])

    const nodeUpdate = nodeEnter.merge(node)

    nodeUpdate
      .transition()
      .duration(this.duration)
      .attr('transform', d => `translate(${d.y}, ${d.x})`)

    nodeUpdate
      .select('circle.node')
      .attr('r', 10)
      .style('fill', d => d['_children'] ? 'lightsteelblue' : '#fff')
      .attr('cursor', 'pointer')

    const nodeExit = node.exit()
      .transition()
      .duration(this.duration)
      .attr('transform', d => `translate(${source.y}, ${source.x})`)
      .remove()

    nodeExit
      .select('circle')
      .attr('r', 1e-6)

    nodeExit.select('text')
      .style('fill-opacity', 1e-6)

    // Create links and transitions
    const link = this.svg
      .selectAll('path.link')
      .data(links, d => d['id'])

    const datasetDiagonal = d => {
      const o = { x: source.x0, y: source.y0 }
      return diaganol(o, o)
    }

    const linkEnter = link.enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('d', datasetDiagonal)
      .on('click', d => this.onNodeClick(d))

    const linkUpdate = linkEnter.merge(link)

    linkUpdate.transition()
      .duration(this.duration)
      .attr('d', d => diaganol(d, d.parent))

    link.exit()
      .transition()
      .duration(this.duration)
      .attr('d', datasetDiagonal)
      .remove()

    nodes.forEach(d => {
      d['x0'] = d.x
      d['y0'] = d.y
    })
  }

  onNodeClick (d) {
    if (this.collapsible) {
      this.toggleCollapse(d)
    }
    this.updateTree(d)
    this.clickPending = d
  }

  maybeAction (event) {
    if (this.clickPending) {
      // Calculate difference in mouse position and svg container in reference to viewport
      const offset = getBoundOffset(this.divContainer.nativeElement, /^body/i)

      this.onClickNode.emit({
        event,
        offsetX: event.pageX - offset.x,
        offsetY: event.pageY - offset.y,
        node: this.clickPending
      })
      this.clickPending = false
    }
  }

  private initialiseRender () {
    this.root = hierarchy<{ id: number, children: any, _children: any }>(this.treeDataset as any, d => d.children)
    this.root.x0 = this.height / 2
    this.root.y0 = 0

    // If tree is collapsible - manipulate tree to collapse
    if (this.collapsible && this.root.children) this.root.children.forEach(d => this.collapse(d))

    // Create/render initial tree node visualisation
    this.updateTree(this.root)
  }

  private getMaxDepth (d, currentMax = 0) {
    if (d.children) {
      const childMax = max<number>(d.children.map(child => this.getMaxDepth(child), d.depth))
      return Math.max(currentMax, childMax)
    } else {
      return Math.max(d.depth, currentMax)
    }
  }

  /**
   * Hide all children recursively so they do not display on next d3 update
   */
  private collapse (d) {
    if (d.children) {
      d._children = d.children
      d._children.forEach(d => this.collapse(d))
      d.children = null
    }
  }

  private toggleCollapse (d) {
    if (d.children) {
      d._children = d.children
      this.collapse(d)
      d.children = null
    } else {
      d.children = d._children
      d._children = null
    }
  }
}
