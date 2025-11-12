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
const isLoggedIn = ref(false) // Estado de autenticación

// Manejo del tema
const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <UApp>
    <UHeader
      :ui="{
        center: 'flex items-center'
      }"
    >
      <template #left>
        <div class="flex items-center gap-1 max-w-fit">
          <NuxtLink to="/">
            <AppLogo class="h-8 w-auto" />
          </NuxtLink>
          <UButton
            :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
            variant="ghost"
            color="neutral"
            size="sm"
            aria-label="Cambiar tema"
            @click="toggleTheme"
          />
        </div>
      </template>

      <template #default>
        <!-- moved center slightly more to the left to prevent overlap when search is active -->
        <div class="flex items-center gap-1 lg:gap-2 -ml-8 lg:-ml-14">
          <!-- Link Promociones -->
          <UButton
            to="/offers"
            variant="ghost"
            color="neutral"
            icon="i-lucide-tag"
            class="hidden lg:inline-flex text-base font-medium"
            size="md"
          >
            Promociones
          </UButton>

          <!-- Link Menú -->
          <UButton
            to="/menu"
            variant="ghost"
            color="neutral"
            icon="i-lucide-menu"
            class="hidden lg:inline-flex text-base font-medium"
            size="md"
          >
            Menú
          </UButton>

          <!-- Link Locales -->
          <UButton
            to="/places"
            variant="ghost"
            color="neutral"
            icon="i-lucide-map-pin"
            class="hidden lg:inline-flex text-base font-medium"
            size="md"
          >
            Locales
          </UButton>

          <!-- Buscador -->
          <div class="relative flex items-center">
            <UInput
              v-if="mostrarBusqueda"
              v-model="busqueda"
              placeholder="Buscar..."
              icon="i-simple-line-icons-magnifier"
              autofocus
              class="w-28 lg:w-40"
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
        <div class="flex items-center gap-2 lg:gap-4 whitespace-nowrap">
          <UButton
            href="tel:01419-1919"
            target="_blank"
            title="01419-1919"
            variant="ghost"
            color="neutral"
            size="sm"
            class="flex flex-col items-center gap-1 text-sm whitespace-nowrap min-w-[72px]"
          >
            <span class="uppercase tracking-wide text-xs font-semibold">Llámanos</span>
            <span class="flex items-center gap-2">
              <UIcon
                name="i-lucide-phone"
                class="h-4 w-4"
                aria-hidden="true"
              />
              <strong class="number-phone">01419-1919</strong>
            </span>
          </UButton>

          <template v-if="isLoggedIn">
            <span class="text-sm hidden lg:inline whitespace-nowrap">
              <span>Hola,</span>
              <strong class="ml-1">{{ usuario }}</strong>
            </span>
          </template>
          <template v-else>
            <!-- Mostrar en línea en pantallas grandes para evitar saltos/solapamientos -->
            <span class="text-sm hidden lg:inline-flex items-center text-center gap-2 whitespace-nowrap">
              <span class="block">Hola,</span>
              <NuxtLink
                to="/auth"
                class="inline-flex items-center gap-2 hover:underline focus-visible:underline"
              >
                <UIcon
                  name="mdi:account-circle"
                  class="h-5 w-5"
                  aria-hidden="true"
                />
                <span>Iniciar sesión</span>
              </NuxtLink>
            </span>
          </template>

          <!-- Carrito de compras -->
          <UButton
            icon="i-lucide-shopping-cart"
            variant="ghost"
            color="neutral"
            size="sm"
            aria-label="Carrito"
            class="min-w-16"
          >
            <span class="hidden sm:inline ml-2 text-sm whitespace-nowrap">
              S/ {{ carritoTotal.toFixed(2) }}
            </span>
          </UButton>
        </div>
      </template>

      <template #body>
        <!-- animación simple para el menú móvil -->
        <div class="flex flex-col gap-2 lg:hidden slide-down">
          <!-- Buscador dentro del menú móvil (primero) -->
          <div class="px-3 pt-2">
            <UInput
              v-model="busqueda"
              placeholder="Buscar..."
              icon="i-simple-line-icons-magnifier"
              class="w-full"
              size="sm"
              @keyup.enter="() => { /* puedes manejar la búsqueda aquí */ }"
            />
          </div>

          <UButton
            to="/offers"
            variant="ghost"
            color="neutral"
            icon="i-lucide-tag"
            block
          >
            Promociones
          </UButton>
          <UButton
            to="/places"
            variant="ghost"
            color="neutral"
            icon="i-lucide-map-pin"
            block
          >
            Locales
          </UButton>

          <UButton
            to="/menu"
            variant="ghost"
            color="neutral"
            icon="i-lucide-menu"
            block
          >
            Menú
          </UButton>

          <template v-if="!isLoggedIn">
            <!-- Móvil: mostrar solo el botón 'Iniciar sesión' centrado -->
            <div class="px-3 py-2 text-sm flex justify-center">
              <UButton
                to="/auth"
                variant="ghost"
                color="neutral"
                class="inline-flex items-center gap-2 w-full max-w-xs justify-center"
              >
                <UIcon
                  name="mdi:account-circle"
                  class="h-5 w-5"
                  aria-hidden="true"
                />
                <span class="hidden sm:inline">Iniciar sesión</span>
                <span class="inline-block sm:hidden uppercase tracking-wide text-xs font-semibold">Iniciar</span>
              </UButton>
            </div>
          </template>
          <template v-else>
            <div class="px-3 py-2 text-sm">
              Hola {{ usuario }}
            </div>
          </template>
        </div>
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
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

<style scoped>
/* Animación simple para desplegar el menú móvil */
.slide-down {
  animation: slideDown 220ms ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-8px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
