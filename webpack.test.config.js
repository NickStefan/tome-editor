var commonLoaders = [
    {
        test: /\.js$/,
        loader: 'babel-loader?loose[]=es6.modules',
        exclude: /node_modules/
    }
];

module.exports = {
    resolve:{
        alias: {}
    },
    externals: [
        /^[a-z\-0-9]+$/
    ],
    module: {
        loaders: commonLoaders
    }
};