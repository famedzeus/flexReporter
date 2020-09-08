const vendors = require('../src/app/libs/vendor.list')
const polyfills = require('../src/app/libs/polyfills.list')
const HappyPack = require('happypack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// needed to create context for resolveNgRoute

declare var module
declare var __dirname

const {
  ContextReplacementPlugin,
  DefinePlugin,
  ProgressPlugin,
  DllPlugin,

  optimize: {
    CommonsChunkPlugin,
    DedupePlugin
  }

} = require('webpack');
const {ForkCheckerPlugin} = require('ts-loader');
const AssetsPlugin = require('assets-webpack-plugin');

const path = require('path');

function root(__path = '.') {
  return path.join(__dirname + '/../', __path);
}

// type definition for WebpackConfig is defined in webpack.d.ts
function webpackConfig(options = {}) {
  return {
    devtool: '#source-map',
    entry: {
      polyfills,
      vendors
    },

    output: {
      path: root('dist/dev/dll'),
      filename: '[name].[hash].js',
      sourceMapFilename: '[name].[hash].map',
      library: "__[name]"
    },

    module: {
      loaders: [
        // fix angular2
        {
          test: /(systemjs_component_resolver|system_js_ng_module_factory_loader)\.js$/,
          loader: 'string-replace-loader',
          query: {
            search: '(lang_1(.*[\\n\\r]\\s*\\.|\\.))?' +
              '(global(.*[\\n\\r]\\s*\\.|\\.))?' +
              '(System|SystemJS)(.*[\\n\\r]\\s*\\.|\\.)import\\((.+)\\)',
            replace: '$5.import($7)',
            flags: 'g'
          },
          include: [root('node_modules/@angular/core')]
        },
        {
          test: /\.js$/,
          loader: 'string-replace-loader',
          query: {
            search: 'moduleId: module.id,',
            replace: '',
            flags: 'g'
          }
        },
        // end angular2 fix
        {
          test: /\.ts$/,
          loader: 'happypack/loader?id=ts',
          exclude: [root('src/app')],
          include: [root('./src')]
        },
        {
          test: /\.js$/,
          loader: 'string-replace-loader',
          query: {
            search: 'var sourceMappingUrl = extractSourceMappingUrl\\(cssText\\);',
            replace: 'var sourceMappingUrl = "";',
            flags: 'g'
          }
        },
        {
          test: /\.json$/,
          loader: 'string-replace-loader',
          query: {
            search: '}(.*[\\n\\r]\\s*)}(.*[\\n\\r]\\s*)}"activeExports": \\[\\]',
            replace: '',
            flags: 'g'
          }
        }
      ]

    },

    plugins: [
      new HappyPack({
        id: 'ts',
        loaders: [
          {
            path: 'ts-loader',
            query: {
              transpileOnly: true,
              happyPackMode: true
            }
          }
        ]
      }),
      new ForkTsCheckerWebpackPlugin(),
      new AssetsPlugin({
        path: root('dist/dev/dll'),
        filename: 'webpack-assets.json',
        prettyPrint: true
      }),
      new DllPlugin({
        name: '__[name]',
        path: root('dist/dev/dll/[name]-manifest.json'),
      }),

      new ProgressPlugin({}),

      // https://github.com/webpack/webpack/issues/2764
      // new DedupePlugin(),

    ],
    node: {
      global: true,
      process: true,
      Buffer: false,
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false,
      clearTimeout: true,
      setTimeout: true
    }
  };
}


// Export
module.exports = webpackConfig();

