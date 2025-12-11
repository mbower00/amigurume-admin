<!-- using code from https://vuetifyjs.com/en/components/text-fields/#forms -->

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { authCall } from '@/helpers/api'
import { useRouter } from 'vue-router'
import { required, notOnlyWhiteSpace } from '@/helpers/rules'
import ProductRow from '@/components/ProductRow.vue'

const router = useRouter()
const isEditing = ref(false)
const productEditing = ref(null)
const products = ref(null)
const types = ref(null)
const isValid = ref(false)
const formLoading = ref(false)
// form refs
const name = ref(null)
const price = ref(null)
const stock = ref(null)
const type = ref(null)
const description = ref(null)
const image = ref(null)

onMounted(async () => {
  const resProducts = authCall('/products', router)
  const resTypes = authCall('/product/types', router)
  products.value = await resProducts
  types.value = await resTypes
})

const imagePreview = computed(() => {
  if (image.value) {
    // using code from https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file
    return URL.createObjectURL(image.value)
  }
  if (isEditing.value) {
    return productEditing.value.image_url
  }
  return null
})

const typesList = computed(() => {
  if (types.value) {
    return types.value.map((t) => t.type)
  }
  return []
})

function editProduct(id) {
  // window.scrollTo(0, 0)
  const index = products.value.findIndex((product) => product.id === id)
  isEditing.value = true
  productEditing.value = JSON.parse(JSON.stringify(products.value[index]))
  name.value = productEditing.value.name
  price.value = productEditing.value.price
  stock.value = productEditing.value.stock
  description.value = productEditing.value.description
  image.value = null
  type.value = productEditing.value.type
}

function stockOne(id, stock) {
  const index = products.value.findIndex((product) => product.id === id)
  products.value[index].stock = stock
}

function clearForm() {
  name.value = null
  price.value = null
  stock.value = null
  description.value = null
  image.value = null
  type.value = null
  // This should go last?
  isValid.value = false
}

function fullClearForm() {
  isEditing.value = false
  productEditing.value = null
  clearForm()
}

function cancelEdit() {
  // window.scrollTo(0, 0)
  fullClearForm()
}

function removeEditingImage() {
  if (image.value) {
    image.value = null
  } else if (isEditing.value) {
    productEditing.value.image_url = null
  }
}

async function submitForm() {
  formLoading.value = true
  let image_url = null
  if (image.value) {
    const form = new FormData()
    form.append('image', image.value)
    try {
      const data = await authCall('product/image', router, 'post', form)
      image_url = data.image_url
    } catch (error) {
      console.log(error)
      formLoading.value = false
      // fullClearForm()
      return
    }
  } else if (isEditing.value) {
    image_url = productEditing.value.image_url
  }
  const body = {
    name: name.value,
    price: price.value,
    stock: stock.value,
    description: description.value,
    image_url,
    type: type.value,
  }
  let data
  try {
    if (isEditing.value) {
      // edit product
      const id = productEditing.value.id
      data = await authCall(`/product/${id}`, router, 'patch', body)
      const index = products.value.findIndex((product) => product.id === id)
      body.id = id
      body.type = data.type
      addTypeToForm(data.type)
      products.value[index] = body
    } else {
      // add product
      data = await authCall('/product', router, 'post', body)
      body.id = data.id
      body.type = data.type
      addTypeToForm(data.type)
      products.value.push(body)
    }
  } catch (error) {
    console.log(error)
  } finally {
    formLoading.value = false
    fullClearForm()
  }
}

