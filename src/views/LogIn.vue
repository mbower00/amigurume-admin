<!-- using code from https://vuetifyjs.com/en/components/text-fields/#forms -->
<!-- using code from https://vuetifyjs.com/en/components/text-fields/#password-input -->

<script setup>
import { ref } from 'vue'
import { noWhiteSpace, required } from '@/helpers/rules'
import { loginUser, authCall } from '@/helpers/api'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const username = ref('')
const password = ref('')
const isValid = ref(null)
const isLoading = ref(null)
const errorMessage = ref(null)
const viewPassword = ref(false)

async function login() {
  if (!isValid.value || isLoading.value) return
  isLoading.value = true
  errorMessage.value = null
  try {
    const { data } = await loginUser(username.value, password.value)
    console.log(data)
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

async function one() {
  console.log(await authCall('/products'))
}
async function two() {
  console.log(
    await authCall('/product', 'post', {
      name: 'Dragon Tail',
      stock: 5,
      price: 4.99,
      description: 'A green dragon plushie tail.',
      image_url: 'https://picsum.photos/200/300',
      type: 'tail',
    }),
  )
}
</script>

<template>
  <v-container class="login-container">
    <v-card :loading="isLoading">
      <v-container>
        <v-form class="login-form" v-model="isValid" @submit.prevent="login">
          <v-text-field
            v-model="username"
            label="Username"
            :rules="[required, noWhiteSpace]"
            variant="filled"
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            :rules="[required, noWhiteSpace]"
            variant="filled"
            :type="viewPassword ? 'text' : 'password'"
            :append-inner-icon="viewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
            @click:append-inner="viewPassword = !viewPassword"
          ></v-text-field>
          <v-btn
            type="submit"
            :disabled="!isValid || isLoading"
            variant="outlined"
            class="login-btn"
            >Login</v-btn
          >
          <v-expand-transition>
            <div v-show="errorMessage">
              <v-alert class="error">{{ errorMessage }}</v-alert>
            </div>
          </v-expand-transition>
        </v-form>
      </v-container>
    </v-card>
  </v-container>
  <v-btn @click="one">get products (user)</v-btn>
  <v-btn @click="two">post product (admin)</v-btn>
  <span>username: {{ userStore.username }}</span>
</template>

<style scoped>
.login-container {
  margin-top: 10vh;
  max-width: 500px;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.login-btn {
  width: fit-content;
  margin: 0 auto;
}
.error {
  background-color: var(--error-background);
  margin-top: 16px;
}
</style>
