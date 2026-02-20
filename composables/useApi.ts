import type { Comic, Chapter, ChapterDetail, User, PaginatedResponse, ChapterAccess, ReadingHistoryItem } from '~/types'

export const useApi = () => {
  const config = useRuntimeConfig()
  const userStore = useUserStore()
  
  const baseURL = config.public.apiBase

  const fetch = $fetch.create({
    baseURL,
    headers: {
      ...userStore.token ? { Authorization: `Bearer ${userStore.token}` } : {}
    },
    onResponseError({ response }) {
      if (response.status === 401 && import.meta.client) {
        userStore.clearAuth()
        if (window.location.pathname.startsWith('/user')) {
          navigateTo('/login')
        }
      }
    }
  })

  const fetchWithAuth = (url: string, options: any = {}) => {
    const headers = {
      ...options.headers || {},
      ...userStore.token ? { Authorization: `Bearer ${userStore.token}` } : {}
    }
    return fetch(url, { ...options, headers })
  }

  return {
    auth: {
      register: (data: { username: string; email: string; password: string }) =>
        fetch<User>('/auth/register', { method: 'POST', body: data }),
      
      login: (data: { login: string; password: string }) =>
        fetch<{ access_token: string; refresh_token: string }>('/auth/login', { method: 'POST', body: data }),
      
      sendVerifyEmail: (data: { email: string; type: string }) =>
        fetch('/auth/send-verify-email', { method: 'POST', body: data }),
      
      verifyEmail: (data: { email: string; code: string }) =>
        fetch('/auth/verify-email', { method: 'POST', body: data }),
      
      resetPassword: (data: { email: string; code: string; new_password: string }) =>
        fetch('/auth/reset-password', { method: 'POST', body: data })
    },

    user: {
      profile: (token?: string) => {
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        return fetch<User>('/user/profile', { headers })
      },
      
      updateProfile: (data: { username?: string; avatar_url?: string }) =>
        fetchWithAuth<User>('/user/profile', { method: 'PUT', body: data }),
      
      points: () => fetchWithAuth<{ points: number }>('/user/points'),
      
      pointsRecords: (page = 1) =>
        fetchWithAuth<PaginatedResponse<any>>('/user/points/records', { query: { page } }),
      
      checkin: () => fetchWithAuth<{ message: string; points: number; total: number }>('/user/checkin', { method: 'POST' }),
      
      activateVip: (cardNumber: string) =>
        fetchWithAuth('/user/vip/activate', { method: 'POST', body: { card_number: cardNumber } }),
      
      changePassword: (data: { old_password: string; new_password: string }) =>
        fetchWithAuth('/user/change-password', { method: 'POST', body: data }),
      
      changeEmail: (data: { new_email: string; code: string }) =>
        fetchWithAuth('/user/change-email', { method: 'POST', body: data })
    },

    comics: {
      list: (params: { page?: number; category_id?: number; category_slug?: string; status?: string; keyword?: string; sort?: string }) =>
        fetch<PaginatedResponse<Comic>>('/comics', { query: params }),
      
      featured: (limit = 10) =>
        fetch<Comic[]>('/comics/featured', { query: { limit } }),
      
      categories: () =>
        fetch<{ id: number; name: string; slug: string; comic_count: number }[]>('/comics/categories'),
      
      get: (id: number) => fetch<Comic>(`/comics/${id}`),
      
      chapters: (comicId: number) => fetch<Chapter[]>(`/comics/${comicId}/chapters`),
      
      favorite: (comicId: number) =>
        fetchWithAuth(`/comics/${comicId}/favorite`, { method: 'POST' }),
      
      unfavorite: (comicId: number) =>
        fetchWithAuth(`/comics/${comicId}/favorite`, { method: 'DELETE' })
    },

    chapters: {
      access: (chapterId: number) =>
        fetchWithAuth<ChapterAccess>(`/chapters/${chapterId}/access`),
      
      get: (chapterId: number) =>
        fetchWithAuth<ChapterDetail>(`/chapters/${chapterId}`),
      
      unlock: (chapterId: number) =>
        fetchWithAuth(`/chapters/${chapterId}/unlock`, { method: 'POST' }),
      
      saveProgress: (chapterId: number, progress: number) =>
        fetchWithAuth(`/chapters/${chapterId}/progress`, {
          method: 'POST',
          body: { chapter_id: chapterId, progress_percent: progress }
        })
    },

    library: {
      favorites: (page = 1) =>
        fetchWithAuth<PaginatedResponse<Comic>>('/user/favorites', { query: { page } }),
      
      history: (page = 1) =>
        fetchWithAuth<PaginatedResponse<ReadingHistoryItem>>('/user/history', { query: { page } }),
      
      clearHistory: () =>
        fetchWithAuth('/user/history', { method: 'DELETE' })
    },

    comments: {
      list: (comicId: number, page = 1) =>
        fetch<PaginatedResponse<any>>(`/comics/${comicId}/comments`, { query: { page } }),
      
      create: (comicId: number, content: string) =>
        fetchWithAuth(`/comics/${comicId}/comments`, { method: 'POST', body: { content } }),
      
      like: (commentId: number) =>
        fetchWithAuth(`/comments/${commentId}/like`, { method: 'POST' }),
      
      unlike: (commentId: number) =>
        fetchWithAuth(`/comments/${commentId}/like`, { method: 'DELETE' })
    }
  }
}
