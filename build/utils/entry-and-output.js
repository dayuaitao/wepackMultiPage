
// 开发环境
let EnvironmentalScience = {
    // devServer 配置
    openPage: 'pages/index.html',
    contentBase: '../../dist',
    // 入口出口配置
    Catalog: '../../src/pages',
    implement: 'main.js',
    filename: 'pages'
}

if (process.env.SETTINGS_ENV === 'dev') {
    let dev = {
        openPage: 'pages/index.html',
        contentBase: '../../dist',
        Catalog: '../../src/pages',
        implement: 'main.js',
        filename: 'pages'
    }
    Object.assign(EnvironmentalScience, dev)
} else if (process.env.SETTINGS_ENV === 'stg') {
    let stg = {
        openPage: 'dist/index.html',
        contentBase: '../../dist',
        Catalog: '../../src/pages',
        implement: 'main.js',
        filename: 'pages'
    }
    Object.assign(EnvironmentalScience, stg)
} else {
    let prg = {
        openPage: 'pages/index.html',
        contentBase: '../../dist',
        Catalog: '../../src/pages',
        implement: 'main.js',
        filename: 'pages'
    }
    Object.assign(EnvironmentalScience, prg)
}

module.exports = {
    EnvironmentalScience

}
