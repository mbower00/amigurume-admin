<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate } from '@/helpers/date'
import { authCall } from '@/helpers/api'

const router = useRouter
const prop = defineProps(['order'])
const emits = defineEmits(['fulfilledChanged', 'orderDeleted'])
const fulfillLoading = ref(false)
const deleteLoading = ref(false)
const createdDate = computed(() => formatDate(prop.order.created))
const fulfilledDate = computed(() => formatDate(prop.order.fulfilled))
const quantity = computed(() =>
  prop.order.ordered_products.reduce((quantity, product) => quantity + product.quantity, 0),
)
const price = computed(() =>
  prop.order.ordered_products.reduce((price, product) => price + product.product.price, 0),
)

async function changeFulfilled() {
  fulfillLoading.value = true
  let url = `/order/fulfill/${prop.order.id}`
  if (prop.order.fulfilled) {
    url += '?to-null=1'
  }
  try {
    const data = await authCall(url, router, 'patch')
    emits('fulfilledChanged', prop.order.id, data.fulfilled)
  } catch (error) {
    console.log(error)
  } finally {
    fulfillLoading.value = false
  }
}

async function deleteOrder() {
  deleteLoading.value = true
  try {
    await authCall(`/order/${prop.order.id}`, router, 'delete')
    emits('orderDeleted', prop.order.id, !Boolean(prop.order.fulfilled))
  } catch (error) {
    console.log(error)
  } finally {
    deleteLoading.value = false
  }
}
</script>

<template>
  <v-expansion-panel hide-actions>
    <v-expansion-panel-title>
      <div class="title-grid">
        <span>{{ createdDate }}</span>
        <div class="flex">
          <div :class="`${prop.order.fulfilled ? 'fulfilled' : 'unfulfilled'}`">
            {{ prop.order.fulfilled ? fulfilledDate : 'unfulfilled' }}
          </div>
          <v-btn
            @click.stop="changeFulfilled"
            :disabled="deleteLoading"
            :loading="fulfillLoading"
            variant="plain"
            :icon="prop.order.fulfilled ? 'fas fa-undo' : 'fas fa-check'"
            size="x-small"
            v-tooltip="prop.order.fulfilled ? 'Unfulfill' : 'Fulfill'"
          ></v-btn>
        </div>
        <span>{{ prop.order.user.username }}</span>
        <span>{{ prop.order.user.email }}</span>
        <span>{{ quantity }}</span>
        <span>${{ price }}</span>
        <v-btn
          @click.stop="deleteOrder"
          :disabled="fulfillLoading"
          :loading="deleteLoading"
          variant="plain"
          :icon="prop.order.fulfilled ? 'fas fa-trash' : 'fas fa-trash-restore'"
          size="x-small"
          v-tooltip="prop.order.fulfilled ? 'Delete' : 'Delete and Restock'"
        ></v-btn>
      </div>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Type</th>
            <th>
              Stock
              <span
                v-tooltip="'Product Stock (Stock is subtracted at time of order)'"
                class="fas fa-info-circle"
              ></span>
            </th>
            <th>Quantity <span v-tooltip="'Amount Ordered'" class="fas fa-info-circle"></span></th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ordered_product in prop.order.ordered_products">
            <td class="img-td">
              <img
                class="product-img"
                :src="ordered_product.product.image_url"
                :alt="ordered_product.product.name"
              />
            </td>
            <td>{{ ordered_product.product.name }}</td>
            <td>{{ ordered_product.product.type }}</td>
            <td>{{ ordered_product.product.stock }}</td>
            <td>{{ ordered_product.quantity }}</td>
            <td>{{ ordered_product.product.price }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<style scoped>
.title-grid {
  font-size: 14px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 0.5fr 0.5fr 0.2fr;
  gap: 10px;
  width: 100%;
  align-items: center;
}
.fulfilled {
  color: var(--dark-green);
}
.unfulfilled {
  color: var(--light-blackberry);
}
.flex {
  display: flex;
  gap: 5px;
  align-items: center;
}
.img-td {
  display: flex;
  align-items: center;
}
.product-img {
  height: auto;
  width: 40px;
  padding: 5px;
}
</style>
