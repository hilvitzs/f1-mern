<script setup>
import { ref, onMounted } from 'vue'

const leaderboard = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const response = await fetch('/api/leaderboard')

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to load leaderboard')
    }

    leaderboard.value = await response.json()
  } catch (err) {
    errorMessage.value = err.messsage
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <h1>Leaderboard</h1>

  <p v-if="isLoading">Loading...</p>
  <p v-else-if="errorMessage">{{ errorMessage }}</p>
  <p v-else-if="leaderboard.length === 0">No scored predictions yet.</p>

  <ol v-else>
    <li v-for="entry in leaderboard" :key="entry.userId">
      {{ entry.email }} - {{ entry.totalPoints }} points ({{ entry.predictionsScored }} scored)
    </li>
  </ol>
</template>