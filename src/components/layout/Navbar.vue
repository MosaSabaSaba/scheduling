<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useSocketStore } from '../../stores/socket'

const router = useRouter()
const authStore = useAuthStore()
const socketStore = useSocketStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isManager = computed(() => authStore.isManager)
const user = computed(() => authStore.user)
const unreadNotifications = computed(() => 
  socketStore.notifications.filter(n => !n.read).length
)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <router-link class="navbar-brand" to="/">
        <i class="bi bi-calendar-check me-2"></i>
        WorkScheduler
      </router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item" v-if="isAuthenticated">
            <router-link class="nav-link" to="/schedule">
              <i class="bi bi-calendar-week me-1"></i> Schedule
            </router-link>
          </li>
          <li class="nav-item" v-if="isAuthenticated && isManager">
            <router-link class="nav-link" to="/employees">
              <i class="bi bi-people me-1"></i> Employees
            </router-link>
          </li>
        </ul>
        
        <ul class="navbar-nav">
          <li class="nav-item dropdown" v-if="isAuthenticated">
            <a class="nav-link dropdown-toggle position-relative" href="#" id="notificationsDropdown" role="button" data-bs-toggle="dropdown">
              <i class="bi bi-bell-fill"></i>
              <span v-if="unreadNotifications > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {{ unreadNotifications }}
              </span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="notificationsDropdown">
              <li v-if="socketStore.notifications.length === 0">
                <span class="dropdown-item text-muted">No notifications</span>
              </li>
              <li v-for="notification in socketStore.notifications.slice(0, 5)" :key="notification.id">
                <a class="dropdown-item" href="#" @click.prevent="socketStore.markNotificationAsRead(notification.id)">
                  <small class="text-muted">{{ new Date(notification.timestamp).toLocaleTimeString() }}</small>
                  <div :class="{'fw-bold': !notification.read}">{{ notification.message }}</div>
                </a>
              </li>
              <li v-if="socketStore.notifications.length > 0">
                <hr class="dropdown-divider">
              </li>
              <li>
                <a class="dropdown-item text-center" href="#" @click.prevent="socketStore.clearNotifications()">
                  Clear all
                </a>
              </li>
            </ul>
          </li>
          
          <template v-if="isAuthenticated">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
                <i class="bi bi-person-circle me-1"></i>
                {{ user?.name || 'User' }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <router-link class="dropdown-item" to="/profile">
                    <i class="bi bi-person me-2"></i> Profile
                  </router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="handleLogout">
                    <i class="bi bi-box-arrow-right me-2"></i> Logout
                  </a>
                </li>
              </ul>
            </li>
          </template>
          
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" to="/login">
                <i class="bi bi-box-arrow-in-right me-1"></i> Login
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register">
                <i class="bi bi-person-plus me-1"></i> Register
              </router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>