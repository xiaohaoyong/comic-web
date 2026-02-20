export default defineNuxtPlugin({
  name: 'user-store-plugin',
  mode: 'client',
  setup() {
    const userStore = useUserStore()
    userStore.loadFromStorage()
  }
})
