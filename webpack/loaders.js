const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = [
  // {
  //   test: /\.(ts(x?)|js)$/,
  //   // loader: 'ts-loader',
  //   loader: 'happypack/loader?id=ts',
  //   include: [
  //     path.resolve(__dirname, '../src'),
  //     path.resolve(__dirname, '../utils'),
  //     path.resolve(__dirname, '../mocks'),
  //     // path.resolve(__dirname, '../node_modules/@angular'),
  //     path.resolve(__dirname, '../node_modules/ngx-color-picker'),
  //     // path.resolve(__dirname, '../node_modules/ng2-datepicker'),
  //     path.resolve(__dirname, '../node_modules/ng2-slimscroll')
  //   ]
  // },
  {
    test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
    loader: '@ngtools/webpack',
    include: [
      path.resolve(__dirname, '../src')
    ]
  },
  {
    test: /\.css$/,
    use: ['css-to-string-loader', 'css-loader']
  },
  {
    test: /\.scss$/,
      // 'exports-loader?module.exports.toString()',

      // 'css-loader?',
      // { loader: 'postcss-loader', options: { ident: 'postcss', plugins: () => [require('autoprefixer')({ grid: true })] } },
      // 'sass-loader?a=b'
    use: ['exports-loader?module.exports.toString()', 'css-loader', 'sass-loader']


    // ExtractTextPlugin.extract({
    //   fallback: 'style-loader',
    //   //resolve-url-loader may be chained before sass-loader if necessary
    //   use: [
    //     'css-loader?',
    //     { loader: 'postcss-loader', options: { ident: 'postcss', plugins: () => [require('autoprefixer')({ grid: true })] } },
    //     'sass-loader?a=b']
    // })
  },
  {
    test: /\.html$/,
    loader: 'raw-loader?'
  }, {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'url-loader?limit=10000&mimetype=application/font-woff'
  }, {
    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'file-loader?'
  }, {
    test: /\.jpg$/,
    loader: 'file-loader?'
  }, {
    test: /\.png$/,
    loader: 'file-loader?'
}];
