<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { createKitchen } from '~/api/restaurantService'

const { user } = useAuth()
const tenantId = ref<string>(user && (user as any).tenantId ? String((user as any).tenantId) : 'TENANT#BEMBOS')

const name = ref('')
const address = ref('')
const imageUrl = ref('')
const imageFile = ref<File | null>(null)
const imageBase64 = ref<string | null>(null)
const imageFilename = ref<string | null>(null)
const imageContentType = ref<string | null>(null)
const loading = ref(false)
const message = ref<string | null>(null)

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files || input.files.length === 0) {
    imageFile.value = null
    imageBase64.value = null
    imageFilename.value = null
    imageContentType.value = null
    return
  }
  const file = input.files[0]
  imageFile.value = file
  imageFilename.value = file.name
  imageContentType.value = file.type || 'image/jpeg'
  const reader = new FileReader()
  reader.onload = () => {
    const result = reader.result as string
    const matches = result.match(/^data:(.+);base64,(.+)$/)
    if (matches) imageBase64.value = matches[2]
    else imageBase64.value = result.replace(/^data:.+;base64,/, '')
  }
  reader.readAsDataURL(file)
}

async function submit() {
  message.value = null
  const n = String(name.value || '').trim()
  if (!n) {
    message.value = 'Nombre del local requerido'
    return
  }
  loading.value = true
  try {
    const payload: Record<string, unknown> = {
      tenantId: tenantId.value,
      name: n,
      address: String(address.value || '')
    }
    if (imageUrl.value && imageUrl.value.trim()) {
      payload.imageUrl = String(imageUrl.value).trim()
    } else if (imageBase64.value) {
      payload.imageBase64 = imageBase64.value
      payload.imageFilename = imageFilename.value || `image.jpg`
      payload.imageContentType = imageContentType.value || 'image/jpeg'
    }
    await createKitchen(payload)
    message.value = 'Local creado correctamente'
    name.value = ''
    address.value = ''
    imageUrl.value = ''
    imageFile.value = null
    imageBase64.value = null
    imageFilename.value = null
    imageContentType.value = null
  } catch (err) {
    console.error('create local error', err)
    message.value = 'Error al crear local'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-4 rounded border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800">
    <h4 class="font-medium mb-2">Crear Local / Cocina</h4>
    <div class="space-y-2">
      <input v-model="name" placeholder="Nombre del local" class="w-full p-2 border rounded" />
      <input v-model="address" placeholder="Dirección (opcional)" class="w-full p-2 border rounded" />

      <div class="text-sm font-medium">Imagen (URL o subir archivo)</div>
      <input v-model="imageUrl" placeholder="URL de imagen (opcional)" class="w-full p-2 border rounded" />
      <div class="flex items-center gap-2">
        <input type="file" accept="image/*" @change="onFileChange" />
        <div v-if="imageFilename" class="text-sm text-neutral-500">{{ imageFilename }}</div>
      </div>

      <div class="flex items-center gap-2">
        <button @click="submit" :disabled="loading" class="px-3 py-1 bg-amber-500 text-white rounded">Crear</button>
        <span v-if="loading" class="text-sm text-neutral-500">Creando...</span>
      </div>
      <div v-if="message" class="text-sm text-neutral-600">{{ message }}</div>
    </div>
  </div>
</template>

<style scoped>
input { background: transparent }
</style>
