<template>
  <nav class="fixed bottom-0 left-0 right-0 glass-effect md:hidden z-50">
    <div class="flex items-center justify-around py-3">
      <NuxtLink 
        v-for="item in navItems" 
        :key="item.path"
        :to="item.path" 
        class="flex flex-col items-center gap-1 transition-colors"
        :class="isActive(item.path) ? 'text-purple-400' : 'text-gray-400'"
      >
        <component :is="item.icon" class="w-6 h-6" />
        <span class="text-xs">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { h } from 'vue'

const route = useRoute()

const HomeIcon = {
  render: () => h('svg', { 
    fill: 'none', 
    stroke: 'currentColor', 
    viewBox: '0 0 24 24' 
  }, [
    h('path', { 
      'stroke-linecap': 'round', 
      'stroke-linejoin': 'round', 
      'stroke-width': '2', 
      d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
    })
  ])
}

const CategoryIcon = {
  render: () => h('svg', { 
    fill: 'none', 
    stroke: 'currentColor', 
    viewBox: '0 0 24 24' 
  }, [
    h('path', { 
      'stroke-linecap': 'round', 
      'stroke-linejoin': 'round', 
      'stroke-width': '2', 
      d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' 
    })
  ])
}

const LibraryIcon = {
  render: () => h('svg', { 
    fill: 'none', 
    stroke: 'currentColor', 
    viewBox: '0 0 24 24' 
  }, [
    h('path', { 
      'stroke-linecap': 'round', 
      'stroke-linejoin': 'round', 
      'stroke-width': '2', 
      d: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' 
    })
  ])
}

const UserIcon = {
  render: () => h('svg', { 
    fill: 'none', 
    stroke: 'currentColor', 
    viewBox: '0 0 24 24' 
  }, [
    h('path', { 
      'stroke-linecap': 'round', 
      'stroke-linejoin': 'round', 
      'stroke-width': '2', 
      d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' 
    })
  ])
}

const navItems = [
  { path: '/', label: '首页', icon: HomeIcon },
  { path: '/comics', label: '分类', icon: CategoryIcon },
  { path: '/library', label: '书架', icon: LibraryIcon },
  { path: '/user', label: '我的', icon: UserIcon }
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>
