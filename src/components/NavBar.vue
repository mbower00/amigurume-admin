<script setup>
import { logoutUser } from '@/helpers/api'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const logoutLoading = ref(false)

async function logout() {
  logoutLoading.value = true
  try {
    await logoutUser(router)
  } catch (error) {
    console.error(error)
  } finally {
    logoutLoading.value = false
  }
}
</script>

<template>
  <div class="bar flex">
    <router-link to="orders" class="title fancy-font">AdminguruMe</router-link>
    <nav class="links flex">
      <router-link to="orders" active-class="active">Orders</router-link>
      <router-link to="products" active-class="active">Products</router-link>
      <router-link to="users" active-class="active">Users</router-link>
    </nav>
    <div class="user-area flex">
      <span class="username">{{ userStore.username }}</span>
      <v-btn
        density="compact"
        class="logout-btn"
        variant="text"
        :loading="logoutLoading"
        icon="fas fa-sign-out-alt"
        @click="logout"
      ></v-btn>
    </div>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
  color: white;
}
.flex {
  display: flex;
  align-items: center;
  gap: 15px;
}
.bar {
  width: 100%;
  margin-bottom: 20px;
  background-color: var(--lilac);
  padding: 5px 20px;
  color: white;
}
.title {
  font-size: x-large;
}
.links {
  font-size: small;
}
.user-area {
  margin-left: auto;
  gap: 5px;
}
.active {
  text-decoration: underline;
}
.logout-btn {
  font-size: 10px;
}
.username {
  font-size: x-small;
}
@media (max-width: 600px) {
  .title {
    font-size: medium;
  }
}
@media (max-width: 450px) {
  .title {
    display: none;
  }
}
</style>
