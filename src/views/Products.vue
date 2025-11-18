<script setup>
import { ref } from 'vue'
import { authCall, loginUser, logoutUser } from '@/helpers/api'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()

async function one() {
  console.log(await authCall('/products', router))
}
async function two() {
  console.log(
    await authCall('/product', router, 'post', {
      name: 'Dragon Tail',
      stock: 5,
      price: 4.99,
      description: 'A green dragon plushie tail.',
      image_url: 'https://picsum.photos/200/300',
      type: 'tail',
    }),
  )
}
async function three() {
  await loginUser(router)
}
async function four() {
  userStore.username = null
  userStore.access = null
}
async function five() {
  userStore.access =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc2MzQ1ODEzNSwianRpIjoiNzU5YTM2NzAtM2EwMC00NTM2LWI2YzYtNzZkNmJmMDRjMGMzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6Im1ib3dlciIsIm5iZiI6MTc2MzQ1ODEzNSwiY3NyZiI6IjAzY2VlODk0LWMzNTItNDU0ZS1hODE3LTg2ZmRiOTljOWQ1MiIsImV4cCI6MTc2MzQ1OTAzNX0.ZMTvXhZC12Y9Qi245oDDVUZVv9k4SbVcVRttMhHeW4c'
}
async function logout() {
  console.log(await logoutUser(router))
}
</script>

<template>
  <v-card>Products</v-card>
  <v-btn @click="one">get products (user)</v-btn>
  <v-btn @click="two">post product (admin)</v-btn>
  <v-btn @click="three">refresh</v-btn>
  <v-btn @click="logout">logout</v-btn>
  <v-btn @click="four">clear user store</v-btn>
  <router-link to="/orders">orders</router-link>
  <p>username: {{ userStore.username }}</p>
  <p>access: {{ userStore.access }}</p>
  <v-btn @click="five">expire access</v-btn>
</template>

<style scoped></style>
