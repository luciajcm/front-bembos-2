<template> 
  <AppLogo class="w-24 h-24 mx-auto mb-6" />  
</template>


<script setup = "ts">

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
</script>