<template>
  <div class="min-h-screen bg-surface-400 flex">
    <!-- 左侧装饰 -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <div class="absolute inset-0">
        <img 
          src="https://picsum.photos/seed/login/1920/1080" 
          alt="Comic background"
          class="w-full h-full object-cover opacity-30"
        >
        <div class="absolute inset-0 bg-gradient-to-r from-surface-400 via-surface-400/90 to-transparent"></div>
      </div>
      
      <div class="relative z-10 flex flex-col justify-center px-16">
        <div class="mb-8">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <h1 class="font-display font-bold text-4xl mb-4">
            <span class="gradient-text">ComicVerse</span>
          </h1>
          <p class="text-gray-400 text-lg">探索无限漫画世界，发现精彩故事</p>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-center gap-3 text-gray-300">
            <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
            </div>
            <span>海量高清漫画资源</span>
          </div>
          <div class="flex items-center gap-3 text-gray-300">
            <div class="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
              <svg class="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <span>极速更新，抢先阅读</span>
          </div>
          <div class="flex items-center gap-3 text-gray-300">
            <div class="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span>VIP会员专属特权</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 右侧登录表单 -->
    <div class="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-md">
        <!-- Logo (移动端显示) -->
        <div class="lg:hidden text-center mb-8">
          <div class="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <h1 class="font-display font-bold text-2xl gradient-text">ComicVerse</h1>
        </div>
        
        <div class="text-center mb-8">
          <h2 class="font-display font-bold text-3xl mb-2">欢迎回来</h2>
          <p class="text-gray-400">登录您的账号继续阅读</p>
        </div>
        
        <div class="gradient-border p-8">
          <form @submit.prevent="handleLogin">
            <div class="space-y-5">
              <div>
                <label for="login" class="block text-sm font-medium text-gray-300 mb-2">用户名/邮箱</label>
                <input
                  id="login"
                  v-model="form.login"
                  type="text"
                  required
                  autocomplete="username"
                  class="w-full input-field px-4 py-3 rounded-xl"
                  placeholder="请输入用户名或邮箱"
                />
              </div>
              
              <div>
                <label for="password" class="block text-sm font-medium text-gray-300 mb-2">密码</label>
                <div class="relative">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    autocomplete="current-password"
                    class="w-full input-field px-4 py-3 pr-12 rounded-xl"
                    placeholder="请输入密码"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              :disabled="loading"
              class="w-full mt-6 btn-primary py-3.5 rounded-xl font-semibold"
            >
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                登录中...
              </span>
              <span v-else>登录</span>
            </button>
          </form>
          
          <div class="mt-6 text-center text-sm text-gray-400">
            <NuxtLink to="/forgot-password" class="text-purple-400 hover:text-purple-300">忘记密码?</NuxtLink>
            <span class="mx-3">|</span>
            <span>还没有账号?</span>
            <NuxtLink to="/register" class="text-purple-400 hover:text-purple-300 ml-1">立即注册</NuxtLink>
          </div>
        </div>
        
        <!-- 社交登录 -->
        <div class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-surface-400 text-gray-400">或使用以下方式登录</span>
            </div>
          </div>
          
          <div class="mt-6 flex gap-4">
            <button class="social-btn flex-1 py-3 rounded-xl border border-purple-500/20 hover:bg-purple-500/10 transition-colors flex items-center justify-center gap-2">
              <svg class="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.49.49 0 01.176-.553C23.806 18.032 24 16.516 24 15.668c0-3.385-3.148-6.758-7.062-6.81zm-2.731 2.675c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
              </svg>
              <span class="text-sm">微信</span>
            </button>
            <button class="social-btn flex-1 py-3 rounded-xl border border-purple-500/20 hover:bg-purple-500/10 transition-colors flex items-center justify-center gap-2">
              <svg class="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.001 2C6.486 2 2 6.486 2 12.001c0 5.515 4.486 10.001 10.001 10.001 5.515 0 10.001-4.486 10.001-10.001C22.002 6.486 17.516 2 12.001 2zm3.86 6.033l-1.86 8.753c-.14.62-.508.775-.103.484l-2.856-2.104-1.377 1.326c-.154.154-.283.283-.578.283l.205-2.903 5.278-4.768c.229-.205-.049-.318-.358-.113l-6.524 4.108-2.812-.878c-.612-.19-.625-.612.128-.908l10.993-4.238c.509-.19.954.123.784.908z"/>
              </svg>
              <span class="text-sm">QQ</span>
            </button>
          </div>
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
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const form = reactive({
  login: '',
  password: ''
})

const loading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  loading.value = true
  
  try {
    const result = await api.auth.login(form)
    userStore.setAuth(result.access_token, result.refresh_token, { id: 0 } as any)
    
    const user = await api.user.profile(result.access_token)
    userStore.updateUser(user)
    
    const redirect = route.query.redirect as string || '/'
    router.push(redirect)
  } catch (error: any) {
    console.error('登录失败:', error)
    alert(error.data?.detail || error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

useHead({
  title: '登录 - ComicVerse',
  meta: [
    { name: 'description', content: '登录ComicVerse漫画阅读平台，享受海量漫画资源' }
  ]
})
</script>
