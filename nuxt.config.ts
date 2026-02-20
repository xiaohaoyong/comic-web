export default defineNuxtConfig({
  ssr: true,
  
  devtools: { enabled: false },
  
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  
  app: {
    head: {
      title: 'ComicVerse - 漫画阅读平台',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'ComicVerse漫画阅读平台，海量高清漫画在线阅读，探索无限漫画世界' },
        { name: 'theme-color', content: '#0a0a12' },
        { name: 'keywords', content: '漫画,在线漫画,漫画阅读,免费漫画,VIP漫画,热血漫画,恋爱漫画,冒险漫画' },
        { property: 'og:title', content: 'ComicVerse - 漫画阅读平台' },
        { property: 'og:description', content: 'ComicVerse漫画阅读平台，海量高清漫画在线阅读' },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&family=Outfit:wght@300;400;500;600;700;800&display=swap' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      htmlAttrs: {
        lang: 'zh-CN',
        class: 'dark'
      },
      bodyAttrs: {
        class: 'bg-surface-400 text-slate-200 font-body'
      }
    }
  },
  
  css: [
    '@/assets/css/main.css'
  ],
  
  runtimeConfig: {
    apiBase: process.env.NUXT_API_BASE || 'http://api:8000/api/v1',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api/v1'
    }
  },
  
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: []
    }
  },
  
  routeRules: {
    '/': { swr: 3600 },
    '/comics': { swr: 3600 },
    '/comics/**': { swr: 7200 },
    '/chapters/**': { swr: 86400 }
  },
  
  compatibilityDate: '2024-11-01'
})
