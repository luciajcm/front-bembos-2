<template>
  <div :class="stripClasses">
    <div class="store-direction bem max-w-7xl mx-auto px-3">
      <a
        class="store-selector-link-bold action secondary change-direction flex items-center justify-between gap-4 py-2"
        href="#"
        :style="selectedStyle"
      >
        <div class="flex items-center gap-3">
          <UIcon
            name="i-lucide-map-pin"
            class="h-5 w-5"
          />
          <div>
            <div
              v-if="!coords"
              class="not-selected"
            >
              <div class="text-location text-sm font-medium">¡Comienza tu pedido!</div>
              <div class="direction-group text-xs text-(--color-muted)">Elige tu dirección</div>
            </div>
            <div
              v-else
              class="selected"
            >
              <div class="store-title text-sm">
                <span class="method-name">Delivery:</span>
                <strong
                  class="source-name ml-2"
                  style="color: var(--primary-color)"
                >{{ coords.lat.toFixed(5) }}, {{ coords.lng.toFixed(5) }}</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="actions flex items-center gap-2">
          <UButton
            size="sm"
            variant="outline"
            color="primary"
            @click.prevent.stop="requestLocation"
          >Recargar ubicación</UButton>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocation } from '~/composables/useLocation'
import { useTheme } from '~/composables/useTheme'
import { computed } from 'vue'

const { status, coords, requestLocation, mapsLink, copyCoords } = useLocation()
const { isDark, palette } = useTheme()

const stripClasses = computed(() => {
  // use slightly softer background in dark mode, removing heavy contrast
  return [
    'header-bottom-links w-full rounded-md',
    isDark.value ? 'bg-neutral-800 text-(--color-text) border border-neutral-700' : 'bg-(--color-surface) text-(--color-text)'
  ]
})

const selectedStyle = computed(() => ({
  'color': palette.value.text,
  // ensure we do NOT force primary/yellow highlight here; keep neutral vars
  '--primary-color': palette.value.primary,
  'boxShadow': 'none'
} as Record<string, string>))
</script>

<style scoped>
.place-card {
    /* simple spacing to match other cards */
}
</style>
