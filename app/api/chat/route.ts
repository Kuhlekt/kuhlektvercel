import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { getKuhlektContext } from "@/lib/kuhlekt-knowledge-base"

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, conversationId } = await request.json()

    console.log("[v0] Chat API called with message:", message)
    console.log("[v0] Session ID:", sessionId)
    console.log("[v0] Conversation ID:", conversationId)

    const knowledgeContext = getKuhlektContext()
    console.log("[v0] Using static knowledge base")

    const prompt = `You are Kali, a helpful AI assistant for Kuhlekt, an AR automation and digital collections platform.

You have access to a comprehensive knowledge base about Kuhlekt. Use this knowledge base to answer questions accurately and helpfully.

KNOWLEDGE BASE:
${knowledgeContext}

USER QUESTION: ${message}

INSTRUCTIONS:
- Answer based on the knowledge base provided above
- Search the entire knowledge base thoroughly - information may be in different sections
- Make connections between related concepts (e.g., "email" relates to "communication", "workflows", "automation")
- Be specific and cite relevant features, statistics, or capabilities from the knowledge base
- If the exact answer isn't explicitly stated but can be inferred from the knowledge base, provide that inference
- Only say you don't have information if the topic is truly not covered anywhere in the knowledge base
- Be concise, friendly, and helpful
- If appropriate, suggest relevant pages or actions (e.g., "schedule a demo", "visit /solutions")

Answer the user's question now:`

    console.log("[v0] Generating AI response...")
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      temperature: 0.3,
      maxTokens: 500,
    })

    console.log("[v0] AI response generated")

    if (conversationId) {
      const supabase = await createClient()

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
