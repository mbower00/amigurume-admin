import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const access = ref(null)
  const username = ref(null)
  const authHeader = computed(() => `Bearer ${access.value}`)

  return { access, username, authHeader }
})
