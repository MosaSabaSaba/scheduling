<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('employee')
const formSubmitted = ref(false)
const passwordError = ref('')

const validateForm = () => {
  formSubmitted.value = true
  
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    return false
  }
  
  if (password.value !== confirmPassword.value) {
    passwordError.value = 'Passwords do not match'
    return false
  }
  
  if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
    return false
  }
  
  passwordError.value = ''
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  const userData = {
    name: name.value,
    email: email.value,
    password: password.value,
    role: role.value
  }
  
  const success = await authStore.register(userData)
  
  if (success) {
    router.push('/schedule')
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h2 class="text-center mb-4">
            <i class="bi bi-person-plus me-2"></i>
            Register
          </h2>
          
          <div v-if="authStore.error" class="alert alert-danger">
            {{ authStore.error }}
          </div>
          
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="name" class="form-label">Full Name</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="name"
                  :class="{ 'is-invalid': formSubmitted && !name }"
                  placeholder="Enter your full name"
                  required
                >
                <div class="invalid-feedback">
                  Name is required
                </div>
              </div>
            </div>
            
            <div class="mb-3">
              <label for="email" class="form-label">Email address</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="email"
                  :class="{ 'is-invalid': formSubmitted && !email }"
                  placeholder="Enter your email"
                  required
                >
                <div class="invalid-feedback">
                  Email is required
                </div>
              </div>
            </div>
            
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-lock"></i>
                </span>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  :class="{ 'is-invalid': formSubmitted && (!password || passwordError) }"
                  placeholder="Enter your password"
                  required
                >
                <div class="invalid-feedback">
                  {{ passwordError || 'Password is required' }}
                </div>
              </div>
            </div>
            
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-lock-fill"></i>
                </span>
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :class="{ 'is-invalid': formSubmitted && (!confirmPassword || passwordError) }"
                  placeholder="Confirm your password"
                  required
                >
                <div class="invalid-feedback">
                  {{ passwordError || 'Please confirm your password' }}
                </div>
              </div>
            </div>
            
            <div class="mb-3">
              <label for="role" class="form-label">Role</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-person-badge"></i>
                </span>
                <select
                  class="form-select"
                  id="role"
                  v-model="role"
                  required
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>
            
            <div class="d-grid">
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="authStore.loading"
              >
                <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                Register
              </button>
            </div>
          </form>
          
          <div class="mt-3 text-center">
            <p>
              Already have an account?
              <router-link to="/login">Login</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>