<template>
  <div>
    <Header />
    
    <main class="pt-20 pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-6">
          <div class="text-sm text-gray-400">共 <span class="text-purple-400 font-medium">{{ total }}</span> 条阅读记录</div>
          <button 
            @click="clearHistory"
            class="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            <span class="text-sm">清空历史</span>
          </button>
        </div>

        <div v-if="loading" class="flex justify-center py-20">
          <div class="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-else-if="historyItems.length === 0" class="text-center py-20">
          <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-gray-400 mb-4">暂无阅读记录</p>
          <NuxtLink to="/comics" class="text-purple-400 hover:text-purple-300">去发现漫画</NuxtLink>
        </div>

        <template v-else>
          <section v-for="group in groupedHistory" :key="group.label" class="mb-8">
            <h2 class="text-sm text-gray-400 mb-4 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              {{ group.label }}
            </h2>
            <div class="space-y-3">
              <NuxtLink 
                v-for="item in group.items" 
                :key="item.comic.id"
                :to="`/reader/${item.comic.id}/${item.last_chapter_id}`"
                class="history-item flex items-center gap-4 p-4 rounded-xl border border-gray-800 hover:border-purple-500/30"
              >
                <img 
                  :src="item.comic.cover_url || `https://picsum.photos/seed/hist${item.comic.id}/100/140`" 
                  :alt="item.comic.title" 
                  class="w-16 h-22 rounded-lg object-cover flex-shrink-0"
                >
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-medium truncate">{{ item.comic.title }}</h3>
                    <span v-if="item.comic.free_chapters_count < item.comic.chapter_count" class="px-2 py-0.5 bg-pink-500/20 border border-pink-500/30 rounded text-xs text-pink-300">VIP</span>
                    <span v-else class="px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-300">免费</span>
                  </div>
                  <p class="text-sm text-gray-400 mb-2">阅读至 第{{ getChapterNumber(item.last_chapter_id, item.comic.chapter_count) }}话</p>
                  <div class="flex items-center gap-4 text-xs text-gray-500">
                    <span class="flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {{ formatTime(item.last_read_at) }}
                    </span>
                    <span>阅读进度 {{ item.progress_percent }}%</span>
                  </div>
                  <div class="mt-2 flex items-center gap-2">
                    <div class="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
                        :style="{ width: `${item.progress_percent}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
                <div class="text-right hidden sm:block">
                  <span class="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-medium">继续阅读</span>
                </div>
              </NuxtLink>
            </div>
          </section>
        </template>

        <div v-if="totalPages > 1" class="flex justify-center mt-10 gap-2">
          <button 
            @click="changePage(page - 1)"
            :disabled="page <= 1"
            class="px-4 py-2 rounded-lg border border-purple-500/30 hover:bg-purple-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span class="px-4 py-2 text-gray-400">{{ page }} / {{ totalPages }}</span>
          <button 
            @click="changePage(page + 1)"
            :disabled="page >= totalPages"
            class="px-4 py-2 rounded-lg border border-purple-500/30 hover:bg-purple-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      </div>
    </main>
    
    <MobileNav />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const api = useApi()

interface HistoryItem {
  comic: any
  last_chapter_id: number
  progress_percent: number
  last_read_at: string
}

const historyItems = ref<HistoryItem[]>([])
const loading = ref(true)
const total = ref(0)
const page = ref(1)
const totalPages = ref(1)

const loadHistory = async () => {
  loading.value = true
  try {
    const data = await api.library.history(page.value)
    historyItems.value = data.items
    total.value = data.total
    totalPages.value = data.total_pages
  } catch (e) {
    console.error('加载历史失败', e)
  } finally {
    loading.value = false
  }
}

const clearHistory = async () => {
  if (!confirm('确定要清空所有阅读历史吗？')) return
  
  try {
    await api.library.clearHistory()
    historyItems.value = []
    total.value = 0
  } catch (e) {
    console.error('清空历史失败', e)
  }
}

const changePage = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage
    loadHistory()
  }
}

const formatTime = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  return date.toLocaleDateString()
}

const getChapterNumber = (chapterId: number, totalChapters: number) => {
  return chapterId || 1
}

const groupedHistory = computed(() => {
  const groups: { label: string; items: HistoryItem[] }[] = []
  const today: HistoryItem[] = []
  const yesterday: HistoryItem[] = []
  const earlier: HistoryItem[] = []
  
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart.getTime() - 86400000)
  
  for (const item of historyItems.value) {
    const date = new Date(item.last_read_at)
    if (date >= todayStart) {
      today.push(item)
    } else if (date >= yesterdayStart) {
      yesterday.push(item)
    } else {
      earlier.push(item)
    }
  }
  
  if (today.length) groups.push({ label: '今天', items: today })
  if (yesterday.length) groups.push({ label: '昨天', items: yesterday })
  if (earlier.length) groups.push({ label: '更早', items: earlier })
  
  return groups
})

onMounted(() => {
  loadHistory()
})

useHead({
  title: '阅读历史 - ComicVerse'
})
</script>

<style scoped>
.history-item {
  transition: all 0.3s;
}
.history-item:hover {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1));
}
</style>
