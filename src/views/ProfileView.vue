<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const profileForm = ref({
  name: user.value?.name || '',
  email: user.value?.email || '',
  phone: user.value?.phone || '',
  position: user.value?.position || '',
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const profileSuccess = ref(false)
const passwordSuccess = ref(false)
const profileError = ref('')
const passwordError = ref('')

const updateProfile = async () => {
  profileSuccess.value = false
  profileError.value = ''
  
  try {
    // This would call an API endpoint to update the user profile
    // await axios.put('/api/users/profile', profileForm.value)
    profileSuccess.value = true
  } catch (err) {
    profileError.value = err.response?.data?.message || 'Failed to update profile'
  }
}

const updatePassword = async () => {
  passwordSuccess.value = false
  passwordError.value = ''
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Passwords do not match'
    return
  }
  
  try {
    // This would call an API endpoint to update the password
    // await axios.put('/api/users/password', {
    //   currentPassword: passwordForm.value.currentPassword,
    //   newPassword: passwordForm.value.newPassword
    // })
    passwordSuccess.value = true
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (err) {
    passwordError.value = err.response?.data?.message || 'Failed to update password'
  }
}
</script>

<template>
  <div class="profile-container">
    <h1 class="h3 mb-4">
      <i class="bi bi-person-circle me-2"></i>
      My Profile
    </h1>
    
    <div class="row">
      <div class="col-md-6">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-white">
            <h2 class="h5 mb-0">Profile Information</h2>
          </div>
          
          <div class="card-body">
            <div v-if="profileSuccess" class="alert alert-success">
              Profile updated successfully!
            </div>
            
            <div v-if="profileError" class="alert alert-danger">
              {{ profileError }}
            </div>
            
            <form @submit.prevent="updateProfile">
              <div class="mb-3">
                <label for="name" class="form-label">Full Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="profileForm.name"
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="profileForm.email"
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="phone" class="form-label">Phone Number</label>
                <input
                  type="tel"
                  class="form-control"
                  id="phone"
                  v-model="profileForm.phone"
                >
              </div>
              
              <div class="mb-3">
                <label for="position" class="form-label">Position</label>
                <input
                  type="text"
                  class="form-control"
                  id="position"
                  v-model="profileForm.position"
                >
              </div>
              
              <button type="submit" class="btn btn-primary">
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-white">
            <h2 class="h5 mb-0">Change Password</h2>
          </div>
          
          <div class="card-body">
            <div v-if="passwordSuccess" class="alert alert-success">
              Password updated successfully!
            </div>
            
            <div v-if="passwordError" class="alert alert-danger">
              {{ passwordError }}
            </div>
            
            <form @submit.prevent="updatePassword">
              <div class="mb-3">
                <label for="currentPassword" class="form-label">Current Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="currentPassword"
                  v-model="passwordForm.currentPassword"
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="newPassword" class="form-label">New Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="newPassword"
                  v-model="passwordForm.newPassword"
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm New Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  v-model="passwordForm.confirmPassword"
                  required
                >
              </div>
              
              <button type="submit" class="btn btn-primary">
                Change Password
              </button>
            </form>
          </div>
        </div>
        
        <div class="card shadow-sm">
          <div class="card-header bg-white">
            <h2 class="h5 mb-0">Account Information</h2>
          </div>
          
          <div class="card-body">
            <div class="mb-3">
              <strong>Role:</strong> {{ user?.role === 'manager' ? 'Manager' : 'Employee' }}
            </div>
            
            <div class="mb-3">
              <strong>Account Created:</strong> {{ new Date(user?.createdAt || Date.now()).toLocaleDateString() }}
            </div>
            
            <div class="mb-3">
              <strong>Last Login:</strong> {{ new Date(user?.lastLogin || Date.now()).toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  margin-bottom: 2rem;
}
</style>