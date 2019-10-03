var FS = require('fs');
var Path = require('path');
var Webpack = require('webpack');
var NamedChunksPlugin = Webpack.NamedChunksPlugin;
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var MiniCSSExtractPlugin = require("mini-css-extract-plugin");

var event = process.env.npm_lifecycle_event;

var clientConfig = {
    mode: (event === 'build') ? 'production' : 'development',
    context: Path.resolve('./src'),
    entry: 'www-entry.mjs',
    output: {
        path: Path.resolve('./www'),
        filename: 'index.js',
        chunkFilename: '[name].js',
    },
    resolve: {
        extensions: [ '.js', '.jsx', '.mjs' ],
        modules: [ Path.resolve('./src'), 'node_modules' ],
    },
    module: {
        rules: [
            {
                test: /\.(jsx|mjs)$/,
                loader: 'babel-loader',
                type: 'javascript/auto',
                query: {
                    presets: [
                        [ '@babel/preset-env', { modules: false } ],
                        [ '@babel/preset-react' ],
                    ],
                    plugins: [
                        '@babel/plugin-proposal-class-properties',
                        '@babel/plugin-proposal-export-default-from',
                        '@babel/plugin-proposal-export-namespace-from',
                        '@babel/plugin-proposal-json-strings',
                        '@babel/plugin-proposal-nullish-coalescing-operator',
                        '@babel/plugin-proposal-optional-chaining',
                        '@babel/plugin-proposal-throw-expressions',
                        '@babel/plugin-syntax-dynamic-import',
                        '@babel/plugin-syntax-import-meta',
                        '@babel/plugin-transform-regenerator',
                        '@babel/plugin-transform-runtime',
                        'syntax-async-functions',
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
                test: /\.(jpeg|jpg|png|gif|svg)$/,
                loader: 'file-loader',
            },
        ]
    },
    plugins: [
        new NamedChunksPlugin,
        new BundleAnalyzerPlugin({
            analyzerMode: (event === 'build') ? 'static' : 'disabled',
            reportFilename: `report.html`,
            openAnalyzer: false,
        }),
        new MiniCSSExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
    ],
    optimization: {
        concatenateModules: false,
    },
    devtool: (event === 'build') ? 'source-map' : 'inline-source-map',
    devServer: require('./webpack-dev-server.config.js'),
};

var serverConfig = {
    mode: clientConfig.mode,
    context: clientConfig.context,
    entry: 'ssr-entry.mjs',
    target: 'node',
    output: {
        path: Path.resolve('./ssr'),
        filename: 'index.js',
        chunkFilename: '[name].js',
        libraryTarget: 'commonjs2',
    },
    resolve: clientConfig.resolve,
    module: clientConfig.module,
    plugins: clientConfig.plugins,
};

module.exports = [ clientConfig, serverConfig ];
