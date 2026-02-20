<template>
  <div>
    <Header />

    <main class="pt-20 pb-12">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 返回按钮 -->
        <NuxtLink to="/user" class="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          返回个人中心
        </NuxtLink>

        <div class="text-center mb-8">
          <h1 class="font-display font-bold text-3xl mb-2">编辑资料</h1>
          <p class="text-gray-400">修改您的用户名和头像</p>
        </div>

        <div class="gradient-border p-8">
          <form @submit.prevent="handleSubmit">
            <div class="space-y-6">
              <!-- 头像预览 -->
              <div class="flex flex-col items-center">
                <div class="relative mb-4">
                  <img
                    :src="form.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.username || 'comic'}`"
                    alt="头像预览"
                    class="w-24 h-24 rounded-full border-4 border-purple-500/30"
                  >
                </div>
                <p class="text-xs text-gray-400">头像将根据URL自动更新</p>
              </div>

              <!-- 用户名 -->
              <div>
                <label for="username" class="block text-sm font-medium text-gray-300 mb-2">用户名</label>
                <input
                  id="username"
                  v-model="form.username"
                  type="text"
                  required
                  minlength="2"
                  maxlength="50"
                  class="w-full input-field px-4 py-3 rounded-xl"
                  placeholder="请输入用户名"
                />
                <p class="text-xs text-gray-500 mt-1">2-50个字符</p>
              </div>

              <!-- 头像URL -->
              <div>
                <label for="avatar_url" class="block text-sm font-medium text-gray-300 mb-2">头像URL</label>
                <input
                  id="avatar_url"
                  v-model="form.avatar_url"
                  type="url"
                  class="w-full input-field px-4 py-3 rounded-xl"
                  placeholder="https://example.com/avatar.png"
                />
                <p class="text-xs text-gray-500 mt-1">留空则使用默认头像</p>
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full mt-8 btn-primary py-3.5 rounded-xl font-semibold"
            >
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                保存中...
              </span>
              <span v-else>保存修改</span>
            </button>
          </form>
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

const form = reactive({
  username: '',
  avatar_url: ''
})

const loading = ref(false)

// 初始化表单数据
onMounted(() => {
  if (userStore.user) {
    form.username = userStore.user.username || ''
    form.avatar_url = userStore.user.avatar || ''
  }
})

const handleSubmit = async () => {
  loading.value = true

  try {
    const user = await api.user.updateProfile({
      username: form.username,
      avatar_url: form.avatar_url || undefined
    })
    userStore.updateUser(user)
    alert('资料更新成功')
    router.push('/user')
  } catch (error: any) {
    alert(error.data?.detail || '更新失败')
  } finally {
    loading.value = false
  }
}

useHead({
  title: '编辑资料 - ComicVerse',
  meta: [
    { name: 'description', content: '修改您的用户名和头像' }
  ]
})
</script>
