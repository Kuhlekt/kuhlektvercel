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

    const supabase = await createClient()

    const { data: articles, error } = await supabase
      .from("kb_articles")
      .select("title, content")
      .eq("is_published", true)

    console.log("[v0] Database articles found:", articles?.length || 0)

    let knowledgeContext = ""
    if (articles && articles.length > 0) {
      // Extract keywords for filtering
      const keywords = message
        .toLowerCase()
        .split(" ")
        .filter((word: string) => word.length > 2)

      let relevantArticles = articles
      if (keywords.length > 0) {
        const keywordFiltered = articles.filter((article: any) => {
          const searchText = `${article.title} ${article.content}`.toLowerCase()
          return keywords.some((keyword) => searchText.includes(keyword))
        })

        if (keywordFiltered.length > 0) {
          relevantArticles = keywordFiltered.slice(0, 30)
          console.log("[v0] Filtered to", keywordFiltered.length, "articles matching keywords, using top 30")
        } else {
          relevantArticles = articles.slice(0, 30)
          console.log("[v0] No keyword matches, using first 30 articles")
        }
      } else {
        relevantArticles = articles.slice(0, 30)
        console.log("[v0] No keywords extracted, using first 30 articles")
      }

      knowledgeContext = relevantArticles
        .map((article: { title: string; content: string }) => `ARTICLE: ${article.title}\n${article.content}\n---`)
        .join("\n\n")
      console.log("[v0] Using database knowledge base with", relevantArticles.length, "articles")
    } else {
      knowledgeContext = getKuhlektContext()
      console.log("[v0] Using static knowledge base (database empty)")
    }

    const prompt = `You are Kali, a helpful AI assistant for Kuhlekt, an AR automation and digital collections platform.

You have access to a comprehensive knowledge base about Kuhlekt. Use this knowledge base to answer questions accurately and helpfully.

KNOWLEDGE BASE:
${knowledgeContext}

USER QUESTION: ${message}

INSTRUCTIONS:
- Answer based on the knowledge base provided above
- Be specific and reference relevant information from the knowledge base
- For questions about features, explain what Kuhlekt offers
- For questions about implementation, reference the timeline and process
- For questions about results, cite the statistics (80% manual tasks eliminated, 30% DSO reduction, etc.)
- If the user asks about email, explain that Kuhlekt includes automated email workflows and communication features
- If the user asks about DOA or DSO (Days Sales Outstanding), explain how Kuhlekt reduces it by 30-35%
- Be concise, friendly, and helpful
- If appropriate, suggest relevant actions (e.g., "schedule a demo at /demo", "visit /solutions")
- Always provide value and demonstrate knowledge of Kuhlekt's capabilities

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
