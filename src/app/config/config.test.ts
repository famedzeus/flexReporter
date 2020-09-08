import common from './config.common'
import { merge } from 'lodash'
import { IAppConfig, Env } from './config.types'

export default merge(common, {
  logging: true,
  env: Env.Test,
  server: {
    domain: 'eu-jb2e-testn.nmcorp.nissan.biz',
    port: null,
    secure: true
  }
}) as IAppConfig 
