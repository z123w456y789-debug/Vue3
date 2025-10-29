<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="login-container">
    <div class="login-box">
      <h2>学生登录</h2>
      <el-form 
        :model="loginForm" 
        :rules="loginRules" 
        ref="loginFormRef"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入学号"
            prefix-icon="User"
            clearable
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            class="login-button"
            @click="handleLogin"
            :loading="loading"
            style="width: 100%"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable vue/multi-word-component-names */
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
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
}

.login-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.login-box h2 {
  margin-bottom: 30px;
  color: #333;
}

.login-form {
  margin-top: 20px;
}

.login-button {
  margin-top: 20px;
}
</style>