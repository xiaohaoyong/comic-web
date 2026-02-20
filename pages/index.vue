<template>
  <div>
    <Header />
    
    <main class="pt-20">
      <!-- 分类导航 -->
      <section class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
        <div class="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
          <NuxtLink 
            v-for="cat in allCategories" 
            :key="cat.slug ?? 'all'"
            :to="cat.slug ? `/comics?category=${cat.slug}` : '/comics'"
            class="category-pill px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap"
            :class="selectedCategorySlug === cat.slug ? 'active' : 'text-gray-300'"
          >
            {{ cat.name }}
          </NuxtLink>
        </div>
      </section>
      
      <!-- 热门更新 -->
      <section class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            <h2 class="font-display font-bold text-2xl">热门更新</h2>
          </div>
          <NuxtLink to="/comics" class="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
            查看更多
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
        </div>
        
        <div v-if="featuredPending" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          <div v-for="i in 6" :key="i" class="aspect-[3/4] bg-surface-50 rounded-xl animate-pulse" />
        </div>
        
        <div v-else-if="featuredComics && featuredComics.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          <ComicCard
            v-for="comic in featuredComics"
            :key="comic.id"
            :comic="comic"
          />
        </div>
        
        <div v-else class="text-center py-12 text-gray-500">
          暂无推荐漫画
        </div>
      </section>
      
      <!-- 精选推荐 -->
      <section class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-1 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
            <h2 class="font-display font-bold text-2xl">精选推荐</h2>
          </div>
        </div>
        
        <div v-if="latestPending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="gradient-border p-4">
            <div class="flex gap-4">
              <div class="w-28 h-36 bg-surface-50 rounded-lg animate-pulse" />
              <div class="flex-1 space-y-3">
                <div class="h-5 bg-surface-50 rounded animate-pulse" />
                <div class="h-4 bg-surface-50 rounded animate-pulse w-3/4" />
                <div class="h-4 bg-surface-50 rounded animate-pulse w-1/2" />
              </div>
            </div>
          </div>
        </div>
        
        <div v-else-if="latestComics?.items && latestComics.items.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink 
            v-for="comic in latestComics.items.slice(0, 3)" 
            :key="comic.id"
            :to="`/comics/${comic.id}`"
            class="gradient-border p-4 card-glow cursor-pointer"
          >
            <div class="flex gap-4">
              <div class="w-28 h-36 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  :src="comic.cover_url || `https://picsum.photos/seed/${comic.id}/200/280`" 
                  :alt="comic.title"
                  class="w-full h-full object-cover"
                >
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-lg mb-2 line-clamp-1">{{ comic.title }}</h3>
                <p class="text-sm text-gray-400 mb-3 line-clamp-2">{{ comic.description || '精彩漫画等你来看...' }}</p>
                <div class="flex items-center gap-3 mb-3">
                  <span class="flex items-center gap-1 text-sm">
                    <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    {{ formatRating(comic.rating) }}
                  </span>
                  <span class="text-sm text-gray-400">{{ formatViews(comic.total_views) }} 阅读</span>
                </div>
                <div class="flex gap-2">
                  <span class="px-2 py-0.5 bg-purple-500/20 rounded text-xs text-purple-300">{{ comic.category?.name || '玄幻' }}</span>
                  <span class="px-2 py-0.5 bg-pink-500/20 rounded text-xs text-pink-300">热血</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>
      
      <!-- 排行榜 -->
      <section class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
            <h2 class="font-display font-bold text-2xl">人气排行</h2>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- 热门榜 -->
          <div class="gradient-border p-5">
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.644-.628 1.396-.82 2.153v.002a1 1 0 00-.09.25c-.025.112-.037.225-.037.336 0 .815.417 1.534 1.046 1.953a2.99 2.99 0 00-.045 1.883c.145.566.485 1.09.925 1.507a4.35 4.35 0 00-.163 1.57c.08.748.385 1.452.848 2.022.469.578 1.078 1.018 1.77 1.246.71.235 1.471.242 2.163.011.702-.233 1.312-.668 1.774-1.218a4.38 4.38 0 001.018-2.054c.068-.378.09-.76.066-1.138a3.99 3.99 0 00.736-1.937c.06-.543-.04-1.09-.266-1.594a3.003 3.003 0 00.945-1.937c.052-.617-.106-1.236-.448-1.76a2.99 2.99 0 00-.566-.654c.263-.46.422-.975.46-1.51.044-.624-.08-1.253-.36-1.818a3.005 3.005 0 00-1.25-1.267 2.99 2.99 0 00-1.8-.38 3.016 3.016 0 00-1.666.707 3.01 3.01 0 00-1.733-.526 3.01 3.01 0 00-1.916.682z" clip-rule="evenodd"/>
              </svg>
              <span class="font-medium">热门榜</span>
            </div>
            <div class="space-y-3">
              <NuxtLink 
                v-for="(comic, index) in hotRankList" 
                :key="comic.id"
                :to="`/comics/${comic.id}`"
                class="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-50/50 transition-colors cursor-pointer"
              >
                <span 
                  class="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold"
                  :class="getRankClass(index)"
                >
                  {{ index + 1 }}
                </span>
                <img 
                  :src="comic.cover_url || `https://picsum.photos/seed/rank${index}/60/80`" 
                  :alt="comic.title"
                  class="w-10 h-14 rounded object-cover"
                >
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-sm truncate">{{ comic.title }}</div>
                  <div class="text-xs text-gray-400">{{ formatViews(comic.total_views) }} 阅读</div>
                </div>
              </NuxtLink>
            </div>
          </div>
          
          <!-- 新作榜 -->
          <div class="gradient-border p-5">
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span class="font-medium">新作榜</span>
            </div>
            <div class="space-y-3">
              <NuxtLink 
                v-for="(comic, index) in newRankList" 
                :key="comic.id"
                :to="`/comics/${comic.id}`"
                class="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-50/50 transition-colors cursor-pointer"
              >
                <span 
                  class="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold"
                  :class="getNewRankClass(index)"
                >
                  {{ index + 1 }}
                </span>
                <img 
                  :src="comic.cover_url || `https://picsum.photos/seed/new${index}/60/80`" 
                  :alt="comic.title"
                  class="w-10 h-14 rounded object-cover"
                >
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-sm truncate">{{ comic.title }}</div>
                  <div class="text-xs text-gray-400">本周 {{ formatViews(comic.weekly_views || comic.total_views) }} 阅读</div>
                </div>
              </NuxtLink>
            </div>
          </div>
          
          <!-- 评分榜 -->
          <div class="gradient-border p-5">
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span class="font-medium">评分榜</span>
            </div>
            <div class="space-y-3">
              <NuxtLink 
                v-for="(comic, index) in ratingRankList" 
                :key="comic.id"
                :to="`/comics/${comic.id}`"
                class="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-50/50 transition-colors cursor-pointer"
              >
                <span 
                  class="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold"
                  :class="getRatingRankClass(index)"
                >
                  {{ index + 1 }}
                </span>
                <img 
                  :src="comic.cover_url || `https://picsum.photos/seed/rating${index}/60/80`" 
                  :alt="comic.title"
                  class="w-10 h-14 rounded object-cover"
                >
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-sm truncate">{{ comic.title }}</div>
                  <div class="flex items-center gap-1 text-xs">
                    <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span class="text-amber-400">{{ formatRating(comic.rating) }}</span>
                    <span class="text-gray-400">({{ formatCount(comic.rating_count) }})</span>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const api = useApi()

