import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const visitorData = await request.json()

    // Insert visitor data into Supabase
    const { error } = await supabase.from("visitor_tracking").insert([visitorData])

    if (error) {
      console.error("Error inserting visitor data:", error)
      return NextResponse.json({ error: "Failed to track visitor" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking visitor:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
