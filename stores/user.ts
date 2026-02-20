import { defineStore } from 'pinia'
import type { User } from '~/types'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    refreshToken: null as string | null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token && !!state.user,
    isVip: (state) => state.user?.is_vip ?? false
  },

  actions: {
    setAuth(token: string, refreshToken: string, user: User) {
      this.token = token
      this.refreshToken = refreshToken
      this.user = user
      if (import.meta.client) {
        localStorage.setItem('token', token)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('user', JSON.stringify(user))
      }
    },

    loadFromStorage() {
      if (import.meta.client) {
        const token = localStorage.getItem('token')
        const refreshToken = localStorage.getItem('refreshToken')
        const userStr = localStorage.getItem('user')
        if (token && userStr) {
          this.token = token
          this.refreshToken = refreshToken
          this.user = JSON.parse(userStr)
        }
      }
    },

    clearAuth() {
      this.token = null
      this.refreshToken = null
      this.user = null
      if (import.meta.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
    },

    updateUser(user: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...user }
        if (import.meta.client) {
          localStorage.setItem('user', JSON.stringify(this.user))
        }
      }
    }
  }
})
