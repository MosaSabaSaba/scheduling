<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  employee: {
    type: Object,
    required: true
  },
  mode: {
    type: String,
    default: 'add'
  }
})

const emit = defineEmits(['close', 'save', 'delete'])

const formData = ref({ ...props.employee })
const activeTab = ref('info')

// Days of the week for availability
const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
]

// Watch for changes in the employee prop
watch(() => props.employee, (newEmployee) => {
  formData.value = { ...newEmployee }
  
  // Ensure availability object exists
  if (!formData.value.availability) {
    formData.value.availability = {}
    daysOfWeek.forEach(day => {
      formData.value.availability[day.key] = {
        available: false,
        startTime: '09:00',
        endTime: '17:00'
      }
    })
  }
}, { deep: true })

// Computed properties
const modalTitle = computed(() => {
  return props.mode === 'add' ? 'Add New Employee' : 'Edit Employee'
})

// Methods
const handleSubmit = () => {
  emit('save', formData.value)
}

const handleDelete = () => {
  emit('delete', formData.value._id)
}

const setTab = (tab) => {
  activeTab.value = tab
}
</script>

<template>
  <div class="modal fade show" tabindex="-1" style="display: block;">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-person-plus me-2"></i>
            {{ modalTitle }}
          </h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>
        
        <div class="modal-body">
          <ul class="nav nav-tabs mb-3">
            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ active: activeTab === 'info' }"
                href="#"
                @click.prevent="setTab('info')"
              >
                <i class="bi bi-info-circle me-1"></i>
                Basic Info
              </a>
            </li>
            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ active: activeTab === 'availability' }"
                href="#"
                @click.prevent="setTab('availability')"
              >
                <i class="bi bi-calendar-check me-1"></i>
                Availability
              </a>
            </li>
          </ul>
          
          <form @submit.prevent="handleSubmit">
            <!-- Basic Info Tab -->
            <div v-if="activeTab === 'info'">
              <div class="mb-3">
                <label for="name" class="form-label">Full Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="formData.name"
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="formData.email"
                  required
                >
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="position" class="form-label">Position</label>
                    <input
                      type="text"
                      class="form-control"
                      id="position"
                      v-model="formData.position"
                    >
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="phone" class="form-label">Phone Number</label>
                    <input
                      type="tel"
                      class="form-control"
                      id="phone"
                      v-model="formData.phone"
                    >
                  </div>
                </div>
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
            </div>
            
            <!-- Availability Tab -->
            <div v-if="activeTab === 'availability'">
              <div class="mb-3">
                <div class="card mb-3" v-for="day in daysOfWeek" :key="day.key">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <h6 class="mb-0">{{ day.label }}</h6>
                      <div class="form-check form-switch">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          :id="`available-${day.key}`"
                          v-model="formData.availability[day.key].available"
                        >
                        <label class="form-check-label" :for="`available-${day.key}`">
                          Available
                        </label>
                      </div>
                    </div>
                    
                    <div class="row" v-if="formData.availability[day.key].available">
                      <div class="col-md-6">
                        <div class="mb-2">
                          <label :for="`start-${day.key}`" class="form-label small">Start Time</label>
                          <input
                            type="time"
                            class="form-control"
                            :id="`start-${day.key}`"
                            v-model="formData.availability[day.key].startTime"
                          >
                        </div>
                      </div>
                      
                      <div class="col-md-6">
                        <div class="mb-2">
                          <label :for="`end-${day.key}`" class="form-label small">End Time</label>
                          <input
                            type="time"
                            class="form-control"
                            :id="`end-${day.key}`"
                            v-model="formData.availability[day.key].endTime"
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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