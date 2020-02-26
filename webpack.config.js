const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "main.js"
    },
    mode:"production",
    // mode:"development",

    //ローカルサーバー
    devServer: {
        contentBase: "dist",
        open: true,
        inline: true,
        watchContentBase:true
    },

    
    module: {
        rules: [
            {
                test: /\.pug$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'pug-loader',
                        options: {
                            pretty: true,
                            root: path.resolve(__dirname, 'src')
                        }
                    }
                ]
            },
            //babel-loader
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                ],
                exclude: /node_modules/
            },

            //sass-loader
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            sourceMap: true,
                            importLoaders: 2
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap:true,
                            plugins: [
                                require('autoprefixer')({
                                    grid: true
                                })
                            ]
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.pug'
        })
    ]

}