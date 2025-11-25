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
    <td class="flex">
      <div>
        {{ prop.user.clearance }}
      </div>
      <v-btn
        @click="changeClearance"
        :loading="loading"
        variant="plain"
        :icon="
          prop.user.clearance === 'admin' ? 'fa-solid fa-user-minus' : 'fa-solid fa-user-shield'
        "
        size="x-small"
        v-tooltip="prop.user.clearance === 'admin' ? 'Set to User' : 'Set to Admin'"
      ></v-btn>
    </td>
  </tr>
</template>

<style scoped>
.flex {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
