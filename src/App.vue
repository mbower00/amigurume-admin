<script setup>
import NavBar from './components/NavBar.vue'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { loginUser } from './helpers/api'
const route = useRoute()

onMounted(async () => {
  try {
    // refresh tokens upon mount (refresh)
    await loginUser()
  } catch {}
})
</script>

<template>
  <nav-bar class="nav-bar" v-if="route.name !== 'login'"></nav-bar>
  <div class="view">
    <router-view></router-view>
  </div>
  <!-- TODO: add alert for error/success, if time -->
</template>

<style scoped>
.nav-bar {
  position: sticky;
  top: 0px;
  z-index: 10;
}
</style>
