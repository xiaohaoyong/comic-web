<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <div class="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-14">
          <div class="flex items-center space-x-4">
            <button 
              @click="handleClose" 
              class="p-2 hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="关闭阅读器"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            <div>
              <h1 class="font-semibold">{{ comicTitle }}</h1>
              <p class="text-sm text-gray-400">第 {{ currentChapter }} 话</p>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <button
              v-if="prevChapterId"
              @click="handlePrevChapter"
              class="px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              上一话
            </button>
            <label for="chapter-select" class="sr-only">选择章节</label>
            <select
              id="chapter-select"
              v-model="selectedChapter"
              class="px-3 py-1.5 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              @change="handleChapterChange"
            >
              <option v-for="ch in chapters" :key="ch.id" :value="ch.chapter_number">
                第 {{ ch.chapter_number }} 话
              </option>
            </select>
            <button
              v-if="nextChapterId"
              @click="handleNextChapter"
              class="px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              下一话
            </button>
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="toggleAutoScroll"
              :class="[
                'px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary',
                isAutoScrolling ? 'bg-primary' : 'bg-gray-800 hover:bg-gray-700'
              ]"
              :aria-pressed="isAutoScrolling"
            >
              {{ isAutoScrolling ? '停止滚动' : '自动滚动' }}
            </button>
            <label for="scroll-speed" class="sr-only">滚动速度</label>
            <select 
              id="scroll-speed"
              v-model="scrollSpeed" 
              class="px-3 py-1.5 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="slow">慢速</option>
              <option value="medium">中速</option>
              <option value="fast">快速</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div ref="containerRef" class="pt-14 pb-20" role="main" :aria-label="`${comicTitle} 第${currentChapter}话`">
      <div class="max-w-3xl mx-auto">
        <img
          v-for="(url, index) in imageUrls"
          :key="index"
          :src="url"
          :alt="`第${index + 1}页`"
          class="w-full"
          width="800"
          height="1200"
          loading="lazy"
          style="aspect-ratio: 2/3"
          @load="handleImageLoad(index)"
        />
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-400" role="status" aria-live="polite">阅读进度: {{ readProgress }}%</span>
          </div>
          <div class="flex items-center space-x-2">
            <button
              v-if="prevChapterId"
              @click="handlePrevChapter"
              class="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              上一话
            </button>
            <button
              v-if="nextChapterId"
              @click="handleNextChapter"
              class="px-4 py-2 bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              下一话
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showUnlockModal"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unlock-modal-title"
    >
      <div class="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <h3 id="unlock-modal-title" class="text-xl font-semibold mb-4">解锁章节</h3>
        <p class="text-gray-400 mb-4">
          此章节需要 <span class="text-primary font-semibold">{{ pointsRequired }}</span> 积分解锁
        </p>
        <p class="text-gray-400 mb-6">
          当前积分: <span class="text-white font-semibold">{{ userPoints }}</span>
        </p>
        <div class="flex space-x-3">
          <button
            @click="showUnlockModal = false"
            class="flex-1 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            取消
          </button>
          <button
            @click="handleUnlock"
            :disabled="userPoints < pointsRequired"
            class="flex-1 px-4 py-2 bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            确认解锁
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  comicId: number
  comicTitle: string
  chapterId: number
}>()

const emit = defineEmits<{
  close: []
  chapterChange: [chapterId: number]
}>()

const api = useApi()
const userStore = useUserStore()

const containerRef = ref<HTMLElement | null>(null)
const imageUrls = ref<string[]>([])
const chapters = ref<any[]>([])
const currentChapter = ref(1)
const selectedChapter = ref(1)
const prevChapterId = ref<number | null>(null)
const nextChapterId = ref<number | null>(null)
const readProgress = ref(0)
const isAutoScrolling = ref(false)
const scrollSpeed = ref<'slow' | 'medium' | 'fast'>('medium')
const showUnlockModal = ref(false)
const pointsRequired = ref(0)
const userPoints = ref(0)

let scrollInterval: ReturnType<typeof setInterval> | null = null

const speedMap = {
  slow: 0.5,
  medium: 1,
  fast: 2
}

const loadChapter = async (chapterId: number) => {
  try {
    const access = await api.chapters.access(chapterId)
    
    if (!access.can_read) {
      if (access.reason === 'points_required') {
        pointsRequired.value = access.points_required!
        userPoints.value = access.user_points!
        showUnlockModal.value = true
        return
      }
      navigateTo('/login')
      return
    }

    const chapter = await api.chapters.get(chapterId)
    imageUrls.value = chapter.image_urls
    prevChapterId.value = chapter.prev_chapter_id
    nextChapterId.value = chapter.next_chapter_id
    currentChapter.value = chapter.chapter_number
    selectedChapter.value = chapter.chapter_number

    window.scrollTo(0, 0)
  } catch (error) {
    console.error('加载章节失败:', error)
  }
}

const loadChapters = async () => {
  try {
    chapters.value = await api.comics.chapters(props.comicId)
  } catch (error) {
    console.error('加载章节列表失败:', error)
  }
}

const handleImageLoad = (index: number) => {
  updateProgress()
}

const updateProgress = () => {
  if (!containerRef.value) return
  
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  readProgress.value = Math.min(100, Math.round((scrollTop / docHeight) * 100))
}

const saveProgress = () => {
  if (readProgress.value > 0) {
    api.chapters.saveProgress(props.chapterId, readProgress.value)
  }
}

const toggleAutoScroll = () => {
  isAutoScrolling.value = !isAutoScrolling.value
  
  if (isAutoScrolling.value) {
    scrollInterval = setInterval(() => {
      window.scrollBy(0, speedMap[scrollSpeed.value])
      updateProgress()
    }, 16)
  } else {
    if (scrollInterval) {
      clearInterval(scrollInterval)
      scrollInterval = null
    }
  }
}

const handlePrevChapter = () => {
  if (prevChapterId.value) {
    saveProgress()
    emit('chapterChange', prevChapterId.value)
  }
}

const handleNextChapter = () => {
  if (nextChapterId.value) {
    saveProgress()
    emit('chapterChange', nextChapterId.value)
  }
}

const handleChapterChange = () => {
  const chapter = chapters.value.find(c => c.chapter_number === selectedChapter.value)
  if (chapter) {
    saveProgress()
    emit('chapterChange', chapter.id)
  }
}

const handleClose = () => {
  saveProgress()
  if (scrollInterval) {
    clearInterval(scrollInterval)
  }
  emit('close')
}

const handleUnlock = async () => {
  try {
    await api.chapters.unlock(props.chapterId)
    showUnlockModal.value = false
    await loadChapter(props.chapterId)
  } catch (error) {
    console.error('解锁失败:', error)
  }
}

watch(() => props.chapterId, (newId) => {
  loadChapter(newId)
})

watch(scrollSpeed, () => {
  if (isAutoScrolling.value) {
    toggleAutoScroll()
    toggleAutoScroll()
  }
})

onMounted(() => {
  loadChapter(props.chapterId)
  loadChapters()
  window.addEventListener('scroll', updateProgress)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
  if (scrollInterval) {
    clearInterval(scrollInterval)
  }
  saveProgress()
})
</script>
