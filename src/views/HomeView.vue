<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const navigateToApp = () => {
  if (authStore.isAuthenticated) {
    router.push('/schedule')
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <div class="home-container">
    <div class="row align-items-center">
      <div class="col-lg-6">
        <h1 class="display-4 fw-bold mb-4">Simplify Your Workforce Scheduling</h1>
        <p class="lead mb-4">
          WorkScheduler makes it easy to create and manage employee schedules, track time off, and communicate with your team in real-time.
        </p>
        <div class="d-grid gap-2 d-md-flex justify-content-md-start mb-4">
          <button @click="navigateToApp" class="btn btn-primary btn-lg px-4 me-md-2">
            <i class="bi bi-calendar-check me-2"></i>
            {{ authStore.isAuthenticated ? 'Go to Schedule' : 'Get Started' }}
          </button>
          <a href="#features" class="btn btn-outline-secondary btn-lg px-4">
            Learn More
          </a>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="p-4 bg-white rounded shadow-lg">
          <img src="https://placehold.co/600x400/e9ecef/495057?text=Schedule+Dashboard" alt="Schedule Dashboard" class="img-fluid rounded">
        </div>
      </div>
    </div>

    <section id="features" class="py-5 mt-5">
      <h2 class="text-center mb-5">Key Features</h2>
      <div class="row g-4">
        <div class="col-md-4">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body text-center p-4">
              <div class="feature-icon bg-primary bg-gradient text-white mb-3">
                <i class="bi bi-calendar-week"></i>
              </div>
              <h3 class="card-title h5">Easy Scheduling</h3>
              <p class="card-text">Create and manage employee schedules with an intuitive drag-and-drop interface.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body text-center p-4">
              <div class="feature-icon bg-primary bg-gradient text-white mb-3">
                <i class="bi bi-bell"></i>
              </div>
              <h3 class="card-title h5">Real-Time Updates</h3>
              <p class="card-text">Receive instant notifications about schedule changes and shift updates.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body text-center p-4">
              <div class="feature-icon bg-primary bg-gradient text-white mb-3">
                <i class="bi bi-people"></i>
              </div>
              <h3 class="card-title h5">Team Management</h3>
              <p class="card-text">Easily manage your team, track availability, and handle time-off requests.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  padding: 2rem 0;
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  font-size: 2rem;
}

/* Animation for the hero section */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.display-4, .lead, .d-md-flex {
  animation: fadeInUp 0.5s ease-out forwards;
}

.lead {
  animation-delay: 0.2s;
}

.d-md-flex {
  animation-delay: 0.4s;
}
</style>