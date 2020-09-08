// Common webpack config
const path = require('path')
const ROOT = path.resolve( __dirname, '../src' );
const loaders = require("./loaders");

module.exports = (envName, plantName) => ({
  commonsChunkConfig: {
    name: ['vendor', 'polyfills']
  },
  htmlPlugConfig: {
      template: './src/index.ejs',
      filename: 'index.html',
      inject: true,
      hash: true,
      baseUrl: envName === 'dev' ? '/'
        : (!plantName || plantName === 'nmuk') ? '/vehicle-scheduling-ui/' : `/vehicle-scheduling-${plantName}/`
  },
  globalProviderConfig : {

  },

  webpackCopyConfig : [{
    from: './src/app/messages', to: 'app/messages'
  }, {
    from: './src/assets', to: 'assets'
  }, {
    context: './src/app',
    from: '**/*.html',
    to: './app'
  }, {
    from: './src/*.html',
    to: './'
  }],

  config : {
    entry: {
      polyfills:  path.resolve( ROOT, 'app/libs/polyfills.js'),
      vendor: path.resolve( ROOT, 'app/libs/vendor.js' ),
      main:  path.resolve( ROOT, 'app/main.ts')
    },
    output: {
        filename: '[name].bundle.js',
        path: 'dist',
        chunkFilename: "[id].chunk.js",
        sourceMapFilename: '[file].map'
    },
    resolveLoader: {
        // modulesDirectories: ["node_modules"]
    },
    node: {
      "child_process": "empty"
    },
    resolve: {
      extensions: ['.ts', '.js', '.json']
    },
    module: { loaders }
  }
})
