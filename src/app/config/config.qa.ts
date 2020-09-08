import common from './config.common'
import { merge } from 'lodash'
import { IAppConfig, Env } from './config.types'

export default merge(common, {
  logging: false,
  env: Env.QA,
  server: {
    domain: 'eu-jb2e-qan.nmcorp.nissan.biz',
    port: null,
    secure: true
  }
}) as IAppConfig
