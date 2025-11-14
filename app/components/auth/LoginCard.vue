<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

import { login } from '../../api/authService'

const toast = useToast()

const DEFAULT_TENANT = 'TENANT#BEMBOS'

const fields: AuthFormField[] = [
  {
    name: 'identifier',
    type: 'text',
    label: 'Email or Username',
    placeholder: 'Enter your email or username',
    required: true
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    required: true
  },
  {
    name: 'remember',
    type: 'checkbox',
    label: 'Remember me'
  }
]

const schema = z.object({
  identifier: z.string().min(1, 'Required'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const p = payload as unknown
  let form: Record<string, unknown> = {}
  if (typeof p === 'object' && p !== null && 'data' in (p as Record<string, unknown>)) {
    form = (p as { data: Record<string, unknown> }).data
  } else if (typeof p === 'object' && p !== null) {
    form = p as Record<string, unknown>
  }

  // Ensure tenantId is always present in the outgoing payload
  form.tenantId = typeof form.tenantId === 'string' ? form.tenantId : DEFAULT_TENANT

  try {
    // backend expects tenantId and a field named `email` containing either email or username
    const identifier = typeof form.identifier === 'string' ? form.identifier : undefined
    const res = await login({
      tenantId: typeof form.tenantId === 'string' ? form.tenantId : DEFAULT_TENANT,
      email: identifier,
      password: typeof form.password === 'string' ? form.password : undefined
    })

    // Extract token defensively from response shape
    let token: string | undefined
    if (res && typeof res === 'object') {
      const r = res as Record<string, unknown>
      if (typeof r.token === 'string') token = r.token
      else if (r.data && typeof r.data === 'object') {
        const d = r.data as Record<string, unknown>
        if (typeof d.token === 'string') token = d.token
      }
    }

    if (token) {
      // Store token in cookie (client-side). For httpOnly cookie prefer backend Set-Cookie.
      const authCookie = useCookie('auth_token', {
        path: '/',
        sameSite: 'lax',
        secure: true,
        maxAge: 60 * 60 // 1 hour
      })
      authCookie.value = token
    }

    toast.add({ title: 'Login successful', description: 'You are now logged in.' })
    // redirect to home
    navigateTo('/')
    console.log('Login success', identifier)
  } catch (errUnknown) {
    const errObj = errUnknown as { body?: { message?: string }, message?: string }
    const message = errObj.body?.message ?? errObj.message ?? 'Login failed'
    toast.add({ title: 'Login failed', description: String(message) })
    console.error('Login error', errUnknown)
  }
}
</script>

<template>
  <UPageCard class="w-full max-w-md">
    <UAuthForm
      :schema="schema"
      title="Login"
      description="Enter your credentials to access your account."
      icon="i-lucide-user"
      :fields="fields"
      @submit="onSubmit"
    />
  </UPageCard>
</template>
