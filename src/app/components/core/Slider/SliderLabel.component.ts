import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'slider-label',
  template: `
    {{label}}
  `
})

export class SliderLabelComponent implements OnInit {
  @Input() label: string
  constructor() { }

  ngOnInit() { }
}