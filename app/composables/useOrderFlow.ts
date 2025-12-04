import { computed } from 'vue'
import { getOrderById } from '~/api/restaurantService'

let _pollId: number | null = null

async function _doFetch(orderId: string, activeOrder: any) {
  try {
    const res = await getOrderById(orderId)
    const ord = (res && (res.order ?? res)) || null
    activeOrder.value = ord
  } catch (e) {
    console.error('useOrderFlow: failed to fetch order', e)
  }
}

export function useOrderFlow() {
  // create/use the shared state lazily inside the composable (must be called within setup)
  const activeOrder = useState<any | null>('active_order', () => null)

  function start(orderId: string, interval = 3000) {
    if (!orderId) return
    // only run polling on client
    if (process.server) return
    stop()
    // fetch immediately then poll
    void _doFetch(orderId, activeOrder)
    _pollId = window.setInterval(() => {
      void _doFetch(orderId, activeOrder)
    }, interval) as unknown as number
  }

  function stop() {
    if (_pollId !== null) {
      clearInterval(_pollId)
      _pollId = null
    }
  }

  return {
    activeOrder: computed(() => activeOrder.value),
    start,
    stop
  }
}

export default useOrderFlow
