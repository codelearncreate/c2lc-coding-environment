const path = require('path');

const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

function getDevTool(isProduction) {
    if (isProduction) {
        return 'source-map';
    } else {
        return 'cheap-module-source-map';
    }
}

const postcssOptions = {
    config: false,
    plugins: [
        'postcss-flexbugs-fixes',
        [
            'postcss-preset-env',
            {
                autoprefixer: {
                    flexbox: 'no-2009'
                },
                stage: 3
            }
        ],
        'postcss-normalize'
    ]
};

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const isDevelopment = argv.mode === 'development';

    // Set BABEL_ENV and NODE_ENV
    if (isProduction) {
        process.env.BABEL_ENV = 'production';
        process.env.NODE_ENV = 'production';
    } else if (isDevelopment) {
        process.env.BABEL_ENV = 'development';
        process.env.NODE_ENV = 'development';
    }

    return {
        target: ['browserslist'],
        devtool: getDevTool(isProduction),
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'static/js/[name].[contenthash:8].js',
            assetModuleFilename: 'static/media/[name].[hash][ext]',
            publicPath: '/',
            clean: true
        },
        module: {
            strictExportPresence: true,
            rules: [
                {
                    enforce: 'pre',
                    exclude: /@babel(?:\/|\\{1,2})runtime/,
                    test: /\.(js|mjs|jsx|ts|tsx|css)$/,
                    loader: 'source-map-loader'
                },
                {
                    oneOf: [
                        {
                            test: [/\.avif$/],
                            type: 'asset',
                            mimetype: 'image/avif'
                        },
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            type: 'asset'
                        },
                        {
                            test: /\.svg$/,
                            use: [
                                {
                                    loader: '@svgr/webpack',
                                    options: {
                                        prettier: false,
                                        svgo: false,
                                        titleProp: true,
                                        ref: true
                                    }
                                },
                                {
                                    loader: 'file-loader',
                                    options: {
                                        name: 'static/media/[name].[hash].[ext]'
                                    }
                                }
                            ]
                        },
                        {
                            test: /\.js$/,
                            include: path.resolve(__dirname, 'src'),
                            loader: 'babel-loader',
                            options: {
                                customize: require.resolve(
                                    'babel-preset-react-app/webpack-overrides'
                                ),
                                presets: [
                                    [
                                        require.resolve('babel-preset-react-app'),
                                        {
                                            runtime: 'automatic'
                                        }
                                    ]
                                ],
                                compact: isProduction
                            }
                        },
                        {
                            test: /\.(js|mjs)$/,
                            exclude: /@babel(?:\/|\\{1,2})runtime/,
                            loader: 'babel-loader',
                            options: {
                                babelrc: false,
                                configFile: false,
                                compact: false,
                                presets: [
                                    [
                                        require.resolve('babel-preset-react-app/dependencies'),
                                        {
                                            helpers: true
                                        }
                                    ]
                                ],
                                sourceMaps: true,
                                inputSourceMap: true
                            }
                        },
                        {
                            test: /\.css$/,
                            use: [
                                {
                                    loader: MiniCssExtractPlugin.loader,
                                    options: {}
                                },
                                {
                                    loader: 'css-loader',
                                    options: {
                                        sourceMap: true,
                                        modules: {
                                            mode: 'icss'
                                        }
                                    }
                                },
                                {
                                    loader: 'postcss-loader',
                                    options: {
                                        postcssOptions: postcssOptions,
                                        sourceMap: true
                                    }
                                }
                            ]
                        },
                        {
                            test: /\.scss$/,
                            use: [
                                {
                                    loader: MiniCssExtractPlugin.loader,
                                    options: {}
                                },
                                {
                                    loader: 'css-loader',
                                    options: {
                                        sourceMap: true,
                                        modules: {
                                            mode: 'icss'
                                        }
                                    }
                                },
                                {
                                    loader: 'postcss-loader',
                                    options: {
                                        postcssOptions: postcssOptions,
                                        sourceMap: true
                                    }
                                },
                                {
                                    loader: 'sass-loader',
                                    options: {
                                        sourceMap: true
                                    }
                                }
                            ]
                        },
                        {
                            exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                            type: 'asset/resource'
                        }
                    ]
                }
            ]
        },
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            ecma: 8
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2
                        },
                        mangle: {
                            safari10: true
                        },
                        keep_classnames: false,
                        keep_fnames: false,
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true
                        }
                    }
                }),
                new CssMinimizerPlugin()
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: 'public/index.html',
                inject: true
            }),
            new MiniCssExtractPlugin({
                filename: 'static/css/[name].[contenthash:8].css'
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: '**/*',
                        globOptions: {
                            ignore: ['**/index.html']
                        },
                        context: 'public/'
                    }
                ]
            })
        ]
    };
};
