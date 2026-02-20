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
          <h1 class="font-display font-bold text-3xl mb-2">修改密码</h1>
          <p class="text-gray-400">定期修改密码可以提高账户安全性</p>
        </div>

        <div class="gradient-border p-8">
          <form @submit.prevent="handleSubmit">
            <div class="space-y-5">
              <!-- 旧密码 -->
              <div>
                <label for="old_password" class="block text-sm font-medium text-gray-300 mb-2">当前密码</label>
                <div class="relative">
                  <input
                    id="old_password"
                    v-model="form.old_password"
                    :type="showOldPassword ? 'text' : 'password'"
                    required
                    autocomplete="current-password"
                    class="w-full input-field px-4 py-3 pr-12 rounded-xl"
                    placeholder="请输入当前密码"
                  />
                  <button
                    type="button"
                    @click="showOldPassword = !showOldPassword"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    <svg v-if="!showOldPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- 新密码 -->
              <div>
                <label for="new_password" class="block text-sm font-medium text-gray-300 mb-2">新密码</label>
                <div class="relative">
                  <input
                    id="new_password"
                    v-model="form.new_password"
                    :type="showNewPassword ? 'text' : 'password'"
                    required
                    autocomplete="new-password"
                    class="w-full input-field px-4 py-3 pr-12 rounded-xl"
                    placeholder="至少8位，需包含字母和数字"
                    @input="checkPasswordStrength"
                  />
                  <button
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    <svg v-if="!showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
                <!-- 密码强度指示器 -->
                <div class="mt-2">
                  <div class="flex gap-1 mb-1">
                    <div
                      v-for="i in 4"
                      :key="i"
                      class="h-1 flex-1 rounded-full transition-colors"
                      :class="passwordStrength >= i ? getStrengthColor(passwordStrength) : 'bg-surface-50'"
                    ></div>
                  </div>
                  <p class="text-xs" :class="passwordStrength >= 3 ? 'text-green-400' : 'text-gray-500'">
                    {{ passwordStrengthText }}
                  </p>
                </div>
              </div>

              <!-- 确认新密码 -->
              <div>
                <label for="confirm_password" class="block text-sm font-medium text-gray-300 mb-2">确认新密码</label>
                <div class="relative">
                  <input
                    id="confirm_password"
                    v-model="form.confirm_password"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    required
                    autocomplete="new-password"
                    class="w-full input-field px-4 py-3 pr-12 rounded-xl"
                    placeholder="请再次输入新密码"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
                <p v-if="form.confirm_password && form.new_password !== form.confirm_password" class="text-xs text-red-400 mt-1">
                  两次输入的密码不一致
                </p>
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading || !isFormValid"
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
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const api = useApi()
const router = useRouter()

const form = reactive({
  old_password: '',
  new_password: '',
  confirm_password: ''
})

const loading = ref(false)
const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const passwordStrength = ref(0)

const checkPasswordStrength = () => {
  const password = form.new_password
  let strength = 0

  if (password.length >= 8) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++

  passwordStrength.value = strength
}

const getStrengthColor = (strength: number) => {
  if (strength <= 1) return 'bg-red-500'
  if (strength === 2) return 'bg-yellow-500'
  if (strength === 3) return 'bg-blue-500'
  return 'bg-green-500'
}

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (!form.new_password) return '请输入密码'
  if (strength <= 1) return '密码强度：弱'
  if (strength === 2) return '密码强度：中等'
  if (strength === 3) return '密码强度：强'
  return '密码强度：非常强'
})

const isFormValid = computed(() => {
  const hasLetter = /[a-zA-Z]/.test(form.new_password)
  const hasNumber = /\d/.test(form.new_password)
  const isLongEnough = form.new_password.length >= 8

  return (
    form.old_password &&
    form.new_password &&
    form.confirm_password &&
    form.new_password === form.confirm_password &&
    hasLetter &&
    hasNumber &&
    isLongEnough
  )
})

const handleSubmit = async () => {
  if (!isFormValid.value) return

  loading.value = true

  try {
    await api.user.changePassword({
      old_password: form.old_password,
      new_password: form.new_password
    })
    alert('密码修改成功，请重新登录')
    const userStore = useUserStore()
    userStore.logout()
    router.push('/login')
  } catch (error: any) {
    alert(error.data?.detail || '修改失败')
  } finally {
    loading.value = false
  }
}

useHead({
  title: '修改密码 - ComicVerse',
  meta: [
    { name: 'description', content: '修改您的账户密码' }
  ]
})
</script>
