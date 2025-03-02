import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Import views
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ScheduleView from '../views/ScheduleView.vue'
import EmployeesView from '../views/EmployeesView.vue'
import ProfileView from '../views/ProfileView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresGuest: true }
  },
  {
    path: '/schedule',
    name: 'schedule',
    component: ScheduleView,
    meta: { requiresAuth: true }
  },
  {
    path: '/employees',
    name: 'employees',
    component: EmployeesView,
    meta: { requiresAuth: true, requiresManager: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active'
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const isManager = authStore.isManager

  // Check for protected routes
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } 
  // Check for manager-only routes
  else if (to.meta.requiresManager && !isManager) {
    next({ name: 'schedule' })
  }
  // Check for guest-only routes (login, register)
  else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'schedule' })
  }
  else {
    next()
  }
})

export default router