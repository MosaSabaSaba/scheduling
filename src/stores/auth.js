import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Load user from token if exists
  if (token.value) {
    try {
      user.value = jwtDecode(token.value)
    } catch (err) {
      token.value = null
      localStorage.removeItem('token')
    }
  }

  // Computed properties
  const isAuthenticated = computed(() => !!token.value)
  const isManager = computed(() => user.value?.role === 'manager')

  // Actions
  async function login(email, password) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      token.value = response.data.token
      user.value = jwtDecode(token.value)
      localStorage.setItem('token', token.value)
      setAuthHeader()
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post('/api/auth/register', userData)
      token.value = response.data.token
      user.value = jwtDecode(token.value)
      localStorage.setItem('token', token.value)
      setAuthHeader()
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  function setAuthHeader() {
    if (token.value) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    }
  }

  // Initialize auth header
  setAuthHeader()

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    isManager,
    login,
    register,
    logout
  }
})