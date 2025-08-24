import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// Check if we're in a real Supabase environment
export const isMockMode = supabaseUrl === "https://placeholder.supabase.co" || supabaseAnonKey === "placeholder-key"

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock database for preview mode
export const mockDatabase = {
  categories: [],
  users: [
    {
      id: "1",
      username: "admin",
      password: "admin123",
      email: "admin@example.com",
      role: "admin" as const,
      createdAt: new Date(),
      lastLogin: new Date(),
    },
  ],
  auditLog: [],
  pageVisits: 0,
}
