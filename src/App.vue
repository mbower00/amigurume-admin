<script setup>
import NavBar from './components/NavBar.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <nav-bar class="nav-bar" v-if="route.name !== 'login'"></nav-bar>
  <div class="view">
    <router-view></router-view>
  </div>
</template>

<style scoped>
/* TODO: POSITIONING */
.nav-bar {
  position: sticky;
}
.view {
  position: fixed;
  height: 100vh;
}
</style>
