const webpackBuild = require('./webpack.build')
const { merge } = require('lodash')

module.exports = (env) => {
  const plantName = env && env.plant ? env.plant : 'nmuk'
  return merge(webpackBuild('prod', plantName), {})
}
