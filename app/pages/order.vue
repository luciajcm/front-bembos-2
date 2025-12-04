<template>
  <div class="container mx-auto py-8">
    <div class="max-w-3xl mx-auto card p-6">
      <h1 class="text-2xl font-bold" :style="{ color: 'var(--color-primary)' }">Confirmar pedido</h1>
          <p class="text-sm text-(--color-muted) mt-1">Revisa los platos y procede al pago.</p>

          <div v-if="createdOrder" class="mt-4 p-4 border rounded bg-green-50">
            <div class="font-semibold text-lg">Pedido creado</div>
            <div class="text-sm text-(--color-muted) mt-1">Tu pedido fue registrado correctamente.</div>
            <div class="mt-3 flex items-center gap-4">
              <div class="p-3 bg-white rounded shadow-sm">
                <div class="text-xs text-(--color-muted)">ID</div>
                <div class="font-mono font-semibold text-sm">{{ createdOrder.orderId ?? createdOrder.id ?? createdOrder.order?.orderId }}</div>
              </div>
              <div class="p-3 bg-white rounded shadow-sm">
                <div class="text-xs text-(--color-muted)">Total</div>
                <div class="font-semibold text-sm">S/ {{ Number(createdOrder.total ?? createdOrder.order?.total ?? 0).toFixed(2) }}</div>
              </div>
            </div>
          </div>

      <div class="mt-6">
        <div v-if="!cart.length" class="text-center py-8">Tu carrito está vacío. Ve al <NuxtLink to="/menu" class="text-(--color-primary)">menú</NuxtLink> para agregar platos.</div>

        <ul v-else class="space-y-4">
          <li v-for="item in cart" :key="item.id" class="flex items-center justify-between gap-4">
            <div class="flex-1">
              <div class="font-semibold">{{ item.name }}</div>
              <div class="text-xs text-(--color-muted)">S/ {{ Number(item.price).toFixed(2) }}</div>
            </div>
            <div class="flex items-center gap-2">
              <button class="px-2 py-1 border rounded" @click="decrease(item)">-</button>
              <div class="px-3">{{ item.qty }}</div>
              <button class="px-2 py-1 border rounded" @click="increase(item)">+</button>
              <div class="w-24 text-right font-bold">S/ {{ (Number(item.price) * item.qty).toFixed(2) }}</div>
            </div>
          </li>
        </ul>

        <div v-if="cart.length" class="mt-6 flex items-center justify-between">
          <div>
            <div class="text-sm">Total estimado</div>
            <div class="text-2xl font-extrabold">S/ {{ carritoTotal.toFixed(2) }}</div>
          </div>
          <div class="space-y-2">
            <button class="btn-primary" :disabled="loading" @click="makeOrder">{{ loading ? 'Procesando...' : 'Hacer pedido / Pagar' }}</button>
            <button class="btn-ghost" @click="clearCart" :disabled="loading">Vaciar carrito</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCart } from '~/composables/useCart'
import { createOrder } from '~/api/restaurantService'
import { useOrderFlow } from '~/composables/useOrderFlow'
import { useAuth } from '~/composables/useAuth'
const { cart, updateQty, removeItem, clear, total: carritoTotal } = useCart()
const createdOrder = ref<any | null>(null)
const loading = ref(false)
const router = useRouter()

function increase(item: any) {
  updateQty(item.id, Number(item.qty) + 1)
}

function decrease(item: any) {
  const next = Number(item.qty) - 1
  if (next <= 0) removeItem(item.id)
  else updateQty(item.id, next)
}

async function makeOrder() {
  if (!cart.value.length) return
  loading.value = true
  try {
    const payload = {
      items: cart.value.map(i => ({ id: i.id, name: i.name, price: Number(i.price), qty: Number(i.qty) })),
      total: Number(carritoTotal.value)
    }
    const { token } = useAuth()
    const res = await createOrder(payload, { token: token.value ?? undefined })
    // assume response contains order.orderId
    const orderId = (res && (res.order?.orderId ?? res.orderId ?? res.data?.orderId)) || (res && (res.orderId ?? res.id))
    // store created order info to show card
    createdOrder.value = (res && (res.order ?? res)) || { orderId, total: payload.total }
    clear()
    const toast = useToast()
    toast.add({ title: 'Pedido creado', description: 'Tu pedido se creó correctamente', color: 'success' })
    // start order flow (polling order details) so other pages/components can observe updates
    try {
      const { start } = useOrderFlow()
      if (orderId) start(String(orderId))
    } catch (e) {
      // non-fatal
      console.error('Could not start order flow', e)
    }
    // give user a brief moment to see the created card, then navigate to detail
    try {
      if (orderId) {
        setTimeout(() => { router.push(`/orders/${orderId}`) }, 1500)
      } else {
        setTimeout(() => { router.push('/orders') }, 1500)
      }
    } catch (e) {
      // fallback
      if (orderId) router.push(`/orders/${orderId}`)
      else router.push('/orders')
    }
  } catch (err: any) {
    const toast = useToast()
    toast.add({ title: 'Error', description: err?.message ?? 'No se pudo crear pedido', color: 'error' })
    console.error(err)
  } finally {
    loading.value = false
  }
}

function clearCart() {
  clear()
}
</script>

