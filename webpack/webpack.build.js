const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack');
const path = require('path')
const common = require('./webpack.config')
const { merge } = require('lodash')
const ZipPlugin = require('zip-webpack-plugin')
const commonPlugins = require('./webpack.plugins')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const package = require('../package.json')
// const HappyPack = require('happypack')

module.exports = (envName, plantName) => {
  const helpers = require('./helpers')(envName)
  const config = common(envName, plantName)
  const versionString = envName === 'prod' ? `-${package.version}` : ''
  const zipFileName = envName === 'prod' 
      ? `vs-frontend-${plantName}${versionString}.zip`
      : `${envName}-${plantName}${versionString}.zip`

  return merge(config.config, {
    devtool: 'source-map',
    resolve: {
      alias: {
        'app-config': path.join(__dirname, `../src/app/config/${plantName}/config.${envName}.ts`),
        'sass-env-variables': path.join(__dirname, `../src/app/config/${plantName}/variables.${envName}.scss`)
      },
      modules: [ helpers.root('node_modules') ]
    },
    output: {
      path: path.resolve( __dirname, `../dist/${envName}`)
    },
    plugins: commonPlugins(envName, plantName).concat([
      // new ForkTsCheckerWebpackPlugin(),

      // new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.optimize.CommonsChunkPlugin(config.commonsChunkConfig),

      new HtmlWebpackPlugin(config.htmlPlugConfig),
      new CopyWebpackPlugin(config.webpackCopyConfig),
      new webpack.ProvidePlugin(config.globalProviderConfig),
      // new ExtractTextPlugin('style.css'),
      new webpack.optimize.UglifyJsPlugin({
        beautify: false, //prod
        output: {
          comments: false
        }, //prod
        mangle: {
          screw_ie8: true
        }, //prod
        compress: {
          screw_ie8: true,
          warnings: false,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
          negate_iife: false, // we need this for lazy v8
          // TODO: remove reliance on function names in src
          keep_fnames: false
        },
      }),
      new ZipPlugin({
        // OPTIONAL: defaults to the Webpack output path (above)
        // can be relative (to Webpack output path) or absolute
        path: '../',

        // OPTIONAL: defaults to the Webpack output filename (above) or,
        // if not present, the basename of the path
        filename: zipFileName
      })
    ])
  })
}
