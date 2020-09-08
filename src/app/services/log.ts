import { Injectable } from '@angular/core'
import { noop } from 'lodash'
import appConfig from 'app-config'

interface ILog {}

/**
 * Simple injectable logging services which
 * will replace methods with non ops if logging is disabled
 */
@Injectable()
export class Log implements ILog {

  constructor () {
    if (!appConfig.logging) {
      // Turn log methods into non ops
      ['debug', 'error', 'info', 'log'].forEach(method => this[method] = noop)
    }
  }

  debug (message: any, ...args) {
    console.debug(message, ...args)
  }

  error (message: any, ...args) {
    console.error(message, ...args)
  }

  info (message: any, ...args) {
    console.info(message, ...args)
  }

  log (message: any, ...args) {
    console.log(message, ...args)
  }
}
