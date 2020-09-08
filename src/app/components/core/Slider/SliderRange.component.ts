import { Component, ElementRef, HostBinding, OnInit, Input, Renderer } from '@angular/core';
import { SliderRange } from './Slider.types'

const percentize = (val: number) => val + '%'

@Component({
  selector: 'slider-range',
  template: `
    <ng-content></ng-content>
  `
})
export class SliderRangeComponent implements OnInit {
  @HostBinding('style.left') left: string
  @HostBinding('style.right') right: string
  @Input()
  set start (range: number) {
    this.left = percentize(range)
  }

  @Input()
  set end (range: number) {
    this.right = percentize(100 - range)
  }

  constructor() { }

  ngOnInit(

  ) { }
}