import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core'
import { sortBy, maxBy, minBy } from 'lodash'
import { invokeNonIE } from '../../../services/browser-utils'
import { drag, select } from 'd3'
import * as d3 from 'd3'

const axiesMatch = (a: ILink, b: ILink) => a.xAxis === b.xAxis && a.yAxis === b.yAxis
export interface ILink {
  xAxis: number
  yAxis: number
  id?: string
}
enum InputMode {
  Select = 'Select',
  Create = 'Create',
  Erase = 'Erase',
  Move = 'Move'
}
export interface IEditorToggleButton {
  disabled?: boolean
  value: InputMode | string
  locale: string
  iconClass: string
  id?: string
}

export interface IMapOptionEvent {
  event: Event,
  type: string,
  coordBoundary?: ICoordBoundary
  id?: string
}

export interface IMapOptionEvent {
  event: Event,
  type: string,
  coordBoundary?: ICoordBoundary
}

export enum PointType {
  LinkPoint = 'LinkPoint',
  Point = 'Point'
}

export interface IMapEditEvent {
  type: PointType
  point?: IPoint
  points?: Array<IPoint>
  hasBrokenLinks?: boolean
  previousPoint?: IPoint
}

export interface ICustomMapEditEvent extends IMapEditEvent {
  value: string
}

export interface ICoordBoundary {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export interface ICoord {
  xAxis?: number
  yAxis?: number
}

export interface IPoint extends ICoord {
  id: string
  uid: string
  label?: string
  position?: number
  textColour?: string
  isLinkedPoint?: boolean
  borderColour?: string
  backgroundColour?: string,
  details?: Array<string>
}

export interface ILinkData {
  link: Array<IPoint>,
  uid?: string,
  id: string
}
const strokeWidth = 4
const diff = (p1: IPoint, target: IPoint) => {
  const x = Math.abs(p1.xAxis - target.xAxis)
  const y = Math.abs(p1.yAxis - target.yAxis)
  return Math.sqrt((x * x) + (y * y))
}
const findClosestPoint = (point: IPoint, points: Array<IPoint>, unlinkedPoints?: Array<IPoint>) =>
  (unlinkedPoints || points)
  .reduce((acc, nextPoint) => {
    if (acc === null) {
      return nextPoint
    }

    if (diff(nextPoint, point) < diff(acc, point)) {
      return nextPoint
    }

    return acc
  }, null)

@Component({
  selector: 'map-editor',
  styleUrls: ['./MapEditor.component.scss'],
  templateUrl: './MapEditor.component.html'
})
export class MapEditorComponent implements AfterViewInit, OnChanges {
  @Input() height = 500
  @Input() width = 950
  @Input() xyRatio = 1.9
  @Input() minRangeX = 15
  @Input() minRangeY = 10
  xRange = 1
  yRange = 2
  @Input() minX = 0
  @Input() minY = 0
  @Input() maxX = 1
  @Input() maxY = 1
  @Input() linkEditEnabled = false
  @Input() points: Array<IPoint> = []
  @Input() linkedPoints: Array<IPoint> = []
  @Input() createDisabled = false
  @Input() mode: 'Edit' | 'View' = 'Edit'
  @Input() customToggleButtons: Array<IEditorToggleButton> = []
  @Input() panelTitleLocale = 'edit_mode'
  @Output() onMapOptionSelected = new EventEmitter<IMapOptionEvent>()
  @Output() onErased = new EventEmitter<IMapEditEvent>()
  @Output() onMove = new EventEmitter<IMapEditEvent>()
  @Output() onCreate = new EventEmitter<IMapEditEvent>()
  @Output() onCustomAction = new EventEmitter<ICustomMapEditEvent>()
  @Output() onSelected = new EventEmitter<IMapEditEvent>()

