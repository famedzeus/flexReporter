import { Component, Input, OnInit } from '@angular/core';

export enum LoadingDialogMessageStatus {
  Error = 'error'
}
export interface LoadingDialogMessage {
  status: string
  message: string
}
// <div class="cogs">
    //   <i class="fa fa-cog fa-spin-backwards"></i>
    //   <i class="fa fa-cog fa-spin secondary-cog"></i>
    // </div>
    
@Component({
  selector: 'cog-activity',
  styleUrls: ['./CogActivityPanel.component.scss'],
  template: `
  <div 
    [class]="'msg-box eases ' + status" [style.background-position]="position+'px'">
    <h4>{{message | translate}}</h4>
    <button
      *ngIf="status === 'error'"
      class="btn btn-primary"
      type="button"
      ng-click="close()">Close</button>
  </div>

`
})

    // <svg width="100%">
    //   <rect *ngFor="let bar of randomBars; let i = index" [attr.x]="i*30" [attr.y]="bar.y" width="20" [attr.height]="40" fill="#ddd" />
    // </svg>

export class CogActivityComponent {
  @Input() status: string
  @Input() message: string = ''
  
  bouncer
  randomBars = []
  zoom = 1
  position = -100

  constructor () {
    
    this.bouncer = setInterval(()=>{
      this.position -= 4
    },100)

    for(let i = 0; i < 40 ; i++){
      this.randomBars.push({direction:1,speed:1,y:0})
    }
  }

  close () {

  }

  waveBars(){
    this.randomBars.forEach((bar,index) => {
      bar.y += Math.sin(index) * bar.speed
      if(bar.y <= 0 || bar.y >= 100){
        bar.speed = -bar.speed
      }
    })
  }

  randomizeBars(){
    this.zoom -= 0.01
    this.randomBars = this.randomBars.map(bar => {
      let v = Math.random()*2
      return  v > 1 ? bar-10 : bar+10
    })
  }

}
