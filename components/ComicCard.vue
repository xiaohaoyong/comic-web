<template>
  <NuxtLink :to="`/comics/${comic.id}`" class="card-glow cursor-pointer block">
    <div class="comic-card aspect-[3/4] mb-3">
      <img
        :src="comic.cover_url || `https://picsum.photos/seed/${comic.id}/300/400`"
        :alt="comic.title"
        class="w-full h-full object-cover"
        loading="lazy"
      >
      <!-- VIP 标签 -->
      <div v-if="comic.is_vip" class="absolute top-2 left-2 z-10">
        <span class="px-2 py-0.5 bg-pink-500/90 rounded text-xs font-medium">VIP</span>
      </div>
      <!-- 免费/完结标签 -->
      <div v-else-if="comic.is_free" class="absolute top-2 left-2 z-10">
        <span class="px-2 py-0.5 bg-green-500/90 rounded text-xs font-medium">免费</span>
      </div>
      <div v-else-if="comic.status === 'completed'" class="absolute top-2 left-2 z-10">
        <span class="px-2 py-0.5 bg-blue-500/90 rounded text-xs font-medium">完结</span>
      </div>
      <!-- 章节更新 -->
      <div class="absolute top-2 right-2 z-10">
        <span class="px-2 py-0.5 bg-black/60 backdrop-blur rounded text-xs">
          {{ comic.chapter_count ? `更新至${comic.chapter_count}话` : '连载中' }}
        </span>
      </div>
      <!-- 底部信息 -->
      <div class="absolute bottom-0 left-0 right-0 p-3 z-10">
        <h3 class="font-medium text-sm mb-1 line-clamp-1">{{ comic.title }}</h3>
        <div class="flex items-center gap-2 text-xs text-gray-400">
          <span class="flex items-center gap-1">
            <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            {{ formatRating(comic.rating) }}
          </span>
          <span>{{ comic.category?.name || comic.category || '玄幻奇幻' }}</span>
        </div>
      </div>
    </div>
    
    <!-- 阅读进度条 (可选显示) -->
    <div v-if="showProgress && progress" class="flex items-center gap-2 text-xs text-gray-400">
      <div class="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div class="progress-bar h-full" :style="{ width: `${progress}%` }"></div>
      </div>
      <span>{{ progress }}%</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Comic } from '~/types'

const props = defineProps<{
  comic: Comic
  showProgress?: boolean
  progress?: number
}>()

const formatRating = (rating: number) => {
  if (!rating) return '4.5'
  return (rating / 10).toFixed(1)
}
</script>
