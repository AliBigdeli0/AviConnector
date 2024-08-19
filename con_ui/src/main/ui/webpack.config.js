
const path = require('path');
const ForkTSChecker = require('fork-ts-checker-webpack-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');

module.exports = {
    mode: "production",
    
    entry: {
        home: './src/pages/home/home.tsx',
        about: './src/pages/about/about.tsx',
    },
    
    output: {
        path: path.resolve(__dirname, '../resources/static/js'),
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', 'jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack', 'url-loader'],
            }
        ],
    },
    plugins: [
        new ForkTSChecker(),
        new TSLintPlugin({
            files: ['./src/**/*.ts', './src/**/*.tsx'],
        })
    ]
};