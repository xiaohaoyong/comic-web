<template>
  <div class="bg-black min-h-screen">
    <!-- 顶部控制栏 -->
    <header ref="headerRef" class="fixed top-0 left-0 right-0 z-50 glass-effect transform transition-transform duration-300" :class="controlsVisible ? '' : '-translate-y-full'">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <NuxtLink :to="`/comics/${comicId}`" class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          <span class="text-sm hidden sm:inline">返回详情</span>
        </NuxtLink>
        <div class="text-center">
          <div class="font-medium text-sm">{{ comicTitle }}</div>
          <div class="text-xs text-gray-400">第{{ currentChapter?.chapter_number || 1 }}话</div>
        </div>
        <div class="flex items-center gap-2">
          <button @click.stop="showSettings = !showSettings" class="control-btn p-2 rounded-lg">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </button>
          <button @click.stop="showChapters = !showChapters" class="control-btn p-2 rounded-lg">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
          </button>
        </div>
      </div>
      <!-- 进度条 -->
      <div class="h-1 bg-gray-800">
        <div class="progress-bar h-full transition-all" :style="{ width: `${readProgress}%` }"></div>
      </div>
    </header>

    <!-- 漫画内容 -->
    <main class="reader-container pt-16 pb-20" @click="toggleControls">
      <div v-if="loading" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <div class="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-400">加载中...</p>
        </div>
      </div>
      
      <div v-else class="comic-images">
        <img
          v-for="(url, index) in imageUrls"
          :key="index"
          :src="url"
          :alt="`Page ${index + 1}`"
          class="w-full h-auto"
          loading="lazy"
          @load="handleImageLoad(index)"
        >
      </div>
      
      <!-- 章节结束提示 -->
      <div v-if="!loading && imageUrls.length > 0" class="w-full max-w-800px mx-auto px-4 py-12 text-center">
        <div class="gradient-text font-display font-bold text-2xl mb-4">第{{ currentChapter?.chapter_number || 1 }}话 完</div>
        <p class="text-gray-400 text-sm mb-6">感谢阅读！请继续阅读下一话</p>
        <div class="flex justify-center gap-4">
          <NuxtLink :to="`/comics/${comicId}`" class="px-6 py-2.5 rounded-full border border-purple-500/30 hover:bg-purple-500/10 transition-colors text-sm">
            返回目录
          </NuxtLink>
          <button v-if="nextChapterId" @click="goToNextChapter" class="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-medium">
            下一话
          </button>
        </div>
      </div>
    </main>

    <!-- 底部控制栏 -->
    <footer ref="footerRef" class="fixed bottom-0 left-0 right-0 z-50 glass-effect transform transition-transform duration-300" :class="controlsVisible ? '' : 'translate-y-full'">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs text-gray-400">第{{ currentChapter?.chapter_number || 1 }}话 / 共{{ totalChapters }}话</span>
          <span class="text-xs text-gray-400">阅读进度 {{ readProgress }}%</span>
        </div>
        <div class="flex items-center justify-between gap-4">
          <button @click="goToPrevChapter" :disabled="!prevChapterId" class="control-btn flex-1 py-2.5 rounded-lg border border-gray-700 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            <span class="hidden sm:inline">上一话</span>
          </button>
          <button @click="goToNextChapter" :disabled="!nextChapterId" class="control-btn flex-1 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            <span class="hidden sm:inline">下一话</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </footer>

    <!-- 章节列表侧边栏 -->
    <div class="fixed inset-y-0 right-0 w-80 max-w-full z-50 transform transition-transform duration-300" :class="showChapters ? 'translate-x-0' : 'translate-x-full'">
      <div class="h-full glass-effect border-l border-purple-500/10 flex flex-col">
        <div class="p-4 border-b border-gray-800 flex items-center justify-between">
          <h3 class="font-medium">章节列表</h3>
          <button @click="showChapters = false" class="p-1 rounded hover:bg-surface-50">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto scrollbar-hide p-4">
          <div class="space-y-2">
            <NuxtLink
              v-for="ch in chapters"
              :key="ch.id"
              :to="`/reader/${comicId}/${ch.id}`"
              class="chapter-item block p-3 rounded-lg border"
              :class="ch.id === chapterId ? 'border-purple-500/30 bg-purple-500/10' : 'border-gray-700'"
            >
              <div class="flex items-center justify-between">
                <span class="font-medium text-sm">第{{ ch.chapter_number }}话</span>
                <span class="text-xs" :class="ch.is_free ? 'text-green-400' : 'text-amber-400'">
                  {{ ch.is_free ? '免费' : `${ch.points_required || 10}积分` }}
                </span>
              </div>
              <div class="text-xs text-gray-400 mt-1">{{ ch.title || `第${ch.chapter_number}话` }}</div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置面板 -->
    <div class="fixed inset-y-0 left-0 w-80 max-w-full z-50 transform transition-transform duration-300" :class="showSettings ? 'translate-x-0' : '-translate-x-full'">
      <div class="h-full glass-effect border-r border-purple-500/10 flex flex-col">
        <div class="p-4 border-b border-gray-800 flex items-center justify-between">
          <h3 class="font-medium">阅读设置</h3>
          <button @click="showSettings = false" class="p-1 rounded hover:bg-surface-50">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-6">
          <!-- 亮度调节 -->
          <div>
            <label class="block text-sm text-gray-400 mb-3">亮度调节</label>
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              <input type="range" v-model="brightness" class="settings-slider flex-1" min="0" max="100">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            </div>
          </div>
          
          <!-- 阅读模式 -->
          <div>
            <label class="block text-sm text-gray-400 mb-3">阅读模式</label>
            <div class="grid grid-cols-2 gap-2">
              <button @click="readMode = 'scroll'" class="p-3 rounded-lg border text-sm" :class="readMode === 'scroll' ? 'border-purple-500/30 bg-purple-500/10' : 'border-gray-700 text-gray-400'">
                竖向滚动
              </button>
              <button @click="readMode = 'flip'" class="p-3 rounded-lg border text-sm" :class="readMode === 'flip' ? 'border-purple-500/30 bg-purple-500/10' : 'border-gray-700 text-gray-400'">
                左右翻页
              </button>
            </div>
          </div>
          
          <!-- 背景颜色 -->
          <div>
            <label class="block text-sm text-gray-400 mb-3">背景颜色</label>
            <div class="flex gap-3">
              <button @click="bgColor = 'black'" class="w-10 h-10 rounded-lg bg-black" :class="bgColor === 'black' ? 'border-2 border-purple-500' : 'border border-gray-700'"></button>
              <button @click="bgColor = 'gray-900'" class="w-10 h-10 rounded-lg bg-gray-900 border" :class="bgColor === 'gray-900' ? 'border-purple-500' : 'border-gray-700'"></button>
              <button @click="bgColor = 'amber-50'" class="w-10 h-10 rounded-lg bg-amber-50 border" :class="bgColor === 'amber-50' ? 'border-purple-500' : 'border-gray-700'"></button>
              <button @click="bgColor = 'green-50'" class="w-10 h-10 rounded-lg bg-green-50 border" :class="bgColor === 'green-50' ? 'border-purple-500' : 'border-gray-700'"></button>
            </div>
          </div>
          
          <!-- 自动翻页 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="text-sm text-gray-400">自动翻页</label>
              <button @click="autoScroll = !autoScroll" class="w-12 h-6 rounded-full relative transition-colors" :class="autoScroll ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-surface-50 border border-gray-700'">
                <div class="w-5 h-5 rounded-full absolute top-0.5 transition-transform" :class="autoScroll ? 'bg-white right-0.5' : 'bg-gray-500 left-0.5'"></div>
              </button>
            </div>
          </div>
          
          <!-- 预加载 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="text-sm text-gray-400">预加载下一话</label>
              <button @click="preload = !preload" class="w-12 h-6 rounded-full relative transition-colors" :class="preload ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-surface-50 border border-gray-700'">
                <div class="w-5 h-5 rounded-full absolute top-0.5 transition-transform" :class="preload ? 'bg-white right-0.5' : 'bg-gray-500 left-0.5'"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 解锁弹窗 -->
    <div v-if="showUnlockModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
      <div class="bg-surface-50 rounded-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-semibold mb-4">解锁章节</h3>
        <p class="text-gray-400 mb-4">
          此章节需要 <span class="text-amber-400 font-semibold">{{ pointsRequired }}</span> 积分解锁
        </p>
        <p class="text-gray-400 mb-6">
          当前积分: <span class="text-white font-semibold">{{ userPoints }}</span>
        </p>
        <div class="flex space-x-3">
          <button @click="showUnlockModal = false" class="flex-1 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
            取消
          </button>
          <button @click="handleUnlock" :disabled="userPoints < pointsRequired" class="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors">
            确认解锁
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const route = useRoute()
const router = useRouter()
const api = useApi()
const userStore = useUserStore()

