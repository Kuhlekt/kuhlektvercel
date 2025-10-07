import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

// Create Supabase client for Server Components
export async function createClient() {
  const cookieStore = await cookies()

  if (!isSupabaseConfigured) {
    console.warn("Supabase environment variables are not set. Using dummy client.")
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              eq: () => ({
                gt: () => ({
                  order: () => ({
                    limit: async () => ({ data: null, error: new Error("Supabase not configured") }),
                  }),
                }),
              }),
            }),
          }),
        }),
        insert: () => ({
          select: async () => ({ data: null, error: new Error("Supabase not configured") }),
        }),
        update: () => ({
          eq: async () => ({ data: null, error: new Error("Supabase not configured") }),
        }),
      }),
    } as any
  }

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch (error) {
          // Handle cookies in Server Components
          console.error("Error setting cookies:", error)
        }
      },
    },
  })
}
