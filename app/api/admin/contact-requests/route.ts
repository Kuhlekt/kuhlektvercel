import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    // Check admin authentication
    const cookieStore = await cookies()
    const authCookie = cookieStore.get("admin-auth")

    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create Supabase client
    const supabase = await createClient()

    // Fetch all contact requests
    const { data, error } = await supabase.from("form_submitters").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching contact requests:", error)
      return NextResponse.json({ error: "Failed to fetch contact requests", details: error.message }, { status: 500 })
    }

    return NextResponse.json({
      requests: data || [],
    })
  } catch (error: any) {
    console.error("[v0] Error in contact-requests API:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}
