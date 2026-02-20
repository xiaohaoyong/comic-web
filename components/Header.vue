<template>
  <nav class="fixed top-0 left-0 right-0 z-50 glass-effect">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <span class="font-display font-bold text-xl gradient-text">ComicVerse</span>
        </NuxtLink>
        
        <!-- 搜索框 -->
        <div class="hidden md:flex flex-1 max-w-md mx-8">
          <div class="relative w-full">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="搜索漫画、作者..." 
              class="w-full bg-surface-50/50 border border-purple-500/20 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              @keyup.enter="handleSearch"
            >
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
        
        <!-- 导航链接 -->
        <div class="hidden lg:flex items-center gap-1">
          <NuxtLink to="/" class="nav-link" :class="isActive('/') ? 'active text-white' : 'text-gray-400 hover:text-white'">
            首页
          </NuxtLink>
          <NuxtLink to="/comics" class="nav-link" :class="isActive('/comics') ? 'active text-white' : 'text-gray-400 hover:text-white'">
            分类
          </NuxtLink>
          <NuxtLink to="/ranking" class="nav-link" :class="isActive('/ranking') ? 'active text-white' : 'text-gray-400 hover:text-white'">
            排行榜
          </NuxtLink>
          <NuxtLink to="/library" class="nav-link" :class="isActive('/library') ? 'active text-white' : 'text-gray-400 hover:text-white'">
            书架
          </NuxtLink>
        </div>
        
        <!-- 用户区域 -->
        <div class="flex items-center gap-4">
          <!-- 通知按钮 -->
          <button class="p-2 rounded-lg hover:bg-surface-50 transition-colors hidden sm:block">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </button>
          
          <template v-if="userStore.isLoggedIn">
            <NuxtLink to="/user" class="flex items-center gap-3 pl-4 border-l border-gray-700">
              <div class="text-right hidden sm:block">
                <div class="text-sm font-medium">{{ userStore.user?.username || '漫画爱好者' }}</div>
                <div class="flex items-center gap-1.5 text-xs text-gray-400">
                  <svg class="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span>{{ userStore.user?.points || 0 }} 积分</span>
                </div>
              </div>
              <div class="relative">
                <img 
                  :src="userStore.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userStore.user?.username || 'comic'}`" 
                  alt="Avatar" 
                  class="w-10 h-10 rounded-full border-2 border-purple-500/50"
                >
                <div v-if="userStore.user?.is_vip" class="absolute -bottom-1 -right-1 w-5 h-5 vip-badge rounded-full flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
            </NuxtLink>
          </template>
          
          <template v-else>
            <NuxtLink to="/login" class="text-gray-400 hover:text-white transition-colors text-sm">
              登录
            </NuxtLink>
            <NuxtLink to="/register" class="btn-primary px-5 py-2 rounded-full text-sm font-medium">
              <span>注册</span>
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const searchQuery = ref('')

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/comics', query: { keyword: searchQuery.value } })
  }
}

onMounted(() => {
  userStore.loadFromStorage()
})
</script>
