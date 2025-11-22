<script setup>
import { ref, onMounted, computed } from 'vue'
import { authCall } from '@/helpers/api'
import { useRouter } from 'vue-router'

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

function stockOne(index) {
  console.log(index)
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
    <div class="products" v-else>
      <v-card v-for="(product, index) in products">
        <template #text>
          <div class="flex">
            <img class="product-img" :src="product.image_url" :alt="product.name" />
            <div>
              <div class="title">
                <h3>
                  {{ product.name }}
                </h3>
                <span class="chip type">{{ product.type }}</span>
                <span class="chip price">${{ product.price }}</span>
                <span class="chip stock">{{ product.stock }} in stock</span>
              </div>
              <div class="description">
                {{ product.description }}
              </div>
              <div class="flex btns">
                <v-btn density="compact" variant="outlined" @click="editProduct(index)">edit</v-btn>
                <v-btn density="compact" variant="outlined" @click="stockOne(index)"
                  >stock one</v-btn
                >
              </div>
            </div>
          </div>
        </template>
      </v-card>
    </div>
    <div v-if="types === null">
      <v-skeleton-loader type="heading"></v-skeleton-loader>
      <v-skeleton-loader type="heading"></v-skeleton-loader>
      <v-skeleton-loader type="heading"></v-skeleton-loader>
      <v-skeleton-loader type="heading"></v-skeleton-loader>
      <v-skeleton-loader type="heading"></v-skeleton-loader>
    </div>
    <v-card v-else>
      <template #text>
        <v-form class="form" v-model="isValid" @submit.prevent="submitForm">
          <v-text-field v-model="name" label="Name" :rules="[]" variant="outlined"></v-text-field>
          <div class="flex">
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
.container {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
}
.form {
  height: fit-content;
}
.products {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.flex {
  display: flex;
  gap: 16px;
}
.product-img {
  width: 60px;
  height: 100%;
  border-radius: 4px;
}
.title {
  display: flex;
  gap: 10px;
  align-items: center;
}
.chip {
  padding: 2px 10px;
  border-radius: 20px;
}
.type {
  background-color: var(--blackberry);
  color: white;
}
.price {
  background-color: var(--green);
  color: var(--text);
}
.stock {
  background-color: var(--steel);
  color: white;
}
.description {
  margin-top: 10px;
}
.btns {
  margin-top: 10px;
}
</style>
