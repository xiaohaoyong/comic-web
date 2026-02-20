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
          <h1 class="font-display font-bold text-3xl mb-2">修改邮箱</h1>
          <p class="text-gray-400">更换您的登录邮箱地址</p>
        </div>

        <div class="gradient-border p-8">
          <!-- 当前邮箱 -->
          <div class="mb-6 p-4 rounded-xl bg-surface-50/50">
            <p class="text-sm text-gray-400 mb-1">当前邮箱</p>
            <p class="font-medium">{{ userStore.user?.email }}</p>
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="space-y-5">
              <!-- 新邮箱 -->
              <div>
                <label for="new_email" class="block text-sm font-medium text-gray-300 mb-2">新邮箱地址</label>
                <input
                  id="new_email"
                  v-model="form.new_email"
                  type="email"
                  required
                  autocomplete="email"
                  class="w-full input-field px-4 py-3 rounded-xl"
                  placeholder="请输入新邮箱地址"
                />
              </div>

              <!-- 验证码 -->
              <div>
                <label for="code" class="block text-sm font-medium text-gray-300 mb-2">验证码</label>
                <div class="flex gap-3">
                  <input
                    id="code"
                    v-model="form.code"
                    type="text"
                    required
                    maxlength="6"
                    class="flex-1 input-field px-4 py-3 rounded-xl"
                    placeholder="请输入6位验证码"
                  />
                  <button
                    type="button"
                    @click="sendCode"
                    :disabled="sendingCode || !form.new_email || countdown > 0"
                    class="px-6 py-3 rounded-xl border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                  >
                    <span v-if="countdown > 0">{{ countdown }}s</span>
                    <span v-else-if="sendingCode">发送中...</span>
                    <span v-else>获取验证码</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading || !form.new_email || !form.code"
              class="w-full mt-8 btn-primary py-3.5 rounded-xl font-semibold disabled:opacity-50"
            >
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                修改中...
              </span>
              <span v-else>确认修改</span>
            </button>
          </form>
        </div>

        <!-- 提示信息 -->
        <div class="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div class="flex gap-3">
            <svg class="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div class="text-sm text-amber-200">
              <p class="font-medium mb-1">注意事项</p>
              <ul class="list-disc list-inside text-amber-300/80 space-y-1">
                <li>修改邮箱后需要使用新邮箱登录</li>
                <li>新邮箱必须未在其他账户注册</li>
                <li>验证码有效期为10分钟</li>
              </ul>
            </div>
          </div>
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
  new_email: '',
  code: ''
})

const loading = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)

let countdownTimer: ReturnType<typeof setInterval> | null = null

const sendCode = async () => {
  if (!form.new_email || countdown.value > 0) return

  sendingCode.value = true

  try {
    await api.auth.sendVerifyEmail({
      email: form.new_email,
      type: 'change_email'
    })
    alert('验证码已发送到新邮箱')

    // 开始倒计时
    countdown.value = 60
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        if (countdownTimer) {
          clearInterval(countdownTimer)
          countdownTimer = null
        }
      }
    }, 1000)
  } catch (error: any) {
    alert(error.data?.detail || '发送失败')
  } finally {
    sendingCode.value = false
  }
}

const handleSubmit = async () => {
  if (!form.new_email || !form.code) return

  loading.value = true

  try {
    await api.user.changeEmail({
      new_email: form.new_email,
      code: form.code
    })
    alert('邮箱修改成功，请使用新邮箱登录')
    userStore.logout()
    router.push('/login')
  } catch (error: any) {
    alert(error.data?.detail || '修改失败')
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})

useHead({
  title: '修改邮箱 - ComicVerse',
  meta: [
    { name: 'description', content: '更换您的登录邮箱地址' }
  ]
})
</script>