  coordBoundary: ICoordBoundary
  defaultModeToggles: Array<IEditorToggleButton> = [{
    value: InputMode.Select,
    id: 'mapEditorOptionSelect',
    locale: 'line_map_select_tooltip',
    iconClass: 'fa fa-mouse-pointer'
  }, {
    value: InputMode.Move,
    id: 'mapEditorOptionMove',
    locale: 'line_map_move_tooltip',
    iconClass: 'fa fa-arrows-alt'
  }, {
    value: InputMode.Create,
    id: 'mapEditorOptionCreate',
    locale: 'line_map_draw_tooltip',
    disabled: this.createDisabled,
    iconClass: 'fa fa-pencil'
  }, {
    value: InputMode.Erase,
    id: 'mapEditorOptionErase',
    locale: 'line_map_erase_tooltip',
    iconClass: 'fa fa-eraser'
  }]
  modeToggles: Array<IEditorToggleButton> = []
  inputMode: InputMode = InputMode.Select
  links: Array<ILinkData> = []
  xStep: number
  yStep: number
  normaliseY: number
  normaliseX: number
  pointRectWidth: number
  pointRectHeight: number
  yOffset: number
  newLink: ILinkData = null
  missingPoints = ''
  initialOptionsDialogCoords = {
    x: 100,
    y: 50
  }

  private svg: d3.Selection<any, any, any, any>
  @ViewChild('container') private container

  ngAfterViewInit () {
    const { nativeElement } = this.container
    const svgContainer = select(nativeElement)
    this.svg = svgContainer
      .append('g')
    this.svg.attr('input-mode', this.inputMode)
    this.createDefinitions()
    this.height = this.width / this.xyRatio
    svgContainer.attr('viewBox', `0 0 ${this.width} ${this.height}`)
  }

  ngOnInit () {
    this.modeToggles = this.mode === 'Edit'
      ? this.defaultModeToggles
        .filter(toggle => {
          if (this.linkEditEnabled === false && toggle.value === InputMode.Create) {
            return false
          }

          return true
        }).concat(this.customToggleButtons)
      : this.customToggleButtons

    if (this.modeToggles.length > 0) {
      this.inputMode = this.modeToggles[0].value as InputMode
    }
  }

  ngOnChanges (changes: SimpleChanges) {
    if (!this.svg) return

    if (changes.points) {
      this.setMapRange()
      this.updateLinkDataAndRender()
      this.adjustPoints()
    }
    if (changes.linkedPoints) {
      this.updateLinkDataAndRender()
      this.adjustPoints()
    }

    if (changes.minRangeX || changes.minRangeY) {
      this.readjustGrid()
    }

    if (changes.createDisabled) {
      const toggle = this.modeToggles.find(toggle => toggle.value === InputMode.Create)
      toggle.disabled = this.createDisabled
    }
  }

  setPointFlags () {
    const linkPoints = this.getOrderedLinkPoints()
    this.points.forEach(point => {
      const isLinkedPoint = !!linkPoints.find(pointN => pointN.id === point.id)
      point.isLinkedPoint = isLinkedPoint
    })
  }

  /**
   * Adds a new link and updates d3 link rende
   * @param d The point to link from
   */
  addLink (point: IPoint) {
    const point2 = findClosestPoint(this.calcLinkDragPosition() as any, this.points, this.getLinkablePoints(point, null))
    const link = {
      id: point.id + point2.id,
      link: [point, point2]
    }
    this.links = this.links.concat([link])

    this.renderLinks()
    return link
  }

  addPoints (event: Event) {
    this.onMapOptionSelected
      .emit({
        coordBoundary: this.coordBoundary,
        event,
        type: 'AddPoints'
      })
  }

  createDefinitions () {
    const definitions = this.svg.append('defs')
    definitions
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 5)
      .attr('refY', 0)
      .attr('markerWidth', 4)
      .attr('markerHeight', 4)
      .attr('orient', 'auto')
      .append('path')
      .style('stroke-width', 0)
      .attr('d', 'M-3,-5L7,0L-3,5')
      .attr('class', 'arrow-head')

    const filter = definitions.append('filter')
      .attr('id', 'drop-shadow')
      .attr('result', 'blur')

    filter
      .append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 5)
      .attr('result', 'blur')

    filter
      .append('feOffset')
      .attr('in', 'blur')
      .attr('dx', 5)
      .attr('dy', 5)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('result', 'offsetBlur')

    const feMerge = filter.append('feMerge')

