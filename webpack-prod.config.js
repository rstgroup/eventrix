const package = require('./package.json');

const externals = new Set([
    ...Object.keys(package.dependencies || {}),
    ...Object.keys(package.peerDependencies || {}),
]);

const config = {
    mode: 'production',
    devtool: 'source-map',
    entry: {
        index: './src/index.js',
        'redux-adapter/index': './src/redux/index.js',
        'react/index': './src/react/index.js',
        'decorators/index': './src/decorators/index.js',
    },
    output: {
        path: __dirname,
        filename: '[name].js',
        sourceMapFilename: '[name].map',
        library: 'eventrix',
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
};

module.exports = config;
