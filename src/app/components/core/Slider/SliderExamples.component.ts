// import { Component, OnInit } from '@angular/core'
// import { SliderHandle } from './Slider.types'
// import * as moment from 'moment'

// const transformVal = (val: number) => moment(val).format('hh:mm')
// const transformValFine = (val: number) => moment(val).format('hh:mm:ss')
// const start = (new Date).getTime()
// @Component({
//   selector: 'slider-examples',
//   template: `
//     <vs-slider
//       [handles]="handles"
//       [start]="${start - 100000}"
//       [end]="${start + 1000000000}"
//       [labelTransform]="transformVal"
//       [transformFine]="transformValFine"
//       [rangeIndices]="ranges"></vs-slider>
//   `
// })

// export class SliderExamplesComponent implements OnInit {
//   handles: Array<SliderHandle> = [{
//     value: start + 100000000,
//     label: 'test'
//   }, {
//     value: start + 400000000
//   }, {
//     value: start + 500000000
//   }, {
//     value: start + 900000000
//   }]
//   start = (new Date).getTime()

//   ranges = [
//     [0, 1],
//     [2, 3]
//   ]
//   transformVal = transformVal
//   transformValFine = transformValFine

//   constructor() { }

//   ngOnInit() { }
// }