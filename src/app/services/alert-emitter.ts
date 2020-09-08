import { EventEmitter } from '@angular/core'
import { IAlert } from 'reducers'

// Emitter service for alerts
export class AlertEmitter extends EventEmitter<IAlert> {
  constructor () {
    super(false)
  }
}
