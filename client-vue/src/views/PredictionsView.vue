<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const predictions = ref([])
const isLoading = ref(true)
const errorMessage = ref("")

const authStore = useAuthStore()

onMounted(async () => {
  try {
    const response = await fetch('/api/predictions', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to load predictions')
    }

    predictions.value = await response.json()
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <h1>Predictions</h1>

  <p v-if="isLoading">Loading...</p>
  <p v-else-if="errorMessage">{{ errorMessage }}</p>
  <p v-else-if="predictions.length === 0">You haven't submitted any predictions yet.</p>

  <ul v-else>
    <li v-for="prediction in predictions" :key="prediction._id">
      Season {{ prediction.season }}, Round {{ prediction.round }} - Predicted: {{  prediction.predictedPodium.join(', ') }}
      <span v-if="prediction.points !== null">
        - Scored: {{ prediction.points }} points (Actual: {{ prediction.actualPodium.join(', ') }})
      </span>
      <span v-else> - Not yet scored</span>
    </li>
  </ul>
</template>Spenc