import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, Output, ViewChild } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { SliderLabelComponent } from './SliderLabel.component'
import { SliderHandle } from './Slider.types'
import { AdjustmentType } from './SliderFineAdjust.component'

const percentize = (val: number) => val + '%'

/**
 * Component responsible for slider handle interaction tracking and label display (via child components)
 */
@Component({
  selector: 'slider-handle',
  template: `
    <slider-label [label]="label"></slider-label>
    <slider-fine-adjust
      *ngIf="fineAdjust"
      [displayValue]="fineLabel"
      (onAdjust)="onAdjust.emit($event)"></slider-fine-adjust>
  `
})
export class SliderHandleComponent implements OnDestroy, AfterViewInit {
  @ViewChild(SliderLabelComponent, { read: ElementRef }) sliderLabel: ElementRef
  @HostBinding('style.left') left: string
  @Input()
  @HostBinding('style.background') handleColour: string
  _handle
  @Input()
  set handle (handle: number) {
    this._handle = handle
    this.left = percentize(handle)
  }
  @Input() fineAdjust: boolean = false
  @Input() fineLabel: string = ''
  @Input() label: string = ''
  @Output() onDrag = new EventEmitter()
  @Output() onAdjust = new EventEmitter<AdjustmentType>()
  private subscriptions: Array<Subscription> = []

  constructor(private el: ElementRef) { }

  ngOnDestroy () {
    this.unsubscribe()
  }

  ngAfterViewInit() {
    this.subscribeToDrags()
  }

  /**
   * Subscribes to mouse events and tracks/emits drag differences
   */
  subscribeToDrags () {
    // Create rxjs Observables from DOM events
    const mousedown = Observable.fromEvent(this.el.nativeElement, 'mousedown')
    const mousemove = Observable.fromEvent(document, 'mousemove')
    const mouseup = Observable.fromEvent(document, 'mouseup')

    // Subscribe to mouse drag events
    this.subscriptions = this.subscriptions
      .concat([
        mousedown
          .flatMap((event: MouseEvent) => {
            event.preventDefault()
            // Use mutatable var to track postionsal difference between events
            let lastX = event.clientX
            return mousemove
              // Map a mouse move to difference of X from previous event
              .map((event: MouseEvent) => {
                // map to difference between previous mouse position
                const diff = event.clientX - lastX
                lastX = event.clientX
                return diff
              })
              .takeUntil(mouseup)
          })
          // Emit mouse drag difference
          .subscribe(diff => this.onDrag.emit({ x: diff, dragCompleted: false })),

        mousedown
          // Drag end
          .flatMap((event: MouseEvent) => {
            return mousemove
              .skipUntil(mouseup)
              .first()
          })
          // Emit drag has completed
          .subscribe(() => this.onDrag.emit({ x: null, dragCompleted: true }))

      ])
  }

  /**
   * Unsubscribe any Subscriptions
   */
  unsubscribe (): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }
}