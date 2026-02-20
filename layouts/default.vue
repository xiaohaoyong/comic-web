<template>
  <div class="min-h-screen bg-surface-400">
    <!-- 噪点覆盖层 -->
    <div class="noise-overlay"></div>
    
    <slot />
    
    <!-- 移动端底部导航 -->
    <MobileNav />
    
    <!-- 移动端底部占位 -->
    <div class="h-20 md:hidden"></div>
  </div>
</template>
