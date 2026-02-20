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
          <h1 class="font-display font-bold text-3xl mb-2">验证邮箱</h1>
          <p class="text-gray-400">验证邮箱后可享受更多功能</p>
        </div>

        <div class="gradient-border p-8">
          <!-- 当前邮箱状态 -->
          <div class="mb-6 p-4 rounded-xl bg-surface-50/50">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-400 mb-1">当前邮箱</p>
                <p class="font-medium">{{ userStore.user?.email }}</p>
              </div>
              <div v-if="userStore.user?.email_verified" class="flex items-center gap-2 text-green-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm font-medium">已验证</span>
              </div>
              <div v-else class="flex items-center gap-2 text-amber-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm font-medium">未验证</span>
              </div>
            </div>
          </div>

          <!-- 已验证状态 -->
          <div v-if="userStore.user?.email_verified" class="text-center py-8">
            <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg class="w-10 h-10 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-green-400 mb-2">邮箱已验证</h3>
            <p class="text-gray-400">您的邮箱已完成验证，可以正常使用所有功能</p>
          </div>

          <!-- 未验证状态 - 显示验证表单 -->
          <form v-else @submit.prevent="handleSubmit">
            <div class="space-y-5">
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
                    :disabled="sendingCode || countdown > 0"
                    class="px-6 py-3 rounded-xl border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                  >
                    <span v-if="countdown > 0">{{ countdown }}s</span>
                    <span v-else-if="sendingCode">发送中...</span>
                    <span v-else>获取验证码</span>
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-2">验证码将发送至 {{ userStore.user?.email }}</p>
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading || !form.code"
              class="w-full mt-8 btn-primary py-3.5 rounded-xl font-semibold disabled:opacity-50"
            >
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                验证中...
              </span>
              <span v-else>确认验证</span>
            </button>
          </form>
        </div>

        <!-- 验证好处 -->
        <div v-if="!userStore.user?.email_verified" class="mt-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <div class="flex gap-3">
            <svg class="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div class="text-sm text-purple-200">
              <p class="font-medium mb-2">验证邮箱的好处</p>
              <ul class="list-disc list-inside text-purple-300/80 space-y-1">
                <li>找回密码时可通过邮箱验证</li>
                <li>接收重要通知和更新</li>
                <li>提高账户安全性</li>
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

const form = reactive({
  code: ''
})

const loading = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)

let countdownTimer: ReturnType<typeof setInterval> | null = null

const sendCode = async () => {
  if (countdown.value > 0 || !userStore.user?.email) return

  sendingCode.value = true

  try {
    await api.auth.sendVerifyEmail({
      email: userStore.user.email,
      type: 'verify'
    })
    alert('验证码已发送到您的邮箱')

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
  if (!form.code || !userStore.user?.email) return

  loading.value = true

  try {
    await api.auth.verifyEmail({
      email: userStore.user.email,
      code: form.code
    })
    // 更新用户状态
    userStore.updateUser({ email_verified: true })
    alert('邮箱验证成功')
  } catch (error: any) {
    alert(error.data?.detail || '验证失败')
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
  title: '验证邮箱 - ComicVerse',
  meta: [
    { name: 'description', content: '验证您的邮箱地址' }
  ]
})
</script>
