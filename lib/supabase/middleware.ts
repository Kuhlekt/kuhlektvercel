import { NextResponse, type NextRequest } from "next/server"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

export async function updateSession(request: NextRequest) {
  // If Supabase is not configured, just continue without auth
  if (!isSupabaseConfigured) {
    return NextResponse.next({
      request,
    })
  }

  // For now, just pass through all requests to avoid webpack compilation issues
  // Auth functionality can be re-implemented using direct Supabase client calls
  return NextResponse.next({
    request,
  })
}
