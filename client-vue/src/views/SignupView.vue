<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'; 

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const authStore = useAuthStore()
const router = useRouter()

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''
  try {
    await authStore.signup(email.value, password.value)
    successMessage.value = 'Account created - please log in.'
    setTimeout(() => router.push({ name: 'login' }), 1500)
  } catch (err) {
    errorMessage.value = err.message
  }
}
</script>

<template>
  <h1>Sign Up</h1>

  <form @submit.prevent="handleSubmit">
    <div>
      <label for="email">Email</label>
      <input id="email" v-model="email" type="email" required />
    </div>
    <div>
      <label for="password">Password</label>
      <input id="password" v-model="password" type="password" required />
    </div>
    <button type="submit">Sign up</button>
  </form>

  <p v-if="errorMessage">{{ errorMessage }}</p>
  <p v-if="successMessage">{{ successMessage }}</p>
</template>