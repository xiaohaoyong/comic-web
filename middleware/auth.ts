export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) {
    return
  }
  
  const userStore = useUserStore()
  
  if (!userStore.isLoggedIn) {
    return navigateTo('/login', { query: { redirect: to.fullPath } })
  }
})
