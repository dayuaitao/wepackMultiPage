const { merge } = require('lodash')

// path 模块提供用于处理文件路径和目录路径的实用工具
const path = require('path')

const baseConfig = require('./webpack.base.conf')
const zipPackUtils = require('./utils/zip-pack-utils')

const packageJSON = require('../package.json')

let publicPath = `/${packageJSON.name}/`

// 给当前配置增加打包zip的部分
zipPackUtils(baseConfig)

const envConfig = {
    mode: 'production',
    // output 配置文档 https://webpack.js.org/configuration/output/
    output: {
        publicPath
    },
    // https://webpack.js.org/configuration/resolve/
    resolve: {
        alias: {
            // 设置配置模块，引用当前环境指定的配置
            '@config$': path.resolve(__dirname, './config/prod.env.js')
        }
    }
}

module.exports = merge(baseConfig, envConfig)
