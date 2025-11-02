import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

// CORS headers for external widget
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept",
  "Access-Control-Max-Age": "86400",
}

// Validation schema for chat messages
const chatMessageSchema = z.object({
  message: z.string().min(1, "Message is required"),
  sessionId: z.string().optional(),
  userId: z.string().optional(),
})

// Handle OPTIONS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Chat message endpoint called")

    // Parse request body
    const body = await request.json()
    console.log("[v0] Request body:", body)

    // Validate input
    const validation = chatMessageSchema.safeParse(body)
    if (!validation.success) {
      console.log("[v0] Validation failed:", validation.error.issues)
      return NextResponse.json(
        {
          error: "Invalid request",
          details: validation.error.issues[0]?.message,
        },
        { status: 400, headers: corsHeaders },
      )
    }

    const { message, sessionId } = validation.data

    // Search knowledge base for relevant articles
    const supabase = await createClient()
    const { data: articles, error: kbError } = await supabase
      .from("kb_articles")
      .select("title, content, tags")
      .eq("is_published", true)
      .ilike("content", `%${message.split(" ").slice(0, 3).join("%")}%`)
      .limit(3)

    if (kbError) {
      console.error("[v0] KB search error:", kbError)
    }

    console.log("[v0] Found KB articles:", articles?.length || 0)

    // Build context from KB articles
    let context = ""
    if (articles && articles.length > 0) {
      context = articles.map((article) => `${article.title}\n${article.content}`).join("\n\n")
    }

    // Generate AI response using OpenAI
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are Kali, a helpful AI assistant for Kuhlekt, a company that provides AI-powered solutions. Use the following knowledge base information to answer questions accurately and helpfully. If the information isn't in the knowledge base, provide a general helpful response and suggest contacting support for specific details.\n\nKnowledge Base:\n${context || "No specific knowledge base articles found for this query."}`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error("[v0] OpenAI API error:", errorText)
      throw new Error("Failed to generate AI response")
    }

    const aiData = await openaiResponse.json()
    const aiMessage =
      aiData.choices[0]?.message?.content || "I apologize, but I was unable to generate a response. Please try again."

    console.log("[v0] AI response generated successfully")

    // Return response
    return NextResponse.json(
      {
        success: true,
        message: aiMessage,
        sessionId: sessionId || `session_${Date.now()}`,
        sources: articles?.map((a) => a.title) || [],
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error("[v0] Error processing chat message:", error)
    return NextResponse.json(
      {
        error: "Failed to process message",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers: corsHeaders },
    )
  }
}
