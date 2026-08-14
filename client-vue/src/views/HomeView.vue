<script setup>
import { ref, onMounted } from 'vue'

const races = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const response = await fetch('/api/races/2026')
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to load races')
    }
    const data = await response.json()
    races.value = data.MRData.RaceTable.Races
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <h1>F1 Predictor</h1>

  <p v-if="isLoading">Loading races...</p>
  <p v-else-if="errorMessage">{{  errorMessage }}</p>

  <ul v-else>
    <li v-for="race in races" :key="race.round">
      Round {{  race.round }} - {{ race.raceName }} ({{ race.date }})
    </li>
  </ul>
</template>