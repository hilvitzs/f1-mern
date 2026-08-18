<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const races = ref([])
const drivers = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')

const selectedRound = ref('')
const podium = ref(['', '', ''])

const authStore = useAuthStore()

onMounted(async () => {
  try {
    const [racesRes, driversRes] = await Promise.all([
      fetch('/api/races/2026'),
      fetch('/api/drivers/2026'),
    ])

    if (!racesRes.ok || !driversRes.ok) {
      throw new Error('Failed to load race or driver data')
    }

    const racesData = await racesRes.json();
    const driversData = await driversRes.json();

    races.value = racesData.MRData.RaceTable.Races
    drivers.value = driversData.MRData.DriverTable.Drivers
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isLoading.value = false;
  }
})

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  if (podium.value.some((d) => !d)) {
    errorMessage.value = 'Please select all three podium positions'
    return
  }

  const selectedRace = races.value.find((r) => r.round === selectedRound.value)
  if (!selectedRace) {
    errorMessage.value = 'Please select a race'
    return
  }

  try {
    const response = await fetch('/api/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        season: Number(selectedRace.season),
        round: Number(selectedRound.value),
        predictedPodium: podium.value
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to submit prediction')
    }

    successMessage.value = 'Prediction submitted!'
    selectedRound.value = ''
    podium.value = ['', '', '']
  } catch (err) {
    errorMessage.value = err.message
  }
}
</script>

<template>
  <h1>Submit a Prediction</h1>

  <p v-if="isLoading">Loading...</p>

  <form v-else @submit.prevent="handleSubmit">
    <div>
      <label for="race">Race</label>
      <select id="race" v-model="selectedRound" required>
        <option value="" disabled>Select a race</option>
        <option v-for="race in races" :key="race.round" :value="race.round">
          Round {{ race.round }} - {{ race.raceName }}
        </option>
      </select>
    </div>

    <div v-for="(_, index) in podium" :key="index">
      <label :for="`podium-${index}`">Position {{ index + 1 }}</label>
      <select :id="`podium-${index}`" v-model="podium[index]" required>
        <option value="" disabled>Select a driver</option>
        <option v-for="driver in drivers" :key="driver.driverId" :value="driver.driverId">
          {{ driver.givenName }} {{ driver.familyName }}
        </option>
      </select>
    </div>

    <button type="submit">Submit Prediction</button>

    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="successMessage">{{ successMessage }}</p>
  </form>
</template>