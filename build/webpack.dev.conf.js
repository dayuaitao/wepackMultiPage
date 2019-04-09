const { merge } = require('lodash')

// path 模块提供用于处理文件路径和目录路径的实用工具
const path = require('path')

const baseConfig = require('./webpack.base.conf')
const utilsServer = require('./utils/server')

const envConfig = {
    mode: 'development',
    devtool: 'source-map', // 开启调试
    devServer: utilsServer.EnvironmentalScience,
    // output 配置文档 https://webpack.js.org/configuration/output/

    // https://webpack.js.org/configuration/resolve/
    resolve: {
        alias: {
            // 设置配置模块，引用当前环境指定的配置
            '@config$': path.resolve(__dirname, './config/dev.env.js')
        }
    }
}

module.exports = merge(baseConfig, envConfig)
