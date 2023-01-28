import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'home',
    meta: { title: '首页' },
    component: () => import('@/views/HomeView')
  },
  {
    path: '/home',
    name: 'index',
    meta: { title: '首页' },
    component: () => import('@/views/IndexView')
  },
  {
    path: '/Ihome',
    name: 'indexs',
    meta: { title: '首页' },
    component: () => import('@/views/IndexsView')
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: '医生登录' },
    component: () => import('@/views/LoginView')
  },
  {
    path: '/myzx',
    name: 'myzx',
    meta: { title: '首页' },
    component: () => import('@/views/MyzxView')
  },
  {
    path: '/rej',
    name: 'rej',
    meta: { title: '注册-补齐信息' },
    component: () => import('@/views/RejView')
  },
  {
    path: '/jk',
    name: 'jk',
    meta: { title: '建卡' },
    component: () => import('@/views/JkView')
  },
  {
    path: '/ksys',
    name: 'ksys',
    meta: { title: '科室-医生' },
    component: () => import('@/views/KeshiView')
  },
  {
    path: '/yshome',
    name: 'yshome',
    meta: { title: '医生主页' },
    component: () => import('@/views/YshomeView')
  },
  {
    path: '/bqms',
    name: 'bqms',
    meta: { title: '病情描述' },
    component: () => import('@/views/BqmsView')
  },
  {
    path: '/yslb',
    name: 'yslb',
    meta: { title: '问诊列表' },
    component: () => import('@/views/YslbView')
  },
  {
    path: '/wait',
    name: 'wait',
    meta: { title: '图文问诊详情' },
    component: () => import('@/views/WaitView')
  },
  {
    path: '/ltck',
    name: 'ltck',
    meta: { title: '图文问诊详情' },
    component: () => import('@/views/LtckView')
  },
  // {
  //   path: '/404',
  //   name: 'NotFound',
  //   component: () => import('@/views/NotFound')
  // },
  {
    path: '/:pathMatch(.*)',
    redirect: '/index'
  }
]

const router = createRouter({
  base: 'yiyang',
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // 动态标题
  const title = (to.meta.title ? to.meta.title : '')
  document.title = title || document.title
  if (to.path === '/yshome') {
    if (!to.query?.data) {
      router.replace('/index')
    }
  }
  if (to.path === '/yslb') {
    if (!localStorage.getItem('ysdm')) {
      router.replace('/login')
    }
  }
  next()
})

router.afterEach((to, from) => {
  window.scrollTo(0, 0)
})

export default router
