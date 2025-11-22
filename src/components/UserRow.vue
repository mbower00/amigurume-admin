<script setup>
import { authCall } from '@/helpers/api'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const prop = defineProps(['user'])
const emit = defineEmits(['clearanceChanged'])
const loading = ref(false)
const router = useRouter()

async function changeClearance() {
  loading.value = true
  let url = `/user/clearance/${prop.user.id}`
  if (prop.user.clearance === 'admin') {
    url += '?to-user=1'
  }
  try {
    await authCall(url, router, 'patch')
    emit('clearance-changed', prop.user.id, prop.user.clearance === 'admin' ? 'user' : 'admin')
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <tr>
    <td>{{ prop.user.username }}</td>
    <td>{{ prop.user.email }}</td>
    <td>
      {{ prop.user.clearance }}
    </td>
    <td>
      <v-btn @click="changeClearance" :loading="loading" variant="plain"
        >set to {{ prop.user.clearance === 'admin' ? 'user' : 'admin' }}</v-btn
      >
    </td>
  </tr>
</template>

<style scoped></style>
