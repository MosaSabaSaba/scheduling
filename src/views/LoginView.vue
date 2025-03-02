<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const formSubmitted = ref(false)

const handleSubmit = async () => {
  formSubmitted.value = true
  
  if (!email.value || !password.value) {
    return
  }
  
  const success = await authStore.login(email.value, password.value)
  
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
            <i class="bi bi-box-arrow-in-right me-2"></i>
            Login
          </h2>
          
          <div v-if="authStore.error" class="alert alert-danger">
            {{ authStore.error }}
          </div>
          
          <form @submit.prevent="handleSubmit">
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
                  :class="{ 'is-invalid': formSubmitted && !password }"
                  placeholder="Enter your password"
                  required
                >
                <div class="invalid-feedback">
                  Password is required
                </div>
              </div>
            </div>
            
            <div class="mb-3 form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="rememberMe"
                v-model="rememberMe"
              >
              <label class="form-check-label" for="rememberMe">Remember me</label>
            </div>
            
            <div class="d-grid">
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="authStore.loading"
              >
                <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                Login
              </button>
            </div>
          </form>
          
          <div class="mt-3 text-center">
            <p>
              Don't have an account?
              <router-link to="/register">Register</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>