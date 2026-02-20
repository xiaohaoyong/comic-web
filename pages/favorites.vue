<template>
  <div>
    <!-- 顶部导航栏 -->
    <nav class="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <NuxtLink to="/user" class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              <span class="text-sm">返回</span>
            </NuxtLink>
          </div>
          <h1 class="font-display font-bold text-lg">我的收藏</h1>
          <div class="flex items-center gap-3">
            <button class="p-2 rounded-lg hover:bg-surface-50 transition-colors">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
            <button class="p-2 rounded-lg hover:bg-surface-50 transition-colors">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="pt-20 pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 统计信息 -->
        <div class="flex items-center justify-between mb-6">
          <div class="text-sm text-gray-400">共 <span class="text-purple-400 font-medium">{{ total }}</span> 部收藏漫画</div>
          <div class="flex items-center gap-2">
            <select v-model="sortBy" @change="loadFavorites" class="bg-surface-50 border border-purple-500/20 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500/50">
              <option value="time">按收藏时间</option>
              <option value="update">按更新时间</option>
              <option value="name">按名称排序</option>
            </select>
          </div>
        </div>

        <!-- 加载中 -->
        <div v-if="loading" class="flex justify-center py-20">
          <div class="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="favorites.length === 0" class="text-center py-20">
          <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
          <p class="text-gray-400 mb-4">暂无收藏</p>
          <NuxtLink to="/comics" class="text-purple-400 hover:text-purple-300">去发现漫画</NuxtLink>
        </div>

        <!-- 漫画网格 -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          <NuxtLink
            v-for="comic in favorites"
            :key="comic.id"
            :to="`/comics/${comic.id}`"
            class="comic-card group"
          >
            <div class="relative mb-3">
              <img
                :src="comic.cover_url || `https://picsum.photos/seed/fav${comic.id}/200/280`"
                :alt="comic.title"
                class="comic-cover w-full aspect-[3/4] rounded-xl object-cover border border-purple-500/20"
              >
              <!-- VIP标签 -->
              <div v-if="comic.free_chapters_count < comic.chapter_count && comic.status !== 'completed'" class="absolute top-2 left-2">
                <span class="px-2 py-0.5 bg-pink-500/90 rounded text-xs font-medium">VIP</span>
              </div>
              <!-- 免费标签 -->
              <div v-else-if="comic.free_chapters_count >= comic.chapter_count && comic.status !== 'completed'" class="absolute top-2 left-2">
                <span class="px-2 py-0.5 bg-green-500/90 rounded text-xs font-medium">免费</span>
              </div>
              <!-- 完结标签 -->
              <div v-if="comic.status === 'completed'" class="absolute top-2 left-2">
                <span class="px-2 py-0.5 bg-blue-500/90 rounded text-xs font-medium">完结</span>
              </div>
              <!-- 删除按钮 -->
              <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  @click.prevent="removeFavorite(comic.id)"
                  class="w-8 h-8 bg-red-500/90 rounded-full flex items-center justify-center hover:bg-red-500"
                >
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
              <!-- 继续阅读按钮 -->
              <div class="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-xs font-medium">
                  继续阅读
                </button>
              </div>
            </div>
            <h3 class="font-medium text-sm truncate mb-1">{{ comic.title }}</h3>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>{{ comic.status === 'completed' ? `全${comic.chapter_count}话` : `更新至${comic.chapter_count}话` }}</span>
              <span :class="comic.status === 'completed' ? 'text-blue-400' : 'text-green-400'">
                {{ comic.status === 'completed' ? '已完结' : '连载中' }}
              </span>
            </div>
          </NuxtLink>
        </div>

        <!-- 加载更多 -->
        <div v-if="totalPages > 1" class="flex justify-center mt-10">
          <button
            @click="loadMore"
            :disabled="loadingMore"
            class="px-8 py-3 rounded-full border border-purple-500/30 hover:bg-purple-500/10 transition-colors disabled:opacity-50"
          >
            {{ loadingMore ? '加载中...' : '加载更多' }}
          </button>
        </div>
      </div>
    </main>

    <!-- 底部导航 (移动端) -->
    <nav class="fixed bottom-0 left-0 right-0 glass-effect md:hidden z-50">
      <div class="flex items-center justify-around py-3">
        <NuxtLink to="/" class="flex flex-col items-center gap-1 text-gray-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span class="text-xs">首页</span>
        </NuxtLink>
        <NuxtLink to="/category" class="flex flex-col items-center gap-1 text-gray-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
          <span class="text-xs">分类</span>
        </NuxtLink>
        <NuxtLink to="/ranking" class="flex flex-col items-center gap-1 text-gray-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          <span class="text-xs">排行</span>
        </NuxtLink>
        <NuxtLink to="/user" class="flex flex-col items-center gap-1 text-purple-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <span class="text-xs">我的</span>
        </NuxtLink>
      </div>
    </nav>
    <div class="h-20 md:hidden"></div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const api = useApi()

const favorites = ref<any[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const total = ref(0)
const page = ref(1)
const totalPages = ref(1)
const sortBy = ref('time')

const loadFavorites = async () => {
  loading.value = true
  page.value = 1
  try {
    const data = await api.library.favorites(page.value)
    favorites.value = data.items
    total.value = data.total
    totalPages.value = data.total_pages
  } catch (e) {
    console.error('加载收藏失败', e)
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  if (page.value >= totalPages.value) return
  loadingMore.value = true
  page.value++
  try {
    const data = await api.library.favorites(page.value)
    favorites.value = [...favorites.value, ...data.items]
  } catch (e) {
    console.error('加载更多失败', e)
    page.value--
  } finally {
    loadingMore.value = false
  }
}

const removeFavorite = async (comicId: number) => {
  try {
    await api.comics.unfavorite(comicId)
    favorites.value = favorites.value.filter(f => f.id !== comicId)
    total.value--
  } catch (e) {
    console.error('取消收藏失败', e)
  }
}

onMounted(() => {
  loadFavorites()
})

useHead({
  title: '我的收藏 - ComicVerse'
})
</script>

<style scoped>
.comic-card {
  transition: all 0.3s;
  overflow: visible !important;
  border-radius: 0 !important;
}

.comic-card::after {
  display: none !important;
  content: none !important;
}

.comic-card:hover {
  transform: translateY(-4px);
}

.comic-card:hover .comic-cover {
  box-shadow: 0 10px 30px -10px rgba(168, 85, 247, 0.5);
}
</style>
