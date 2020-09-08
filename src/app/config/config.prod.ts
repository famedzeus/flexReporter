import common from './config.common'
import { merge } from 'lodash'

export default merge(common, {
  logging: false,
  env: 'PROD'
})
