'use strict'

var mime = require('mime-types')
const path = require('path')
const autoprefixer = require('autoprefixer')
const fs = require('fs')

const APPDIR = 'Webpack/'

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

let htmlPageNames = [];
const pages = fs.readdirSync('./src/html')
pages.forEach(page => {
    if (page.endsWith('.html') && !(page == 'index.html')) {
        htmlPageNames.push(page.split('.html')[0])
    }
})
let multipleHtmlPlugins = htmlPageNames.map(name => {
  return new HtmlWebpackPlugin({
    inject: true,
    template: `./src/html/${name}.html`, // relative path to the HTML files
    filename: `${name}.html`, // output HTML files
    chunks: [`${name}`], // respective JS files
    // excludeChunks: ["main"], // exclude bundle for the index file in other files
  })
});

module.exports = {
  mode: 'development',
  entry: {
    main: './src/js/main.js',
    home: './src/js/home.js',
    //... repeat until example 4
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: ''
  },
  devServer: {
    host: '0.0.0.0', // you can change this ip with your ip
    port: 80,
    static: path.resolve(__dirname, 'dist'),
    hot: true,
    devMiddleware: {
      mimeTypes: {
        phtml: 'text/html',
        js: 'application/javascript',
        scss: 'text/x-scss',
        css: 'text/css',
     },
    },
    historyApiFallback: true,
    server: {
      type: 'https',
      options: {
        key: fs.readFileSync("cert.key"),
        cert: fs.readFileSync("cert.crt"),
        ca: fs.readFileSync("ca.crt"),
      },
    },
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      filename: `./index.html`,
      template: `./src/index.html`,
      chunks: ['main']
    })
  ].concat(multipleHtmlPlugins),
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          {
            // Adds CSS to the DOM by injecting a `<style>` tag
            loader: 'style-loader'
          },
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: 'css-loader'
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer
                ]
              }
            }
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
}