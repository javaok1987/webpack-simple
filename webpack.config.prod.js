const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// 定義文件路徑.
const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
const IMAGE_PATH = path.resolve(ROOT_PATH, 'src/images');

module.exports = {
  context: APP_PATH,
  entry: {
    app: ['./scripts/main.js'],
  },
  output: {
    path: BUILD_PATH,
    filename: './js/[name]-[hash].bundle.js',
  },
  module: {
    rules: [{
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: true,
          removeComments: true,
          collapseWhitespace: true
        }
      }],
    },
    {
      test: /\.js$/,
      enforce: 'pre', // webpack的處理順序是 perLoaders - loaders - postLoaders.
      exclude: [/node_modules/],
      use: [{
        loader: 'eslint-loader',
        options: {
          failOnWarning: false,
          failOnError: false
        }
      }]
    },
    {
      test: /\.js$/,
      exclude: [/node_modules/],
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', {
              modules: false, // 轉換 ES2015 module 的語法（import）為其它類型，預設為 true 轉換為 commonjs。
              loose: true   // 提供 loose 編譯模式，該模式啟動下 Babel 會盡可能產生較精簡的 ES5 程式碼，預設 false 會盡可能產出接近 ES2015 規範的程式碼。
            }]
          ]
        }
      }],
    },
    {
      test: /\.(sass|scss)$/,
      exclude: [/node_modules/],
      loader: ExtractTextPlugin.extract({ // 匯出css檔案
        fallback: 'style-loader',
        use: 'css-loader!sass-loader'
      }),
    },
    {
      test: /\.(png|gif|jpg|svg)$/,
      include: IMAGE_PATH,
      use: 'url-loader?limit=20480&name=images/[name]-[hash].[ext]',
    },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']), // 清除 bundle 後的資料夾.
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false,
      },
    }),
    new webpack.ProvidePlugin({ // 告訴webpack看到$就自動requre('jquery')
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new ExtractTextPlugin({
      filename: './css/[name]-[hash].css',
      allChunks: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: './js/commons.js',
      minChunks: 2,
    }),
    new HtmlWebpackPlugin({ // 動態產生 index.html 並支援 Extract Text Plugin 自動將打包完後的 js 與 css 檔加入.
      template: './templates/index.html',
      path: BUILD_PATH,
    }),
  ]
};
