<template>
  <div class="not-found-container text-center py-5">
    <div class="display-1 text-muted mb-3">404</div>
    <h1 class="h3 mb-4">Page Not Found</h1>
    <p class="lead mb-4">The page you are looking for does not exist or has been moved.</p>
    <router-link to="/" class="btn btn-primary">
      <i class="bi bi-house me-2"></i> Go Home
    </router-link>
  </div>
</template>

<style scoped>
.not-found-container {
  max-width: 600px;
  margin: 0 auto;
}
</style>