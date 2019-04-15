// webpack.config.js
const path = require('path')

const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const webpack = require('webpack')
// 使用插件之前需要先加载对应的plugin
const CleanWebpackPlugin = require('clean-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

// 打包目标目录清理插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default

const designatedEntry = require('./utils/entry-and-output')

const os = require('os')
const open_thread = os.cpus().length // 计划开启几个线程处理
// 引入HappyPack插件
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: open_thread }) // happypack多个实例的时候，共享线程池，以达到资源的最小消耗
const createHappyPlugin = (id, loaders) => new HappyPack({
    id: 'babel',
    cache: true,
    loaders: loaders,
    threads: open_thread, // 开几个线程去处理
    loaders: ['cache-loader', 'babel-loader?cacheDirectory'], // 2、babel-loader支持缓存转换出的结果，通过cacheDirectory选项开启
    verbose: true, // 允许 HappyPack 输出日志 ,默认true
    threadPool: happyThreadPool,
    verbose: process.env.HAPPY_VERBOSE === '1' // make happy more verbose with HAPPY_VERBOSE=1
})

const dev = process.env.SETTINGS_ENV === 'dev'
// webpack动态打包入口 与 HtmlWebpackPlugin 动态编译
const { entryPlugin } = require('./utils/entry-plugin')
const { entry, htmlWebpackPlugins } = entryPlugin()

// 获取根目录
const packageJSON = require('../package.json')

