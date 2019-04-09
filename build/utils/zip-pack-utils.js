const moment = require('moment')

const FileManagerPlugin = require('filemanager-webpack-plugin')

// 开发环境
const dev = process.env.SETTINGS_ENV === 'dev'

const packageJSON = require('../../package.json')

module.exports = appendZipPackConfig

function appendZipPackConfig (webpackConfig) {
    if (dev) {
        return webpackConfig
    }
    webpackConfig.plugins.push(new FileManagerPlugin({
        onEnd: {
            mkdir: ['./packages'],
            archive: [{
                source: './dist',
                destination: `./packages/${packageJSON.name}.${dev}.${moment().format('YY-MM-DD_hh:mm:ss')}.zip`
            }, {
                source: './dist',
                destination: `./packages/${packageJSON.name}.latest.zip`
            }]
        }
    }))

    return webpackConfig
}
