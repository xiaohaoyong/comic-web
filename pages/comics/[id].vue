<template>
  <div>
    <!-- 详情页导航栏 -->
    <nav class="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <NuxtLink to="/comics" class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              <span class="text-sm">返回</span>
            </NuxtLink>
          </div>
          <div class="flex items-center gap-4">
            <button class="p-2 rounded-lg hover:bg-surface-50 transition-colors">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
            </button>
            <NuxtLink v-if="userStore.isLoggedIn" to="/user" class="relative">
              <img :src="userStore.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userStore.user?.username || 'comic'}`" alt="Avatar" class="w-10 h-10 rounded-full border-2 border-purple-500/50">
              <div v-if="userStore.isVip" class="absolute -bottom-1 -right-1 w-5 h-5 vip-badge rounded-full flex items-center justify-center">
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              </div>
            </NuxtLink>
            <NuxtLink v-else to="/login" class="text-sm text-gray-400 hover:text-white">登录</NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <main v-if="comic" class="pt-16">
      <!-- 漫画头部信息 -->
      <section class="relative h-[400px] md:h-[450px]">
        <img :src="comic.cover_url || `https://picsum.photos/seed/detail-banner-${comic.id}/1400/500`" alt="Banner" class="absolute inset-0 w-full h-full object-cover">
        <div class="banner-bg"></div>
        <div class="absolute inset-0 z-10">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
            <div class="flex gap-6 md:gap-8">
              <!-- 封面 -->
              <div class="hidden sm:block w-40 md:w-48 flex-shrink-0 -mb-4">
                <div class="relative">
                  <img :src="comic.cover_url || `https://picsum.photos/seed/cover${comic.id}/200/280`" alt="Cover" class="w-full rounded-xl shadow-2xl border-2 border-purple-500/30">
                  <div v-if="comic.is_vip" class="absolute top-2 left-2"><span class="px-2 py-0.5 bg-pink-500/90 rounded text-xs font-medium">VIP</span></div>
                </div>
              </div>
              <!-- 信息 -->
              <div class="flex-1 pb-4">
                <div class="flex items-center gap-2 mb-3">
                  <span class="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">{{ comic.category?.name || comic.category || '玄幻奇幻' }}</span>
                  <span class="px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-300">{{ comic.status === 'completed' ? '已完结' : '连载中' }}</span>
                </div>
                <h1 class="font-display font-bold text-3xl md:text-4xl mb-3">{{ comic.title }}</h1>
                <p class="text-gray-300 text-sm md:text-base mb-4 max-w-2xl line-clamp-2 md:line-clamp-3">
                  {{ comic.description || '精彩漫画等你来看...' }}
                </p>
                <div class="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-400 mb-6">
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    {{ comic.author || '佚名' }}
                  </span>
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    {{ formatViews(comic.total_views) }}
                  </span>
                  <span class="flex items-center gap-1.5 star-rating">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    {{ formatRating(comic.rating) }} ({{ formatCount(comic.rating_count) }}评分)
                  </span>
                </div>
                <div class="flex flex-wrap gap-3">
                  <button @click="startReading" class="btn-primary px-6 py-2.5 rounded-full font-medium text-sm">
                    <span class="flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      开始阅读
                    </span>
                  </button>
                  <button @click="handleFavorite" class="px-6 py-2.5 rounded-full border border-purple-500/30 hover:bg-purple-500/10 transition-colors text-sm flex items-center gap-2" :class="comic.is_favorite ? 'text-pink-400 border-pink-500/50' : ''">
                    <svg class="w-4 h-4" :fill="comic.is_favorite ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                    {{ comic.is_favorite ? '已收藏' : '收藏' }}
                  </button>
                  <button class="px-6 py-2.5 rounded-full border border-gray-700 hover:border-purple-500/30 transition-colors text-sm flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                    分享
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 内容区域 -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- 左侧：章节列表 -->
          <div class="lg:col-span-2">
            <!-- 章节筛选 -->
            <div class="flex items-center justify-between mb-6">
              <h2 class="font-display font-bold text-xl">章节列表</h2>
              <div class="flex items-center gap-3">
                <select v-model="chapterOrder" class="bg-surface-50 border border-purple-500/20 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500/50">
                  <option value="asc">正序</option>
                  <option value="desc">倒序</option>
                </select>
              </div>
            </div>
            
            <!-- 免费章节提示 -->
            <div class="gradient-border p-4 mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                </div>
                <div>
                  <div class="text-sm font-medium">前{{ comic.free_chapters_count || 3 }}章免费阅读</div>
                  <div class="text-xs text-gray-400">VIP会员可免费阅读全部章节</div>
                </div>
              </div>
            </div>
            
            <!-- 章节网格 -->
            <div v-if="chaptersPending" class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              <div v-for="i in 16" :key="i" class="h-16 bg-surface-50 rounded animate-pulse" />
            </div>
            
            <div v-else class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              <button
                v-for="ch in sortedChapters"
                :key="ch.id"
                @click="readChapter(ch.id)"
                class="chapter-item p-2 rounded-lg bg-surface-50/50 text-center text-sm"
                :class="getChapterClass(ch)"
              >
                <div :class="ch.is_free ? 'text-green-400' : 'text-gray-300'">第{{ ch.chapter_number }}话</div>
                <div class="text-xs mt-0.5" :class="ch.is_free ? 'text-gray-500' : 'text-amber-400'">
                  {{ ch.is_free ? '免费' : `${ch.points_required || 10}积分` }}
                </div>
              </button>
            </div>
            
            <!-- 加载更多 -->
            <div v-if="hasMoreChapters" class="flex justify-center mt-6">
              <button @click="loadMoreChapters" class="px-6 py-2 rounded-full border border-purple-500/30 hover:bg-purple-500/10 transition-colors text-sm">
                加载更多章节
              </button>
            </div>
          </div>
          
          <!-- 右侧：相关信息 -->
          <div class="space-y-6">
            <!-- 评分 -->
            <div class="gradient-border p-5">
              <h3 class="font-medium mb-4">为这部漫画评分</h3>
              <div class="flex items-center gap-2 mb-3">
                <div class="flex gap-1">
                  <button v-for="i in 5" :key="i" @click="rate(i)" @mouseenter="hoverRating = i" @mouseleave="hoverRating = 0" class="transition-transform hover:scale-110">
                    <svg class="w-8 h-8" :class="i <= (hoverRating || userRating) ? 'text-amber-400' : 'text-gray-600'" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  </button>
                </div>
              </div>
              <div class="text-sm text-gray-400">当前评分：<span class="text-amber-400 font-medium">{{ formatRating(comic.rating) }}</span> / 5</div>
            </div>
            
            <!-- 标签 -->
            <div class="gradient-border p-5">
              <h3 class="font-medium mb-4">标签</h3>
              <div class="flex flex-wrap gap-2">
                <span v-for="(tag, index) in (comic.tags || ['玄幻', '热血', '冒险', '修炼', '逆袭'])" :key="tag" class="px-3 py-1 rounded-full text-xs" :class="getTagClass(index)">
                  {{ tag }}
                </span>
              </div>
            </div>
            
            <!-- 相关推荐 -->
            <div class="gradient-border p-5">
              <h3 class="font-medium mb-4">相关推荐</h3>
              <div class="space-y-3">
                <NuxtLink v-for="rec in recommendedComics" :key="rec.id" :to="`/comics/${rec.id}`" class="flex gap-3 p-2 rounded-lg hover:bg-surface-50/50 transition-colors">
                  <img :src="rec.cover_url || `https://picsum.photos/seed/rec${rec.id}/80/100`" alt="" class="w-14 h-18 rounded object-cover">
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-sm truncate">{{ rec.title }}</div>
                    <div class="text-xs text-gray-400 mt-1">{{ rec.category || '玄幻奇幻' }}</div>
                    <div class="flex items-center gap-1 text-xs mt-1">
                      <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      <span class="text-amber-400">{{ formatRating(rec.rating) }}</span>
                    </div>
                  </div>
                </NuxtLink>
              </div>
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
const userStore = useUserStore()

