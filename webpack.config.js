var path = require('path');
var webpack = require('webpack');

var node_modules = path.resolve(__dirname, 'node_modules');

// helpful
//https://christianalfoni.github.io/react-webpack-cookbook/Optimizing-rebundling.html

var commonLoaders = [
    {
        test: /\.js$/,
        loader: 'babel-loader?loose[]=es6.modules',
        exclude: /node_modules/
    },
    { test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node-modules/
    }
];

var eslint = {
    configFile: './.eslintrc',
    failOnWarning: true,
    failOnError: true
};

module.exports = [
    {
        name: 'common-build',
        eslint: eslint,
        entry: __dirname + '/main/main.js',
        output: {
            libraryTarget: 'umd',
            path: './build/',
            filename: 'tome.js'
        },
        resolve:{
            alias: {}
        },
        module: {
            loaders: commonLoaders.concat([
                { test: /\.css$/,  loader: path.join(__dirname, 'server', 'style-collector') + '!css-loader' }
            ])
        }
    },
    {
        name: 'common-build',
        eslint: eslint,
        entry: __dirname + '/main/main.js',
        output: {
            libraryTarget: 'umd',
            path: './example/',
            filename: 'tome.js'
        },
        resolve:{
            alias: {}
        },
        module: {
            loaders: commonLoaders.concat([
                { test: /\.css$/,  loader: path.join(__dirname, 'server', 'style-collector') + '!css-loader' }
            ])
        }
    }
];