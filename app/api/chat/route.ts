import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, conversationId } = await request.json()

    console.log("[v0] Chat API called with message:", message)
    console.log("[v0] Session ID:", sessionId)
    console.log("[v0] Conversation ID:", conversationId)

    const supabase = await createClient()

    const { data: knowledgeResults, error: knowledgeError } = await supabase
      .from("kb_articles")
      .select("title, content")
      .eq("is_published", true)
      .or(`title.ilike.%${message}%,content.ilike.%${message}%`)
      .limit(5)

    if (knowledgeError) {
      console.error("[v0] Error fetching knowledge:", knowledgeError)
      throw knowledgeError
    }

    console.log("[v0] Knowledge articles found:", knowledgeResults?.length || 0)

    const knowledgeContext = (knowledgeResults || [])
      .map((article: any) => `Article: ${article.title}\n${article.content}`)
      .join("\n\n")

    const prompt = `You are Kali, a helpful AI assistant for Kuhlekt, an AR automation and digital collections platform.

Use ONLY the following knowledge base to answer the user's question. If the answer is not in the knowledge base, say "I don't have specific information about that in my knowledge base, but I'd be happy to help you get in touch with our team."

Knowledge Base:
${knowledgeContext}

User Question: ${message}

Instructions:
- Answer based ONLY on the knowledge base provided
- Be concise, friendly, and helpful
- If you don't know, say so clearly and offer to connect them with support
- Quote directly from the knowledge base when relevant`

    console.log("[v0] Generating AI response...")
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      temperature: 0.3,
      maxTokens: 500,
    })

    console.log("[v0] AI response generated")

    if (conversationId) {
      // Save user message
      await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        role: "user",
        content: message,
      })

      // Save assistant response
      await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: text,
      })

      // Update conversation last_message_at
      await supabase
        .from("chat_conversations")
        .update({
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("conversation_id", conversationId)
        .select()
        .then(async ({ data }) => {
          if (data && data[0]) {
            const currentCount = data[0].message_count || 0
            await supabase
              .from("chat_conversations")
              .update({ message_count: currentCount + 2 })
              .eq("conversation_id", conversationId)
          }
        })

      console.log("[v0] Messages saved to database")
    }

    return NextResponse.json({
      response: text,
      conversationId: conversationId,
    })
  } catch (error) {
    console.error("[v0] Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
