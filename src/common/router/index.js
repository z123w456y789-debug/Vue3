import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../../components/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../../components/Home.vue'),
    redirect: '/my-exams',
    children: [
      {
        path: '/my-exams',
        name: 'my-exams',
        component: () => import('@/components/MyExams.vue'),
      },

      {
        path: '/my-courses',
        name: 'MyCourses',
        component: () => import('../../components/MyCourses.vue')
      },
    ]
  },



]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router