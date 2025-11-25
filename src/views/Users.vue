<script setup>
import { ref, onMounted } from 'vue'
import { authCall, logoutUser } from '@/helpers/api'
import { useRouter } from 'vue-router'
import UserRow from '@/components/UserRow.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const users = ref(null)
const userStore = useUserStore()

onMounted(async () => {
  users.value = await authCall('/users', router)
})

async function changeClearance(id, clearance) {
  const index = users.value.findIndex((user) => user.id === id)
  users.value[index].clearance = clearance
  if (users.value[index].username === userStore.username) {
    try {
      await logoutUser(router)
    } catch (error) {
      console.error(error)
    }
  }
}
</script>

<template>
  <v-container class="container">
    <div v-if="users === null">
      <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
    </div>
    <div v-else>
      <v-table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Clearance</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <user-row
            @clearance-changed="changeClearance"
            v-for="user in users"
            :user="user"
          ></user-row>
        </tbody>
      </v-table>
    </div>
  </v-container>
</template>

<style scoped>
.container {
  max-width: 1400px;
}
</style>
