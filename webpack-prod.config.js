const package = require('./package.json');
const webpack = require('webpack');

const externals = new Set([
    ...Object.keys(package.dependencies || {}),
    ...Object.keys(package.peerDependencies || {}),
]);

const config = {
    mode: 'production',
    entry: {
        index: './src/index.js',
        'redux-adapter/index': './src/redux/index.js',
        'react/index': './src/react/index.js',
        'decorators/index': './src/decorators/index.js',
    },
    output: {
        path: __dirname,
        filename: '[name].js',
        libraryTarget: 'umd',
    },
    externals(context, request, callback) {
        if (externals.has(request)) {
            return callback(null, `${config.output.libraryTarget} ${request}`);
        }
        return callback();
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[name].js.map',
        })
    ]
};

module.exports = config;
