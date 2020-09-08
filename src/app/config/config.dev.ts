import common from './config.common'
import { IAppConfig, Env } from './config.types'
const developLocal = true
const testServer = {
  domain: 'eu-jb2e-testn.nmcorp.nissan.biz',
  port: 80,
  secure: false
}
const localServer = {
  // domain: '127.0.0.1',
  domain: 'localhost',
  port: 8080,
  secure: false
}

const config: IAppConfig = {
  // Mix common config and dev config into new object
  ...common,
  logging: true,
  env: Env.Dev,
  server: developLocal ? localServer : testServer,
  permissionsDisabled: true
}

export default config
