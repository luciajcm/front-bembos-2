<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: 'https://www.bembos.com.pe/media/favicon/stores/9/favicon-bembos.png' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Bemmbos'
const description = 'Template Bembos para Nuxt 3 y Nuxt UI by Lazheart'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterCard: 'summary_large_image'
})

const usuario = ref('Usuario')
const carritoTotal = ref(0)
const mostrarBusqueda = ref(false)
const busqueda = ref('')
</script>

<template>
  <UApp>
    <UHeader
      :ui="{
        center: 'flex items-center' // Cambia de 'hidden lg:flex' a 'flex items-center'
      }"
    >
      <template #left>
        <NuxtLink to="/"> 
          <AppLogo class="h-8 w-auto" />
        </NuxtLink>
      </template>
      
      <template #center>
        <div class="flex items-center gap-2 lg:gap-4">
          <!-- Link Promociones -->
          <UButton
            to="/offers"
            variant="ghost"
            color="neutral"
            class="hidden lg:inline-flex"
            size="sm"
          >
            Promociones
          </UButton>
          
          <!-- Link Menú -->
          <UButton
            to="/menu"
            variant="ghost"
            color="neutral"
            class="hidden lg:inline-flex"
            size="sm"
          >
            Menú
          </UButton>
          
          <!-- Buscador -->
          <div class="relative flex items-center">
            <UInput
              v-if="mostrarBusqueda"
              v-model="busqueda"
              placeholder="Buscar..."
              icon="i-simple-line-icons-magnifier"
              autofocus
              class="w-32 lg:w-48"
              size="sm"
              @keyup.escape="mostrarBusqueda = false; busqueda = ''"
              @blur="() => { if (!busqueda) mostrarBusqueda = false }"
            />
            <UButton
              v-else
              icon="i-simple-line-icons-magnifier"
              variant="ghost"
              color="neutral"
              size="sm"
              aria-label="Buscar"
              @click="mostrarBusqueda = true"
            />
          </div>
        </div>
      </template>
      
      <template #right>
        <div class="flex items-center gap-2 lg:gap-4">
          <!-- Saludo al usuario -->
          <span class="text-sm hidden lg:inline">
            Hola {{ usuario }}
          </span>
          
          <!-- Carrito de compras -->
          <UButton
            icon="i-lucide-shopping-cart"
            variant="ghost"
            color="neutral"
            size="sm"
            aria-label="Carrito"
          >
            <span class="hidden sm:inline ml-2 text-sm">
              S/ {{ carritoTotal.toFixed(2) }}
            </span>
          </UButton>
        </div>
      </template>

      <!-- Menu móvil (opcional, para cuando #center esté oculto) -->
      <template #body>
        <div class="flex flex-col gap-2 lg:hidden">
          <UButton
            to="/offers"
            variant="ghost"
            color="neutral"
            block
          >
            Promociones
          </UButton>
          
          <UButton
            to="/menu"
            variant="ghost"
            color="neutral"
            block
          >
            Menú
          </UButton>
        </div>
      </template>
    </UHeader>

    <UMain>
      <!-- Tu contenido aquí -->
    </UMain>

    <USeparator icon="bx:bolt-circle" />

    <UFooter>
      <template #left>
        <div class="flex flex-col items-start gap-2">
          <AppLogo class="h-8 w-auto" />
          <p class="text-sm text-muted">
            Lazheart Bemmbos • © {{ new Date().getFullYear() }}
          </p>
        </div>
      </template>

      <template #right>
        <UButton
          to="https://github.com/Lazheart/front-bembos.git"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </UApp>
</template>