function addTypeToForm(type) {
  const findType = types.value.findIndex((typeItem) => typeItem.type === type)
  if (findType === -1) {
    types.value.push({ type })
  }
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
          v-for="product in products"
          :product
          :disable="formLoading"
          @edit-product="editProduct(product.id)"
          @stock-one="stockOne"
          @cancel-edit="cancelEdit"
          :editing="product.id === productEditing?.id"
        ></product-row>
      </v-expansion-panels>
    </div>
    <div v-if="types === null">
      <v-skeleton-loader type="heading"></v-skeleton-loader>
      <v-skeleton-loader type="heading"></v-skeleton-loader>
      <v-skeleton-loader type="heading"></v-skeleton-loader>
      <v-skeleton-loader type="heading"></v-skeleton-loader>
      <v-skeleton-loader type="heading"></v-skeleton-loader>
    </div>
    <v-card
      :loading="formLoading"
      :class="{ 'form-card': true, 'form-highlight': isEditing }"
      v-else
    >
      <template #text>
        <v-form class="form" v-model="isValid" @submit.prevent="submitForm">
          <div class="form-title">
            {{ isEditing ? `Edit ${productEditing?.name}` : 'Add Product' }}
          </div>
          <div class="form-note">* required</div>
          <v-text-field
            v-model="name"
            label="Name *"
            :rules="[required, notOnlyWhiteSpace]"
            variant="solo"
          ></v-text-field>
          <div class="price-stock-flex">
            <v-number-input
              v-model="price"
              label="Price *"
              :rules="[required]"
              variant="solo"
              control-variant="hidden"
              prepend-inner-icon="fas fa-dollar-sign"
              :precision="2"
            >
            </v-number-input>
            <v-number-input
              v-model="stock"
              label="Stock *"
              :rules="[required]"
              variant="solo"
              control-variant="hidden"
              prepend-inner-icon="fas fa-cubes"
            >
            </v-number-input>
          </div>
          <v-textarea v-model="description" label="Description" variant="solo"></v-textarea>
          <div v-if="imagePreview" class="image-preview-div">
            <img class="image-preview" :src="imagePreview" alt="Product image preview" />
            <v-btn
              @click="removeEditingImage"
              :disabled="fulfillLoading"
              :loading="deleteLoading"
              variant="plain"
              icon="fas fa-x"
              size="x-small"
            ></v-btn>
          </div>
          <!-- using code from: 
           - https://vuetifyjs.com/en/components/file-inputs/#validation
           - https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file 
          -->
          <v-file-input
            accept="image/png, image/jpeg"
            prepend-icon="fas fa-image"
            v-model="image"
            label="Image"
            variant="solo"
          ></v-file-input>
          <v-combobox
            v-model="type"
            label="Type *"
            :rules="[required, notOnlyWhiteSpace]"
            :items="typesList"
            variant="solo"
          ></v-combobox>
          <div class="flex">
            <v-btn
              type="submit"
              :disabled="!isValid"
              :loading="formLoading"
              variant="flat"
              color="var(--green)"
              >submit</v-btn
            >
            <v-btn @click="clearForm" variant="outlined" :disabled="formLoading">clear</v-btn>
            <v-btn
              style="margin-left: auto"
              variant="outlined"
              v-if="isEditing"
              :disabled="formLoading"
              @click="cancelEdit"
              >cancel edit</v-btn
            >
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
  top: 82px;
  max-width: 600px;
  justify-self: center;
  width: 100%;
  /* border: white 4px dashed; */
}
/* .form-highlight {
  border: var(--mid-lilac) 4px dashed;
} */
/* .form {
  display: flex;
  flex-direction: column;
  gap: 5px;
} */
.flex {
  display: flex;
  gap: 16px;
}
.price-stock-flex {
  display: flex;
  gap: 16px;
}
.form-title {
  font-size: 20px;
  font-weight: bold;
  color: rgb(118, 118, 118);
}
.form-note {
  color: rgb(118, 118, 118);
  margin-bottom: 16px;
  font-size: smaller;
}
.image-preview-div {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 20px;
}
.image-preview {
  width: inherit;
  height: 100px;
  border-radius: 4px;
}

@media (max-height: 820px) {
  .form-card {
    position: relative;
    top: 0;
  }
}

@media (max-width: 1000px) {
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
