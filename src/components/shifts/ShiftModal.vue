<script setup>
import { ref, computed, watch } from 'vue'
import { format, parseISO } from 'date-fns'
import { useAuthStore } from '../../stores/auth'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  shift: {
    type: Object,
    required: true
  },
  mode: {
    type: String,
    default: 'add'
  },
  employees: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'save', 'delete'])

const authStore = useAuthStore()
const formData = ref({ ...props.shift })

// Format dates for input fields
const formatDateTimeForInput = (dateTimeString) => {
  if (!dateTimeString) return ''
  const date = new Date(dateTimeString)
  return format(date, "yyyy-MM-dd'T'HH:mm")
}

// Watch for changes in the shift prop
watch(() => props.shift, (newShift) => {
  formData.value = { ...newShift }
}, { deep: true })

// Computed properties
const modalTitle = computed(() => {
  return props.mode === 'add' ? 'Add New Shift' : 'Edit Shift'
})

const startTimeFormatted = computed(() => {
  return formatDateTimeForInput(formData.value.startTime)
})

const endTimeFormatted = computed(() => {
  return formatDateTimeForInput(formData.value.endTime)
})

// Methods
const handleSubmit = () => {
  emit('save', formData.value)
}

const handleDelete = () => {
  emit('delete', formData.value._id)
}
</script>

<template>
  <div class="modal fade show" tabindex="-1" style="display: block;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-calendar-plus me-2"></i>
            {{ modalTitle }}
          </h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="employeeId" class="form-label">Employee</label>
              <select
                id="employeeId"
                class="form-select"
                v-model="formData.employeeId"
                required
              >
                <option value="" disabled>Select an employee</option>
                <option v-for="employee in employees" :key="employee._id" :value="employee._id">
                  {{ employee.name }}
                </option>
              </select>
            </div>
            
            <div class="mb-3">
              <label for="startTime" class="form-label">Start Time</label>
              <input
                type="datetime-local"
                class="form-control"
                id="startTime"
                v-model="formData.startTime"
                required
              >
            </div>
            
            <div class="mb-3">
              <label for="endTime" class="form-label">End Time</label>
              <input
                type="datetime-local"
                class="form-control"
                id="endTime"
                v-model="formData.endTime"
                required
              >
            </div>
            
            <div class="mb-3">
              <label for="notes" class="form-label">Notes</label>
              <textarea
                class="form-control"
                id="notes"
                v-model="formData.notes"
                rows="3"
              ></textarea>
            </div>
          </form>
        </div>
        
        <div class="modal-footer">
          <button
            v-if="mode === 'edit'"
            type="button"
            class="btn btn-danger me-auto"
            @click="handleDelete"
          >
            <i class="bi bi-trash me-1"></i>
            Delete
          </button>
          
          <button
            type="button"
            class="btn btn-secondary"
            @click="emit('close')"
          >
            Cancel
          </button>
          
          <button
            type="button"
            class="btn btn-primary"
            @click="handleSubmit"
          >
            <i class="bi bi-save me-1"></i>
            Save
          </button>
        </div>
      </div>
    </div>
    
    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>