import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface DatabaseUser {
  id: string
  username: string
  password: string
  email?: string
  role: "admin" | "editor" | "viewer"
  created_at: string
  last_login?: string
  updated_at: string
}

export interface DatabaseCategory {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface DatabaseSubcategory {
  id: string
  name: string
  description?: string
  category_id: string
  created_at: string
  updated_at: string
}

export interface DatabaseArticle {
  id: string
  title: string
  content: string
  category_id: string
  subcategory_id?: string
  tags: string[]
  created_by: string
  last_edited_by?: string
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
  details?: string
  timestamp: string
}
