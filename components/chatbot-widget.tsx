"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, MessageCircle, Send, Bot } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp?: string
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        'Hello! I\'m Kali, your AI assistant. How can I help you today?\n\nNeed to speak with a human?\nType /human or click the "Talk to Human" button above.',
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [showHandoffForm, setShowHandoffForm] = useState(false)
  const [handoffData, setHandoffData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !conversationId) {
      setConversationId(`conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    }
  }, [isOpen, conversationId])

  const handleHandoff = () => {
    console.log("[v0] Handoff requested - showing contact form")
    setShowHandoffForm(true)
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "I'd be happy to connect you with a human agent! Please provide your contact information below.",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      },
    ])
  }

  const submitHandoff = async () => {
    if (!handoffData.firstName || !handoffData.lastName || !handoffData.email) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Please fill in all required fields (first name, last name, and email).",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        },
      ])
      return
    }

    console.log("[v0] Submitting handoff with contact info:", handoffData)
    setShowHandoffForm(false)

    try {
      const response = await fetch("/api/chat/handoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversationId,
          sessionId: conversationId,
          userName: `${handoffData.firstName} ${handoffData.lastName}`,
          userEmail: handoffData.email,
          phone: handoffData.phone || null,
          reason: "User requested human assistance",
        }),
      })

      console.log("[v0] Handoff response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Handoff created successfully:", data)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Thank you! I've connected you with our team. A human agent will contact you shortly at the email or phone number you provided.",
            timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          },
        ])
        // Reset form
        setHandoffData({ firstName: "", lastName: "", email: "", phone: "" })
      } else {
        console.error("[v0] Handoff failed with status:", response.status)
        const errorText = await response.text()
        console.error("[v0] Error response:", errorText)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I'm having trouble processing your request. Please try again or contact support directly.",
            timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          },
        ])
      }
    } catch (error) {
      console.error("[v0] Error creating handoff:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting you to a human agent. Please try again or contact support directly.",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        },
      ])
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      },
    ])

    const lowerMessage = userMessage.toLowerCase().trim()
    if (
      lowerMessage === "/human" ||
      lowerMessage === "human" ||
      lowerMessage === "talk to human" ||
      lowerMessage === "speak to human" ||
      lowerMessage === "agent" ||
      lowerMessage === "representative"
    ) {
      console.log("[v0] Handoff trigger detected:", userMessage)
      handleHandoff()
      return
    }

    setIsLoading(true)

    try {
      console.log("[v0] Sending message to /api/chat:", userMessage)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversationId: conversationId,
          sessionId: conversationId,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Received response from /api/chat:", data)

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        },
      ])
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again.",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-cyan-500 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
          aria-label="Open chat"
        >
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20200%20Pxls%20-%20Copy-60iaM5ygzmdd6ULAwb5yMc9bzHJ8J6.png"
            alt="Kuhlekt"
            className="h-10 w-10 object-contain"
          />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-200">
          <div className="flex items-center justify-between bg-cyan-400 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <span className="text-2xl font-bold text-cyan-400">K</span>
              </div>
              <div>
                <div className="text-lg font-semibold text-white">Kali AI</div>
                <div className="text-sm text-white/90">Online</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleHandoff}
                className="flex items-center gap-2 rounded-lg bg-white/20 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/30"
                aria-label="Talk to Human"
              >
                <MessageCircle className="h-4 w-4" />
                Talk to Human
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-cyan-400">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <div
                    className={`max-w-[280px] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-cyan-400 text-white rounded-tr-sm"
                        : "bg-white text-gray-900 border border-gray-200 rounded-tl-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                  {message.timestamp && <span className="text-xs text-gray-500 px-2">{message.timestamp}</span>}
                </div>
              </div>
            ))}
            {showHandoffForm && (
              <div className="flex gap-3 justify-start">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-cyan-400">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 max-w-[280px] rounded-2xl rounded-tl-sm px-4 py-3 bg-white border border-gray-200">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        value={handoffData.firstName}
                        onChange={(e) => setHandoffData({ ...handoffData, firstName: e.target.value })}
                        className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        value={handoffData.lastName}
                        onChange={(e) => setHandoffData({ ...handoffData, lastName: e.target.value })}
                        className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                        placeholder="Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={handoffData.email}
                        onChange={(e) => setHandoffData({ ...handoffData, email: e.target.value })}
                        className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={handoffData.phone}
                        onChange={(e) => setHandoffData({ ...handoffData, phone: e.target.value })}
                        className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <button
                      onClick={submitHandoff}
                      className="w-full rounded-lg bg-cyan-400 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-500"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-cyan-400">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div className="max-w-[280px] rounded-2xl rounded-tl-sm px-4 py-3 bg-white border border-gray-200">
                  <div className="flex gap-1">
                    <div
                      className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:bg-gray-100"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="rounded-lg bg-cyan-400 p-2.5 text-white transition-colors hover:bg-cyan-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">Press Enter or Ctrl+Enter to send</p>
          </div>
        </div>
      )}
    </>
  )
}
