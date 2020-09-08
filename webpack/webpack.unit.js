const loaders = require("./loaders");
const webpack = require('webpack');
const path = require('path')
const ROOT = path.resolve( __dirname, '../src' )
const commonPlugins = require('./webpack.plugins')
function root(__path = '.') {
  return path.join(__dirname + '/../', __path)
}

module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'app-config': root('src/app/config/config.unit.ts'),
      'sass-env-variables': path.join(__dirname, `../src/app/config/variables.unit.scss`)
    },
    modules: [ root('src'), root('node_modules') ]
  },
  devtool: 'eval',
  plugins: commonPlugins('unit'),
  module: {
    exprContextCritical: false,
    rules:
      [{
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
          root('node_modules/@angular'),
          root('node_modules/rxjs'),
          root('node_modules/ag-grid-angular')
        ]
      }]
      .concat(
        loaders
          .map(loader => {
            if (loader.loader === '@ngtools/webpack') {
              return {
                ...loader,
                include: loader.include.concat(path.resolve(__dirname, '../utils'))
              }
            }

            return loader
          })
          .concat([
            {
              test: /sinon.*\.js$/,
              loader: "imports-loader?define=>false,require=>false"
            }
          ])
    )
  }
};
