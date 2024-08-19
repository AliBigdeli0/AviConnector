
const path = require('path');

module.exports = {
    entry: {
        home: './src/pages/hoome/home.tsx',
        about: './src/pages/About/home.tsx',
    },
    output: {
        path: path.resolve(__dirname, '/../resources/static/js'),
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};