const webpack = require("webpack");
const path = require("path");
module.exports = {
    entry: ["./src/Vue.js"],
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: "/dist/",
        filename: "vue.js"
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
};
