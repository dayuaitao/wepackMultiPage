// https://eslint.org/docs/user-guide/configuring

module.exports = {
  //此项是用来告诉eslint找当前配置文件不能往父级查找
  root: true,
   //此项是用来指定javaScript语言类型和风格，sourceType用来指定js导入的方式，默认是script，此处设置为module，指某块导入方式
  parserOptions: {
        //此项是用来指定eslint解析器的，解析器必须符合规则，babel-eslint解析器是对babel解析器的包装使其与ESLint解析
    parser: 'babel-eslint'
  },
      //此项指定环境的全局变量，下面的配置指定为浏览器环境
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    // 此项是用来配置标准的js风格，就是说写代码的时候要规范的写，如果你使用vs-code我觉得应该可以避免出错
    'standard'
  ],
  // required to lint *.vue files
  // 此项是用来提供插件的，插件名称省略了eslint-plugin-，下面这个配置是用来规范html的
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
     "indent": [1,'tab'|4], //使用什么换行
     "no-tabs":"off",
     'no-dupe-args': 2, //函数定义的时候不允许出现重复的参数
     'no-dupe-keys': 2, //对象中不允许出现重复的键
     'no-duplicate-case': 2, //switch语句中不允许出现重复的case标签
     'no-empty': 2, //不允许出现空的代码块
     'no-negated-in-lhs': 2, //不允许在in表达式语句中对最左边的运算数使用取反操作
     'no-unreachable': 2, //在return，throw，continue，break语句后不允许出现不可能到达的语句
     'use-isnan': 2, //要求检查NaN的时候使用isNaN()
     'default-case': 0, //在switch语句中需要有default语句
     'no-eval': 2, //不允许使用eval()
     'no-loop-func': 2, //不允许在循环语句中进行函数声明
     'no-redeclare': 2, //不允许变量重复声明
     'no-self-compare': 2, //不允许自己和自己比较
     'no-shadow-restricted-names': 2, //js关键字和保留字不能作为函数名或者变量名
     'generator-star-spacing': [2, "both"], //生成器函数前后空格
     'vue/no-use-v-if-with-v-for':1,

    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',


  }
}
