import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useEmployeeStore = defineStore('employees', () => {
  const employees = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchEmployees() {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get('/api/employees')
      employees.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch employees'
      console.error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function addEmployee(employeeData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post('/api/employees', employeeData)
      employees.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to add employee'
      console.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateEmployee(id, employeeData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.put(`/api/employees/${id}`, employeeData)
      const index = employees.value.findIndex(emp => emp._id === id)
      if (index !== -1) {
        employees.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update employee'
      console.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteEmployee(id) {
    loading.value = true
    error.value = null
    
    try {
      await axios.delete(`/api/employees/${id}`)
      employees.value = employees.value.filter(emp => emp._id !== id)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete employee'
      console.error(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
  }
})