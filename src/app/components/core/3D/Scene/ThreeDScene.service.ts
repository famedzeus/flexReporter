import { Component, Inject, Injectable, Input, OnInit, OnChanges } from '@angular/core'
import { ElementRef } from '@angular/core'
import * as Three from 'three'

let MTLLoader = require('three-mtl-loader')
let OBJLoader = require('three-obj-loader')

export interface IProp {
  id:string,
  model:string,
  material:string,
  x:number,
  y:number,
  z:number,
  object:Three.Object3D
}

// 3D Scene
export interface IThreeDScene {
  camera:object,
  scene:object,
  renderer:object,
  directionalLight:object,
  ambientLight:object,
  props:Array<IProp>,
  update:object
}

/* Service */
@Injectable()
export class ThreeDScene implements IThreeDScene {

  camera
  scene
  renderer
  update
  directionalLight
  ambientLight
  props = []
  loadingManager
  texture
  mtlLoader
  object
  Three = Three
  window
  frameInterval

  constructor(
      
  ){
      
  }

  animate() {
    requestAnimationFrame(()=>{this.animate()})
    this.update.emit({camera:this.camera,scene:this.scene});
    this.render()
  }

  createScene(globals, props, updateFn, container, width, height){

    this.update = updateFn

    this.camera = new this.Three.PerspectiveCamera( 45, width / height, 1, 2000 )
    this.camera.position.z = 5;
    this.scene = new this.Three.Scene();
    this.scene.background = new this.Three.Color( globals.backgroundColor );

    this.ambientLight = new this.Three.AmbientLight( globals.ambientLight );
    this.scene.add( this.ambientLight );

    this.directionalLight = new this.Three.DirectionalLight( 0xffffff );
    this.directionalLight.position.set( 5, 0, 0 );
    this.scene.add( this.directionalLight );

    this.loadingManager = new this.Three.LoadingManager();
    this.loadingManager.onProgress = function ( item, loaded, total ) {

      console.log( item, loaded, total );

    };

    this.texture = new this.Three.Texture();

    var onProgress = function ( xhr ) {
      if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        //console.log( Math.round(percentComplete, 2) + '% downloaded' );
      }
    };

    var onError = function ( xhr ) {
    };

    this.mtlLoader = new MTLLoader()
    OBJLoader(Three)
    let objLoader = new Three.OBJLoader()
    
    let promises = []
    props.forEach(prop => {

      this.mtlLoader.load( prop.material, ( materials ) => {

        materials.preload();
        
        objLoader.setMaterials( materials )
      
        // model
        objLoader.load( prop.model, (obj) => { 
          prop.object = obj;
          this.scene.add( prop.object )
          prop.object.position.x = prop.x
          prop.object.position.y = prop.y
          prop.object.position.z = prop.z
        }, onProgress, onError )

      })

    })

    this.renderer = new this.Three.WebGLRenderer()
    this.renderer.setPixelRatio( 1 )
    this.renderer.setSize( width, height)
    container.nativeElement.appendChild( this.renderer.domElement )
    window.addEventListener( 'resize', this.onWindowResize, false )

    // this.frameInterval = setInterval(this.animate, 100, this)
    this.animate()
  }

  onWindowResize() {

    let windowHalfX = this.window.innerWidth / 2
    let windowHalfY = this.window.innerHeight / 2

    this.camera.aspect = this.window.innerWidth / this.window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize( this.window.innerWidth, this.window.innerHeight )

  }

  render() {

//    object.rotation.y += 0.005;

  //  directionalLight.rotation.x += 1;
    
    this.renderer.render( this.scene, this.camera )

  }

}
