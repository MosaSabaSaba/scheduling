<script setup>
import { ref, computed, onMounted } from 'vue'
import { format, startOfWeek, endOfWeek, addDays, addWeeks, subWeeks, parseISO } from 'date-fns'
import { useAuthStore } from '../stores/auth'
import { useShiftStore } from '../stores/shifts'
import { useEmployeeStore } from '../stores/employees'
import ShiftModal from '../components/shifts/ShiftModal.vue'
import ShiftCard from '../components/shifts/ShiftCard.vue'

const authStore = useAuthStore()
const shiftStore = useShiftStore()
const employeeStore = useEmployeeStore()

const currentDate = ref(new Date())
const selectedShift = ref(null)
const showModal = ref(false)
const modalMode = ref('add')

// Computed properties for date navigation
const weekStart = computed(() => startOfWeek(currentDate.value, { weekStartsOn: 0 }))
const weekEnd = computed(() => endOfWeek(currentDate.value, { weekStartsOn: 0 }))
const weekDays = computed(() => {
  const days = []
  let day = weekStart.value
  
  for (let i = 0; i < 7; i++) {
    days.push(day)
    day = addDays(day, 1)
  }
  
  return days
})

// Format date for display
const formatDate = (date) => format(date, 'MMM d, yyyy')
const formatDay = (date) => format(date, 'EEE')
const formatDayNumber = (date) => format(date, 'd')

// Navigation functions
const previousWeek = () => {
  currentDate.value = subWeeks(currentDate.value, 1)
  fetchWeekShifts()
}

const nextWeek = () => {
  currentDate.value = addWeeks(currentDate.value, 1)
  fetchWeekShifts()
}

const goToToday = () => {
  currentDate.value = new Date()
  fetchWeekShifts()
}

// Fetch shifts for the current week
const fetchWeekShifts = async () => {
  await shiftStore.fetchShifts(
    format(weekStart.value, 'yyyy-MM-dd'),
    format(weekEnd.value, 'yyyy-MM-dd')
  )
}

// Group shifts by day and employee
const shiftsByDay = computed(() => {
  const result = {}
  
  // Initialize days
  weekDays.value.forEach(day => {
    result[format(day, 'yyyy-MM-dd')] = []
  })
  
  // Add shifts to corresponding days
  shiftStore.shifts.forEach(shift => {
    const shiftDate = format(parseISO(shift.startTime), 'yyyy-MM-dd')
    if (result[shiftDate]) {
      result[shiftDate].push(shift)
    }
  })
  
  return result
})

// Filter shifts for the current user if not a manager
const filteredShiftsByDay = computed(() => {
  if (authStore.isManager) {
    return shiftsByDay.value
  }
  
  const result = {}
  
  Object.keys(shiftsByDay.value).forEach(date => {
    result[date] = shiftsByDay.value[date].filter(
      shift => shift.employeeId === authStore.user.id
    )
  })
  
  return result
})

// Handle shift actions
const openAddShiftModal = (date) => {
  selectedShift.value = {
    startTime: `${date}T09:00:00`,
    endTime: `${date}T17:00:00`,
    employeeId: '',
    notes: ''
  }
  modalMode.value = 'add'
  showModal.value = true
}

const openEditShiftModal = (shift) => {
  selectedShift.value = { ...shift }
  modalMode.value = 'edit'
  showModal.value = true
}

const handleShiftSave = async (shiftData) => {
  if (modalMode.value === 'add') {
    await shiftStore.addShift(shiftData)
  } else {
    await shiftStore.updateShift(shiftData._id, shiftData)
  }
  
  showModal.value = false
  selectedShift.value = null
}

const handleShiftDelete = async (shiftId) => {
  if (confirm('Are you sure you want to delete this shift?')) {
    await shiftStore.deleteShift(shiftId)
    showModal.value = false
    selectedShift.value = null
  }
}

// Load data on component mount
onMounted(async () => {
  await employeeStore.fetchEmployees()
  await fetchWeekShifts()
})
</script>

<template>
  <div class="schedule-container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3">
        <i class="bi bi-calendar-week me-2"></i>
        Schedule
      </h1>
      
      <div class="btn-group">
        <button @click="previousWeek" class="btn btn-outline-primary">
          <i class="bi bi-chevron-left"></i>
        </button>
        <button @click="goToToday" class="btn btn-outline-primary">Today</button>
        <button @click="nextWeek" class="btn btn-outline-primary">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
    
    <div class="card shadow-sm mb-4">
      <div class="card-header bg-white">
        <h2 class="h5 mb-0 text-center">
          {{ formatDate(weekStart) }} - {{ formatDate(weekEnd) }}
        </h2>
      </div>
      
      <div class="card-body p-0">
        <div class="schedule-grid">
          <!-- Day headers -->
          <div class="schedule-header">
            <div v-for="day in weekDays" :key="day.toString()" class="schedule-day-header">
              <div :class="{ 'text-primary fw-bold': format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') }">
                <div class="day-name">{{ formatDay(day) }}</div>
                <div class="day-number">{{ formatDayNumber(day) }}</div>
              </div>
            </div>
          </div>
          
          <!-- Shifts grid -->
          <div class="schedule-body">
            <div v-for="day in weekDays" :key="day.toString()" class="schedule-day">
              <div class="day-shifts">
                <div v-if="filteredShiftsByDay[format(day, 'yyyy-MM-dd')].length === 0" class="no-shifts">
                  <p class="text-muted">No shifts</p>
                </div>
                
                <ShiftCard
                  v-for="shift in filteredShiftsByDay[format(day, 'yyyy-MM-dd')]"
                  :key="shift._id"
                  :shift="shift"
                  :employees="employeeStore.employees"
                  @edit="openEditShiftModal"
                />
              </div>
              
              <button 
                v-if="authStore.isManager"
                @click="openAddShiftModal(format(day, 'yyyy-MM-dd'))" 
                class="btn btn-sm btn-outline-primary mt-2"
              >
                <i class="bi bi-plus-circle me-1"></i> Add Shift
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Shift Modal -->
    <ShiftModal
      v-if="showModal"
      :show="showModal"
      :shift="selectedShift"
      :mode="modalMode"
      :employees="employeeStore.employees"
      @close="showModal = false"
      @save="handleShiftSave"
      @delete="handleShiftDelete"
    />
  </div>
</template>

<style scoped>
.schedule-container {
  margin-bottom: 2rem;
}

.schedule-grid {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.schedule-header {
  display: flex;
  border-bottom: 1px solid #dee2e6;
}

.schedule-day-header {
  flex: 1;
  text-align: center;
  padding: 0.75rem;
  font-weight: 500;
}

.day-name {
  font-size: 0.9rem;
}

.day-number {
  font-size: 1.2rem;
}

.schedule-body {
  display: flex;
}

.schedule-day {
  flex: 1;
  min-height: 150px;
  padding: 0.75rem;
  border-right: 1px solid #dee2e6;
}

.schedule-day:last-child {
  border-right: none;
}

.day-shifts {
  min-height: 100px;
}

.no-shifts {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .schedule-body {
    flex-direction: column;
  }
  
  .schedule-day {
    border-right: none;
    border-bottom: 1px solid #dee2e6;
  }
  
  .schedule-day:last-child {
    border-bottom: none;
  }
  
  .schedule-header {
    display: none;
  }
  
  .schedule-day::before {
    content: attr(data-day);
    font-weight: 500;
    display: block;
    margin-bottom: 0.5rem;
  }
}
</style>