<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">注册</h1>
        <p class="text-gray-500 mt-2">创建您的账号</p>
      </div>
      
      <div class="bg-white rounded-2xl shadow-sm p-8">
        <form @submit.prevent="handleRegister">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <input
                v-model="form.username"
                type="text"
                required
                minlength="3"
                maxlength="50"
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="3-50个字符"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input
                v-model="form.password"
                type="password"
                required
                minlength="6"
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="至少6个字符"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
              <input
                v-model="form.confirmPassword"
                type="password"
                required
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="再次输入密码"
              />
            </div>
          </div>
          
          <div class="mt-4">
            <label class="flex items-start">
              <input type="checkbox" required class="mt-1 rounded border-gray-300 text-primary focus:ring-primary" />
              <span class="ml-2 text-sm text-gray-600">
                我已阅读并同意
                <NuxtLink to="/terms" class="text-primary hover:underline">用户协议</NuxtLink>
                和
                <NuxtLink to="/privacy" class="text-primary hover:underline">隐私政策</NuxtLink>
              </span>
            </label>
          </div>
          
          <button
            type="submit"
            :disabled="loading"
            class="w-full mt-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
          >
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </form>
        
        <div class="mt-6 text-center text-sm text-gray-500">
          已有账号?
          <NuxtLink to="/login" class="text-primary hover:underline">立即登录</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const api = useApi()
const router = useRouter()

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    alert('两次密码输入不一致')
    return
  }
  
  loading.value = true
  
  try {
    await api.auth.register({
      username: form.username,
      email: form.email,
      password: form.password
    })
    
    alert('注册成功，请登录')
    router.push('/login')
  } catch (error: any) {
    alert(error.data?.detail || '注册失败')
  } finally {
    loading.value = false
  }
}

useHead({
  title: '注册 - 漫画平台'
})
</script>