module.exports = {

    // 配置入口文件 单入口
    // entry: path.resolve(__dirname, '../src/main.js'),
    // 配置入口文件 多入口
    // 执行入口文件
    entry: () => {
        // 异步加载
        return new Promise((resolve) => {
            resolve(entry)
        })
    },
    // 执行出口文件
    // Webpack打包的入口
    output: {
        // 输出的文件都放到 dist 目录下
        path: path.resolve(__dirname, '../dist'), // 打包后的文件存放的地方
        // 把所有依赖的模块合并输出到一个.js 文件当中
        filename: 'scripts/[name].[hash].js', // 打包后输出文件的文件名
        // 配置了它，非入口entry的模块，会帮自动拆分文件，也就是大家常说的按需加载，与路由中的 require.ensure相互应
        chunkFilename: 'js/[name].[chunkhash:8].js'
    }, // 配置模块的解析方式 resolve选项可以更改webpack寻找的位置'lodash'
    //  解析模块的可选项
    resolve: {
        // webpack 解析模块时应该搜索的目录
        modules: [path.resolve(__dirname, '../node_modules')], // 指明包模块的加载路径，避免层层查找的消耗（也就是说webpack去那个目录下面查找三方的包模块）
        // 自动解决某些扩展
        extensions: ['.js', '.vue', '.json', '.css'],
        mainFields: ['main'], // 只采用main字段作为入口文件描述字段，减少搜索步骤
        // 更轻松地创建别名import或require某些模块。例如，为一堆常用src/文件夹添加别名
        // 非常重要的一个配置，它可以配置一些短路径
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname, '/src')
        }
    },

    // Webpack如何去寻找Loader，因为在使用Loader时是通过其包名称去引用的，
    // Webpack需要根据配置的Loader包名去找到Loader的实际代码，以调用Loader去处理源文件
    resolveLoader: {
        // Webpack去哪些目录下寻找第三方模块，默认是只会去node_modules目录下寻找
        modules: [path.resolve(__dirname, '../node_modules')], // 模块的查找路径
        // Webpack会自动带上后缀后去尝试访问文件是否存在
        extensions: ['.js', '.json'], // 对导入的没有后缀名的文件，按照查找后缀的顺序
        // Webpack会根据mainFields的配置去决定优先采用那份代码
        mainFields: ['jsnext:main', 'browser', 'main'] // 查找模块的 package.json 文件之后 入口加载的优先顺序
    },

    // 优化主要是用来让开发者根据需要自定义一些优化构建打包的策略配置
    optimization: {
        minimize: !dev, // 告诉webpack使用UglifyjsWebpackPlugin最小化捆绑包。

        // webpack-parallel-uglify-plugin 能够把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程，从而实现并发编译，进而大幅提升js压缩速度
        minimizer: [
            new ParallelUglifyPlugin({ // 多进程压缩
                cacheDir: '.cache/',
                uglifyJS: {
                    output: {
                        comments: false,
                        beautify: false
                    },
                    compress: {
                        warnings: false,
                        drop_console: true,
                        collapse_vars: true,
                        reduce_vars: true
                    }
                }
            }),
            new UglifyJsPlugin({
                exclude: /\.min\.js$/, // 过滤掉以".min.js"结尾的文件，我们认为这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
                cache: true,
                parallel: true, // 开启并行压缩，充分利用cpu
                sourceMap: false,
                extractComments: false, // 移除注释
                uglifyOptions: {
                    compress: {
                        unused: true,
                        warnings: false,
                        drop_debugger: true
                    },
                    output: {
                        comments: false
                    }
                }
            }),
            // 用于优化css文件
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessorOptions: {
                    safe: true,
                    autoprefixer: { disable: true }, // 这里是个大坑，稍后会提到
                    mergeLonghand: false,
                    discardComments: {
                        removeAll: true // 移除注释
                    }
                },
                canPrint: true
            })

        ],
        // namedModules: true,       //Tells webpack to use readable module identifiers for better debugging. When optimization.namedModules is not set in webpack config, webpack will enable it by default for mode development and disable for mode production.
        noEmitOnErrors: true, // 在 webpack 编译代码出现错误时并不会退出 webpack
        runtimeChunk: { // 仅包含运行时的每个入口点添加一个额外的块  也就是 manifest 文件块
            name: entrypoint => {
                return `whale_${entrypoint.name}`
            }
        },
        splitChunks: {
            minSize: 30000,
            // 缓存组
            cacheGroups: {
                // default:false, //将最少重复引用两次的模块放入default中
                vue: {
                    test: /([\/]node_modules[\/]vue)/, // <- window | mac -> /node_modules/vue/
                    name: 'vue-vendor', // 拆分块的名称
                    chunks: 'initial', // initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
                    priority: 100, // 该配置项是设置处理的优先级，数值越大越优先处理
                    enforce: true // 如果cacheGroup中没有设置minSize，则据此判断是否使用上层的minSize，true：则使用0，false：使用上层minSize
                    // minSize: 1024*10,                 //表示在压缩前的最小模块大小，默认为0；
                    // minChunks: 1,                     //表示被引用次数，默认为1；
                    // maxAsyncRequests:                 //最大的按需(异步)加载次数，默认为1；
                    // maxInitialRequests:               //最大的初始化加载次数，默认为1；
                    // reuseExistingChunk: true          //表示可以使用已经存在的块，即如果满足条件的块已经存在就使用已有的，不再创建一个新的块。
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    minSize: 30000,
                    minChunks: 1,
                    chunks: 'initial',
                    priority: 1 // 该配置项是设置处理的优先级，数值越大越优先处理

                    // test: /[\\/]node_modules[\\/]/,
                    // chunks: 'initial',
                    // name: 'vendor',
                    // priority: 80,
                    // enforce: true
                },
                common: {
                    // test: /[\\/]src[\\/]common[\\/]/,
                    // name: 'commons',
                    // minSize: 30000,
                    // minChunks: 3,
                    // chunks: 'initial',
                    // priority: -1,
                    // reuseExistingChunk: true // 这个配置允许我们使用已经存在的代码块
                    name: 'common',
                    chunks: 'initial',
                    minChunks: 3,
                    priority: 70,
                    enforce: true
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }

    },
    // 模块，可以使用各种loader，比如css转换，图片压缩等
    // 模块相关配置
    module: {
        noParse: /^(vue|vue-router|vuex|vuex-router-sync|lodash|axios)$/, // 忽略大型的 library 可以提高构建性能
        // 一组规则，与创建模块时的请求匹配。这些规则可以修改模块的创建方式。他们可以将加载器应用于模块，或修改解析器。
        // 解析与给定正则表达式匹配的任何文件
        // 配置模块loaders，解析规则
        rules: [{
            // vue 正则表达式，匹配编译的文件
            test: /\.vue$/,
            // 排除特定条件，如通常会写node_modules，即把某些目录/文件过滤掉
            exclude: /node_modules/,
            // 它正好与exclude相反
            include: [
                path.resolve(__dirname, '../')
            ],
            use: ['cache-loader', 'thread-loader',
                {
                    // 必须要有它，它相当于是一个 test 匹配到的文件对应的解析器，babel-loader、style-loader、sass-loader、url-loader等等
                    loader: 'vue-loader',
                    // 它与loader配合使用，可以是一个字符串或对象，它的配置可以直接简写在loader内一起，它下面还有presets、plugins等属性
                    options: {
                        loaders: {
                            js: 'happypack/loader?id=babel'
                        }
                    }
                }
            ]
        },
        {
            test: /\.js$/,
            use: [{ loader: 'cache-loader' }, 'happypack/loader?id=babel'],
            exclude: /node_modules/,
            include: /(src|node_modules\/flv.js)/
            // include: [
            //     path.resolve(__dirname, '../')
            // ]
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/,
            exclude: /node_modules/,
            include: path.resolve(__dirname, '../'),
            use: [{
                loader: 'url-loader', // 对于一些较小的文件采用base64编码
                options: {
                    limit: 1024 * 5, // 对 5KB 以下文件进行处理（⚠️ ！ 但是会被打包到JS中）
                    fallback: {
                        loader: 'file-loader'
                        // publicPath: dev ? `/${packageJSON.name}/` : `/${packageJSON.name}/dist`
                        // publicPath: designatedEntry.fileLoaderFontOutputPath
                    },
                    outputPath: 'src/assets/images'
                    // outputPath: dev ? `src/assets/images` : `/assets/img`

                }
            }]
        },
            // html转换配置
        {
            test: /\.html$/,
            use: [{
                loader: 'html-loader', // 模块上下文解析
                options: { // loader的可选项
                    interpolate: true,
                    /*
                html-loader 接受 attrs 参数，表示什么标签的什么属性需要调用 webpack 的 loader 进行打包。
                比如 <img> 标签的 src 属性，webpack 会把 <img> 引用的图片打包，然后 src 的属性值替换为打包后的路径。
                使用什么 loader 代码，同样是在 module.rules 定义中使用匹配的规则。

                如果 html-loader 不指定 attrs 参数，默认值是 img:src, 意味着会默认打包 <img> 标签的图片。
                这里我们加上 <link> 标签的 href 属性，用来打包入口 index.html 引入的 favicon.png 文件。
              */
                    attrs: ['img:src', 'link:href']
                }
            }]
        },
        {
            // vue样式转换
            test: /\.css$/,
            use: [
                dev ? 'style-loader' : {
                    loader: MiniCssExtractPlugin.loader
                },
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        importLoaders: 1,
                        getLocalIdent: (context, localIdentName, localName) => localName
                    }
                },
                'postcss-loader'
            ]

        }
        ]
    },
    // 插件，用于生成模板和其它功能
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        // 打包目标目录清理插件
        new CleanWebpackPlugin(
            ['../dist/**/*', '../dist/assets/css/*.css', '../dist/assets/scripts/*.js', '../dist/assets/img/*', '../dist/assets/js/*'], {
                root: path.resolve(__dirname, '../'), // 根目录
                verbose: true, // 开启在控制台输出信息
                dry: false // 启用删除文件
            }),
        new ImageminPlugin({
            jpegtran: {
                progressive: true
            }
        }),
        require('autoprefixer'),
        new MiniCssExtractPlugin({
            filename: `assets/css/[name]${dev ? '' : '.[chunkhash:4]'}.css`,
            chunkFilename: `assets/css/[id]${dev ? '' : '.[chunkhash:4]'}.css`,
            hot: dev // optional as the plugin cannot automatically detect if you are using HOT, not for production use
        }), new VueLoaderPlugin(),
        createHappyPlugin('happy-babel', [{
            loader: 'babel-loader',
            options: {
                babelrc: true,
                cacheDirectory: true // 启用缓存
            }
        }]),
        ...htmlWebpackPlugins

        // 单页面生产
        // // 生成html文件到输入目录
        // new HtmlWebpackPlugin({

        //     // 可以以src目录下的html源文件为模板
        //     template: './index.html',
        //     // 在目标目录下生成目标文件
        //     filename: './index.html'
        // }), new VueLoaderPlugin()
    ]
}
