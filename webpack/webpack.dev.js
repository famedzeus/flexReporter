const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin');
const webpack = require('webpack');
const DllReferencePlugin = webpack.DllReferencePlugin
const path = require('path')
const fs = require('fs')
const ROOT = path.resolve( __dirname, '../src' );
const common = require('./webpack.config')
const lodash = require('lodash')
const THREE = require('three')
const config = common('dev')
const vendors = require('../src/app/libs/vendor.list')
const polyfills = require('../src/app/libs/polyfills.list')
const helpers = require('./helpers')()
const commonPlugins = require('./webpack.plugins')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HappyPack = require('happypack')
const {AngularCompilerPlugin} = require('@ngtools/webpack')

module.exports = (conf) => {
  return lodash.merge(config.config, { entry: false }, {
    resolve: {
        alias: {
          'app-config': path.join(__dirname, '../src/app/config/config.dev.ts'),
          'sass-env-variables': path.join(__dirname, `../src/app/config/variables.dev.scss`)
        },
        modules: [ helpers.root('node_modules') ]
    },
    entry: {
      main:  polyfills.concat(vendors).concat([path.resolve( ROOT, 'app/main.ts')]),
    },
    devtool: "inline-source-map",

    devServer: {
      contentBase: helpers.root('./dist/dev'),
      port: 3001,
      before: (app) => {

        app.get('/dll/*', (req, res) => {
          var files = req.path.split('/');
          var chunk = files[files.length - 1].replace('.js', '');
          if (chunk.split('.').length < 2) {
            res.sendFile(helpers.root('dist/dev/dll/' + helpers.getDllAssets(chunk)));
          } else {
            res.sendFile(helpers.root('dist/dev/dll/' + chunk));
          }
        });
      }
    },

    output: {
      path: path.resolve( __dirname, '../dist/dev'),
      devtoolModuleFilenameTemplate: '[absolute-resource-path]'
    },

    plugins: [
      // new AngularCompilerPlugin({
      //   entryModule: '../src/components/app/App.module#AppModule',
      //   tsConfigPath: helpers.root('./tsconfig.json')
      // }),
      // new HappyPack({
      //   id: 'ts',
      //   loaders: [
      //     {
      //       path: 'ts-loader',
      //       query: {
      //         transpileOnly: true,
      //         happyPackMode: true
      //       }
      //     }
      //   ]
      // }),

      // new ForkTsCheckerWebpackPlugin(),
      new AssetsPlugin({
        path: path.resolve( __dirname, '../dist/dev'),
        filename: 'webpack-assets.json',
        prettyPrint: true
      }),
      new DllReferencePlugin({
        context: '.',
        manifest: helpers.getManifest('vendors'),
      }),
      new DllReferencePlugin({
        context: '.',
        manifest: helpers.getManifest('polyfills'),
      }),
      new ExtractTextPlugin('style.css'),
      new HtmlWebpackPlugin(config.htmlPlugConfig),
      new CopyWebpackPlugin(config.webpackCopyConfig),
      new BrowserSyncPlugin({
          host: '127.0.0.0',
          port: 3000,
          proxy: 'http://localhost:3001/',
          ui: false,
          online: false,
          notify: false
      }),
      new webpack.ProvidePlugin(config.globalProviderConfig),
      // new webpack.optimize.UglifyJsPlugin({
      //   beautify: false, //prod
      //   output: {
      //     comments: false
      //   }, //prod
      //   mangle: {
      //     screw_ie8: true
      //   }, //prod
      //   compress: {
      //     screw_ie8: true,
      //     warnings: false,
      //     conditionals: true,
      //     unused: true,
      //     comparisons: true,
      //     sequences: true,
      //     dead_code: true,
      //     evaluate: true,
      //     if_return: true,
      //     join_vars: true,
      //     negate_iife: false // we need this for lazy v8
      //   },
      // })
      // new webpack.optimize.ModuleConcatenationPlugin()
    ].concat(commonPlugins('dev'))
  });
}
