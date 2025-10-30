import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { message, knowledge } = await request.json()

    // Extract relevant articles from knowledge base
    const articles = knowledge?.articles || []
    const knowledgeContext = articles
      .map((article: any) => `Article: ${article.title}\n${article.content}`)
      .join("\n\n")

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

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      temperature: 0.3,
      maxTokens: 500,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error generating response:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
