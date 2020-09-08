import { Injectable } from '@angular/core'
import appConfig from 'app-config'
import { IServer, IAPI } from '../config/config.types'

type WebProtocol = 'https' | 'http'

/**
 * Util to provide correct API Url.
 */
@Injectable()
export class ServerInfo {
  server: IServer
  api: IAPI
  mock = 'http://localhost:8090'
  private proto: WebProtocol

  constructor () {
    this.server = { ...appConfig.server }
    this.api = { ...appConfig.api }
    this.proto = this.server.secure ? 'https' : 'http'
  }

  getPortString (port) {
    return port ? `:${port}` : ''
  }

  /**
   * Provides API url
   * @return Base API url
   */
  URL (): string {
    const { api, server, proto } = this
    return `${proto}://${server.domain}${this.getPortString(server.port)}/${api.uri}`
  }

  domainURL (): string {
    const { api, server, proto } = this
    return `${proto}://${server.domain}${this.getPortString(server.port)}/${appConfig.serverSubdomain}`
  }

  /**
   * Provides mock API Url for development purposes
   * @return Base mock api url
   */
  mockURL (): string {
    const { api } = this
    return `${this.mock}/${api.uri}`
  }

  /**
   * Allows current server info to be overrode
   */
  setServerProperties (protocol: WebProtocol, domain: string, port: number): void {
    const { server } = this
    this.proto = protocol
    server.domain = domain
    server.port = port
  }

  /**
   * Provides current web protocol setting
   * @return protocol type {'http' | 'https'}
   */
  protocol (): WebProtocol {
    return this.proto
  }
}