const comicId = computed(() => Number(route.params.comicId))
const chapterId = computed(() => Number(route.params.chapterId))

const loading = ref(true)
const controlsVisible = ref(true)
const showChapters = ref(false)
const showSettings = ref(false)
const showUnlockModal = ref(false)

const comicTitle = ref('')
const imageUrls = ref<string[]>([])
const chapters = ref<any[]>([])
const currentChapter = ref<any>(null)
const prevChapterId = ref<number | null>(null)
const nextChapterId = ref<number | null>(null)
const totalChapters = ref(0)
const readProgress = ref(0)
const pointsRequired = ref(0)
const userPoints = ref(0)

const brightness = ref(80)
const readMode = ref('scroll')
const bgColor = ref('black')
const autoScroll = ref(false)
const preload = ref(true)

let scrollInterval: ReturnType<typeof setInterval> | null = null

const loadChapter = async () => {
  loading.value = true
  console.log('Loading chapter:', chapterId.value)
  
  try {
    const access = await api.chapters.access(chapterId.value)
    console.log('Access result:', access)
    
    if (!access.can_read) {
      if (access.reason === 'points_required') {
        pointsRequired.value = access.points_needed!
        userPoints.value = access.user_points!
        showUnlockModal.value = true
        loading.value = false
        return
      }
      router.push('/login')
      return
    }

    const chapter = await api.chapters.get(chapterId.value)
    console.log('Chapter data:', chapter)
    console.log('Image URLs:', chapter.image_urls)
    imageUrls.value = chapter.image_urls || []
    prevChapterId.value = chapter.prev_chapter_id
    nextChapterId.value = chapter.next_chapter_id
    currentChapter.value = chapter
    
    window.scrollTo(0, 0)
  } catch (error) {
    console.error('加载章节失败:', error)
  } finally {
    loading.value = false
    console.log('Loading done, imageUrls:', imageUrls.value.length)
  }
}

