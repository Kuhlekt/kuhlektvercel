import { createBrowserClient } from "@supabase/ssr"

export const isSupabaseConfigured = (() => {
  try {
    return (
      typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
      process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
      process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("https://") &&
      typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0
    )
  } catch {
    return false
  }
})()

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

try {
  if (isSupabaseConfigured) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  } else {
    console.warn("Supabase not configured, using mock client")
    supabaseClient = {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithPassword: () =>
          Promise.resolve({ data: { user: null, session: null }, error: { message: "Supabase not configured" } }),
        signUp: () =>
          Promise.resolve({ data: { user: null, session: null }, error: { message: "Supabase not configured" } }),
        signOut: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        upsert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
      }),
    } as any
  }
} catch (error) {
  console.error("Failed to initialize Supabase client:", error)
  supabaseClient = {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: { message: "Client initialization failed" } }),
      getSession: () =>
        Promise.resolve({ data: { session: null }, error: { message: "Client initialization failed" } }),
      signInWithPassword: () =>
        Promise.resolve({ data: { user: null, session: null }, error: { message: "Client initialization failed" } }),
      signUp: () =>
        Promise.resolve({ data: { user: null, session: null }, error: { message: "Client initialization failed" } }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => Promise.resolve({ data: [], error: { message: "Client initialization failed" } }),
      insert: () => Promise.resolve({ data: null, error: { message: "Client initialization failed" } }),
      upsert: () => Promise.resolve({ data: null, error: { message: "Client initialization failed" } }),
      update: () => Promise.resolve({ data: null, error: { message: "Client initialization failed" } }),
      delete: () => Promise.resolve({ data: null, error: { message: "Client initialization failed" } }),
    }),
  } as any
}

export const supabase = supabaseClient!
