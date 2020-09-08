// import { Component, Inject, Input, Output, OnInit, OnChanges, Pipe, PipeTransform } from '@angular/core'

// /**
//  * @description
//  * Wraps uib-popup to provide a iconised training tip popup
//  */
// @Component({
//   selector: 'c-training-tip',
//   templateUrl: './TrainingTip.html'
// })
// export class TrainingTip implements OnInit {
//   @Input('<') enabled: boolean
//   @Input('@') tipHtml: string
//   @Input('<') openDelay: number
//   @Input('<') closeDelay: number
//   @Input('@') placement: string
//   @Input('@') iconClass: string

//   ngOnInit () {
//     const { closeDelay = 1000 } = this
//     const { openDelay = 1000 } = this
//   }

//   ngOnChanges (changes) {
//     if (changes.tipHtml) {
//       // Add hand pointer to each heading
//       //        this.tipHtml = this.tipHtml.replace(/<h4>/g,'<h4><span class=\"fa fa-hand-o-right\"></span>&nbsp;')
//       //      this.tipHtml = this.tipHtml.replace(/<h4 class=\"help-warning\">/g,'<h4><span class=\"fa fa-warning\"></span>&nbsp;')
//     }

//   }
// }
