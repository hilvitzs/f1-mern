<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/login">Login</RouterLink>
    <RouterLink to="/predictions">Predictions</RouterLink>
    <RouterLink to="/leaderboard">Leaderboard</RouterLink>
  </nav>

  <RouterView />
</template>

<style scoped></style>