const { data: categories } = await useAsyncData(
  'categories',
  () => api.comics.categories(),
  { default: () => [] }
)

const allCategories = computed(() => [
  { id: null, name: '全部', slug: null },
  ...(categories.value || [])
])

const selectedCategorySlug = computed(() => {
  return route.query.category as string || null
})

// 获取推荐漫画
const { data: featuredComics, pending: featuredPending, refresh: refreshFeatured } = await useAsyncData(
  'featured-comics',
  () => api.comics.featured(6),
  { 
    default: () => [], 
    server: true, 
    lazy: false,
    getCachedData: () => null
  }
)

// 获取最新漫画
const { data: latestComics, pending: latestPending, refresh: refreshLatest } = await useAsyncData(
  'latest-comics',
  () => api.comics.list({ page: 1, sort: 'latest', page_size: 12 }),
  { 
    default: () => ({ items: [], total: 0 }), 
    server: true, 
    lazy: false,
    getCachedData: () => null
  }
)

// 页面激活时刷新数据
onMounted(() => {
  refreshFeatured()
  refreshLatest()
})

// 热门榜数据
const hotRankList = computed(() => {
  const data = featuredComics.value
  if (data && data.length > 0) return data.slice(0, 4)
  return generateMockRankList(4)
})

// 新作榜数据
const newRankList = computed(() => {
  const data = latestComics.value?.items
  if (data && data.length > 0) return data.slice(0, 4)
  return generateMockRankList(4)
})

// 评分榜数据
const ratingRankList = computed(() => {
  const data = featuredComics.value
  if (data && data.length > 0) return data.slice(0, 4)
  return generateMockRankList(4)
})

// 生成模拟排行数据
function generateMockRankList(count: number) {
  const titles = ['斗破苍穹', '完美世界', '诡秘之主', '全职法师', '星际迷航', '妖神记']
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: titles[i] || `漫画${i + 1}`,
    cover_url: `https://picsum.photos/seed/mock${i}/60/80`,
    total_views: Math.floor(Math.random() * 1000000) + 100000,
    rating: Math.floor(Math.random() * 10) + 40,
    weekly_views: Math.floor(Math.random() * 50000) + 10000,
    rating_count: Math.floor(Math.random() * 10000) + 1000
  }))
}

// 格式化评分
function formatRating(rating: number) {
  if (!rating) return '4.5'
  return (rating / 10).toFixed(1)
}

// 格式化阅读量
function formatViews(views: number) {
  if (!views) return '0'
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M'
  }
  if (views >= 1000) {
    return (views / 1000).toFixed(0) + 'K'
  }
  return views.toString()
}

// 格式化数量
function formatCount(count: number) {
  if (!count) return '0'
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K'
  }
  return count.toString()
}

// 获取排名样式
function getRankClass(index: number) {
  if (index === 0) return 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
  if (index === 1) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700'
  if (index === 2) return 'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
  return 'text-gray-400'
}

function getNewRankClass(index: number) {
  if (index === 0) return 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
  if (index === 1) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700'
  if (index === 2) return 'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
  return 'text-gray-400'
}

function getRatingRankClass(index: number) {
  if (index === 0) return 'bg-gradient-to-br from-purple-400 to-pink-500 text-white'
  if (index === 1) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700'
  if (index === 2) return 'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
  return 'text-gray-400'
}

useHead({
  title: 'ComicVerse - 漫画阅读平台',
  meta: [
    { name: 'description', content: 'ComicVerse漫画阅读平台，海量高清漫画在线阅读，探索无限漫画世界' }
  ]
})
</script>
