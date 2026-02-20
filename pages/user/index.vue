<template>
  <div>
    <Header />
    
    <main class="pt-20 pb-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 用户信息卡片 -->
        <div class="gradient-border p-6 mb-8">
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <!-- 头像 -->
            <div class="relative">
              <img 
                :src="userStore.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userStore.user?.username || 'comic'}`"
                :alt="userStore.user?.username || '用户'"
                class="w-24 h-24 rounded-full border-4 border-purple-500/30"
              >
              <div v-if="userStore.isVip" class="absolute -bottom-1 -right-1 w-8 h-8 vip-badge rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
            
            <!-- 用户信息 -->
            <div class="text-center sm:text-left flex-1">
              <h1 class="font-display font-bold text-2xl mb-1">{{ userStore.user?.username || '漫画爱好者' }}</h1>
              <p class="text-gray-400 text-sm mb-3">{{ userStore.user?.email }}</p>
              <div class="flex flex-wrap justify-center sm:justify-start gap-2">
                <span 
                  v-if="userStore.isVip"
                  class="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                >
                  VIP会员
                </span>
                <span v-else class="px-3 py-1 rounded-full text-xs font-medium bg-surface-50 text-gray-400">
                  普通用户
                </span>
                <span 
                  v-if="userStore.user?.email_verified"
                  class="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400"
                >
                  已验证
                </span>
              </div>
            </div>
            
            <!-- 编辑按钮 -->
            <button class="p-3 rounded-full border border-purple-500/30 hover:bg-purple-500/10 transition-colors">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 统计卡片 -->
        <div class="grid grid-cols-3 gap-4 mb-8">
          <div class="gradient-border p-4 text-center stat-card">
            <div class="w-10 h-10 mx-auto mb-2 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <div class="text-2xl font-bold gradient-text">{{ userStore.user?.points || 0 }}</div>
            <div class="text-xs text-gray-400">积分</div>
          </div>
          
          <div class="gradient-border p-4 text-center stat-card">
            <div class="w-10 h-10 mx-auto mb-2 rounded-xl bg-pink-500/20 flex items-center justify-center">
              <svg class="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="text-2xl font-bold">{{ favoritesCount }}</div>
            <div class="text-xs text-gray-400">收藏</div>
          </div>
          
          <div class="gradient-border p-4 text-center stat-card">
            <div class="w-10 h-10 mx-auto mb-2 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="text-2xl font-bold">{{ historyCount }}</div>
            <div class="text-xs text-gray-400">阅读记录</div>
          </div>
        </div>
        
        <!-- 功能菜单 -->
        <div class="gradient-border divide-y divide-purple-500/10">
          <NuxtLink to="/library" class="menu-item flex items-center justify-between p-4 cursor-pointer">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                </svg>
              </div>
              <div>
                <div class="font-medium">我的书架</div>
                <div class="text-xs text-gray-400">管理阅读记录和收藏</div>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
          
          <NuxtLink to="/favorites" class="menu-item flex items-center justify-between p-4 cursor-pointer">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div>
                <div class="font-medium">我的收藏</div>
                <div class="text-xs text-gray-400">收藏的漫画列表</div>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
          
          <NuxtLink to="/history" class="menu-item flex items-center justify-between p-4 cursor-pointer">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <div class="font-medium">阅读历史</div>
                <div class="text-xs text-gray-400">最近阅读的漫画</div>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
        </div>
        
        <!-- 账户设置 -->
        <div class="mt-8">
          <h2 class="text-lg font-bold mb-4 px-1">账户设置</h2>
          <div class="gradient-border divide-y divide-purple-500/10">
            <NuxtLink to="/user/profile" class="menu-item flex items-center justify-between p-4 cursor-pointer">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">编辑资料</div>
                  <div class="text-xs text-gray-400">修改用户名和头像</div>
                </div>
              </div>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
            
            <NuxtLink to="/user/change-password" class="menu-item flex items-center justify-between p-4 cursor-pointer">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                  <svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">修改密码</div>
                  <div class="text-xs text-gray-400">定期修改密码更安全</div>
                </div>
              </div>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
            
            <NuxtLink to="/user/change-email" class="menu-item flex items-center justify-between p-4 cursor-pointer">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                  <svg class="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">修改邮箱</div>
                  <div class="text-xs text-gray-400">更换登录邮箱地址</div>
                </div>
              </div>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
            
            <NuxtLink to="/user/verify-email" class="menu-item flex items-center justify-between p-4 cursor-pointer">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">验证邮箱</div>
                  <div class="text-xs text-gray-400">
                    {{ userStore.user?.email_verified ? '已验证' : '未验证' }}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span 
                  v-if="userStore.user?.email_verified"
                  class="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400"
                >
                  已验证
                </span>
                <span 
                  v-else
                  class="px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-400"
                >
                  未验证
                </span>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </NuxtLink>
          </div>
        </div>
        
        <!-- VIP 卡片 -->
        <div class="mt-8 gradient-border p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-display font-bold text-lg text-amber-400">VIP会员</h3>
              <p v-if="userStore.isVip" class="text-xs text-gray-400">
                有效期至: {{ formatDate(userStore.user?.vip_expire_time) }}
              </p>
              <p v-else class="text-xs text-gray-400">开通VIP畅读全站漫画</p>
            </div>
          </div>
          
          <div v-if="!userStore.isVip" class="flex gap-3">
            <input
              v-model="vipCardNumber"
              type="text"
              placeholder="输入VIP卡号激活"
              class="flex-1 input-field px-4 py-2.5 rounded-lg text-sm"
            />
            <button
              @click="activateVip"
              :disabled="!vipCardNumber || activating"
              class="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-sm hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 transition-colors"
            >
              {{ activating ? '激活中...' : '激活' }}
            </button>
          </div>
        </div>
        
        <!-- 每日签到 -->
        <div class="mt-6 gradient-border p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <div class="font-medium">每日签到</div>
                <div class="text-xs text-gray-400">签到获得10积分</div>
              </div>
            </div>
            <button
              @click="handleCheckin"
              :disabled="checking || checkedIn"
              class="px-6 py-2.5 rounded-full font-medium text-sm transition-all"
              :class="checkedIn 
                ? 'bg-surface-50 text-gray-400 cursor-not-allowed' 
                : 'btn-primary text-white'"
            >
              {{ checkedIn ? '已签到' : '签到' }}
            </button>
          </div>
        </div>
        
        <!-- 退出登录 -->
        <div class="mt-8">
          <button 
            @click="handleLogout"
            class="w-full py-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            退出登录
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const api = useApi()
const userStore = useUserStore()
const router = useRouter()

