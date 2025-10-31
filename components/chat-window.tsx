"use client"

import { useState, useEffect, useRef } from "react"

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId] = useState(() => crypto.randomUUID())
  const [sessionId] = useState(() => crypto.randomUUID())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage = { role: "user", content }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Save user message
      await fetch("/api/chat/save-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          sessionId,
          role: "user",
          content,
          isFirstMessage: messages.length === 0,
        }),
      })

      console.log("[v0] Fetching knowledge from external API...")
      const knowledgeUrl = `https://kuhlekt.com/api/public/knowledge?query=${encodeURIComponent(content)}&limit=15`
      console.log("[v0] Knowledge URL:", knowledgeUrl)

      // Fetch knowledge from external API
      const knowledgeResponse = await fetch(knowledgeUrl)
      console.log("[v0] Knowledge response status:", knowledgeResponse.status)
      console.log("[v0] Knowledge response ok:", knowledgeResponse.ok)

      let aiResponse = "I don't have specific information about that in my knowledge base."

      if (knowledgeResponse.ok) {
        const knowledgeData = await knowledgeResponse.json()
        console.log("[v0] Knowledge data received:", knowledgeData)
        console.log("[v0] Articles count:", knowledgeData?.articles?.length || 0)

        // Generate AI response using knowledge base
        const response = await fetch("/api/chat/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            knowledge: knowledgeData,
          }),
        })

        console.log("[v0] Generate response status:", response.status)

        if (response.ok) {
          const data = await response.json()
          aiResponse = data.response
          console.log("[v0] AI response generated successfully")
        } else {
          const errorData = await response.text()
          console.error("[v0] Generate response error:", errorData)
        }
      } else {
        const errorText = await knowledgeResponse.text()
        console.error("[v0] Knowledge API error:", errorText)
      }

      const assistantMessage = { role: "assistant", content: aiResponse }
      setMessages((prev) => [...prev, assistantMessage])

      // Save assistant message
      await fetch("/api/chat/save-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          sessionId,
          role: "assistant",
          content: aiResponse,
          isFirstMessage: false,
        }),
      })
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
          aria-label="Open chat"
        >
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20Cloud%20transparent%20b_ground%20with%20TM%20medium%20120%20Pxls-CbbxTHOilDdeFP6gjtxRLYxwHI9eMq.png"
            alt="Kuhlekt"
            className="h-12 w-12 object-contain"
          />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 py-3">
            <div className="flex items-center gap-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20Cloud%20transparent%20b_ground%20with%20TM%20medium%20120%20Pxls-CbbxTHOilDdeFP6gjtxRLYxwHI9eMq.png"
                alt="Kuhlekt"
                className="h-8 object-contain"
              />
              <span className="text-sm font-medium text-white">Kali Chat</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">Hi! I'm Kali, your Kuhlekt assistant.</p>
                <p className="text-sm mt-2">How can I help you today?</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === "user" ? "bg-cyan-500 text-white" : "bg-white text-gray-900 border border-gray-200"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t bg-white p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage(input)
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
