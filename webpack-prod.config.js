const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const package = require('./package.json');

const externals = new Set([
    ...Object.keys(package.dependencies || {}),
    ...Object.keys(package.peerDependencies || {}),
]);

const config = {
    target: 'web',
    mode: 'production',
    devtool: 'inline-source-map',
    entry: {
        index: './src/index.ts',
        'redux-adapter/index': './src/redux/index.ts',
        'react/index': './src/react/index.ts',
        'decorators/index': './src/decorators/index.ts',
    },
    output: {
        path: __dirname,
        filename: '[name].js',
        sourceMapFilename: '[name].map',
        library: 'eventrix',
        libraryTarget: 'umd',
        globalObject: 'window',
        umdNamedDefine: true
    },
    externals(context, request, callback) {
        if (externals.has(request)) {
            return callback(null, `${config.output.libraryTarget} ${request}`);
        }
        return callback();
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'ts-loader',
                    },
                ],
            },
        ],
    }
};

module.exports = config;
