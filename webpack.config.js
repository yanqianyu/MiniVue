const HtmlWebpackPlugin = require("html-webpack-plugin");

const webpack = require("webpack");
const path = require("path");
module.exports = {
    entry: ["./src/Vue.js"],
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: "/dist/",
        filename: "vue.js"
    },
    devtool: 'eval-source-map',
    devServer: {
        hot: true, // 热更新
        inline: true
    },
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
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