    feMerge
      .append('feMergeNode')
      .attr('in', 'offsetBlur')

    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic')
  }

  createLinks (point: IPoint) {
    const link = this.links.find(link => link.link[0].id === point.id)

    if (!this.linkedPoints.some(linkPoint => linkPoint.id === link.link[0].id)) {
      this.emitCreateLinkPoint(link.link[0])
    }

    this.emitCreateLinkPoint(link.link[1])
  }

  // Any point which is not already pointed to in a link
  //  -> excluding the zone which is pointed to in currentLink
  getLinkablePoints (currentStartPoint: IPoint, currentEndPoint: IPoint) {
    const filtered = this.points
      .filter(point => !this.links.some(link => link.link[1].id === point.id))

    if (currentStartPoint && currentEndPoint) {
      return filtered.filter(p => p.id !== currentStartPoint.id).concat([currentEndPoint])
    }

    return filtered.filter(p => p.id !== currentStartPoint.id)
  }

  calculateSpacing () {
    this.xStep = this.width / (this.xRange + 1)
    this.yStep = this.height / (this.yRange + 1)
    this.normaliseY = this.minY * this.yStep
    this.normaliseX = this.minX * this.xStep
    // Point height at half of grid step size
    this.pointRectWidth = this.xStep * 0.5
    this.pointRectHeight = this.yStep * 0.5

    const halfHeight = this.pointRectHeight / 2
    this.yOffset = - this.normaliseY + halfHeight // Middle of rect
    this.svg.attr('transform', `translate(${this.xStep / 4}, ${this.yStep / 4})`)
  }

  dragNewLine (pointElem: d3.Selection<Element, any, any, any>, d: IPoint) {
    const link = this.links.find(l => l.link[0].id === d.id)
    const closestPoint = findClosestPoint(this.calcLinkDragPosition() as any, this.points, this.getLinkablePoints(
      link.link[0],
      link.link[1]
    ))

    this.svg.selectAll('g.link')
      .filter((l: ILinkData) => l.link[0].id === d.id)
      .select('path')
      .attr('d', (d: ILinkData) => this.linkD(d.link[0], closestPoint))
    return closestPoint
  }

  getExcludedPoints () {
    return this.linkedPoints.filter(pointN => this.links.some(l => l.link[1].id === pointN.id))
  }

  findPath (d, position: 'begin' | 'end' = 'begin') {
    const index = position === 'begin' ? 0 : 1
    const links = this.svg.selectAll('g.link')
    return links.filter(
        (dl: ILinkData) => dl.link[index].id === d.id).select('path')
  }

  getMissingPoints (points: Array<IPoint>) {
    return points
      .filter(
        point => !this.points.some(pointN => point.id === pointN.id)
      )
      .map(point => point.id).join(', ')
  }

  linkPoints () {
    if (this.linkedPoints.length === 0) {
      this.links = []
      this.missingPoints = ''
      return
    }

    this.missingPoints = this.getMissingPoints(this.linkedPoints)

    // Order connected points by position field
    const orderedLinkedPoints: Array<IPoint> = sortBy(this.linkedPoints, ['position'])

    this.links = orderedLinkedPoints.reduce((mapAcc, point, index) => {
      const nextPoint = orderedLinkedPoints[index + 1]
      if (nextPoint) {
        const point1 = this.points.find(pointN => pointN.id === point.id)
        const point2 = this.points.find(pointN => pointN.id === nextPoint.id)

        if (point1 && point2) {
          // We can create a link between points
          const id = point1.uid + point2.uid
          const existingLink = this.links.find(link => link.id === id)
          if (existingLink) {
            return mapAcc.concat([existingLink])
          }

          return mapAcc.concat([{
            id,
            link: [point1, point2]
          }])
        }
      }

      return mapAcc
    }, [])

  }

  getOrderedLinkPoints () {
    if (this.links.length === 0) return []

    const startLinks = this.links.filter((link) => !this.links.some(linkN => linkN.link[1].id === link.link[0].id))
    return startLinks.reduce((acc1, firstLink) => {
      return acc1.concat(this.links.reduce((acc, _, i) => {
        if (acc.nextLink === undefined) return acc

        const nextLink = this.links.find(linkN => linkN.link[0].id === acc.nextLink.link[1].id)

        if (i === 0) {
          return Object.assign(acc, {
            points: acc.points.concat([
              Object.assign({}, acc.nextLink.link[0], { position: acc1.length + acc.points.length }),
              Object.assign({}, acc.nextLink.link[1], { position: acc1.length + acc.points.length + 1 })
            ]),
            nextLink
          })

        }

        return Object.assign(acc, {
          points: acc.points.concat([
            Object.assign({}, acc.nextLink.link[1], { position: acc1.length + acc.points.length })
          ]),
          nextLink
        })
      }, { nextLink: firstLink, points: [] }).points)
    }, [])
  }

  handleLinkDrag (dragState: string, el, d: ILinkData) {
    switch (this.inputMode) {
      case InputMode.Move: {
        return this.repositionLink(dragState, el, d)
      }
      case InputMode.Erase: {
        return this.removeLink(d.link[1])
      }
      case InputMode.Create: return null
      case InputMode.Select: return this.onSelected.emit({
        type: PointType.LinkPoint,
        point: d.link[1]
      })
      default:
        if (dragState === 'start') {
          this.onCustomAction.emit({
            type: PointType.LinkPoint,
            value: this.inputMode,
            point: d.link[1],
            points: this.getOrderedLinkPoints()
          })
        }
    }
  }

  handleCreateLink (dragState: string, el, d: IPoint) {
    switch (dragState) {
      case 'start':
        if (this.links.find(l => l.link[0].id === d.id)) return void 0
        return this.addLink(d)
      case 'end':
        const closestPoint = this.dragNewLine(el, d)
        const link = this.links.find(link => link.link[0].id === d.id)
        link.link[1] = closestPoint
        this.adjustPoints()
        return this.createLinks(d)
      default: return this.dragNewLine(el, d)
    }

  }

  handlePointDrags (dragState: string, el, point: IPoint) {
    switch (this.inputMode) {
      case InputMode.Create: {
        if (this.linkEditEnabled === true) {
          this.handleCreateLink(dragState, el, point)
        }
        return undefined
      }
      case InputMode.Move: return this.repositionPointAndLinks(dragState, el, point)
      case InputMode.Erase: return this.removePoint(dragState, point)
      case InputMode.Select: return this.handleSelectPoint(dragState, point)
    }
  }

  /**
   * Find all links which don't have another pointing towards same id
   * return count
   */
  countStartPoints () {
    return this.links
      .filter((link) => !this.links.some(linkN => linkN.link[1].id === link.link[0].id))
      .length
  }

  readjustGrid () {
    this.setMapRange()
    this.calculateSpacing()
    this.adjustPoints()
    this.adjustLinks()
  }

  adjustPoints () {
    this.setPointFlags()
    const nodes = this.svg.selectAll('g.node')

    this.setPointSelection(
      nodes,
      nodes.selectAll('rect.point'),
      nodes.selectAll('text.label')
    )
  }

  adjustLinks () {
    const links = this.svg.selectAll('g.link')

    links
      .select('path')
      .attr('d', d => this.linkD(d['link'][0], d['link'][1]))
  }

  removeLink (point: IPoint) {
    this.links = this.links.filter(l => l.link[1].id !== point.id)
    this.adjustPoints()
    this.renderLinks()
    const points = this.getOrderedLinkPoints()
    const startCount = this.countStartPoints()

    this.onErased.emit({
      hasBrokenLinks: startCount > 1,
      type: PointType.LinkPoint,
      point,
      points
    })
  }

  /**
   * Main d3 render and event bind function
   */
  render () {
    this.calculateSpacing()

    this.renderLinks()
    this.renderPoints()
  }

  renderPoints () {
    const nodes = this.svg.selectAll('g.node')
      .data(() => this.points, (d: IPoint) => d.uid)

    const handlePointDrags = this.handlePointDrags.bind(this)
    const dragFn = drag()
      .on('start', function (d: IPoint) {
        const el = select(this)

        handlePointDrags('start', el, d)
      })
      .on('drag', function (d: IPoint) {
        const el = select(this)

        handlePointDrags('drag', el, d)
      })
      .on('end', (d: IPoint) => {
        handlePointDrags('end', null, d)
      })

    // Nodes representing points here
    const nodeEnter = nodes.enter()
      .append('g')
      .attr('class', 'node')
      .call(dragFn as any)

    const detailsEnter = nodeEnter.filter(d => !!d.details).append('text').attr('class', 'details')
    this
      .setPointSelection(
        nodeEnter,
        nodeEnter.append('rect').attr('class', 'point'),
        nodeEnter.append('text').attr('class', 'label')
      )
    const y = this.pointRectHeight + this.yOffset
    const pointRectHeight = this.pointRectHeight

    detailsEnter
      .each(function (d) {
        d.details
          .forEach((detail, i) => {
            select(this)
              .append('tspan')
              .attr('x', 0)
              .attr('y', (y * i) - (y * 0.07))
              .style('font-size', pointRectHeight * 0.35)
              .text(detail)
          })
      })

    nodes
      .exit()
      .remove()
  }

  renderLinks () {
    const links = this.svg.selectAll('g.link')
      .data(this.links, link => link['id'])
    const handleLinkDrag = this.handleLinkDrag.bind(this)
    const lineDragFn = drag()
      .on('start', function (d: ILinkData) {
        handleLinkDrag('start', select(this), d)
      })
      .on('drag', function (d: ILinkData) {
        handleLinkDrag('drag', select(this), d)
      })
      .on('end', function (d: ILinkData) {
        handleLinkDrag('end', select(this), d)
      })

    // Links which connect points for a path
    const linkEnter = links
      .enter()
      .insert('g')
      .attr('class', 'link')

    linkEnter
      .append('path')
      .attr('class', 'link')
      .on('mouseover', function () {
        select(this).attr('class', 'link hover')
      })
      .on('mouseout', function () {
        select(this).attr('class', 'link')
      })
      .style('stroke', ((d: IPoint) => d.backgroundColour || '#ccc') as any)
      .style('stroke-width', `${strokeWidth}px`)
      .style('stroke-linecap', 'round')
      .attr('d', d => this.linkD(d['link'][0], d['link'][0], false))
      .transition()
      .duration(500)
      .attr('d', d => this.linkD(d['link'][0], d['link'][1]))

    if (this.linkEditEnabled === true) {
      linkEnter
        .on('mouseover', function () {
          select(this).attr('class', 'link hover')
        })
        .on('mouseout', function () {
          select(this).attr('class', 'link')
        })
        .call(lineDragFn as any)
    }


    invokeNonIE(() =>
      linkEnter.attr('marker-end', 'url(#arrow)')
    )

    links
      .exit()
      .remove()
  }
  /**
   * If another link exists which d.link[1] = linkN.link[0]
   *   Then further points should be excluded
   *      Where further points are ones which any link attached
   *
   * @param dragState
   * @param linkEl
   * @param d
   */
  repositionLink (dragState: string, linkEl, d: ILinkData) {
    const linkEnd = d.link[1]

    // Is there another link attached to this point ?
    const attachedLink = this.links.find(linkN => linkN.link[0].id === linkEnd.id)
    const linkablePoints = this.getLinkablePoints(d.link[0], linkEnd)

    const linkable = attachedLink
      // We need to excluded any currently linked points
      ? linkablePoints.filter(point => !this.links.some(link => link.link[1].id === point.id || link.link[0].id === point.id))
      : linkablePoints

    const closestPoint = findClosestPoint(this.calcLinkDragPosition() as any, this.points, linkable)
    const matching = this.findPath(linkEnd)

    if (matching) {

      matching
        // .transition()
        // .duration(this.linkTransitionDuration)
        .attr('d', (d: ILinkData) => this.linkD(closestPoint, d.link[1]))
    }
    linkEl
      // .transition()
      // .duration(this.linkTransitionDuration)
      .attr('d', (d: any) => this.linkD(d.link[0], closestPoint))

    if (dragState === 'end') {
      if (attachedLink) {
        attachedLink.link[0] = closestPoint
      }
      const previousPoint = d.link[1]
      d.link[1] = closestPoint

      this.adjustPoints()
      this.onMove.emit({
        type: PointType.LinkPoint,
        points: this.getOrderedLinkPoints(),
        point: closestPoint,
        previousPoint
      })
    }

  }

  calcDragPosition () {
    const xAxis = Math.floor(d3.event.x / this.xStep) + this.minX
    const yAxis = Math.floor(d3.event.y / this.yStep) + this.minY
    return { xAxis, yAxis }
  }

  handleSelectPoint (dragState: string, point: IPoint) {
    if (dragState === 'start') {

      this.onSelected.emit({
        type: PointType.Point,
        point
      })
    }
  }

  /**
   * Changes svg attribute so that styles can be changed based upon input mode
   * @param event A click event
   */
  setInputMode (event) {
    this.inputMode = event.source.value
    this.svg.attr('input-mode', this.inputMode)
  }

  /**
   * Visually updates the selection of rects & text
   * @param selection
   * @param rects
   * @param textSelection
   */
  setPointSelection (selection, rects, textSelection) {
    selection.attr('transform', this.transformNode.bind(this))
    const pointsById = this.points.reduce((acc, point) => Object.assign(acc, { [point.id]: point }), {})
    const rectStrokeWidth = 2
    rects
      .attr('width', this.pointRectWidth)
      .attr('height', this.pointRectHeight)
      .attr('rx', rectStrokeWidth * 2)
      .attr('ry', rectStrokeWidth * 2)
      .style('fill', (point: IPoint) => {
        const pointN = pointsById[point.id] || {}
        return pointN.backgroundColour || 'white'
      })
      .style('stroke', '#a0a0a0')
      .style('stroke-width', `${rectStrokeWidth}px`)
      .style('stroke-dasharray',
        (point: IPoint) => {
          // TODO: Get to bottom of why point data is not latest updated point
          const pointN = pointsById[point.id]
          return this.linkedPoints.length === 0 || (pointN || point).isLinkedPoint ? '' : '5, 5'
        })

    const textY = this.pointRectHeight * 0.5
    textSelection
      .attr('y', textY)
      .attr('x', this.pointRectWidth * 0.5)
      .attr('dy', `${this.pointRectHeight * 0.01}em` )
      .attr('text-anchor', 'middle')
      .style('font-size', textY)
      .style('fill', (point: IPoint) => {
        // const pointN = pointsById[point.id] || {}
        return  point.textColour || 'black'
      })
      .attr('class', (point: IPoint) => point.isLinkedPoint ? 'linked-point' : '')
      .text((d: IPoint) => d.label)
  }

  removePoint (dragState: string, point: IPoint) {
    if (dragState === 'start' && this.points.length > 0) {
      const compar = pointN => pointN.id !== point.id
      this.points = this.points.filter(compar)

      const linkPoint = this.linkedPoints.find(pointN => pointN.id === point.id)
      if (linkPoint) {
        const filteredPoints = this.linkedPoints.filter(compar)

        this.linkedPoints = filteredPoints.length === 1 ? [] : filteredPoints
        if (this.linkEditEnabled) {
          // Create new set of links
          this.linkPoints()
          this.onErased.emit({
            type: PointType.LinkPoint,
            point: linkPoint,
            points: this.getOrderedLinkPoints()
          })
        }
      }

      this.render()
      this.onErased.emit({
        type: PointType.Point,
        point,
        points: this.points
      })
    }
  }

  updateLinkDataAndRender () {
    this.linkPoints()
    this.render()
  }

  private emitCreateLinkPoint (point: IPoint) {
    this.onCreate.emit({
      type: PointType.LinkPoint,
      point,
      points: this.getOrderedLinkPoints(),
      hasBrokenLinks: this.countStartPoints() > 1
    })
  }

  private repositionPointAndLinks (dragState, pointElem, d: IPoint) {
    if (dragState === 'start') return

    /**
     * Updatas the paths for all lines points which are connected to a certain id which may have changed
     * @param id The id which repositionable links will contain
     */
    const repositionLinks = (id: string) => {
      return this.svg.selectAll('g.link')
        .filter((l: ILinkData) => l.link[0].id === id || l.link[1].id === id)
        .select('path')
        .attr('d', (d: ILinkData) => this.linkD(d.link[0], d.link[1]))
    }

    const nextCoords = this.calcDragPosition()
    if (nextCoords.xAxis >= this.minX && nextCoords.yAxis >= this.minY) {

      // Stop here if another element is already placed in this position
      const isMatchingCoords = point => axiesMatch(point, nextCoords)
      if (!this.points.some(isMatchingCoords)) {
        Object.assign(d, nextCoords)
        pointElem
          .attr('transform', (d: IPoint) => {
            return this.transformNode(d)
          })

        repositionLinks(d.id)
        this.adjustPoints()
      }
    }

    if (dragState === 'end') {
      this.onMove.emit({
        type: PointType.Point,
        point: d
      })
    }
  }

  /**
   * Gets a translation string from a points x/y axis positions
   * @param d
   */
  private transformNode (d: IPoint) {
    const x = (d.xAxis * this.xStep) - this.normaliseX
    const y = (d.yAxis * this.yStep) - this.normaliseY
    return `translate(${x}, ${y})`
  }

  /**
   *  Calculates map coordinate bounderies and sets results to class instance
   *
   * NOTE: Should only be called when new line map is displayed/when adjusting the grid range
   */
  private setMapRange () {
    const { points } = this

    /**
     * Gets min & maxs values out of a series of numbers and also the difference between those points
     * @param propNames
     */
    const getRange = (propName, minimum = 1, minimumRange = 15) => {
      const filteredPoints = points.filter(point => point.xAxis > -1 && point.yAxis > -1)
      if (filteredPoints.length > 0) {
        const min = +minBy(filteredPoints, propName)[propName]
        const maxResult = +maxBy(filteredPoints, propName)[propName]
        const potentialRange = maxResult - min
        const range = potentialRange < minimumRange ? minimumRange : potentialRange

        return {
          min, max: min + range, range
        }
      }

      return {
        min: minimum, max: minimum + minimumRange, range: minimumRange
      }
    }
    const xRange = getRange('xAxis', 1, this.minRangeX)
    const yRange = getRange('yAxis', 1, this.minRangeY)
    this.xRange = xRange.range
    this.yRange = yRange.range
    this.maxX = xRange.max
    this.maxY = yRange.max
    this.minX = xRange.min
    this.minY = yRange.min

    this.coordBoundary = {
      minX: this.minX,
      minY: this.minY,
      maxX: this.maxX,
      maxY: this.maxY
    }
  }

  /**
   * Calulate which position the mouse is positioned on grid
   */
  private calcLinkDragPosition () {
    this.calculateSpacing()
    const xAxis = Math.floor(d3.event.x / this.xStep) + this.minX
    const yAxis = Math.floor(d3.event.y / this.yStep) + this.minY
    return { xAxis, yAxis }
  }

  /**
   * Calculates a path between a set of 2 points
   * @param point1 The first Point
   * @param point2 The second Point
   */

  private linkD (point1: IPoint, point2: IPoint, adjustPoint2 = true) {
    const xAxis0 = point1.xAxis
    const xAxis1 = point2.xAxis
    // Depending on point coordinates calculates starting/end point info
    const width0 = xAxis1 < xAxis0 ? 0 : this.pointRectWidth
    const width1 = adjustPoint2 === false || (xAxis1 < xAxis0) ? this.pointRectWidth : 0
    const strokeWidth0 = xAxis1 < xAxis0 ? -strokeWidth : strokeWidth
    const strokeWidth1 = adjustPoint2 === false || (xAxis1 < xAxis0) ? strokeWidth : -strokeWidth
    const { xStep, yStep, normaliseX, yOffset } = this

    // const diaganol = (s, d) => `
    //   M ${s.y} ${s.x}
    //   C ${(s.y + d.y) / 1} ${s.x},
    //     ${(s.y + d.y) / 1} ${d.x},
    //     ${d.y} ${d.x}
    // `
    // return diaganol({
    //   y: (xAxis0 * xStep) + strokeWidth0 - normaliseX + width0,
    //   x: (point1.yAxis * yStep) + yOffset
    // }, {
    //   y: (xAxis1 * xStep) + strokeWidth1 - normaliseX + width1,
    //   x: (point2.yAxis * yStep) + yOffset
    // })
    return `
      M ${(xAxis0 * xStep) + strokeWidth0 - normaliseX + width0 } ${(point1.yAxis * yStep) + yOffset}
      L ${(xAxis1 * xStep) + strokeWidth1 - normaliseX + width1 } ${(point2.yAxis * yStep) + yOffset}
    `
  }

}
