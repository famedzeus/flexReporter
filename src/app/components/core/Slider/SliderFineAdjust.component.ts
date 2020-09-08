import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export enum AdjustmentType {
  Increment,
  Decrement
}

@Component({
  selector: 'slider-fine-adjust',
  template: `
    <a (click)="decrement($event)" (mousedown)="stopProp($event)">
      <i class="fa fa-chevron-left"></i>
    </a>
    <span>{{displayValue}}</span>
    <a (click)="increment($event)" (mousedown)="stopProp($event)">
      <i class="fa fa-chevron-right"></i>
    </a>
  `
})

export class SliderFineAdjustComponent implements OnInit {
  @Input() displayValue: string = ''
  @Output() onAdjust = new EventEmitter<AdjustmentType>()

  constructor() { }

  ngOnInit() { }

  stopProp (event: Event) {
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
  }

  decrement (event: Event) {
    this.stopProp(event)
    this.onAdjust.emit(AdjustmentType.Decrement)
  }

  increment (event: Event) {
    this.stopProp(event)
    this.onAdjust.emit(AdjustmentType.Increment)
  }
}