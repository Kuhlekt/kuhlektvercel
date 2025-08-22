import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const isMockMode = !supabaseUrl || !supabaseAnonKey

export const supabase = isMockMode ? null : createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface DatabaseUser {
  id: string
  username: string
  password: string
  email: string | null
  role: "admin" | "editor" | "viewer"
  created_at: string
  updated_at: string
  last_login: string | null
}

export interface DatabaseArticle {
  id: string
  title: string
  content: string
  category_id: string
  subcategory_id: string | null
  tags: string[] | null
  created_by: string
  last_edited_by: string
  edit_count: number
  created_at: string
  updated_at: string
}

export interface DatabaseAuditLog {
  id: string
  action: string
  article_id: string | null
  article_title: string | null
  category_id: string | null
  category_name: string | null
  subcategory_name: string | null
  user_id: string | null
  username: string | null
  performed_by: string
  timestamp: string
  details: string | null
}
