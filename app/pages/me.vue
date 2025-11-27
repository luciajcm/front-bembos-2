<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const { user, isLoggedIn, logout, usuario } = useAuth()

onMounted(() => {
  if (!isLoggedIn.value) {
    // If not logged in redirect to auth page
    router.push('/auth')
  }
})

function handleLogout() {
  logout()
  router.push('/')
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-linear-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl font-bold">
          {{ (usuario || 'U').charAt(0).toUpperCase() }}
        </div>
        <div>
          <h1 class="text-2xl font-semibold">Perfil de usuario</h1>
          <p class="text-sm text-muted">Información de tu sesión</p>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="p-4 rounded border border-neutral-100 dark:border-neutral-800">
          <div class="text-xs uppercase text-neutral-500">Usuario</div>
          <div class="mt-1 font-medium">{{ usuario }}</div>
        </div>

        <div class="p-4 rounded border border-neutral-100 dark:border-neutral-800">
          <div class="text-xs uppercase text-neutral-500">Email</div>
          <div class="mt-1 font-medium">{{ user && (user.email || '-') }}</div>
        </div>

        <div class="p-4 rounded border border-neutral-100 dark:border-neutral-800">
          <div class="text-xs uppercase text-neutral-500">Role</div>
          <div class="mt-1 font-medium">{{ user && (user.role || '-') }}</div>
        </div>

        <div class="p-4 rounded border border-neutral-100 dark:border-neutral-800">
          <div class="text-xs uppercase text-neutral-500">User ID</div>
          <div class="mt-1 font-medium break-all">{{ user && (user.userId || '-') }}</div>
        </div>

        <div class="p-4 rounded border border-neutral-100 dark:border-neutral-800 sm:col-span-2">
          <div class="text-xs uppercase text-neutral-500">Tenant</div>
          <div class="mt-1 font-medium">{{ user && (user.tenantId || '-') }}</div>
        </div>
      </div>

      <div class="mt-6 flex gap-3">
        <NuxtLink to="/order" class="inline-flex items-center px-4 py-2 rounded bg-amber-500 text-white hover:bg-amber-600">Ver mis pedidos</NuxtLink>
        <button @click="handleLogout" class="inline-flex items-center px-4 py-2 rounded border border-neutral-200 dark:border-neutral-800">Cerrar sesión</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-muted { color: rgba(100,100,100,0.9); }
</style>
