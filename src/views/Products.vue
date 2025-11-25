<!-- using code from https://vuetifyjs.com/en/components/text-fields/#forms -->

<script setup>
import { ref, onMounted, computed } from 'vue'
import { authCall } from '@/helpers/api'
import { useRouter } from 'vue-router'
import ProductRow from '@/components/ProductRow.vue'

const router = useRouter()
const products = ref(null)
const types = ref(null)
const isValid = ref(null)
const name = ref(null)
const price = ref(null)
const stock = ref(null)
const description = ref(null)
const image = ref(null)
const type = ref(null)

onMounted(async () => {
  const resProducts = authCall('/products', router)
  const resTypes = authCall('/product/types', router)
  products.value = await resProducts
  types.value = await resTypes
  console.log(products.value, types.value)
})

const typesList = computed(() => {
  if (types.value) {
    return types.value.map((t) => t.type)
  }
  return []
})

function editProduct(index) {
  console.log(index)
}

function stockOne(id, stock) {
  const index = products.value.findIndex((product) => product.id === id)
  products.value[index].stock = stock
}

function submitForm() {
  console.log(description.value)
}

function clearForm() {
  isValid.value = null
  name.value = null
  price.value = null
  stock.value = null
  description.value = null
  image.value = null
  type.value = null
}
</script>

<template>
  <v-container class="container">
    <div v-if="products === null">
      <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
      <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
      <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
      <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
      <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
    </div>
    <div v-else>
      <v-expansion-panels class="panels">
        <v-expansion-panel hide-actions readonly>
          <v-expansion-panel-title>
            <div class="title-grid">
              <span>Name</span>
              <span>Type</span>
              <span>Price</span>
              <span>Stock</span>
              <span></span>
            </div>
          </v-expansion-panel-title>
        </v-expansion-panel>
        <product-row
          v-for="(product, index) in products"
          :product
          @edit-product="editProduct(index)"
          @stock-one="stockOne"
        ></product-row>
        <order-row
          v-for="(order, index) in orders"
          :order
          @fulfilled-changed="changeFulfilled"
          @order-deleted="deleteOrder"
        ></order-row>
      </v-expansion-panels>
    </div>
    <div v-if="types === null">
      <v-skeleton-loader type="heading"></v-skeleton-loader>
      <v-skeleton-loader type="heading"></v-skeleton-loader>
      <v-skeleton-loader type="heading"></v-skeleton-loader>
      <v-skeleton-loader type="heading"></v-skeleton-loader>
      <v-skeleton-loader type="heading"></v-skeleton-loader>
    </div>
    <v-card class="form-card" v-else>
      <template #text>
        <v-form class="form" v-model="isValid" @submit.prevent="submitForm">
          <v-text-field v-model="name" label="Name" :rules="[]" variant="outlined"></v-text-field>
          <div class="price-stock-flex">
            <v-number-input
              v-model="price"
              label="Price"
              :rules="[]"
              variant="outlined"
              control-variant="hidden"
              prepend-inner-icon="fas fa-dollar-sign"
              :precision="2"
            >
            </v-number-input>
            <v-number-input
              v-model="stock"
              label="Stock"
              :rules="[]"
              variant="outlined"
              control-variant="hidden"
              prepend-inner-icon="fas fa-cubes"
            >
            </v-number-input>
          </div>
          <v-textarea
            v-model="description"
            label="Description"
            :rules="[]"
            variant="outlined"
          ></v-textarea>
          <v-file-input
            prepend-icon="fas fa-image"
            v-model="image"
            label="Image"
            :rules="[]"
            variant="outlined"
          ></v-file-input>
          <v-combobox
            v-model="type"
            label="Type"
            :rules="[]"
            :items="typesList"
            variant="outlined"
          ></v-combobox>
          <div class="flex">
            <v-btn type="submit" variant="flat" color="var(--green)">Submit</v-btn>
            <v-btn @click="clearForm" variant="outlined">clear</v-btn>
          </div>
        </v-form>
      </template>
    </v-card>
  </v-container>
</template>

<style scoped>
.title-grid {
  font-size: 14px;
  display: grid;
  grid-template-columns: 1fr 0.5fr 0.5fr 0.5fr 0.2fr;
  gap: 10px;
  width: 100%;
  font-weight: bold;
  align-items: center;
}
.container {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
  max-width: 1400px;
}
.form-card {
  height: fit-content;
  position: sticky;
  top: 70px;
  max-width: 600px;
  justify-self: center;
  width: 100%;
}
.flex {
  display: flex;
  gap: 16px;
}
.price-stock-flex {
  display: flex;
  gap: 16px;
}

@media (max-width: 850px) {
  .container {
    grid-template-columns: 1fr;
  }
  .form-card {
    position: initial;
    grid-row-start: 1;
  }
}
@media (max-width: 500px) {
  .price-stock-flex {
    flex-direction: column;
    gap: 0;
  }
}
</style>
