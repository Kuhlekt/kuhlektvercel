import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// CORS headers for external widget
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept",
  "Access-Control-Max-Age": "86400",
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    console.log("[v0] Knowledge base query received:", query)

    // Search database for published articles
    const supabase = await createClient()
    const { data: articles, error } = await supabase
      .from("kb_articles")
      .select("id, title, content, tags")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("[v0] Error fetching KB articles:", error)
    }

    console.log("[v0] Found", articles?.length || 0, "published articles")

    return NextResponse.json(
      {
        success: true,
        articles: articles || [],
        message: "Knowledge base retrieved successfully",
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error("[v0] Error in knowledge endpoint:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve knowledge base",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers: corsHeaders },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Knowledge base GET request received")

    // Get all published articles
    const supabase = await createClient()
    const { data: articles, error } = await supabase
      .from("kb_articles")
      .select("id, title, content, tags")
      .eq("is_published", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching KB articles:", error)
    }

    console.log("[v0] Found", articles?.length || 0, "published articles")

    return NextResponse.json(
      {
        success: true,
        articles: articles || [],
        message: "Knowledge base retrieved successfully",
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error("[v0] Error in knowledge endpoint:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve knowledge base",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers: corsHeaders },
    )
  }
}
