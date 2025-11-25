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
.nav-bar {
  position: sticky;
  top: 0px;
  z-index: 10;
}
</style>
