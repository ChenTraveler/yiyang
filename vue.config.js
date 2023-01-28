const { VantResolver } = require('unplugin-vue-components/resolvers')
const ComponentsPlugin = require('unplugin-vue-components/webpack')
const AutoImport = require('unplugin-auto-import/webpack')

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'yiyang',
  publicPath: '/',
  devServer: {
    // 配置代理
    proxy: {
      '/jwwz/wx': {
        target: 'http://192.168.0.103:8087/jwwz/wx/', // http://yyxrmyy.yujiankang.com:8083/jwwz/wx/
        // 是否改变域名
        changeOrigin: true,
        // 代理websockets
        ws: true,
        // 路径重写
        pathRewrite: {
          '^/jwwz/wx': ''
        }
      }
    }
  },
  configureWebpack: {
    plugins: [
      ComponentsPlugin({
        resolvers: [VantResolver()]
      }),
      AutoImport({
        imports: ['vue', 'vue-router'],
        eslintrc: {
          enabled: false
        }
      })
    ]
  }
})
