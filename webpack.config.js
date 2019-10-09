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
                        [ '@babel/env', { modules: false } ],
                        [ '@babel/react' ],
                    ],
                    plugins: [
                        '@babel/proposal-class-properties',
                        '@babel/proposal-export-default-from',
                        '@babel/proposal-export-namespace-from',
                        '@babel/proposal-json-strings',
                        '@babel/proposal-nullish-coalescing-operator',
                        '@babel/proposal-optional-chaining',
                        '@babel/proposal-throw-expressions',
                        '@babel/syntax-dynamic-import',
                        '@babel/syntax-import-meta',
                        '@babel/transform-regenerator',
                        '@babel/transform-runtime',
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
                test: /\.svg$/,
                loader: 'svg-react-loader',
                exclude: /fonts/,
                query: {
                    filters: [
                        // strip out the dimension
                        function (value) {
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
