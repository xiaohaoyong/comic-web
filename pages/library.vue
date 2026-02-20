<template>
  <div>
    <Header />

    <main class="pt-20 pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 页面标题 -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="font-display font-bold text-2xl md:text-3xl mb-2">我的书架</h1>
            <p class="text-gray-400 text-sm">共收藏 {{ favoritesData?.total || 0 }} 部漫画</p>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="viewMode = 'list'"
              class="p-2 rounded-lg border transition-colors"
              :class="viewMode === 'list' ? 'border-purple-500/50 bg-surface-50' : 'border-gray-700 hover:border-purple-500/50'"
            >
              <svg class="w-5 h-5" :class="viewMode === 'list' ? 'text-purple-400' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
            </button>
            <button
              @click="viewMode = 'grid'"
              class="p-2 rounded-lg border transition-colors"
              :class="viewMode === 'grid' ? 'border-purple-500/50 bg-surface-50' : 'border-gray-700 hover:border-purple-500/50'"
            >
              <svg class="w-5 h-5" :class="viewMode === 'grid' ? 'text-purple-400' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 标签切换 -->
        <div class="flex gap-3 mb-8 overflow-x-auto scrollbar-hide pb-2">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            class="tab-btn px-5 py-2.5 rounded-full border text-sm font-medium whitespace-nowrap transition-all"
            :class="activeTab === tab.value
              ? 'active border-purple-500/30 bg-gradient-to-r from-purple-500/30 to-pink-500/30'
              : 'border-gray-700 text-gray-400 hover:border-purple-500/30'"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- 继续阅读 -->
        <section v-if="activeTab === 'all' && recentHistory.length > 0" class="mb-10">
          <div class="flex items-center justify-between mb-5">
            <h2 class="font-display font-bold text-lg">继续阅读</h2>
            <NuxtLink to="/history" class="text-sm text-purple-400 hover:text-purple-300">查看全部</NuxtLink>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <NuxtLink
              v-for="item in recentHistory"
              :key="item.comic.id"
              :to="getReaderLink(item)"
              class="gradient-border p-4 flex gap-4 hover:scale-[1.02] transition-transform"
            >
              <img
                :src="item.comic.cover_url || '/images/placeholder.jpg'"
                :alt="item.comic.title"
                class="w-20 h-28 rounded-lg object-cover flex-shrink-0"
              >
              <div class="flex-1 min-w-0">
                <h3 class="font-medium mb-1 truncate">{{ item.comic.title }}</h3>
                <p class="text-sm text-gray-400 mb-3">阅读至 第{{ getLastChapterNumber(item) }}话</p>
                <div class="flex items-center gap-2 mb-2">
                  <div class="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div class="progress-bar h-full" :style="{ width: `${item.progress_percent}%` }"></div>
                  </div>
                  <span class="text-xs text-gray-500">{{ item.progress_percent }}%</span>
                </div>
                <p class="text-xs text-gray-500">上次阅读: {{ formatTime(item.last_read_at) }}</p>
              </div>
            </NuxtLink>
          </div>
        </section>

        <!-- 全部收藏 -->
        <section>
          <div class="flex items-center justify-between mb-5">
            <h2 class="font-display font-bold text-lg">{{ getSectionTitle }}</h2>
            <select
              v-model="sortBy"
              class="bg-surface-50 border border-purple-500/20 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500/50"
            >
              <option value="recent">最近更新</option>
              <option value="reading">最近阅读</option>
              <option value="name">名称排序</option>
            </select>
          </div>

          <!-- 加载状态 -->
          <div v-if="pending" class="flex justify-center py-20">
            <div class="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <!-- 空状态 -->
          <div v-else-if="filteredComics.length === 0" class="text-center py-20">
            <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            <p class="text-gray-400 mb-2">{{ emptyMessage }}</p>
            <NuxtLink to="/category" class="text-purple-400 hover:text-purple-300 text-sm">去发现更多漫画</NuxtLink>
          </div>

          <!-- 网格视图 -->
          <div v-else-if="viewMode === 'grid'" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            <NuxtLink
              v-for="comic in filteredComics"
              :key="comic.id"
              :to="getComicLink(comic)"
              class="card-glow cursor-pointer block"
            >
              <div class="comic-card aspect-[3/4] mb-3">
                <img
                  :src="comic.cover_url || '/images/placeholder.jpg'"
                  :alt="comic.title"
                  class="w-full h-full object-cover"
                >
                <div v-if="isVip(comic)" class="absolute top-2 left-2 z-10">
                  <span class="px-2 py-0.5 bg-pink-500/90 rounded text-xs font-medium">VIP</span>
                </div>
                <div v-else-if="comic.free_chapters_count > 0" class="absolute top-2 left-2 z-10">
                  <span class="px-2 py-0.5 bg-green-500/90 rounded text-xs font-medium">免费</span>
                </div>
                <div v-if="comic.status === 'completed'" class="absolute top-2 right-2 z-10">
                  <span class="px-2 py-0.5 bg-blue-500/90 rounded text-xs font-medium">完结</span>
                </div>
                <div class="absolute top-2 right-2 z-10" v-if="comic.status !== 'completed'">
                  <span class="px-2 py-0.5 bg-black/60 backdrop-blur rounded text-xs">更新至{{ comic.chapter_count }}话</span>
                </div>
                <div class="absolute bottom-0 left-0 right-0 p-3 z-10">
                  <h3 class="font-medium text-sm mb-1 line-clamp-1">{{ comic.title }}</h3>
                  <div class="flex items-center gap-2 text-xs text-gray-400">
                    <span class="flex items-center gap-1">
                      <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      {{ comic.rating?.toFixed(1) || '0.0' }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-400">
                <div class="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div class="progress-bar h-full" :style="{ width: `${getProgress(comic.id)}%` }"></div>
                </div>
                <span>{{ getProgress(comic.id) }}%</span>
              </div>
            </NuxtLink>
          </div>

          <!-- 列表视图 -->
          <div v-else class="space-y-3">
            <NuxtLink
              v-for="comic in filteredComics"
              :key="comic.id"
              :to="getComicLink(comic)"
              class="gradient-border p-4 flex gap-4 hover:scale-[1.01] transition-transform block"
            >
              <img
                :src="comic.cover_url || '/images/placeholder.jpg'"
                :alt="comic.title"
                class="w-16 h-22 rounded-lg object-cover flex-shrink-0"
                style="aspect-ratio: 8/11;"
              >
              <div class="flex-1 min-w-0 flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-medium truncate">{{ comic.title }}</h3>
                    <span v-if="isVip(comic)" class="px-1.5 py-0.5 bg-pink-500/90 rounded text-xs flex-shrink-0">VIP</span>
                    <span v-else-if="comic.free_chapters_count > 0" class="px-1.5 py-0.5 bg-green-500/90 rounded text-xs flex-shrink-0">免费</span>
                    <span v-if="comic.status === 'completed'" class="px-1.5 py-0.5 bg-blue-500/90 rounded text-xs flex-shrink-0">完结</span>
                  </div>
                  <p class="text-sm text-gray-400">{{ comic.author || '未知作者' }}</p>
                  <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span class="flex items-center gap-1">
                      <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      {{ comic.rating?.toFixed(1) || '0.0' }}
                    </span>
                    <span>{{ comic.chapter_count }}话</span>
                  </div>
                </div>
                <div class="flex items-center gap-3 flex-shrink-0">
                  <div class="w-24">
                    <div class="flex items-center gap-2 text-xs text-gray-400">
                      <div class="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div class="progress-bar h-full" :style="{ width: `${getProgress(comic.id)}%` }"></div>
                      </div>
                      <span>{{ getProgress(comic.id) }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- 加载更多 -->
          <div v-if="hasMore && !pending" class="text-center mt-8">
            <button
              @click="loadMore"
              :disabled="loadingMore"
              class="px-6 py-2 border border-purple-500/30 rounded-full text-sm text-purple-400 hover:bg-purple-500/10 transition-colors disabled:opacity-50"
            >
              {{ loadingMore ? '加载中...' : '加载更多' }}
            </button>
          </div>
        </section>
      </div>
    </main>

    <MobileNav />
  </div>
</template>

<script setup lang="ts">
import type { Comic, ReadingHistoryItem } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const api = useApi()

const tabs = [
  { value: 'all', label: '全部收藏' },
  { value: 'recent', label: '最近阅读' },
  { value: 'ongoing', label: '连载中' },
  { value: 'completed', label: '已完结' },
  { value: 'vip', label: 'VIP专区' }
]

const activeTab = ref('all')
const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('recent')

// 收藏列表
const favorites = ref<Comic[]>([])
const favoritesData = ref<{ total: number; total_pages: number } | null>(null)
const currentPage = ref(1)
const loadingMore = ref(false)

// 阅读历史
const historyMap = ref<Map<number, ReadingHistoryItem>>(new Map())
const recentHistory = ref<ReadingHistoryItem[]>([])

// 章节映射（用于获取章节号）
const chapterNumberMap = ref<Map<number, number>>(new Map())

// 加载状态
const pending = ref(true)

// 获取收藏列表
const fetchFavorites = async (page = 1, append = false) => {
  if (!append) {
    pending.value = true
  }

  try {
    const res = await api.library.favorites(page)
    if (append) {
      favorites.value = [...favorites.value, ...res.items]
    } else {
      favorites.value = res.items
    }
    favoritesData.value = {
      total: res.total,
      total_pages: res.total_pages
    }
    currentPage.value = page
  } catch (error) {
    console.error('Failed to fetch favorites:', error)
  } finally {
    pending.value = false
    loadingMore.value = false
  }
}

// 获取阅读历史
const fetchHistory = async () => {
  try {
    const res = await api.library.history(1)
    // 构建历史记录映射
    res.items.forEach(item => {
      historyMap.value.set(item.comic.id, item)
      // 存储章节ID和对应的章节号（从comic的chapter_count推断）
      if (item.last_chapter_id) {
        // 这里我们假设章节号可以从进度百分比推算
        const estimatedChapter = Math.ceil((item.progress_percent / 100) * item.comic.chapter_count)
        chapterNumberMap.value.set(item.last_chapter_id, estimatedChapter)
      }
    })
    // 取前3条作为继续阅读
    recentHistory.value = res.items.slice(0, 3)
  } catch (error) {
    console.error('Failed to fetch history:', error)
  }
}

// 初始化数据
onMounted(async () => {
  await Promise.all([
    fetchFavorites(),
    fetchHistory()
  ])
})

// 计算属性：过滤后的漫画列表
const filteredComics = computed(() => {
  let result = [...favorites.value]

  // 标签过滤
  switch (activeTab.value) {
    case 'ongoing':
      result = result.filter(c => c.status === 'ongoing')
      break
    case 'completed':
      result = result.filter(c => c.status === 'completed')
      break
    case 'vip':
      result = result.filter(c => isVip(c))
      break
    case 'recent':
      // 按阅读时间排序
      result = result.filter(c => historyMap.value.has(c.id))
      break
  }

  // 排序
  switch (sortBy.value) {
    case 'reading':
      result.sort((a, b) => {
        const aTime = historyMap.value.get(a.id)?.last_read_at
        const bTime = historyMap.value.get(b.id)?.last_read_at
        if (!aTime && !bTime) return 0
        if (!aTime) return 1
        if (!bTime) return -1
        return new Date(bTime).getTime() - new Date(aTime).getTime()
      })
      break
    case 'name':
      result.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
      break
    case 'recent':
    default:
      // 默认按收藏时间排序（API已排序）
      break
  }

  return result
})

// 空状态消息
const emptyMessage = computed(() => {
  switch (activeTab.value) {
    case 'ongoing':
      return '暂无连载中的漫画'
    case 'completed':
      return '暂无已完结的漫画'
    case 'vip':
      return '暂无VIP漫画'
    case 'recent':
      return '暂无阅读记录'
    default:
      return '暂无收藏的漫画'
  }
})

// 是否有更多数据
const hasMore = computed(() => {
  if (!favoritesData.value) return false
  return currentPage.value < favoritesData.value.total_pages
})

// 加载更多
const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  await fetchFavorites(currentPage.value + 1, true)
}

// 获取阅读进度
const getProgress = (comicId: number): number => {
  return historyMap.value.get(comicId)?.progress_percent || 0
}

// 判断是否为VIP漫画
const isVip = (comic: Comic): boolean => {
  return comic.free_chapters_count < comic.chapter_count
}

// 获取漫画链接（有阅读进度则跳转到阅读器）
const getComicLink = (comic: Comic): string => {
  const history = historyMap.value.get(comic.id)
  if (history && history.last_chapter_id) {
    return `/reader/${comic.id}/${history.last_chapter_id}`
  }
  return `/comics/${comic.id}`
}

// 获取阅读器链接
const getReaderLink = (item: ReadingHistoryItem): string => {
  if (item.last_chapter_id) {
    return `/reader/${item.comic.id}/${item.last_chapter_id}`
  }
  return `/comics/${item.comic.id}`
}

// 获取最后阅读章节号
const getLastChapterNumber = (item: ReadingHistoryItem): number => {
  if (item.last_chapter_id && chapterNumberMap.value.has(item.last_chapter_id)) {
    return chapterNumberMap.value.get(item.last_chapter_id)!
  }
  // 从进度百分比推算
  return Math.ceil((item.progress_percent / 100) * item.comic.chapter_count)
}

// 格式化时间
const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  return date.toLocaleDateString('zh-CN')
}

// 获取章节标题
const getSectionTitle = computed(() => {
  const tab = tabs.find(t => t.value === activeTab.value)
  return tab?.label || '全部收藏'
})

useHead({
  title: '我的书架 - ComicVerse',
  meta: [
    { name: 'description', content: '管理你的阅读记录和收藏' }
  ]
})
</script>

<style scoped>
.tab-btn.active {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3));
  border-color: rgba(168, 85, 247, 0.5);
}

.progress-bar {
  background: linear-gradient(90deg, #7c3aed 0%, #ec4899 100%);
}

.comic-card {
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
}

.comic-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10, 10, 18, 0.95) 0%, rgba(10, 10, 18, 0.4) 40%, transparent 100%);
  pointer-events: none;
}

.comic-card img {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.comic-card:hover img {
  transform: scale(1.08);
}

.gradient-border {
  position: relative;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1));
  border-radius: 1rem;
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 1rem;
  padding: 1px;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(236, 72, 153, 0.5));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.card-glow {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-glow:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px -15px rgba(168, 85, 247, 0.3), 0 0 30px -10px rgba(236, 72, 153, 0.2);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
