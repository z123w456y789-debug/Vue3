const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3000,
    host: 'localhost',
    open: true, // 自动打开浏览器
    hot: true,  // 热重载
    proxy: {
      '/api': {
        target: 'http://localhost:2222', // 你的后端端口
        changeOrigin: true,
        secure: false,
        ws: true,
        pathRewrite: { 
          '^/api': ''  // 去掉/api前缀
        },
        // 添加详细日志（开发时有用）
        onProxyReq: function(proxyReq, req, res) {
          console.log('代理请求:', req.method, req.url, '->', proxyReq.path)
        }
      }
    },
    // 添加开发服务器配置
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: true
      }
    }
  },
  // 添加构建配置
  configureWebpack: {
    devtool: 'source-map'
  }
})