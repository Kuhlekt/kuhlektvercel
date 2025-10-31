import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { message, knowledge } = await request.json()

    console.log("[v0] Generate API called with message:", message)
    console.log("[v0] Knowledge data structure:", JSON.stringify(knowledge, null, 2))

    // Extract relevant articles from knowledge base
    const articles = knowledge?.articles || []
    console.log("[v0] Articles extracted:", articles.length)

    const knowledgeContext = articles
      .map((article: any) => `Article: ${article.title}\n${article.content}`)
      .join("\n\n")

    console.log("[v0] Knowledge context length:", knowledgeContext.length)

    const prompt = `You are Kali, a helpful assistant for Kuhlekt, an AR automation and digital collections platform.

Use ONLY the following knowledge base to answer the user's question. If the answer is not in the knowledge base, say "I don't have specific information about that in my knowledge base."

Knowledge Base:
${knowledgeContext}

User Question: ${message}

Instructions:
- Answer based ONLY on the knowledge base provided
- Be concise and helpful
- If you don't know, say so clearly
- Quote directly from the knowledge base when relevant`

    console.log("[v0] Calling AI model...")
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      temperature: 0.3,
      maxTokens: 500,
    })

    console.log("[v0] AI response generated:", text.substring(0, 100) + "...")
    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("[v0] Error generating response:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
