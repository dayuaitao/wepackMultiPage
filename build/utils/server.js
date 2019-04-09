const path = require('path')
const localIp = require('./ip').getIpv4Address()
const packageJSON = require('../../package.json')
const designatedEntry = require('./entry-and-output')

module.exports = {
    EnvironmentalScience: {
    // path.resolve([from ...], to)
    // 将 to 参数解析为绝对路径，给定的路径的序列是从右往左被处理的，后面每个 path 被依次解析，直到构造完成一个绝对路径。 例如，给定的路径片段的序列为：/foo、/bar、baz，则调用 path.resolve('/foo', '/bar', 'baz') 会返回 /bar/baz。
    // contentBase 它指定了服务器资源的根目录，如果不写入contentBase的值，那么contentBase默认是项目的目录
        contentBase: path.resolve(__dirname, `${designatedEntry.EnvironmentalScience.contentBase}`),
        // 指定要使用的主机ip地址 默认localhost
        host: localIp,
        // 指定用于侦听请求的端口号
        port: '8081',
        // 启用webpack的热模块替换功能：
        hot: true,
        // 配置一个白名单列表，只有HTTP请求的HOST在列表里才正常返回
        allowedHosts: ['localhost', '0.0.0.0', '127.0.0.1', localIp, '*'],
        // publicPath 捆绑的文件将在此路径下的浏览器中提供
        publicPath: `/${packageJSON.name}/`,
        // openPage指定在打开浏览器时导航到的页面。
        openPage: `${packageJSON.name}/${designatedEntry.EnvironmentalScience.openPage}`,
        // 对文件更改的监控配置
        watchOptions: {
            // 当第一个文件更改，会在重新构建前增加延迟。这个选项允许 webpack 将这段时间内进行的任何其他更改都聚合到一次重新构建里。以毫秒为单位
            aggregateTimeout: 500,
            // 指定毫秒为单位进行轮询
            poll: 1,
            // 对于某些系统，监听大量文件系统会导致大量的 CPU 或内存占用。这个选项可以排除一些巨大的文件夹，例如 node_modules
            ignored: /node_modules/
        },
        // 告诉dev-server在服务器启动后打开浏览器。将其设置true为打开默认浏览器
        open: true
    }
}
