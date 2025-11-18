import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const access = ref(null)
  const username = ref(null)
  const authHeader = computed(() => `Bearer ${access.value}`)
  const isLoggedIn = computed(() => access.value && username.value)
  function logout() {
    access.value = null
    username.value = null
  }

  return { access, username, authHeader, isLoggedIn, logout }
})
