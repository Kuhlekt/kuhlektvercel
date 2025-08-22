import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-key"

// Create a mock mode flag
export const isMockMode = supabaseUrl === "https://mock.supabase.co" || supabaseAnonKey === "mock-key"

// Create Supabase client with fallback for mock mode
export const supabase = isMockMode ? null : createClient(supabaseUrl, supabaseAnonKey)

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
