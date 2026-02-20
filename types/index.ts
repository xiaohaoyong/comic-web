export interface Comic {
  id: number
  title: string
  slug: string
  cover_url: string | null
  description: string | null
  author: string | null
  category: string | null
  tags: string[] | null
  status: 'ongoing' | 'completed'
  free_chapters_count: number
  total_views: number
  rating: number
  is_featured: boolean
  chapter_count: number
  is_favorite: boolean
  created_at: string
}

export interface Chapter {
  id: number
  chapter_number: number
  title: string
  points_required: number
  is_vip_only: boolean
  is_free: boolean
  can_read: boolean
  is_unlocked: boolean
  created_at: string
}

export interface ChapterDetail {
  id: number
  comic_id: number
  chapter_number: number
  title: string
  points_required: number
  is_vip_only: boolean
  image_urls: string[]
  prev_chapter_id: number | null
  next_chapter_id: number | null
}

export interface User {
  id: number
  username: string
  email: string
  email_verified: boolean
  points: number
  is_vip: boolean
  vip_expire_time: string | null
  avatar_url: string | null
  created_at: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface ChapterAccess {
  can_read: boolean
  reason: string | null
  points_needed: number | null
  user_points: number | null
  vip_can_read: boolean | null
}

export interface ReadingHistoryItem {
  comic: Comic
  last_chapter_id: number | null
  progress_percent: number
  last_read_at: string
}
