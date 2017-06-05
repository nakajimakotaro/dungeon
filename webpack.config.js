const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: {
        "script": "./src/script.ts",
    },
    output: {
        filename: "script.js",
        path: __dirname + "/public/",
    },
    devtool: 'source-map',
    devServer: {
        contentBase: 'public/',
        inline: true,
        disableHostCheck: true
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        loaders: [
            {test: /\.ts$/, loader: 'ts-loader'},
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: 'src/index.html', to: 'index.html'},
            {from: 'src/style.css',  to: 'style.css'},
        ])
    ]
};
