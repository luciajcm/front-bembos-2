<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { createWorker } from '~/api/restaurantService'

const { user } = useAuth()
const tenantId = ref<string>(user && (user as any).tenantId ? String((user as any).tenantId) : 'TENANT#BEMBOS')

const email = ref('')
const username = ref('')
const password = ref('')
const role = ref('kitchen')
const loading = ref(false)
const message = ref<string | null>(null)

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

async function submit() {
  message.value = null
  const e = String(email.value || '').trim().toLowerCase()
  const u = String(username.value || '').trim().toLowerCase()
  const p = String(password.value || '')
  const r = String(role.value || 'kitchen').toLowerCase()

  if (!tenantId.value) {
    message.value = 'TenantId no disponible'
    return
  }
  if (!e || !isValidEmail(e)) {
    message.value = 'Email inválido'
    return
  }
  if (!u) {
    message.value = 'Username requerido'
    return
  }
  if (!p || p.length < 8) {
    message.value = 'Password: mínimo 8 caracteres'
    return
  }

  loading.value = true
  try {
    // prevent creating admin accounts from this UI
    if (r === 'admin') {
      message.value = 'No está permitido crear administradores desde aquí'
      loading.value = false
      return
    }

    const payload: Record<string, unknown> = {
      tenantId: tenantId.value,
      email: e,
      username: u,
      password: p,
      role: r
    }
    await createWorker(payload)
    message.value = 'Trabajador creado correctamente'
    email.value = ''
    username.value = ''
    password.value = ''
    role.value = 'kitchen'
  } catch (err: unknown) {
    console.error('create worker error', err)
    message.value = 'Error al crear trabajador'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-4 rounded border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800">
    <h4 class="font-medium mb-2">Crear Trabajador</h4>
    <div class="space-y-2">
      <input v-model="email" placeholder="Email" class="w-full p-2 border rounded" />
      <input v-model="username" placeholder="Username" class="w-full p-2 border rounded" />
      <input v-model="password" placeholder="Password" type="password" class="w-full p-2 border rounded" />
      <select v-model="role" class="w-full p-2 border rounded">
        <option value="kitchen">kitchen</option>
        <option value="delivery">delivery</option>
      </select>
      <div class="flex items-center gap-2">
        <button @click="submit" :disabled="loading" class="px-3 py-1 bg-amber-500 text-white rounded">Crear</button>
        <span v-if="loading" class="text-sm text-neutral-500">Creando...</span>
      </div>
      <div v-if="message" class="text-sm text-neutral-600">{{ message }}</div>
    </div>
  </div>
</template>

<style scoped>
input, select { background: transparent }
</style>
