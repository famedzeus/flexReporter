// Animation
export interface IAnimation {
  frameInterval
  stop: Function
  props: Object
  setFrameFn (frameFn: Function,millisecs: number)
}

export abstract class Animation implements IAnimation {
  frameInterval
  props: Object = {}

  stop () {
    clearInterval(this.frameInterval)
  }

  setFrameFn (fn, millisecs) {
    this.frameInterval = setInterval(fn, millisecs)
  }

  moveBackdrop(prop,speed,movePoint,resetPoint){
    this.props[prop] -= speed
    if(this.props[prop] < movePoint){
      this.props[prop] = resetPoint
    }
  }
  
}
