const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 定義文件路徑.
const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
const IMAGE_PATH = path.resolve(ROOT_PATH, 'src/images');

module.exports = {
  context: APP_PATH,
  entry: {
    app: ['./scripts/main.js']
  },
  output: {
    path: BUILD_PATH,
    filename: './js/[name]-[hash].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
              removeComments: true,
              collapseWhitespace: true
            }
          }
        ]
      }, {
        test: /\.js$/,
        enforce: 'pre', // webpack的處理順序是 perLoaders - loaders - postLoaders.
        exclude: [/node_modules/],
        use: [
          {
            loader: 'eslint-loader',
            options: {
              failOnWarning: false,
              failOnError: false
            }
          }
        ]
      }, {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  'es2015', {
                    modules: false, // 轉換 ES2015 module 的語法（import）為其它類型，預設為 true 轉換為 commonjs。
                    loose: true // 提供 loose 編譯模式，該模式啟動下 Babel 會盡可能產生較精簡的 ES5 程式碼，預設 false 會盡可能產出接近 ES2015 規範的程式碼。
                  }
                ]
              ]
            }
          }
        ]
      }, {
        test: /\.(sass|scss)$/,
        exclude: [/node_modules/],
        loader: ExtractTextPlugin.extract({ // 匯出css檔案
          fallback: 'style-loader',
          use: [
            'css-loader', // 解析 CSS 轉換成 Javascript 同時解析相依的資源.
            'postcss-loader',
            'sass-loader' // 編譯 Sass 成為 CSS.
          ]
        })
      }, {
        test: /\.(png|gif|jpg|svg)$/,
        include: IMAGE_PATH,
        use: 'url-loader?limit=20480&name=images/[name]-[hash].[ext]'
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        postcss: [autoprefixer({
            browsers: ['last 3 version', 'ie >= 10']
          })]
      }
    }),
    new CleanWebpackPlugin(['dist']), // 清除 bundle 後的資料夾.
    new webpack.optimize.UglifyJsPlugin({
      // 最緊湊的輸出
      beautify: false,
      // 刪除所有的註釋
      comments: false,
      compress: {
        // 在UglifyJs刪除沒有用到的代碼時不輸出警告
        warnings: false,
        // 刪除所有的 `console` 語句
        // 還可以兼容ie瀏覽器
        drop_console: true,
        // 內嵌定義了但是只用到一次的變量
        collapse_vars: true,
        // 提取出出現多次但是沒有定義成變量去引用的靜態值
        reduce_vars: true,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true
      }
    }),
    new webpack.ProvidePlugin({ // 告訴webpack看到$就自動requre('jquery')
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new ExtractTextPlugin({filename: './css/[name]-[hash].css', allChunks: true}),
    new webpack.optimize.CommonsChunkPlugin({name: 'commons', filename: './js/commons.js', minChunks: 2}),
    new HtmlWebpackPlugin({ // 動態產生 index.html 並支援 Extract Text Plugin 自動將打包完後的 js 與 css 檔加入.
      template: './templates/index.html',
      path: BUILD_PATH
    })
  ]
};