const comicId = computed(() => Number(route.params.id))
const chapterOrder = ref<'asc' | 'desc'>('asc')
const userRating = ref(0)
const hoverRating = ref(0)
const hasMoreChapters = ref(false)

const { data: comic } = await useAsyncData(
  `comic-${comicId.value}`,
  () => api.comics.get(comicId.value)
)

const { data: chapters, pending: chaptersPending } = await useAsyncData(
  `comic-chapters-${comicId.value}`,
  () => api.comics.chapters(comicId.value)
)

const { data: featuredData } = await useAsyncData(
  'featured-comics-detail',
  () => api.comics.featured(3)
)

const sortedChapters = computed(() => {
  if (!chapters.value) return []
  const sorted = [...chapters.value]
  return chapterOrder.value === 'asc' ? sorted : sorted.reverse()
})

const recommendedComics = computed(() => {
  return featuredData.value?.filter(c => c.id !== comicId.value).slice(0, 3) || [
    { id: 101, title: '完美世界', rating: 48, category: '玄幻奇幻' },
    { id: 102, title: '武动乾坤', rating: 47, category: '玄幻奇幻' },
    { id: 103, title: '大主宰', rating: 46, category: '玄幻奇幻' }
  ]
})

const formatViews = (views: number) => {
  if (!views) return '0'
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M'
  if (views >= 1000) return (views / 1000).toFixed(0) + 'K'
  return views.toString()
}

