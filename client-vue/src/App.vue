<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/predictions">Predictions</RouterLink>
    <RouterLink to="/leaderboard">Leaderboard</RouterLink>
    
    <template v-if="authStore.isLoggedIn">
      <button @click="handleLogout">Log out</button>
    </template>
    <template v-else>
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/signup">Sign Up</RouterLink>
    </template>
  </nav>

  <RouterView />
</template>

<style scoped></style>
