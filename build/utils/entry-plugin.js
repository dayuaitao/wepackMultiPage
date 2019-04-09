
// path 模块提供用于处理文件路径和目录路径的实用工具
const path = require('path')

// fs模块用于对系统文件及目录进行读写操作
const fs = require('fs')

// 编译 Webpack 项目中的 html 类型的文件
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 检查是否是通过webpack-dev-server的方式开启打包的
const isWatchMode = process.env.SETTINGS_ENV === 'dev'

const designatedEntry = require('./entry-and-output')

/**
 * 入口查找工具，构建动态入口
 */
exports.entryPlugin = function entryPlugin () {
    // 入口模板
    const entry = {}
    // HtmlWebpackPlugin 模板
    const htmlWebpackPlugins = []

    // 同步版本的 fs.readdir() 。
    // 方法将返回一个包含“指定目录下所有文件名称”的数组对象。
    let result = fs.readdirSync(path.resolve(__dirname, `${designatedEntry.EnvironmentalScience.Catalog}`))

    // [ 'index','pages下的文件' ]

    // 循环添加到entry当中
    result.forEach(item => {
        let pdz = path.resolve(__dirname, `${designatedEntry.EnvironmentalScience.Catalog}/${item}/${designatedEntry.EnvironmentalScience.implement}`)
        //  index  =  完整路径/1/Documents/消息推送项目/testproject/src/pages/index/main.js

        let hasMainChunk = false
        if (fs.existsSync(pdz)) {
            hasMainChunk = true
            entry[item] = path.resolve(__dirname, `${designatedEntry.EnvironmentalScience.Catalog}/${item}/${designatedEntry.EnvironmentalScience.implement}`)
        }
        const htmlWebpackPluginConf = {
            // 输出文件指定目录位置
            filename: `${designatedEntry.EnvironmentalScience.filename}/${item}.html`,
            // 本地模板文件的位置
            template: path.resolve(__dirname, `${designatedEntry.EnvironmentalScience.Catalog}/${item}/${item}.html`),
            appropriate: true,
            // 注入所有静态资源 true或者body：所有JavaScript资源插入到body元素的底部
            inject: true, // true or body 为默认值
            // 包含已拆分的代码块
            includeSiblingChunks: true,
            // 检查入口chunk是否存在，存在则引入，否则不引入任何块
            chunks: hasMainChunk ? [item] : [],
            chunksSortMode: 'manual'
        }

        if (!isWatchMode) {
            htmlWebpackPluginConf.minify = {
                // 把页面中的注释去掉
                removeComments: true,
                // 把多余的空格去掉
                collapseWhitespace: true
                // 去掉 script 标签的 type 属性
                // removeScriptTypeAttributes: true,
                // 如果有可能的话，去掉包裹属性的引号，不开启，可能会存在兼容性问题
                // removeAttributeQuotes: true
                // 更多可选属性:
                // https://github.com/kangax/html-minifier#options-quick-reference
            }
        }
        // 将多个HtmlWebpackPlugin 添加到htmlWebpackPlugins当中
        htmlWebpackPlugins.push(new HtmlWebpackPlugin(htmlWebpackPluginConf))
    })

    return {
    // entry pages/index/main
        entry,
        // htmlWebpackPlugins里是需要打包的HtmlWebpackPlugin
        htmlWebpackPlugins
    }
}
