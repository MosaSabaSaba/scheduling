<script setup>
import { computed } from 'vue'
import { format, parseISO } from 'date-fns'
import { useAuthStore } from '../../stores/auth'

const props = defineProps({
  shift: {
    type: Object,
    required: true
  },
  employees: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit'])

const authStore = useAuthStore()

// Format times for display
const startTime = computed(() => format(parseISO(props.shift.startTime), 'h:mm a'))
const endTime = computed(() => format(parseISO(props.shift.endTime), 'h:mm a'))

// Get employee name
const employee = computed(() => {
  return props.employees.find(emp => emp._id === props.shift.employeeId) || { name: 'Unassigned' }
})

// Determine if current user is assigned to this shift
const isUserShift = computed(() => {
  return props.shift.employeeId === authStore.user.id
})

// Determine card color based on employee or other criteria
const cardColorClass = computed(() => {
  if (isUserShift.value) {
    return 'border-primary bg-primary bg-opacity-10'
  }
  
  // You could add more logic here to color-code shifts by role, department, etc.
  return 'border-secondary'
})
</script>

<template>
  <div 
    class="shift-card mb-2 p-2 rounded border"
    :class="cardColorClass"
    @click="emit('edit', shift)"
  >
    <div class="d-flex justify-content-between align-items-center">
      <div class="shift-time">
        {{ startTime }} - {{ endTime }}
      </div>
      <div v-if="authStore.isManager" class="shift-actions">
        <button class="btn btn-sm btn-link p-0 text-primary">
          <i class="bi bi-pencil-square"></i>
        </button>
      </div>
    </div>
    
    <div class="shift-employee">
      <i class="bi bi-person me-1"></i>
      {{ employee.name }}
    </div>
    
    <div v-if="shift.notes" class="shift-notes small text-muted mt-1">
      <i class="bi bi-chat-left-text me-1"></i>
      {{ shift.notes }}
    </div>
  </div>
</template>

<style scoped>
.shift-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.shift-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.shift-time {
  font-weight: 500;
  font-size: 0.9rem;
}

.shift-employee {
  font-size: 0.9rem;
}

.shift-notes {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>