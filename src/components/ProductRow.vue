<script setup>
import { ref, computed } from 'vue'
import { formatDate } from '@/helpers/date'
import { useRouter } from 'vue-router'
import { authCall } from '@/helpers/api'

const router = useRouter()
const prop = defineProps(['product', 'disable', 'editing'])
const emits = defineEmits(['editProduct', 'stockOne', 'cancelEdit'])
const stockOneLoading = ref(false)

function editProduct() {
  emits('editProduct')
}

function cancelEdit() {
  emits('cancelEdit')
}

async function stockOne() {
  stockOneLoading.value = true
  try {
    const stock = prop.product.stock + 1
    await authCall(`product/${prop.product.id}`, router, 'patch', { stock })
    emits('stockOne', prop.product.id, stock)
  } catch (error) {
    console.log(error)
  } finally {
    stockOneLoading.value = false
  }
}
</script>

<template>
  <v-expansion-panel :class="{ highlight: prop.editing }" hide-actions>
    <v-expansion-panel-title>
      <div class="title-grid">
        <span>{{ prop.product.name }}</span>
        <span>{{ prop.product.type }}</span>
        <span>${{ prop.product.price }}</span>
        <div class="flex">
          <div>
            {{ prop.product.stock }}
          </div>
          <v-btn
            @click.stop="stockOne"
            :disabled="prop.disable"
            v-show="!prop.editing"
            :loading="stockOneLoading"
            variant="plain"
            icon="fas fa-plus"
            size="x-small"
            v-tooltip="'Stock One'"
          ></v-btn>
        </div>
        <v-btn
          v-if="prop.editing"
          @click.stop="cancelEdit"
          :disabled="stockOneLoading || prop.disable"
          variant="plain"
          icon="fas fa-x"
          size="x-small"
          v-tooltip="'Cancel Edit'"
        ></v-btn>
        <v-btn
          v-else
          @click.stop="editProduct"
          :disabled="stockOneLoading || prop.disable"
          variant="plain"
          icon="fas fa-edit"
          size="x-small"
          v-tooltip="'Edit'"
        ></v-btn>
      </div>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <div class="img-description-flex">
        <img class="product-img" :src="product.image_url" :alt="product.name" />
        <span>{{ prop.product.description }}</span>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<style scoped>
.title-grid {
  font-size: 14px;
  display: grid;
  grid-template-columns: 1fr 0.5fr 0.5fr 0.5fr 0.2fr;
  gap: 10px;
  width: 100%;
  align-items: center;
}
.flex {
  display: flex;
  gap: 5px;
  align-items: center;
}
.img-description-flex {
  display: flex;
  align-items: top;
  font-size: 14px;
  gap: 15px;
}
.product-img {
  width: 60px;
  height: 100%;
  border-radius: 4px;
}
.highlight {
  background-color: var(--light-lilac);
}
</style>
