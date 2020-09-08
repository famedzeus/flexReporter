import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'slider-scale',
  template: `
    <span *ngIf="displayLimits">{{startDisplayValue}}</span>
    <span *ngIf="displayLimits">{{endDisplayValue}}</span>
  `
})

export class SliderScaleComponent implements OnInit {
  @Input() displayLimits: boolean = false
  @Input() endDisplayValue: string
  @Input() startDisplayValue: string
  constructor() { }

  ngOnInit() { }
}