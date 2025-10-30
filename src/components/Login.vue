<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="login-container">
    <!-- 背景装饰元素 -->
    <div class="decoration-circle circle-1"></div>
    <div class="decoration-circle circle-2"></div>
    <div class="decoration-circle circle-3"></div>
    
    <div class="login-box">
      <!-- 头部区域 -->
      <div class="login-header">
        <div class="logo">
          <el-icon size="32" color="#409EFF"><User /></el-icon>
        </div>
        <h2>学生登录</h2>
        <p class="subtitle">欢迎回来，请登录您的账户</p>
      </div>

      <el-form 
        :model="loginForm" 
        :rules="loginRules" 
        ref="loginFormRef"
        class="login-form"
        @keyup.enter="handleLogin"
        size="large"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入学号"
            :prefix-icon="User"
            clearable
            class="custom-input"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            class="custom-input"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            class="login-button"
            @click="handleLogin"
            :loading="loading"
            size="large"
          >
            {{ loading ? '登录中...' : '立即登录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 底部信息 -->
      <div class="login-footer">
        <p class="tip">提示：请使用学校分配的学号和密码登录</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable vue/multi-word-component-names */
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
// 导入http实例
import { http } from '../common/request'

// 定义表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 定义表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入学号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

// 获取表单引用和路由实例
const loginFormRef = ref(null)
const router = useRouter()
const loading = ref(false)

// 处理登录逻辑
const handleLogin = () => {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      
      console.log('发送登录请求:', loginForm.username, loginForm.password)
      
      // 使用普通对象格式，让request.js自动转换
      http.post('/login', {
        username: loginForm.username,
        password: loginForm.password
      })
      .then(response => {
        console.log('登录响应:', response)
        
        if (response.success) {
          // 保存用户信息到localStorage
          localStorage.setItem('userInfo', JSON.stringify(response.data))
          ElMessage.success('登录成功')
          
          // 跳转到学生页面
          router.push('/home')
        } else {
          ElMessage.error(response.message || '登录失败')
        }
      })
      .catch(error => {
        console.error('登录失败:', error)
        ElMessage.error(error.message || '登录失败，请稍后重试')
      })
      .finally(() => {
        loading.value = false
      })
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* 背景装饰圆圈 */
.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: -50px;
  left: -50px;
}

.circle-2 {
  width: 150px;
  height: 150px;
  bottom: 100px;
  right: 100px;
}

.circle-3 {
  width: 100px;
  height: 100px;
  top: 50%;
  right: 10%;
}

.login-box {
  width: 420px;
  padding: 50px 45px 35px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  text-align: center;
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  margin-bottom: 40px;
}

.logo {
  width: 70px;
  height: 70px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #409EFF, #67C23A);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.3);
}

.logo .el-icon {
  color: white !important;
}

.login-box h2 {
  margin-bottom: 12px;
  color: #303133;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.subtitle {
  color: #909399;
  font-size: 14px;
  margin: 0;
  font-weight: 400;
}

.login-form {
  margin-top: 10px;
}

:deep(.custom-input .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

:deep(.custom-input .el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #409EFF;
}

:deep(.custom-input .el-input__wrapper.is-focus) {
  box-shadow: 0 4px 15px rgba(64, 158, 255, 0.2);
  border-color: #409EFF;
}

:deep(.custom-input .el-input__inner) {
  color: #303133;
  font-size: 15px;
}

:deep(.custom-input .el-input__prefix) {
  color: #909399;
}

.login-button {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  background: linear-gradient(135deg, #409EFF, #67C23A);
  border: none;
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
  margin-top: 10px;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(64, 158, 255, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

.login-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.tip {
  color: #C0C4CC;
  font-size: 12px;
  margin: 0;
  font-style: italic;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-box {
    width: 90%;
    margin: 0 auto;
    padding: 40px 25px 25px;
  }
  
  .login-box h2 {
    font-size: 24px;
  }
}
</style>