"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendChatMessage } from "@/app/actions/chat"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! 👋 I'm Kali, your Kuhlekt assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("product") || lowerMessage.includes("solution")) {
      return "Kuhlekt offers comprehensive cloud solutions including data management, analytics, and enterprise integration. Would you like to learn more about a specific product area?"
    }

    if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("pricing")) {
      return "Our pricing is tailored to your specific needs and scale. I'd recommend scheduling a consultation with our team to discuss the best plan for you. Would you like me to help you get in touch?"
    }

    if (lowerMessage.includes("demo") || lowerMessage.includes("trial")) {
      return "Great! You can request a demo through our contact form. Our team typically responds within 24 hours to schedule a personalized demonstration. Would you like me to guide you to the demo request page?"
    }

    if (lowerMessage.includes("support") || lowerMessage.includes("help") || lowerMessage.includes("contact")) {
      return "Our support team is here to help! You can reach us through our contact form, or email us directly. For urgent matters, we also offer priority support for enterprise customers. What kind of assistance do you need?"
    }

    if (lowerMessage.includes("feature") || lowerMessage.includes("capability")) {
      return "Kuhlekt provides advanced features including real-time analytics, automated workflows, secure data storage, and seamless integrations. Which specific capabilities are you interested in learning about?"
    }

    if (lowerMessage.includes("security") || lowerMessage.includes("compliance")) {
      return "Security is our top priority. Kuhlekt is compliant with industry standards and offers enterprise-grade encryption, access controls, and regular security audits. Would you like more detailed information about our security measures?"
    }

    if (lowerMessage.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with today?"
    }

    return "I'd be happy to help you with that! For detailed information, I recommend exploring our website or contacting our team directly. Is there a specific aspect of Kuhlekt you'd like to know more about?"
  }

  const simulateTyping = async (text: string) => {
    const words = text.split(" ")
    let currentText = ""

    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? " " : "") + words[i]
      setMessages((prev) => {
        const newMessages = [...prev]
        const lastMessage = newMessages[newMessages.length - 1]
        if (lastMessage.role === "assistant") {
          lastMessage.content = currentText
        }
        return newMessages
      })
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMessage = input.trim()
    setInput("")

    const newMessages = [...messages, { role: "user" as const, content: userMessage }]
    setMessages(newMessages)
    setIsTyping(true)

    // Add placeholder for assistant message
    setMessages((prev) => [...prev, { role: "assistant", content: "" }])

    try {
      const result = await sendChatMessage(newMessages.map((m) => ({ role: m.role, content: m.content })))

      if (result.success && result.message) {
        await simulateTyping(result.message)
      } else {
        await simulateTyping("I apologize, but I encountered an error. Please try again.")
      }
    } catch (error) {
      console.error("[v0] Chat error:", error)
      await simulateTyping("I apologize, but I encountered an error. Please try again.")
    }

    setIsTyping(false)
  }

  return (
    <>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
          aria-label="Open chat"
        >
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20200%20Pxls%20-%20Copy-60iaM5ygzmdd6ULAwb5yMc9bzHJ8J6.png"
            alt="Kuhlekt"
            className="w-8 h-8 object-contain"
          />
        </button>
      ) : (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20200%20Pxls%20-%20Copy-60iaM5ygzmdd6ULAwb5yMc9bzHJ8J6.png"
                  alt="Kuhlekt"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Kali Assistant</h3>
                <p className="text-xs text-gray-600">Always here to help</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-white/50">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content.split(/(Kuhlekt)/g).map((part, i) =>
                      part === "Kuhlekt" ? (
                        <span
                          key={i}
                          className={message.role === "assistant" ? "text-white font-semibold" : "font-semibold"}
                        >
                          {part}
                        </span>
                      ) : (
                        part
                      ),
                    )}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && messages[messages.length - 1]?.content === "" && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isTyping}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isTyping || !input.trim()}
                size="icon"
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
