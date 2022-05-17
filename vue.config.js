const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: "/app/themes/etoyasno/spa/dist/",
  transpileDependencies: true,

  chainWebpack: config => {
    config.module
      .rule('svg-sprite')
      .use('svgo-loader')
      .loader('svgo-loader')
  }
})