const formatRating = (rating: number) => {
  if (!rating) return '4.5'
  return (rating / 10).toFixed(1)
}

const formatCount = (count: number) => {
  if (!count) return '0'
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
  return count.toString()
}

const getChapterClass = (ch: any) => {
  if (ch.is_free) return 'border border-green-500/30 hover:border-green-500/50'
  return 'border border-purple-500/20 hover:border-purple-500/50'
}

const getTagClass = (index: number) => {
  const classes = [
    'bg-purple-500/20 text-purple-300',
    'bg-pink-500/20 text-pink-300',
    'bg-cyan-500/20 text-cyan-300',
    'bg-amber-500/20 text-amber-300',
    'bg-blue-500/20 text-blue-300'
  ]
  return classes[index % classes.length]
}

const rate = (rating: number) => {
  userRating.value = rating
}

const startReading = () => {
  if (chapters.value && chapters.value.length > 0) {
    navigateTo(`/reader/${comicId.value}/${chapters.value[0].id}`)
  }
}

const readChapter = (chId: number) => {
  navigateTo(`/reader/${comicId.value}/${chId}`)
}

const handleFavorite = async () => {
  if (!userStore.isLoggedIn) {
    navigateTo('/login')
    return
  }
  
  if (comic.value) {
    try {
      if (comic.value.is_favorite) {
        await api.comics.unfavorite(comic.value.id)
        comic.value.is_favorite = false
      } else {
        await api.comics.favorite(comic.value.id)
        comic.value.is_favorite = true
      }
    } catch (error) {
      console.error('收藏操作失败:', error)
    }
  }
}

const loadMoreChapters = () => {
}

useHead({
  title: comic.value ? `${comic.value.title} - ComicVerse` : '漫画详情',
  meta: [
    { name: 'description', content: comic.value?.description || '在线漫画阅读' },
    { property: 'og:title', content: comic.value?.title || '漫画详情' },
    { property: 'og:description', content: comic.value?.description || '' },
    { property: 'og:image', content: comic.value?.cover_url || '' }
  ]
})
</script>