const loadChapters = async () => {
  try {
    const data = await api.comics.chapters(comicId.value)
    chapters.value = data
    totalChapters.value = data.length
  } catch (error) {
    console.error('加载章节列表失败:', error)
  }
}

const loadComicInfo = async () => {
  try {
    const comic = await api.comics.get(comicId.value)
    comicTitle.value = comic.title
  } catch (error) {
    console.error('加载漫画信息失败:', error)
  }
}

const toggleControls = () => {
  controlsVisible.value = !controlsVisible.value
}

const handleImageLoad = () => {
  updateProgress()
}

const updateProgress = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  readProgress.value = Math.min(100, Math.round((scrollTop / docHeight) * 100))
}

const saveProgress = () => {
  if (readProgress.value > 0) {
    api.chapters.saveProgress(chapterId.value, readProgress.value)
  }
}

const goToPrevChapter = () => {
  if (prevChapterId.value) {
    saveProgress()
    router.push(`/reader/${comicId.value}/${prevChapterId.value}`)
  }
}

const goToNextChapter = () => {
  if (nextChapterId.value) {
    saveProgress()
    router.push(`/reader/${comicId.value}/${nextChapterId.value}`)
  }
}

const handleUnlock = async () => {
  try {
    const result = await api.chapters.unlock(chapterId.value)
    showUnlockModal.value = false
    if (userStore.user) {
      userStore.user.points = result.remaining_points
    }
    await loadChapter()
  } catch (error) {
    console.error('解锁失败:', error)
  }
}

watch(autoScroll, (val) => {
  if (val) {
    scrollInterval = setInterval(() => {
      window.scrollBy(0, 1)
      updateProgress()
    }, 16)
  } else {
    if (scrollInterval) {
      clearInterval(scrollInterval)
      scrollInterval = null
    }
  }
})

watch(() => chapterId.value, () => {
  loadChapter()
})

onMounted(async () => {
  await Promise.all([loadChapter(), loadChapters(), loadComicInfo()])
  window.addEventListener('scroll', updateProgress)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
  if (scrollInterval) {
    clearInterval(scrollInterval)
  }
  saveProgress()
})

useHead({
  title: `${comicTitle.value} - 第${currentChapter.value?.chapter_number || 1}话 - ComicVerse`,
  meta: [
    { name: 'description', content: `阅读${comicTitle.value}漫画` }
  ]
})
</script>

<style scoped>
.reader-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.comic-images {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

.comic-images img {
  width: 100%;
  height: auto;
  display: block;
}

.control-btn {
  transition: all 0.3s;
}

.control-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3));
}

.progress-bar {
  background: linear-gradient(90deg, #7c3aed 0%, #ec4899 100%);
}

.chapter-item {
  transition: all 0.3s;
}

.chapter-item:hover,
.chapter-item.active {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2));
}

.settings-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #374151;
  outline: none;
}

.settings-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #ec4899);
  cursor: pointer;
}

.settings-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #ec4899);
  cursor: pointer;
  border: none;
}
</style>
