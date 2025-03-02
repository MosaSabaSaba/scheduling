<script setup>
import { ref, onMounted } from 'vue'
import { useEmployeeStore } from '../stores/employees'
import EmployeeModal from '../components/employees/EmployeeModal.vue'

const employeeStore = useEmployeeStore()
const showModal = ref(false)
const selectedEmployee = ref(null)
const modalMode = ref('add')
const searchQuery = ref('')

// Filter employees based on search query
const filteredEmployees = computed(() => {
  if (!searchQuery.value) {
    return employeeStore.employees
  }
  
  const query = searchQuery.value.toLowerCase()
  return employeeStore.employees.filter(employee => 
    employee.name.toLowerCase().includes(query) || 
    employee.email.toLowerCase().includes(query) ||
    employee.position?.toLowerCase().includes(query)
  )
})

// Handle employee actions
const openAddEmployeeModal = () => {
  selectedEmployee.value = {
    name: '',
    email: '',
    position: '',
    phone: '',
    availability: {
      monday: { available: false, startTime: '09:00', endTime: '17:00' },
      tuesday: { available: false, startTime: '09:00', endTime: '17:00' },
      wednesday: { available: false, startTime: '09:00', endTime: '17:00' },
      thursday: { available: false, startTime: '09:00', endTime: '17:00' },
      friday: { available: false, startTime: '09:00', endTime: '17:00' },
      saturday: { available: false, startTime: '09:00', endTime: '17:00' },
      sunday: { available: false, startTime: '09:00', endTime: '17:00' }
    }
  }
  modalMode.value = 'add'
  showModal.value = true
}

const openEditEmployeeModal = (employee) => {
  selectedEmployee.value = { ...employee }
  modalMode.value = 'edit'
  showModal.value = true
}

const handleEmployeeSave = async (employeeData) => {
  if (modalMode.value === 'add') {
    await employeeStore.addEmployee(employeeData)
  } else {
    await employeeStore.updateEmployee(employeeData._id, employeeData)
  }
  
  showModal.value = false
  selectedEmployee.value = null
}

const handleEmployeeDelete = async (employeeId) => {
  if (confirm('Are you sure you want to delete this employee?')) {
    await employeeStore.deleteEmployee(employeeId)
    showModal.value = false
    selectedEmployee.value = null
  }
}

// Load employees on component mount
onMounted(async () => {
  await employeeStore.fetchEmployees()
})
</script>

<template>
  <div class="employees-container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3">
        <i class="bi bi-people me-2"></i>
        Employees
      </h1>
      
      <button @click="openAddEmployeeModal" class="btn btn-primary">
        <i class="bi bi-person-plus me-1"></i> Add Employee
      </button>
    </div>
    
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <div class="input-group mb-3">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
          <input
            type="text"
            class="form-control"
            placeholder="Search employees..."
            v-model="searchQuery"
          >
        </div>
        
        <div v-if="employeeStore.loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        
        <div v-else-if="employeeStore.error" class="alert alert-danger">
          {{ employeeStore.error }}
        </div>
        
        <div v-else-if="filteredEmployees.length === 0" class="text-center py-4">
          <p class="text-muted">No employees found</p>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Position</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in filteredEmployees" :key="employee._id">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-circle me-2">
                      {{ employee.name.charAt(0).toUpperCase() }}
                    </div>
                    {{ employee.name }}
                  </div>
                </td>
                <td>{{ employee.email }}</td>
                <td>{{ employee.position || 'N/A' }}</td>
                <td>{{ employee.phone || 'N/A' }}</td>
                <td>
                  <div class="btn-group">
                    <button
                      @click="openEditEmployeeModal(employee)"
                      class="btn btn-sm btn-outline-primary"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      @click="handleEmployeeDelete(employee._id)"
                      class="btn btn-sm btn-outline-danger"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Employee Modal -->
    <EmployeeModal
      v-if="showModal"
      :show="showModal"
      :employee="selectedEmployee"
      :mode="modalMode"
      @close="showModal = false"
      @save="handleEmployeeSave"
      @delete="handleEmployeeDelete"
    />
  </div>
</template>

<style scoped>
.employees-container {
  margin-bottom: 2rem;
}

.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #6c757d;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
</style>