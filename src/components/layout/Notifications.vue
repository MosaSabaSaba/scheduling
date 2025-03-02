<script setup>
import { computed, ref, watch } from 'vue'
import { useSocketStore } from '../../stores/socket'

const socketStore = useSocketStore()
const showToast = ref(false)
const currentNotification = ref(null)
const toastTimeout = ref(null)

const unreadNotifications = computed(() => 
  socketStore.notifications.filter(n => !n.read)
)

// Watch for new notifications
watch(() => socketStore.notifications.length, (newLength, oldLength) => {
  if (newLength > oldLength && unreadNotifications.value.length > 0) {
    // Show the most recent notification
    currentNotification.value = unreadNotifications.value[0]
    showToast.value = true
    
    // Auto-hide after 5 seconds
    if (toastTimeout.value) clearTimeout(toastTimeout.value)
    toastTimeout.value = setTimeout(() => {
      showToast.value = false
    }, 5000)
  }
})

const markAsRead = () => {
  if (currentNotification.value) {
    socketStore.markNotificationAsRead(currentNotification.value.id)
    showToast.value = false
  }
}
</script>

<template>
  <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
    <div 
      class="toast show" 
      role="alert" 
      aria-live="assertive" 
      aria-atomic="true"
      v-if="showToast && currentNotification"
    >
      <div class="toast-header">
        <i class="bi bi-bell-fill me-2 text-primary"></i>
        <strong class="me-auto">Notification</strong>
        <small>{{ new Date(currentNotification.timestamp).toLocaleTimeString() }}</small>
        <button 
          type="button" 
          class="btn-close" 
          @click="showToast = false"
        ></button>
      </div>
      <div class="toast-body">
        {{ currentNotification.message }}
        <div class="mt-2 pt-2 border-top">
          <button 
            type="button" 
            class="btn btn-primary btn-sm"
            @click="markAsRead"
          >
            Mark as read
          </button>
        </div>
      </div>
    </div>
  </div>
</template>