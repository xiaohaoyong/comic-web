<template>
  <div>
    <Header />
    
    <main class="pt-20 pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 页面标题 -->
        <div class="mb-8">
          <h1 class="font-display font-bold text-2xl md:text-3xl mb-2">排行榜</h1>
          <p class="text-gray-400 text-sm">发现最受欢迎的漫画作品</p>
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

        <!-- 排行榜列表 -->
        <div class="space-y-3">
          <NuxtLink 
            v-for="(comic, index) in rankList" 
            :key="comic.id"
            :to="`/comics/${comic.id}`"
            class="rank-item flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer block"
            :class="getRankItemClass(index)"
          >
            <div class="w-8 text-center font-display font-bold text-2xl flex-shrink-0" :class="getRankNumberClass(index)">
              {{ index + 1 }}
            </div>
            <img 
              :src="comic.cover_url || `https://picsum.photos/seed/rank${comic.id}/100/140`" 
              :alt="comic.title"
              class="w-16 h-22 rounded-lg object-cover flex-shrink-0"
            >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-medium truncate">{{ comic.title }}</h3>
                <span v-if="comic.is_vip" class="px-2 py-0.5 bg-pink-500/20 border border-pink-500/30 rounded text-xs text-pink-300">VIP</span>
                <span v-else-if="comic.status === 'completed'" class="px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-300">完结</span>
                <span v-else-if="comic.is_free" class="px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-300">免费</span>
              </div>
              <p class="text-sm text-gray-400 mb-2 line-clamp-1">{{ comic.description || '精彩漫画等你来看...' }}</p>
              <div class="flex items-center gap-4 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  {{ formatRating(comic.rating) }}
                </span>
                <span>{{ formatViews(comic.total_views) }} 阅读</span>
                <span>{{ comic.category?.name || comic.category || '玄幻奇幻' }}</span>
              </div>
            </div>
            <div class="text-right hidden sm:block">
              <div class="text-xs text-gray-500 mb-1">{{ comic.status === 'completed' ? '全' : '更新至' }}</div>
              <div class="text-sm font-medium">第{{ comic.chapter_count || 100 }}话</div>
            </div>
          </NuxtLink>
        </div>

        <!-- 加载更多 -->
        <div v-if="hasMore" class="flex justify-center mt-8">
          <button @click="loadMore" class="px-6 py-2.5 rounded-full border border-purple-500/30 hover:bg-purple-500/10 transition-colors text-sm">
            加载更多
          </button>
        </div>
      </div>
    </main>
    
    <MobileNav />
  </div>
</template>

<script setup lang="ts">
const api = useApi()

const tabs = [
  { value: 'hot', label: '热门榜' },
  { value: 'new', label: '新作榜' },
  { value: 'rating', label: '评分榜' },
  { value: 'completed', label: '完结榜' },
  { value: 'trending', label: '飙升榜' }
]

const activeTab = ref('hot')
const page = ref(1)
const hasMore = ref(true)

const { data: rankData } = await useAsyncData(
  'ranking-list',
  () => api.comics.list({ page: 1, page_size: 20, sort: 'popular' })
)

const mockComics = [
  { id: 1, title: '斗破苍穹', description: '天才少年萧炎，创造了家族空前绝后的修炼纪录...', total_views: 1200000, rating: 49, chapter_count: 312, category: '玄幻奇幻', is_vip: true },
  { id: 2, title: '完美世界', description: '一粒尘可填海，一根草斩日月星辰...', total_views: 980000, rating: 48, chapter_count: 156, category: '玄幻奇幻', is_vip: false },
  { id: 3, title: '诡秘之主', description: '蒸汽与机械的浪潮中，谁能触及真正的神...', total_views: 856000, rating: 49, chapter_count: 198, category: '悬疑推理', is_vip: true },
  { id: 4, title: '武动乾坤', description: '大炎王朝天都郡青阳镇，有一个叫林动的少年...', total_views: 720000, rating: 47, chapter_count: 234, category: '玄幻奇幻', is_vip: true },
  { id: 5, title: '绝世武神', description: '九霄大陆，武道为尊，弱小的林枫...', total_views: 650000, rating: 48, chapter_count: 128, category: '玄幻奇幻', is_vip: false },
  { id: 6, title: '全职法师', description: '一觉醒来，世界大变，熟悉的高中...', total_views: 580000, rating: 47, chapter_count: 500, category: '都市魔法', status: 'completed' },
  { id: 7, title: '星际迷航', description: '在浩瀚的宇宙中，人类开始了星际探索...', total_views: 520000, rating: 49, chapter_count: 256, category: '科幻未来', is_free: true },
  { id: 8, title: '都市最强战神', description: '五年前，他被陷害入狱，五年后...', total_views: 480000, rating: 46, chapter_count: 89, category: '都市言情', is_vip: false },
  { id: 9, title: '校园恋爱物语', description: '青春校园，纯真爱情，一段美好的回忆...', total_views: 420000, rating: 47, chapter_count: 67, category: '校园青春', is_vip: false },
  { id: 10, title: '妖神记', description: '重生归来，这一世他要改变一切...', total_views: 380000, rating: 46, chapter_count: 78, category: '玄幻奇幻', is_vip: false }
]

const rankList = computed(() => {
  if (rankData.value?.items?.length) {
    return rankData.value.items.map((item: any, index: number) => ({
      ...item,
      ...mockComics[index % mockComics.length]
    }))
  }
  return mockComics
})

function formatRating(rating: number) {
  if (!rating) return '4.5'
  return (rating / 10).toFixed(1)
}

function formatViews(views: number) {
  if (!views) return '0'
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M'
  if (views >= 1000) return (views / 1000).toFixed(0) + 'K'
  return views.toString()
}

function getRankItemClass(index: number) {
  if (index === 0) return 'rank-1'
  if (index === 1) return 'rank-2'
  if (index === 2) return 'rank-3'
  return 'border border-gray-800'
}

function getRankNumberClass(index: number) {
  if (index === 0) return 'text-amber-400'
  if (index === 1) return 'text-gray-400'
  if (index === 2) return 'text-amber-600'
  return 'text-gray-500'
}

function loadMore() {
  page.value++
}

useHead({
  title: '排行榜 - ComicVerse',
  meta: [
    { name: 'description', content: '漫画排行榜，发现最受欢迎的精彩漫画' }
  ]
})
</script>

<style scoped>
.rank-item {
  transition: all 0.3s;
}

.rank-item:hover {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1));
}

.rank-1 {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(251, 191, 36, 0.1));
  border-left: 3px solid #f59e0b;
}

.rank-2 {
  background: linear-gradient(135deg, rgba(156, 163, 175, 0.2), rgba(209, 213, 219, 0.1));
  border-left: 3px solid #9ca3af;
}

.rank-3 {
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.2), rgba(245, 158, 11, 0.1));
  border-left: 3px solid #d97706;
}

.tab-btn.active {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3));
  border-color: rgba(168, 85, 247, 0.5);
}
</style>
