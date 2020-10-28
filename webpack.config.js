const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

//=========================================================
//  ENVIRONMENT VARS
//---------------------------------------------------------
const NODE_ENV = process.env.NODE_ENV;

const ENV_DEVELOPMENT = NODE_ENV === 'development';
const ENV_PRODUCTION = NODE_ENV === 'production';

//=========================================================
//  CONFIG
//---------------------------------------------------------
const config = {};
module.exports = config;

config.entry = ['whatwg-fetch', path.resolve(__dirname, 'main.js')]

config.output = {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath:'/'
}

config.plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
  })
];

config.module = {
  rules : [
        {
          test : /\.(js|jsx)$/,
          loader : 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          loaders: ['style-loader', 'css-loader', 'resolve-url-loader']
        },
        {
          test: /\.scss$/,
          loaders: ['style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader']
        },
        {
          test: /\.(ico|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
          use: 'file-loader?limit=100000'
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            'file-loader?limit=100000',
            {
              loader: 'img-loader',
              options: {
                enabled: true,
                optipng: true
              }
            }
          ]
        }
      ]
}

//=====================================
//  DEVELOPMENT
//-------------------------------------
if (ENV_DEVELOPMENT) {
  config.devtool = 'inline-source-map'
  config.devServer = {
    compress: true,
    disableHostCheck: true   // That solved it
 }
}


//=====================================
//  PRODUCTION
//-------------------------------------
if (ENV_PRODUCTION) {
  config.devtool = 'cheap-module-source-map';

  config.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        dead_code: true, // eslint-disable-line camelcase
        screw_ie8: true, // eslint-disable-line camelcase
        unused: true,
        warnings: false
      }
    })
  )
}


