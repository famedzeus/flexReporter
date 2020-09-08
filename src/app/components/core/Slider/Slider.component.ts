import { Component, ElementRef, EventEmitter, Input, HostBinding, HostListener, QueryList, OnInit, Output, SimpleChanges, ViewChildren, ViewEncapsulation } from '@angular/core';
import { sortBy, round, maxBy, minBy } from 'lodash'

import { SliderHandleComponent } from './SliderHandle.component'
import { SliderHandle, SliderRange } from './Slider.types'
import { AdjustmentType } from './SliderFineAdjust.component'
import { getBoundOffset } from '../../../services/browser-utils'

interface HandleCoords {
  offset: {
    x: number
    y: number
  }
  height: number
  width: number
}

interface HandleBox {
  left: number
  right: number
  top: number
  bottom: number
}

@Component({
  selector: 'vs-slider',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./Slider.component.scss'],
  template: `
    <div>
      <slider-handle *ngFor="let handle of calculatedHandles; let i = index"
        [handleColour]="handle.handleColour"
        [handle]="handle.snappedPercentage"
        [label]="handle.label"
        [fineAdjust]="enableFineAdjust && handle.active"
        [fineLabel]="handle.fineLabel"
        [style.z-index]="1000 - heightAdjustments[i] || 0"
        [style.height]="(minHandleHeight + (heightAdjustments[i] || 0)) + 'px'"
        (onAdjust)="fineAdjust($event, handle)"
        (onDrag)="updateHandle($event, handle)"></slider-handle>
      <slider-range
        *ngFor="let range of ranges"
        [start]="range.sliderHandleStart.snappedPercentage"
        [end]="range.sliderHandleEnd.snappedPercentage"></slider-range>
      <slider-scale
        [displayLimits]="displayLimits"
        [endDisplayValue]="labelTransform(end)"
        [startDisplayValue]="labelTransform(start)"></slider-scale>
    </div>
  `
})
export class SliderComponent implements OnInit {
  @Output() onHandleUpdated = new EventEmitter()
  @Input() labels: Array<string> = []
  @Input() labelTransform: (value: number) => string = value => value.toString()
  @Input() transformFine: (value: number) => string = this.labelTransform
  @Input() handles: Array<SliderHandle> = []
  @Input() rangeIndices: Array<[number, number]> = []
  @Input() enableFineAdjust: boolean = false
  @Input() displayLimits: boolean = false
  @Input() start = 0
  @Input() end = 10
  @Input() fineAdjustmentValue = 1000
  @Input() minHandleHeight = 20
  @Input() precision = 0
  @HostListener('mouseleave', ['$event.target']) a () {
    this.calculatedHandles
      .forEach(handle => {
        handle.active = false
      })
  }
  @ViewChildren(SliderHandleComponent) labelChildren: QueryList<SliderHandleComponent>
  heightAdjustments = []
  calculatedHandles = []

  ranges: Array<SliderRange>

  constructor(
    private el: ElementRef
  ) {}

  toBox (handle: HandleCoords) : HandleBox {
    return {
      left: handle.offset.x,
      right: handle.offset.x + handle.width,
      // Reverse coord direction
      top: 100000 - handle.offset.y + handle.height,
      bottom: 100000 - handle.offset.y
    }
  }

  doCoordsClash (b1: HandleBox, b2: HandleBox) {
    return !(
      b1.right < b2.left
      || b1.left > b2.right
      || b1.bottom > b2.top
      || b1.top < b2.bottom
    )
  }

  adjustHandleHeights () {
    const boxes: Array<HandleBox> = this.labelChildren
      .map(child => this.toBox({
        offset: getBoundOffset(child.sliderLabel.nativeElement, new RegExp('body', 'gi')),
        height: child.sliderLabel.nativeElement.clientHeight,
        width: child.sliderLabel.nativeElement.clientWidth
      }))

    const min = minBy(boxes, box => box.bottom)
    // chop heights to be relative to 0
    const cutBoxes = boxes
      .map(box => {
        return {
          ...box, bottom: box.bottom - min.bottom, top: box.top - min.bottom
        }
      })

    const result = cutBoxes
      .reduceRight<Array<HandleBox>>((acc, box) => {
        if (acc.length === 0) {
          return cutBoxes
        }

        const clashingBoxes = acc
          .filter(boxN => {
            if (boxN === box) return false

            return this.doCoordsClash(box, boxN)
          })

        if (clashingBoxes.length === 0) {
          // if no boxes clash - see if curent box can be lowered
          // NOTE: should really check multiple 'levels'
          return acc.map(boxN => {

            if (boxN === box) {
              const newBox = {
                ...boxN,
                bottom: 0,
                top: boxN.top - boxN.bottom
              }

              if (!acc.some(box => this.doCoordsClash(box, newBox))) {
                return newBox
              }
            }

            return boxN
          })
        }

        // Box clashes with another - adjust height of current box
        return acc
          .map(boxN => {
            if (boxN === box) {
              const max = maxBy(clashingBoxes, 'top')
              const diff = Math.abs(max.top - boxN.top)
              return {
                ...boxN,
                bottom: max.top + 1,
                top: max.top + (box.top - box.bottom) + 1
              }
            }

            return boxN
          })
      }, [])

    // adjust slider heights by box position from  'bottom'
    this.heightAdjustments = result.map(box => box.bottom)
  }