const vipCardNumber = ref('')
const activating = ref(false)
const checking = ref(false)
const checkedIn = ref(false)
const favoritesCount = ref(0)
const historyCount = ref(0)

const formatDate = (date: string | null | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const activateVip = async () => {
  if (!vipCardNumber.value) return
  
  activating.value = true
  try {
    await api.user.activateVip(vipCardNumber.value)
    alert('VIP激活成功')
    const user = await api.user.profile()
    userStore.updateUser(user)
    vipCardNumber.value = ''
  } catch (error: any) {
    alert(error.data?.detail || '激活失败')
  } finally {
    activating.value = false
  }
}

const handleCheckin = async () => {
  checking.value = true
  try {
    const result = await api.user.checkin()
    checkedIn.value = true
    userStore.updateUser({ points: result.total })
    alert(`签到成功，获得 ${result.points} 积分`)
  } catch (error: any) {
    if (error.data?.detail === '今日已签到') {
      checkedIn.value = true
    }
    alert(error.data?.detail || '签到失败')
  } finally {
    checking.value = false
  }
}

const handleLogout = () => {
  userStore.logout()
  router.push('/')
}

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  try {
    const [favorites, history] = await Promise.all([
      api.library.favorites(1),
      api.library.history(1)
    ])
    favoritesCount.value = favorites.total
    historyCount.value = history.total
  } catch (error) {
    console.error('加载数据失败:', error)
  }
})

useHead({
  title: '个人中心 - ComicVerse',
  meta: [
    { name: 'description', content: '管理您的账户信息、VIP会员和积分记录' }
  ]
})
</script>
