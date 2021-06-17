const package = require('./package.json');

const externals = new Set([
    ...Object.keys(package.dependencies || {}),
    ...Object.keys(package.peerDependencies || {}),
]);

const config = {
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
        umdNamedDefine: true
    },
    externals(context, request, callback) {
        if (externals.has(request)) {
            return callback(null, `${config.output.libraryTarget} ${request}`);
        }
        return callback();
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },
    devServer: {
        historyApiFallback: true,
    },
};

module.exports = config;