  ngAfterViewInit () {
    this.adjustHandleHeights()
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

    if (changes.handles || changes.start || changes.end) {
      this.calculatedHandles = this.calcHandles(this.handles)

      if (this.labelChildren) {
        this.adjustHandleHeights()
      }
    }

    if (this.calculatedHandles.length > 0 && this.rangeIndices.length > 0) {
      this.ranges = this.rangeIndices
        .map(rangeIndex => {
          return {
            sliderHandleStart: this.calculatedHandles[rangeIndex[0]],
            sliderHandleEnd: this.calculatedHandles[rangeIndex[1]]
          }
        })
    }
  }

  calcHandle (handle: SliderHandle) {
    const val = handle.value - this.start
    const range = this.end - this.start
    const percentage = (val / range) * 100
    const cappedPerc =  Math.min(Math.max(0, percentage), 100)
    const value = this.interpolate(cappedPerc)

    return {
      ...handle,
      value,
      percentage,
      snappedPercentage: ((value - this.start) / range) * 100,
      label: this.labelTransform(value),
    }
  }

  calcHandles (handles: Array<SliderHandle>) {
    return handles
      .map(handle => this.calcHandle(handle))
  }

  /**
   * Does a 'fine asjustment' of a current handle value then outputs the update
   */
  fineAdjust (adjustmentType: AdjustmentType, handle: SliderHandle) {
    handle.value += (adjustmentType === AdjustmentType.Increment)
      ? this.fineAdjustmentValue
      // (Else Decrement)
      : -this.fineAdjustmentValue
    // Calculate new values based upon adjustment
    const calcHandle = this.calcHandle(handle)
    handle.snappedPercentage = calcHandle.percentage
    handle.label = this.labelTransform(handle.value)
    handle.fineLabel = this.transformFine(handle.value)
    // Tell the outside world
    this.emitHandleUpdate(handle, true)
  }

  /**
   * Calculates a new slider value based upon a percentage
   */
  interpolate (perc: number) {
    const rangeDiff = this.end - this.start
    return round((rangeDiff / 100) * perc, this.precision) + this.start
  }

  updateHandle (event, handle: SliderHandle) {
    this.calculatedHandles
      .forEach(handle => {
        handle.active = false
      })

    handle.active = true

    if (event.dragCompleted) {

      return this.emitHandleUpdate(handle, true)
    }
    const el: HTMLElement = this.el.nativeElement


    const diff = (event.x / el.clientWidth) * 100

    const sorted = sortBy(this.calculatedHandles)
    const index = sorted.indexOf(handle)
    const prevHandle = sorted[index - 1] || { percentage: 0 }
    const nextHandle = sorted[index + 1] || { percentage: 100 }

    const nextVal = handle.percentage + diff
    if (nextVal > nextHandle.percentage) {
      handle.percentage = nextHandle.percentage
    } else if (nextVal < prevHandle.percentage) {
      handle.percentage = prevHandle.percentage
    } else {
      handle.percentage =  handle.percentage + diff
    }

    handle.value = this.interpolate(handle.percentage)
    handle.label = this.labelTransform(handle.value)
    handle.fineLabel = this.transformFine(handle.value)
    handle.snappedPercentage = this.calcHandle(handle).snappedPercentage

    this.adjustHandleHeights()
    this.emitHandleUpdate(handle, false)
  }

  emitHandleUpdate (handle: SliderHandle, dragCompleted: boolean) {
    this.onHandleUpdated
      .emit({
        dragCompleted,
        changed: handle,
        index: this.calculatedHandles.indexOf(handle),
        handles: this.calculatedHandles
      })
  }
}
