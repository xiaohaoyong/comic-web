<template>
  <div>
    <Header />
    
    <main class="pt-20 pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 页面标题 -->
        <div class="mb-8">
          <h1 class="font-display font-bold text-3xl mb-2">漫画分类</h1>
          <p class="text-gray-400">探索海量精彩漫画，找到属于你的故事</p>
        </div>
        
        <!-- 筛选区域 -->
        <div class="gradient-border p-6 mb-8">
          <!-- 分类筛选 -->
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              <span class="font-medium">分类</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="cat in allCategories" 
                :key="cat.slug ?? 'all'"
                @click="selectedCategorySlug = cat.slug"
                class="filter-btn px-4 py-2 rounded-lg text-sm border border-purple-500/20"
                :class="selectedCategorySlug === cat.slug ? 'active text-white' : 'text-gray-300 hover:text-white'"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>
          
          <!-- 状态筛选 -->
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="font-medium">状态</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="status in statusOptions" 
                :key="status.value"
                @click="selectedStatus = status.value"
                class="filter-btn px-4 py-2 rounded-lg text-sm border border-purple-500/20"
                :class="selectedStatus === status.value ? 'active text-white' : 'text-gray-300 hover:text-white'"
              >
                {{ status.label }}
              </button>
            </div>
          </div>
          
          <!-- 排序 -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/>
              </svg>
              <span class="font-medium">排序</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="sort in sortOptions" 
                :key="sort.value"
                @click="selectedSort = sort.value"
                class="filter-btn px-4 py-2 rounded-lg text-sm border border-purple-500/20"
                :class="selectedSort === sort.value ? 'active text-white' : 'text-gray-300 hover:text-white'"
              >
                {{ sort.label }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- 结果统计 -->
        <div class="flex items-center justify-between mb-6">
          <div class="text-gray-400 text-sm">
            共找到 <span class="text-white font-medium">{{ comicsData?.total || 0 }}</span> 部漫画
          </div>
        </div>
        
        <!-- 漫画列表 -->
        <div v-if="pending" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          <div v-for="i in 12" :key="i" class="aspect-[3/4] bg-surface-50 rounded-xl animate-pulse" />
        </div>
        
        <div v-else-if="comicsData?.items?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          <ComicCard
            v-for="comic in comicsData.items"
            :key="comic.id"
            :comic="comic"
          />
        </div>
        
        <div v-else class="text-center py-20">
          <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-gray-400 text-lg">没有找到符合条件的漫画</p>
          <p class="text-gray-500 text-sm mt-2">试试其他筛选条件吧</p>
        </div>
        
        <!-- 分页 -->
        <div v-if="comicsData?.total_pages > 1" class="flex justify-center mt-12">
          <div class="flex items-center gap-2">
            <button 
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="p-2 rounded-lg border border-purple-500/20 transition-colors"
              :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-50'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            
            <div class="flex items-center gap-1">
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="currentPage = page"
                class="w-10 h-10 rounded-lg text-sm font-medium transition-colors"
                :class="currentPage === page ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'border border-purple-500/20 hover:bg-surface-50'"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="currentPage = Math.min(comicsData.total_pages, currentPage + 1)"
              :disabled="currentPage === comicsData.total_pages"
              class="p-2 rounded-lg border border-purple-500/20 transition-colors"
              :class="currentPage === comicsData.total_pages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-50'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
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

const statusOptions = [
  { value: '', label: '全部' },
  { value: 'ongoing', label: '连载中' },
  { value: 'completed', label: '已完结' }
]

const sortOptions = [
  { value: 'popular', label: '人气最高' },
  { value: 'latest', label: '最新更新' },
  { value: 'rating', label: '评分最高' },
  { value: 'views', label: '阅读最多' }
]

const selectedCategorySlug = ref<string | null>(
  (route.query.category as string) || null
)
const selectedStatus = ref((route.query.status as string) || '')
const selectedSort = ref((route.query.sort as string) || 'popular')
const currentPage = ref(Number(route.query.page) || 1)

// 监听筛选条件变化，重置页码
watch([selectedCategorySlug, selectedStatus, selectedSort], () => {
  currentPage.value = 1
})

// 计算可见页码
const visiblePages = computed(() => {
  const total = comicsData.value?.total_pages || 1
  const current = currentPage.value
  const pages: number[] = []
  
  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)
  
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(total, start + 4)
    } else {
      start = Math.max(1, end - 4)
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 获取漫画列表
const { data: comicsData, pending, refresh } = await useAsyncData(
  'comics-list',
  () => api.comics.list({
    page: currentPage.value,
    category_slug: selectedCategorySlug.value || undefined,
    status: selectedStatus.value || undefined,
    sort: selectedSort.value
  }),
  {
    default: () => ({ items: [], total: 0, page: 1, page_size: 20, total_pages: 0 }),
    watch: [selectedCategorySlug, selectedStatus, selectedSort, currentPage],
    getCachedData: () => null
  }
)

// 页面加载时刷新数据
onMounted(() => {
  refresh()
})

// 更新 URL 参数
watch([selectedCategorySlug, selectedStatus, selectedSort, currentPage], () => {
  const query: Record<string, string | number> = {}
  if (selectedCategorySlug.value) query.category = selectedCategorySlug.value
  if (selectedStatus.value) query.status = selectedStatus.value
  if (selectedSort.value !== 'popular') query.sort = selectedSort.value
  if (currentPage.value > 1) query.page = currentPage.value
  
  router.push({ query })
}, { deep: true })

useHead({
  title: '漫画分类 - ComicVerse',
  meta: [
    { name: 'description', content: '浏览漫画分类，找到你喜欢的漫画类型' }
  ]
})
</script>
