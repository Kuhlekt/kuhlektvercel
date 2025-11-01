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

    const { count: totalCount } = await supabase.from("kb_articles").select("*", { count: "exact", head: true })

    console.log("[v0] Total articles in database:", totalCount)

    const { count: publishedCount } = await supabase
      .from("kb_articles")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true)

    console.log("[v0] Published articles:", publishedCount)

    // Extract keywords from the message for better search
    const keywords = message
      .toLowerCase()
      .split(" ")
      .filter((word: string) => word.length > 2)
    console.log("[v0] Search keywords:", keywords)

    let articles = []
    let error = null

    // Try to get published articles
    const { data: publishedData, error: publishedError } = await supabase
      .from("kb_articles")
      .select("title, content, is_published")
      .eq("is_published", true)
      .limit(20)

    console.log("[v0] Published articles query returned:", publishedData?.length || 0, "articles")

    if (publishedError) {
      console.error("[v0] Published articles query error:", publishedError)
    }

    if (!publishedData || publishedData.length === 0) {
      console.log("[v0] No published articles found, trying to get any articles...")
      const { data: anyData, error: anyError } = await supabase
        .from("kb_articles")
        .select("title, content, is_published")
        .limit(20)

      console.log("[v0] Any articles query returned:", anyData?.length || 0, "articles")
      if (anyData && anyData.length > 0) {
        console.log(
          "[v0] Sample is_published values:",
          anyData.slice(0, 3).map((a) => a.is_published),
        )
      }

      articles = anyData || []
      error = anyError
    } else {
      articles = publishedData
    }

    if (articles.length > 0 && keywords.length > 0) {
      const keywordFiltered = articles.filter((article: any) => {
        const searchText = `${article.title} ${article.content}`.toLowerCase()
        return keywords.some((keyword) => searchText.includes(keyword))
      })

      if (keywordFiltered.length > 0) {
        articles = keywordFiltered
        console.log("[v0] Filtered to", articles.length, "articles matching keywords")
      } else {
        console.log("[v0] No keyword matches, using all articles")
      }
    }

    console.log("[v0] Final articles count:", articles?.length || 0)

    // Build knowledge context from articles
    let knowledgeContext = ""
    if (articles && articles.length > 0) {
      knowledgeContext = articles
        .map((article: { title: string; content: string }) => `ARTICLE: ${article.title}\n${article.content}\n---`)
        .join("\n\n")
      console.log("[v0] Using database knowledge base with", articles.length, "articles")
    } else {
      knowledgeContext = "No articles found in the knowledge base."
      console.log("[v0] No articles found at all")
    }

    const prompt = `You are Kali, a helpful AI assistant for Kuhlekt, an AR automation and digital collections platform.

You have access to a knowledge base with articles about Kuhlekt. Use this knowledge base to answer questions accurately and helpfully.

KNOWLEDGE BASE:
${knowledgeContext}

USER QUESTION: ${message}

INSTRUCTIONS:
- Answer based on the knowledge base articles provided above
- Be specific and cite information from the articles
- If multiple articles are relevant, synthesize the information
- If the knowledge base has relevant information, use it to provide a detailed answer
- If no relevant articles were found, politely say you don't have specific information about that topic and offer to help the user get in touch with the team
- Be concise, friendly, and helpful
- If appropriate, suggest relevant actions (e.g., "schedule a demo", "contact our team")

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
