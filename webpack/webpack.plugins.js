const { AngularCompilerPlugin } = require('@ngtools/webpack')
const webpack = require('webpack')
const packageJSON = require('../package.json')
const path = require('path')
const ROOT = path.resolve( __dirname, '../src' );
/**
 * Export plugins common to all build configs
 */

module.exports = (env, plantName) => [
  new webpack.ContextReplacementPlugin(
    //  Workaround for angular/angular#11580
    // WARNING in ./node_modules/@angular/core/@angular/core.es5.js
    // Critical dependency: the request of a dependency is an expression
    // The (\\|\/) piece accounts for path separators in *nix and Windows
    /angular(\\|\/)core(\\|\/)(@angular|esm5)/
    , path.resolve(ROOT)
  ),
  new webpack.DefinePlugin({
    APP_VERSION: JSON.stringify(`v${packageJSON.version}`),
    APP_BUILD_DATE: JSON.stringify(new Date().toDateString())
  }),
  new AngularCompilerPlugin({
    tsConfigPath: 'tsconfig.json',
    entryModule: path.resolve(ROOT, 'app/components/app/App.module#AppModule'),
    mainPath: path.resolve(ROOT, 'app/main.ts'),
    skipCodeGeneration: env === 'unit',
    compilerOptions: {
      "paths": {
        "app-config": [
          `src/app/config/${plantName ? plantName + '/' : '' }config.${env}.ts`
        ],
        "entities": ["src/app/entities"],
        "effects": ["src/app/store/effects"],
        "services": ["src/app/services"],
        "reducers": ["src/app/store/reducers"]
      }
    },
    sourceMap: env === 'dev' || env === 'test' || env === 'unit'
  })
]