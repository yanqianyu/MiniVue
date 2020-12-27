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
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ['@babel/preset-env', {targets: "defaults"}]
                        ]
                    }
                }
            }
        ]
    }
};
