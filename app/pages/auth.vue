<template>
  <div class="auth-page flex min-h-screen items-center justify-center">
    <div class="auth-content z-10 w-full">
      <AuthSwitcher />
    </div>
  </div>
</template>

<script setup lang="ts">
import AuthSwitcher from '../components/auth/AuthSwitcher.vue'
</script>
