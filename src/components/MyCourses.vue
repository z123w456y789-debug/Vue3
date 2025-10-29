<template>
  <div class="app-container">

    <!-- 主内容区 -->
    <main class="main-content">
      <div class="page-header">
        <h2>我的课程</h2>
        <button class="add-course-btn" @click="showAddCourseModal = true">添加课程</button>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <p>加载中...</p>
      </div>

      <!-- 课程列表 -->
      <div v-else class="course-list">
        <div class="course-card" v-for="course in courses" :key="course.id">
          <img :src="courseCover" alt="课程封面" class="course-cover" />
          <h3 class="course-name">{{ course.name }}</h3>
          <p class="teacher-name">{{ course.teacherName || '教师信息待完善' }}</p>
          <p class="course-code">课程代码: {{ course.courseCode }}</p>
        </div>

        <!-- 空状态 -->
        <div v-if="courses.length === 0" class="empty-state">
          <p>暂无课程，请添加课程</p>
        </div>
      </div>
    </main>

    <!-- 添加课程弹窗 -->
    <div class="modal-overlay" v-if="showAddCourseModal">
      <div class="modal">
        <div class="modal-header">
          <h3>添加课程</h3>
          <button class="close-btn" @click="showAddCourseModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <p>输入课程代码</p>
          <input type="text" v-model="courseCode" placeholder="请输入课程代码" class="course-id-input" />
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showAddCourseModal = false">取消</button>
          <button class="confirm-btn" @click="handleAddCourse" :disabled="addLoading">
            {{ addLoading ? '添加中...' : '确认添加' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import courseCover from '@/assets/at.png'
// 导入http实例
import { http } from '../common/request'

// 课程数据
const courses = ref([])
const loading = ref(false)
const addLoading = ref(false)

// 弹窗相关状态
const showAddCourseModal = ref(false)
const courseCode = ref('')

// 获取学生课程列表
const fetchCourses = async () => {
  loading.value = true
  try {
    const response = await http.get('/courses')
    console.log('课程列表响应:', response)

    if (response.success) {
      courses.value = response.data || []
    } else {
      ElMessage.error(response.message || '获取课程列表失败')
    }
  } catch (error) {
    console.error('获取课程列表失败:', error)
    ElMessage.error(error.message || '获取课程列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 处理添加课程
const handleAddCourse = async () => {
  if (!courseCode.value.trim()) {
    ElMessage.warning('请输入课程代码')
    return
  }

  addLoading.value = true

  try {
    console.log('发送添加课程请求:', courseCode.value.trim())

    const response = await http.post('/courses-add', {
      courseCode: courseCode.value.trim()
    })

    console.log('添加课程响应:', response)

    if (response.success) {
      ElMessage.success('课程添加成功')
      showAddCourseModal.value = false
      courseCode.value = ''
      // 重新获取课程列表
      await fetchCourses()
    } else {
      ElMessage.error(response.message || '添加课程失败')
    }
  } catch (error) {
    console.error('添加课程失败:', error)
    ElMessage.error(error.message || '添加课程失败，请稍后重试')
  } finally {
    addLoading.value = false
  }
}

// 组件挂载时获取课程列表
onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
/* 原有样式保持不变 */
.app-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 220px;
  background: #fff;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 20px;
  font-size: 20px;
  font-weight: bold;
}

.nav-menu {
  flex: 1;
  padding-top: 20px;
}

.menu-item {
  display: block;
  padding: 12px 20px;
  text-decoration: none;
  color: #333;
  transition: background 0.2s;
}

.menu-item.active {
  background: #f0f0f0;
  color: #007bff;
}

.user-info {
  padding: 20px;
  border-top: 1px solid #eee;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  vertical-align: middle;
}

.user-details {
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
}

.username {
  font-weight: bold;
  font-size: 14px;
}

.aux-info {
  font-size: 12px;
  color: #999;
}

.logout-btn {
  margin-top: 10px;
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.add-course-btn {
  background: #007bff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.course-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.course-card {
  width: calc(25% - 15px);
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.course-cover {
  width: 100%;
  height: 120px;
  object-fit: cover;
  background-color: #f5f5f5;
}

.course-name {
  padding: 12px 12px 8px;
  font-size: 16px;
  margin: 0;
  font-weight: bold;
  color: #333;
}

.teacher-name {
  padding: 0 12px 8px;
  font-size: 14px;
  color: #666;
  margin: 0;
}

.course-code {
  padding: 0 12px 12px;
  font-size: 12px;
  color: #999;
  margin: 0;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  line-height: 1;
}

.close-btn:hover {
  color: #666;
}

.modal-body {
  padding: 20px;
}

.modal-body p {
  margin: 0 0 12px 0;
  color: #333;
  font-weight: 500;
}

.course-id-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
  transition: border-color 0.2s;
}

.course-id-input:focus {
  outline: none;
  border-color: #007bff;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f5f5f5;
  border-color: #ccc;
}

.confirm-btn {
  padding: 10px 20px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.confirm-btn:hover:not(:disabled) {
  background: #0056b3;
}

.confirm-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 加载状态 */
.loading-container {
  text-align: center;
  padding: 60px;
  color: #666;
  font-size: 16px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px;
  color: #999;
  width: 100%;
  font-size: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px dashed #ddd;
}
</style>