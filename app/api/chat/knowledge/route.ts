import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")
    const limit = searchParams.get("limit") || "15"

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    const externalApiUrl = process.env.EXTERNAL_CHATBOT_API_URL

    if (!externalApiUrl) {
      console.error("[v0] EXTERNAL_CHATBOT_API_URL environment variable is not set")
      return NextResponse.json(
        {
          error: "External API URL not configured",
          articles: [],
        },
        { status: 200 },
      )
    }

    // Construct the full API URL
    const apiUrl = externalApiUrl.endsWith("/api/public/knowledge")
      ? externalApiUrl
      : `${externalApiUrl}/api/public/knowledge`

    const url = `${apiUrl}?query=${encodeURIComponent(query)}&limit=${limit}`

    console.log("[v0] Fetching from external knowledge base:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] External API response status:", response.status)
    console.log("[v0] External API response content-type:", response.headers.get("content-type"))

    // Check if response is HTML (error page)
    const contentType = response.headers.get("content-type")
    if (contentType?.includes("text/html")) {
      console.error("[v0] External API returned HTML instead of JSON (likely 404 or error page)")
      return NextResponse.json(
        {
          error: "External API returned HTML instead of JSON",
          articles: [],
        },
        { status: 200 },
      )
    }

    if (!response.ok) {
      console.error("[v0] External API error:", response.status, response.statusText)
      return NextResponse.json(
        {
          error: `External API error: ${response.status}`,
          articles: [],
        },
        { status: 200 },
      )
    }

    const data = await response.json()
    console.log("[v0] Successfully fetched", data.articles?.length || 0, "articles from external API")

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching from external knowledge base:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch from external knowledge base",
        articles: [],
      },
      { status: 200 },
    )
  }
}
