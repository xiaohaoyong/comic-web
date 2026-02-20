<template>
  <div class="min-h-screen bg-surface-400 text-white">
    <!-- 顶部控制栏 -->
    <header 
      class="fixed top-0 left-0 right-0 z-50 transition-transform duration-300"
      :class="showControls ? 'translate-y-0' : '-translate-y-full'"
    >
      <div class="glass-effect">
        <div class="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <!-- 返回按钮 -->
          <button 
            @click="goBack"
            class="p-2 rounded-lg hover:bg-surface-50 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          
          <!-- 标题 -->
          <div class="text-center">
            <div class="font-medium text-sm truncate max-w-[200px]">{{ comicTitle }}</div>
            <div class="text-xs text-gray-400">第 {{ currentChapter }} 话</div>
          </div>
          
          <!-- 设置按钮 -->
          <button 
            @click="showSettings = !showSettings"
            class="p-2 rounded-lg hover:bg-surface-50 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
    
    <!-- 内容区域 -->
    <main 
      class="reader-container pt-14 pb-20"
      @click="toggleControls"
    >
      <slot />
    </main>
    
    <!-- 底部控制栏 -->
    <footer 
      class="fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300"
      :class="showControls ? 'translate-y-0' : 'translate-y-full'"
    >
      <div class="glass-effect">
        <div class="max-w-7xl mx-auto px-4 py-3">
          <!-- 章节导航 -->
          <div class="flex items-center justify-between gap-4">
            <button 
              @click="prevChapter"
              :disabled="!hasPrevChapter"
              class="flex-1 py-2.5 rounded-lg border border-purple-500/30 text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-purple-500/10"
            >
              上一话
            </button>
            
            <div class="flex-1 text-center">
              <select 
                v-model="selectedChapter"
                class="bg-surface-50 border border-purple-500/30 rounded-lg px-4 py-2.5 text-sm w-full"
                @change="changeChapter"
              >
                <option v-for="ch in chapters" :key="ch.id" :value="ch.id">
                  第 {{ ch.chapter_number }} 话
                </option>
              </select>
            </div>
            
            <button 
              @click="nextChapter"
              :disabled="!hasNextChapter"
              class="flex-1 py-2.5 rounded-lg border border-purple-500/30 text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-purple-500/10"
            >
              下一话
            </button>
          </div>
        </div>
      </div>
    </footer>
    
    <!-- 设置面板 -->
    <div 
      v-if="showSettings"
      class="fixed inset-0 z-60"
      @click="showSettings = false"
    >
      <div class="absolute inset-0 bg-black/60"></div>
      <div 
        class="absolute right-0 top-0 bottom-0 w-80 glass-effect"
        @click.stop
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-display font-bold text-lg">阅读设置</h3>
            <button @click="showSettings = false" class="p-2 hover:bg-surface-50 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <!-- 阅读模式 -->
          <div class="mb-6">
            <div class="text-sm text-gray-400 mb-3">阅读模式</div>
            <div class="flex gap-2">
              <button 
                v-for="mode in readModes" 
                :key="mode.value"
                @click="readMode = mode.value"
                class="flex-1 py-2 rounded-lg text-sm border border-purple-500/20 transition-colors"
                :class="readMode === mode.value ? 'bg-purple-500/20 text-purple-300 border-purple-500/50' : 'text-gray-400'"
              >
                {{ mode.label }}
              </button>
            </div>
          </div>
          
          <!-- 亮度 -->
          <div class="mb-6">
            <div class="text-sm text-gray-400 mb-3">亮度</div>
            <input 
              type="range" 
              v-model="brightness" 
              min="30" 
              max="100" 
              class="settings-slider"
            >
          </div>
          
          <!-- 背景色 -->
          <div class="mb-6">
            <div class="text-sm text-gray-400 mb-3">背景色</div>
            <div class="flex gap-3">
              <button 
                v-for="bg in bgColors" 
                :key="bg.value"
                @click="bgColor = bg.value"
                class="w-10 h-10 rounded-lg border-2 transition-all"
                :style="{ backgroundColor: bg.color }"
                :class="bgColor === bg.value ? 'border-purple-500' : 'border-transparent'"
              ></button>
            </div>
          </div>
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
  chapters?: any[]
}>()

const emit = defineEmits<{
  'close': []
  'chapter-change': [chapterId: number]
}>()

const router = useRouter()

const showControls = ref(true)
const showSettings = ref(false)
const selectedChapter = ref(props.chapterId)
const currentChapter = ref(1)

const readMode = ref('scroll')
const brightness = ref(100)
const bgColor = ref('dark')

const readModes = [
  { value: 'scroll', label: '滚动' },
  { value: 'flip', label: '翻页' }
]

const bgColors = [
  { value: 'dark', color: '#0a0a12' },
  { value: 'sepia', color: '#f4ecd8' },
  { value: 'light', color: '#ffffff' },
  { value: 'green', color: '#cce8cf' }
]

const hasPrevChapter = computed(() => {
  if (!props.chapters) return false
  const index = props.chapters.findIndex(ch => ch.id === selectedChapter.value)
  return index > 0
})

const hasNextChapter = computed(() => {
  if (!props.chapters) return false
  const index = props.chapters.findIndex(ch => ch.id === selectedChapter.value)
  return index < props.chapters.length - 1
})

const toggleControls = () => {
  showControls.value = !showControls.value
}

const goBack = () => {
  router.back()
}

const prevChapter = () => {
  if (!props.chapters || !hasPrevChapter.value) return
  const index = props.chapters.findIndex(ch => ch.id === selectedChapter.value)
  if (index > 0) {
    const newChapter = props.chapters[index - 1]
    selectedChapter.value = newChapter.id
    currentChapter.value = newChapter.chapter_number
    emit('chapter-change', newChapter.id)
  }
}

const nextChapter = () => {
  if (!props.chapters || !hasNextChapter.value) return
  const index = props.chapters.findIndex(ch => ch.id === selectedChapter.value)
  if (index < props.chapters.length - 1) {
    const newChapter = props.chapters[index + 1]
    selectedChapter.value = newChapter.id
    currentChapter.value = newChapter.chapter_number
    emit('chapter-change', newChapter.id)
  }
}

const changeChapter = () => {
  const chapter = props.chapters?.find(ch => ch.id === selectedChapter.value)
  if (chapter) {
    currentChapter.value = chapter.chapter_number
    emit('chapter-change', selectedChapter.value)
  }
}

// 初始化当前章节号
onMounted(() => {
  const chapter = props.chapters?.find(ch => ch.id === props.chapterId)
  if (chapter) {
    currentChapter.value = chapter.chapter_number
  }
})
</script>
