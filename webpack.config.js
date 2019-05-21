const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');


module.exports = (env, argv) => {

    const productionMode = argv.mode === 'production';

    return {
        entry: {
            app: './src/js/app.js',
        },
        devtool: productionMode ? 'none' : 'source-map',
        output: {
            path: path.resolve(__dirname, 'dist/'),
            filename: '[name].js',
            publicPath: '/dist/',
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.(scss)$/,
                    enforce: 'pre',
                    use: 'import-glob-loader',
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: "style-loader",
                            options: {sourceMap: true}
                        },
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: productionMode ? {sourceMap: true, minimize: { minifyFontValues: { removeQuotes: false }}} : {sourceMap: true}
                        },
                        {
                            loader: "postcss-loader",
                            options: { sourceMap: true}
                        },
                        {
                            loader: "sass-loader",
                            options: {sourceMap: true}
                        }
                    ]
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    exclude: /node_modules/,
                    loader: 'url-loader',
                },
                {
                    test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                        publicPath: '../',
                    },
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(['dist'], { root: path.resolve(__dirname, '..'), verbose: true }),
            new MiniCssExtractPlugin({ filename: 'main.css' }),
            // Forces webpack-dev-server to write bundle files to the file system.
            new WriteFilePlugin(),
        ],
        optimization: {
            minimizer: [
                // Also needed for devMode? Or is it auto disabled when devMode is active?
                // enable the js minification plugin
                new UglifyJSPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true, // set to true if you want JS source maps
                    uglifyOptions: {
                        dead_code: true
                    }
                })
            ]
        },
    }
};
