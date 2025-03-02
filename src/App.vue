<script setup>
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useSocketStore } from './stores/socket'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import Notifications from './components/layout/Notifications.vue'

const router = useRouter()
const authStore = useAuthStore()
const socketStore = useSocketStore()

// Set up socket connection when authenticated
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    socketStore.setupSocket()
  } else {
    socketStore.disconnect()
  }
}, { immediate: true })

// Check if token is expired on app load
onMounted(() => {
  if (authStore.token) {
    const tokenData = authStore.user
    if (tokenData && tokenData.exp * 1000 < Date.now()) {
      authStore.logout()
      router.push('/login')
    }
  }
})
</script>

<template>
  <div class="app-container d-flex flex-column min-vh-100">
    <Navbar />
    
    <main class="flex-grow-1 py-4">
      <div class="container">
        <router-view />
      </div>
    </main>
    
    <Notifications />
    <Footer />
  </div>
</template>

<style>
.app-container {
  background-color: #f8f9fa;
}

/* Transitions for route changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>