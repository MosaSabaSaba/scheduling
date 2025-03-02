import { defineStore } from 'pinia'
import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import { useAuthStore } from './auth'

export const useSocketStore = defineStore('socket', () => {
  const socket = ref(null)
  const connected = ref(false)
  const notifications = ref([])
  const authStore = useAuthStore()

  function setupSocket() {
    if (socket.value) return

    // Create socket connection
    socket.value = io('/', {
      auth: {
        token: authStore.token
      }
    })

    // Set up event listeners
    socket.value.on('connect', () => {
      connected.value = true
      console.log('Socket connected')
    })

    socket.value.on('disconnect', () => {
      connected.value = false
      console.log('Socket disconnected')
    })

    // Listen for shift updates
    socket.value.on('shift_created', (data) => {
      addNotification('New shift created', data)
    })

    socket.value.on('shift_updated', (data) => {
      addNotification('Shift updated', data)
    })

    socket.value.on('shift_deleted', (data) => {
      addNotification('Shift deleted', data)
    })

    socket.value.on('shift_swap_requested', (data) => {
      addNotification('Shift swap requested', data)
    })

    socket.value.on('shift_swap_responded', (data) => {
      addNotification('Shift swap response received', data)
    })
  }

  function disconnect() {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      connected.value = false
    }
  }

  function emitShiftUpdate(event, data) {
    if (socket.value && connected.value) {
      socket.value.emit(event, data)
    }
  }

  function addNotification(message, data) {
    notifications.value.unshift({
      id: Date.now(),
      message,
      data,
      read: false,
      timestamp: new Date()
    })
  }

  function markNotificationAsRead(id) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  function clearNotifications() {
    notifications.value = []
  }

  return {
    socket,
    connected,
    notifications,
    setupSocket,
    disconnect,
    emitShiftUpdate,
    addNotification,
    markNotificationAsRead,
    clearNotifications
  }
})