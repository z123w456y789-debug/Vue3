<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container">
    <!-- 左侧导航栏 -->
    <aside class="sidebar">
      <div class="logo">钛考学生端</div>
      <nav class="menu">
        <ul>
          <!-- 导航项：通过 router-link 实现跳转 -->
          <li>
            <router-link 
              to="/my-exams" 
              :class="isActive('/my-exams')"
            >
              <i class="icon-exam"></i> 我的考试
            </router-link>
          </li>
          <li>
            <router-link 
              to="/my-courses" 
              :class="isActive('/my-courses')"
            >
              <i class="icon-course"></i> 我的课程
            </router-link>
          </li>
          <li>
            <router-link 
              to="/grade-statistics" 
              :class="isActive('/grade-statistics')"
            >
              <i class="icon-grade"></i> 成绩统计
            </router-link>
          </li>
          <li>
            <router-link 
              to="/my-messages" 
              :class="isActive('/my-messages')"
            >
              <i class="icon-message"></i> 我的消息
            </router-link>
          </li>
          <li>
            <router-link 
              to="/personal-center" 
              :class="isActive('/personal-center')"
            >
              <i class="icon-user"></i> 个人中心
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- 用户信息 -->
      <div class="user-info">
        <img src="/user-avatar.png" alt="用户头像" class="avatar">
        <div class="user-detail">
          <p class="username">Username</p>
          <p class="role">Academic information</p>
        </div>
        <button class="logout">退出登录</button>
      </div>
    </aside>

    <!-- 右侧内容区域（子页面展示） -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
/* eslint-disable vue/multi-word-component-names */
import { useRoute } from 'vue-router'

// 判断当前路由是否激活，用于高亮导航
const route = useRoute()
const isActive = (path) => {
  return route.path === path ? 'active' : ''
}
</script>

<style scoped>
.container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 220px;
  background: #fff;
  border-right: 1px solid #eee;
  padding: 20px 0;
}

.logo {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  padding: 0 20px 20px;
  border-bottom: 1px solid #eee;
}

.menu ul {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.menu li {
  margin: 10px 0;
}

.menu a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  text-decoration: none;
  color: #333;
  border-left: 3px solid transparent;
}

.menu a.active {
  background: #f5f7fa;
  color: #409eff;
  border-left-color: #409eff;
}

.user-info {
  padding: 20px;
  border-top: 1px solid #eee;
  margin-top: auto;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.content {
  flex: 1;
  padding: 20px;
  background: #f5f7fa;
}
</style>