<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="courses-page">
    <!-- 简洁页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">我的课程</h1>
        </div>
        <el-button 
          type="primary" 
          size="large" 
          class="add-course-btn"
          @click="showAddCourseModal = true"
          :icon="Plus"
        >
          添加课程
        </el-button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content-area">
      <!-- 搜索和操作栏 -->
      <div class="action-bar">
        <div class="search-container">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索课程名称、教师"
            :prefix-icon="Search"
            class="search-input"
            clearable
          />
        </div>
      </div>

      <!-- 课程内容 -->
      <div class="courses-content">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
          <div class="skeleton-grid">
            <div v-for="i in 6" :key="i" class="course-skeleton">
              <div class="skeleton-cover"></div>
              <div class="skeleton-info">
                <div class="skeleton-title"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 课程网格 -->
        <div v-else class="courses-grid">
          <div 
            v-for="course in filteredCourses" 
            :key="course.id"
            class="course-card"
          >
            <div class="course-cover">
              <img :src="courseCover" alt="课程封面" />
            </div>
            
            <div class="course-info">
              <h4 class="course-name">{{ course.name }}</h4>
              
              <div class="course-details">
                <div class="detail-item">
                  <el-icon><User /></el-icon>
                  <span>{{ course.teacherName || '教师信息待完善' }}</span>
                </div>
                <div class="detail-item">
                  <el-icon><Document /></el-icon>
                  <span>{{ course.courseCode }}</span>
                </div>
              </div>

              <!-- 如果后端提供了进度数据，显示进度条 -->
              <div class="course-progress" v-if="course.progress !== undefined">
                <div class="progress-info">
                  <span>学习进度</span>
                  <span class="progress-percent">{{ course.progress || 0 }}%</span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: (course.progress || 0) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 添加课程卡片 -->
          <div class="add-course-card" @click="showAddCourseModal = true">
            <div class="add-content">
              <el-icon size="32"><Plus /></el-icon>
              <p>添加课程</p>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && courses.length === 0" class="empty-state">
          <div class="empty-content">
            <el-icon size="64" color="#cbd5e1"><Notebook /></el-icon>
            <h3>暂无课程</h3>
            <p>您还没有添加任何课程</p>
            <el-button type="primary" @click="showAddCourseModal = true">
              添加第一个课程
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加课程弹窗 -->
    <el-dialog
      v-model="showAddCourseModal"
      title="添加课程"
      width="400px"
      :close-on-click-modal="false"
      align-center
    >
      <div class="dialog-content">
        <el-form :model="addForm" :rules="addRules" ref="addFormRef">
          <el-form-item label="课程代码" prop="courseCode">
            <el-input
              v-model="addForm.courseCode"
              placeholder="请输入课程代码"
              :prefix-icon="Key"
              size="large"
              clearable
            />
          </el-form-item>
        </el-form>
        
        <div class="dialog-tips">
          <el-alert
            title="提示"
            type="info"
            description="请向授课教师获取课程代码"
            :closable="false"
            show-icon
          />
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddCourseModal = false" :disabled="addLoading">
            取消
          </el-button>
          <el-button 
            type="primary" 
            @click="handleAddCourse" 
            :loading="addLoading"
          >
            {{ addLoading ? '添加中...' : '确认添加' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Plus, 
  Search, 
  User, 
  Document, 
  Key,
  Notebook
} from '@element-plus/icons-vue'
import courseCover from '@/assets/at.png'
import { http } from '../common/request'

// 课程数据
const courses = ref([])
const loading = ref(false)
const addLoading = ref(false)
const searchKeyword = ref('')

// 弹窗相关状态
const showAddCourseModal = ref(false)
const addForm = ref({
  courseCode: ''
})
const addFormRef = ref(null)

// 表单验证规则
const addRules = {
  courseCode: [
    { required: true, message: '请输入课程代码', trigger: 'blur' },
    { min: 3, message: '课程代码长度至少3个字符', trigger: 'blur' }
  ]
}

// 计算属性
const filteredCourses = computed(() => {
  if (!searchKeyword.value) return courses.value
  return courses.value.filter(course => 
    course.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    (course.teacherName && course.teacherName.toLowerCase().includes(searchKeyword.value.toLowerCase()))
  )
})

// 获取学生课程列表
const fetchCourses = async () => {
  loading.value = true
  try {
    const response = await http.get('/courses')
    console.log('课程列表响应:', response)

    if (response.success) {
      // 直接使用后端返回的数据
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
  if (!addFormRef.value) return

  await addFormRef.value.validate(async (valid) => {
    if (!valid) return

    addLoading.value = true

    try {
      const response = await http.post('/courses-add', {
        courseCode: addForm.value.courseCode.trim()
      })

      if (response.success) {
        ElMessage.success('课程添加成功')
        showAddCourseModal.value = false
        addForm.value.courseCode = ''
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
  })
}

onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
.courses-page {
  min-height: 100vh;
  background: #ffffff;
}

/* 简洁页面头部 */
.page-header {
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
  padding: 24px 0;
}

.header-content {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section .page-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1e293b;
}

.title-section .page-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.add-course-btn {
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  padding: 0 20px;
  height: 40px;
}

.add-course-btn:hover {
  background: #2563eb;
}

/* 主要内容区域 */
.main-content-area {
  padding: 24px 32px;
}

/* 操作栏 */
.action-bar {
  margin-bottom: 24px;
}

.search-container {
  max-width: 400px;
}

.search-input {
  width: 100%;
}

:deep(.search-input .el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

:deep(.search-input .el-input__wrapper:hover) {
  border-color: #3b82f6;
}

/* 课程内容 */
.courses-content {
  min-height: 400px;
}

/* 加载状态 */
.loading-state {
  padding: 20px 0;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.course-skeleton {
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  overflow: hidden;
}

.skeleton-cover {
  height: 140px;
  background: #f8fafc;
}

.skeleton-info {
  padding: 16px;
}

.skeleton-title {
  height: 20px;
  background: #f1f5f9;
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-text {
  height: 16px;
  background: #f8fafc;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-text.short {
  width: 60%;
}

/* 课程网格 */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* 课程卡片 */
.course-card {
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;
}

.course-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.course-cover {
  height: 140px;
  background: linear-gradient(135deg, #1e293b, #334155);
  overflow: hidden;
}

.course-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-info {
  padding: 16px;
}

.course-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.course-details {
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 14px;
  color: #64748b;
}

.detail-item .el-icon {
  font-size: 14px;
  color: #94a3b8;
}

.course-progress {
  margin-top: 12px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 12px;
  color: #64748b;
}

.progress-percent {
  font-weight: 600;
  color: #3b82f6;
}

.progress-bar {
  height: 4px;
  background: #f1f5f9;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* 添加课程卡片 */
.add-course-card {
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-course-card:hover {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.add-content {
  text-align: center;
  color: #64748b;
}

.add-content .el-icon {
  margin-bottom: 8px;
}

.add-content p {
  margin: 0;
  font-weight: 500;
}

/* 空状态 */
.empty-state {
  padding: 80px 20px;
  text-align: center;
}

.empty-content h3 {
  color: #374151;
  margin: 16px 0 8px 0;
  font-size: 18px;
}

.empty-content p {
  color: #6b7280;
  margin: 0 0 20px 0;
}

/* 弹窗样式 */
.dialog-content {
  padding: 8px 0;
}

.dialog-tips {
  margin-top: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 0 20px;
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .main-content-area {
    padding: 20px;
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .action-bar {
    margin-bottom: 20px;
  }
}
</style>