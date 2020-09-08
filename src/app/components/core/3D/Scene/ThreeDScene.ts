import { Component, Inject, EventEmitter, Output, Injectable, Input, OnInit, OnChanges } from '@angular/core'

import { ThreeDScene } from './ThreeDScene.service'
import { ElementRef } from '@angular/core'


@Component({
  selector: 'c-3d-scene',
  templateUrl: './template.html'
})
export class ThreeDSceneComponent implements OnInit {

  @Input() model:string
  @Input() material:string
  @Input() props:object
  @Input() globals:object
  @Output() update = new EventEmitter()

  constructor(
    private threeDScene: ThreeDScene,
    private elementRef:ElementRef
  ) {

  }

  ngOnInit () {
    this.threeDScene.createScene(this.globals, this.props, this.update, this.elementRef, 500, 300)
  }

}
