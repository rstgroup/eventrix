const path = require('path');
const pkg = require('./package.json');

const externals = new Set([
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
]);

const config = {
    entry: {
        index: './src/index.js',
    },
    output: {
        path: path.join(__dirname, '/dist'),
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
};

module.exports = config;
