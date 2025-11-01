import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { generateText } from "ai"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, sessionId, message } = body

    if (action === "init") {
      // Create new chat session
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      await sql`
        INSERT INTO chat_sessions (id, created_at, updated_at)
        VALUES (${newSessionId}, NOW(), NOW())
      `

      return NextResponse.json({ sessionId: newSessionId })
    }

    if (action === "message") {
      if (!sessionId || !message) {
        return NextResponse.json({ error: "Missing sessionId or message" }, { status: 400 })
      }

      // Save user message
      await sql`
        INSERT INTO chat_messages (session_id, role, content, created_at)
        VALUES (${sessionId}, 'user', ${message}, NOW())
      `

      // Fetch knowledge base context
      const knowledgeResults = await sql`
        SELECT title, content, category
        FROM bot_knowledge
        WHERE status = 'published'
        ORDER BY priority DESC, updated_at DESC
        LIMIT 10
      `

      const context = knowledgeResults.map((k: any) => `${k.title}\n${k.content}`).join("\n\n")

      // Generate AI response
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        system: `You are Kali, a helpful AI assistant for Kuhlekt, an AR automation and digital collections platform.

Use the following knowledge base to answer questions accurately:

${context}

Guidelines:
- Be friendly, professional, and concise
- Focus on Kuhlekt's AR automation and digital collections solutions
- If you don't know something, admit it and offer to connect them with a human agent
- Use the knowledge base context to provide accurate information`,
        prompt: message,
      })

      // Save assistant response
      await sql`
        INSERT INTO chat_messages (session_id, role, content, created_at)
        VALUES (${sessionId}, 'assistant', ${text}, NOW())
      `

      // Update session timestamp
      await sql`
        UPDATE chat_sessions
        SET updated_at = NOW()
        WHERE id = ${sessionId}
      `

      return NextResponse.json({ response: text })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
