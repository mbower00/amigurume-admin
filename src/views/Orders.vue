<script setup>
import { ref, onMounted } from 'vue'
import { authCall, logoutUser } from '@/helpers/api'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import OrderRow from '@/components/OrderRow.vue'

const router = useRouter()
const orders = ref(null)

onMounted(async () => {
  orders.value = await authCall('/orders', router)
})

async function changeFulfilled(id, fulfilled) {
  const index = orders.value.findIndex((user) => user.id === id)
  orders.value[index].fulfilled = fulfilled
}

async function deleteOrder(id, reload) {
  if (reload) {
    orders.value = null
    orders.value = await authCall('/orders', router)
  } else {
    const index = orders.value.findIndex((user) => user.id === id)
    orders.value.splice(index, 1)
  }
}

// function addP() {
//   authCall(`/order`, router, 'post', {
//     ordered_products: [
//       {
//         id: 1,
//         quantity: 1,
//       },
//     ],
//   })
// }
</script>

<template>
  <!-- <v-btn @click="addP">add</v-btn> -->

  <v-container class="container">
    <div v-if="orders === null">
      <v-skeleton-loader type="heading"></v-skeleton-loader>
      <v-skeleton-loader type="heading"></v-skeleton-loader>
      <v-skeleton-loader type="heading"></v-skeleton-loader>
      <v-skeleton-loader type="heading"></v-skeleton-loader>
      <v-skeleton-loader type="heading"></v-skeleton-loader>
    </div>
    <div v-else>
      <v-expansion-panels class="panels">
        <v-expansion-panel hide-actions readonly>
          <v-expansion-panel-title>
            <div class="title-grid">
              <span>Created</span>
              <span>Fulfilled</span>
              <span>Username</span>
              <span>Email</span>
              <span>Ordered</span>
              <span>Price</span>
              <span></span>
            </div>
          </v-expansion-panel-title>
        </v-expansion-panel>
        <order-row
          v-for="(order, index) in orders"
          :order
          @fulfilled-changed="changeFulfilled"
          @order-deleted="deleteOrder"
        ></order-row>
      </v-expansion-panels>
    </div>
  </v-container>
</template>

<style scoped>
.container {
  max-width: 1400px;
}
.title-grid {
  font-size: 14px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 0.5fr 0.5fr 0.2fr;
  gap: 10px;
  width: 100%;
  font-weight: bold;
}
.fa-chevron-down {
  color: red;
}
</style>
