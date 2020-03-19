const FS = require('fs');
const Path = require('path');
const Webpack = require('webpack');
const NamedChunksPlugin = Webpack.NamedChunksPlugin;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const event = process.env.npm_lifecycle_event;

const clientConfig = {
  mode: (event === 'build' && false) ? 'production' : 'development',
  context: Path.resolve('./src'),
  entry: './www-entry.js',
  output: {
    path: Path.resolve('./www'),
    filename: 'index.js',
    chunkFilename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [
            '@babel/env',
            '@babel/react',
          ],
          plugins: [
            '@babel/transform-runtime',
            'trambar-www/transform-memo',
          ]
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.svg$/,
        loader: 'svg-react-loader',
        exclude: /fonts/,
        query: {
          filters: [
            // strip out the dimension
            (value) => {
              if (value.tagname === 'svg') {
                delete value.props.width;
                delete value.props.height;
              }
            }
          ]
        }
      },
      {
        test: /\.(jpeg|jpg|png|gif)$/,
        loader: 'file-loader',
      },
    ]
  },
  plugins: [
    new NamedChunksPlugin,
    new MiniCSSExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: (event === 'build') ? 'static' : 'disabled',
      reportFilename: `report.html`,
      openAnalyzer: false,
    }),
  ],
  optimization: {
    concatenateModules: false,
  },
  devtool: (event === 'build') ? 'source-map' : 'inline-source-map',
  devServer: require('./webpack-dev-server.config.js'),
};

const serverConfig = {
  mode: clientConfig.mode,
  context: clientConfig.context,
  entry: './ssr-entry.js',
  target: 'node',
  output: {
    path: Path.resolve('./ssr'),
    filename: 'index.js',
    chunkFilename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  module: clientConfig.module,
  plugins: clientConfig.plugins.slice(0, -1),
};

module.exports = [ clientConfig, serverConfig ];
