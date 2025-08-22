import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Check if we're in a browser environment and have valid config
export const isMockMode = !supabaseUrl || !supabaseAnonKey || typeof window === "undefined"

export const supabase = isMockMode ? null : createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface DatabaseUser {
  id: string
  username: string
  password: string
  email: string
  role: "admin" | "editor" | "viewer"
  created_at: string
  updated_at: string
  last_login?: string
}

export interface DatabaseArticle {
  id: string
  title: string
  content: string
  category_id: string
  subcategory_id?: string
  tags: string[]
  created_by: string
  last_edited_by: string
  edit_count: number
  created_at: string
  updated_at: string
}

export interface DatabaseAuditLog {
  id: string
  action: string
  article_id?: string
  article_title?: string
  category_id?: string
  category_name?: string
  subcategory_name?: string
  user_id?: string
  username?: string
  performed_by: string
  timestamp: string
  details?: string
}
