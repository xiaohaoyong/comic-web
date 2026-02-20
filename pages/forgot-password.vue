<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">重置密码</h1>
        <p class="text-gray-500 mt-2">输入注册邮箱重置密码</p>
      </div>
      
      <div class="bg-white rounded-2xl shadow-sm p-8">
        <form @submit.prevent="handleReset" aria-label="重置密码表单">
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">注册邮箱</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                placeholder="请输入注册时使用的邮箱"
                aria-required="true"
              />
            </div>
            
            <div v-if="codeSent">
              <label for="code" class="block text-sm font-medium text-gray-700 mb-1">验证码</label>
              <input
                id="code"
                v-model="form.code"
                type="text"
                required
                maxlength="6"
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                placeholder="请输入6位验证码"
                aria-required="true"
              />
            </div>
            
            <div v-if="codeSent">
              <label for="new_password" class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
              <input
                id="new_password"
                v-model="form.new_password"
                type="password"
                required
                autocomplete="new-password"
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                placeholder="8-32位，需包含字母和数字"
                aria-required="true"
              />
            </div>
          </div>
          
          <button
            v-if="!codeSent"
            type="button"
            @click="sendCode"
            :disabled="loading || !form.email"
            class="w-full mt-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          >
            <span v-if="loading">发送中...</span>
            <span v-else>发送验证码</span>
          </button>
          
          <button
            v-else
            type="submit"
            :disabled="loading || !form.code || !form.new_password"
            class="w-full mt-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          >
            <span v-if="loading">重置中...</span>
            <span v-else>重置密码</span>
          </button>
        </form>
        
        <div class="mt-6 text-center text-sm text-gray-500">
          想起密码了?
          <NuxtLink to="/login" class="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded">返回登录</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const api = useApi()
const router = useRouter()

const form = reactive({
  email: '',
  code: '',
  new_password: ''
})

const loading = ref(false)
const codeSent = ref(false)

const sendCode = async () => {
  loading.value = true
  
  try {
    await api.auth.sendVerifyEmail({ email: form.email, type: 'reset' })
    codeSent.value = true
    alert('验证码已发送到您的邮箱')
  } catch (error: any) {
    alert(error.data?.detail || '发送失败')
  } finally {
    loading.value = false
  }
}

const handleReset = async () => {
  loading.value = true
  
  try {
    await api.auth.resetPassword({
      email: form.email,
      code: form.code,
      new_password: form.new_password
    })
    alert('密码重置成功，请使用新密码登录')
    router.push('/login')
  } catch (error: any) {
    alert(error.data?.detail || '重置失败')
  } finally {
    loading.value = false
  }
}

useHead({
  title: '重置密码 - 漫画平台',
  meta: [
    { name: 'description', content: '重置您的账户密码' }
  ]
})
</script>
