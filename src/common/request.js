import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || '/api', // 使用代理
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 如果是登录请求，使用表单格式
    if (config.url === '/login' && config.method === 'post') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response
    
    // 如果后端返回的业务状态码不是 200，视为错误
    if (data.code && data.code !== 200) {
      ElMessage.error(data.message || '操作失败')
      return Promise.reject(new Error(data.message || 'Error'))
    }
    
    return data
  },
  (error) => {
    // HTTP 状态码错误处理
    if (error.response?.status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      localStorage.removeItem('token')
      // 跳转到登录页
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      ElMessage.error('没有权限访问')
    } else if (error.response?.status === 500) {
      ElMessage.error('服务器内部错误')
    } else {
      ElMessage.error(error.message || '网络错误')
    }
    
    return Promise.reject(error)
  }
)

// 封装常用方法
export const http = {
  // GET 请求
  get(url, params = {}) {
    return request.get(url, { params })
  },
  
  // POST 请求
  post(url, data = {}) {
    // 如果是登录请求，手动转换为URLSearchParams
    if (url === '/login' && data && typeof data === 'object') {
      const params = new URLSearchParams()
      for (const key in data) {
        params.append(key, data[key])
      }
      return request.post(url, params)
    }
    return request.post(url, data)
  },
  
  // PUT 请求
  put(url, data = {}) {
    return request.put(url, data)
  },
  
  // DELETE 请求
  delete(url, params = {}) {
    return request.delete(url, { params })
  }
}

// 默认导出
export default {
  install(app) {
    app.config.globalProperties.$http = http
    app.config.globalProperties.$axios = request
  }
}