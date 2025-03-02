import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useSocketStore } from './socket'

export const useShiftStore = defineStore('shifts', () => {
  const shifts = ref([])
  const loading = ref(false)
  const error = ref(null)
  const socketStore = useSocketStore()

  async function fetchShifts(startDate, endDate) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get('/api/shifts', {
        params: { startDate, endDate }
      })
      shifts.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch shifts'
      console.error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function addShift(shiftData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post('/api/shifts', shiftData)
      shifts.value.push(response.data)
      socketStore.emitShiftUpdate('shift_created', response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to add shift'
      console.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateShift(id, shiftData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.put(`/api/shifts/${id}`, shiftData)
      const index = shifts.value.findIndex(shift => shift._id === id)
      if (index !== -1) {
        shifts.value[index] = response.data
      }
      socketStore.emitShiftUpdate('shift_updated', response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update shift'
      console.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteShift(id) {
    loading.value = true
    error.value = null
    
    try {
      await axios.delete(`/api/shifts/${id}`)
      const deletedShift = shifts.value.find(shift => shift._id === id)
      shifts.value = shifts.value.filter(shift => shift._id !== id)
      socketStore.emitShiftUpdate('shift_deleted', { id, ...deletedShift })
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete shift'
      console.error(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  async function requestSwap(shiftId, requestData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post(`/api/shifts/${shiftId}/swap-request`, requestData)
      const index = shifts.value.findIndex(shift => shift._id === shiftId)
      if (index !== -1) {
        shifts.value[index] = response.data
      }
      socketStore.emitShiftUpdate('shift_swap_requested', response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to request shift swap'
      console.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  async function respondToSwapRequest(shiftId, swapId, approved) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.put(`/api/shifts/${shiftId}/swap-request/${swapId}`, { approved })
      const index = shifts.value.findIndex(shift => shift._id === shiftId)
      if (index !== -1) {
        shifts.value[index] = response.data
      }
      socketStore.emitShiftUpdate('shift_swap_responded', response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to respond to shift swap'
      console.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    shifts,
    loading,
    error,
    fetchShifts,
    addShift,
    updateShift,
    deleteShift,
    requestSwap,
    respondToSwapRequest
  }
})