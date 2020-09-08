// Builds qa & prod distributbles
const webpackBuild = require('./webpack.build')

module.exports = (env) => {
  const plantName = env && env.plant ? env.plant : 'nmuk'
  return webpackBuild('qa', plantName)
}
