<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="layout-container">
    <!-- 固定侧边栏 -->
    <aside class="sidebar">
      <!-- Logo区域 -->
      <div class="sidebar-header">
        <div class="logo-container">
          <el-icon size="28" color="#409EFF"><Monitor /></el-icon>
          <span class="logo-text">钛考学生端</span>
        </div>
      </div>

      <!-- 导航菜单 -->
      <nav class="sidebar-nav">
        <el-menu
          :default-active="currentRoute"
          router
          class="custom-menu"
          background-color="transparent"
          text-color="#e2e8f0"
          active-text-color="#ffffff"
        >
          <el-menu-item index="/my-exams" class="nav-item">
            <el-icon><Document /></el-icon>
            <span>我的考试</span>
          </el-menu-item>
          
          <el-menu-item index="/my-courses" class="nav-item">
            <el-icon><Notebook /></el-icon>
            <span>我的课程</span>
          </el-menu-item>
          
          <el-menu-item index="/grade-statistics" class="nav-item">
            <el-icon><DataAnalysis /></el-icon>
            <span>成绩统计</span>
          </el-menu-item>
          
          <el-menu-item index="/my-messages" class="nav-item">
            <el-icon><Message /></el-icon>
            <span>我的消息</span>
          </el-menu-item>
          
          <el-menu-item index="/personal-center" class="nav-item">
            <el-icon><User /></el-icon>
            <span>个人中心</span>
          </el-menu-item>
        </el-menu>
      </nav>

      <!-- 用户信息 -->
      <div class="user-section">
        <div class="user-info">
          <el-avatar :size="40" src="/user-avatar.png" />
          <div class="user-details">
            <p class="username">Username</p>
            <p class="academic-info">学生信息</p>
          </div>
        </div>
        <el-button 
          class="logout-btn" 
          type="primary" 
          text 
          :icon="SwitchButton"
          @click="handleLogout"
        >
          退出
        </el-button>
      </div>
    </aside>

    <!-- 可滚动主内容区域 -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
/* eslint-disable vue/multi-word-component-names */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Monitor, 
  Document, 
  Notebook, 
  DataAnalysis, 
  Message, 
  User, 
  SwitchButton 
} from '@element-plus/icons-vue'

const route = useRoute()
const currentRoute = computed(() => route.path)

const handleLogout = () => {
  // 退出登录逻辑
  console.log('退出登录')
}
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  background: #f8fafc;
}

/* 固定侧边栏 */
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}

/* 导航菜单 */
.sidebar-nav {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
}

.custom-menu {
  border: none;
}

:deep(.custom-menu .el-menu-item) {
  height: 48px;
  margin: 2px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

:deep(.custom-menu .el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.08) !important;
}

:deep(.custom-menu .el-menu-item.is-active) {
  background: #3b82f6 !important;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

:deep(.custom-menu .el-menu-item .el-icon) {
  font-size: 18px;
}

/* 用户信息 */
.user-section {
  padding: 20px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.user-details {
  flex: 1;
}

.username {
  color: white;
  font-weight: 600;
  font-size: 14px;
  margin: 0 0 2px 0;
}

.academic-info {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin: 0;
}

.logout-btn {
  width: 100%;
  color: rgba(255, 255, 255, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.logout-btn:hover {
  color: white !important;
  background: rgba(255, 255, 255, 0.1) !important;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  margin-left: 260px;
  min-height: 100vh;
  background: #ffffff;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }
  
  .main-content {
    margin-left: 240px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.mobile-open {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0;
  }
}
</style>