import common from './config.common'
import { merge } from 'lodash'

export default merge(common, {
  logging: false,
  env: 'TEST',
  server: {
    domain: 'eu-jb2e-testn.nmcorp.nissan.biz',
    port: 80,
    secure: false
  }
})
