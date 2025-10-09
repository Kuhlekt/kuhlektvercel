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
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "checking">("checking")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && connectionStatus === "checking") {
      testConnection()
    }
  }, [isOpen])

  const testConnection = async () => {
    console.log("[v0] Testing connection...")
    try {
      const result = await sendChatMessage([{ role: "user", content: "test" }])
      console.log("[v0] Connection test result:", result.success)
      setConnectionStatus(result.success ? "connected" : "disconnected")
    } catch (error) {
      console.error("[v0] Connection test failed:", error)
      setConnectionStatus("disconnected")
    }
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
    console.log("[v0] User message:", userMessage)
    setInput("")

    const newMessages = [...messages, { role: "user" as const, content: userMessage }]
    setMessages(newMessages)
    setIsTyping(true)

    setMessages((prev) => [...prev, { role: "assistant", content: "" }])

    try {
      console.log("[v0] Calling sendChatMessage...")
      const result = await sendChatMessage(newMessages.map((m) => ({ role: m.role, content: m.content })))
      console.log("[v0] Result received:", result.success)

      if (result.success && result.message) {
        console.log("[v0] Simulating typing for message:", result.message.substring(0, 50))
        setConnectionStatus("connected")
        await simulateTyping(result.message)
      } else {
        console.log("[v0] Error response:", result.message)
        setConnectionStatus("disconnected")
        await simulateTyping(result.message || "I apologize, but I encountered an error. Please try again.")
      }
    } catch (error) {
      console.error("[v0] Chat error in component:", error)
      setConnectionStatus("disconnected")
      await simulateTyping("I apologize, but I encountered an error. Please try again.")
    } finally {
      setIsTyping(false)
    }
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
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      connectionStatus === "connected"
                        ? "bg-green-500"
                        : connectionStatus === "disconnected"
                          ? "bg-red-500"
                          : "bg-yellow-500 animate-pulse"
                    }`}
                  />
                  {connectionStatus === "connected"
                    ? "Connected to GPT-4o-mini"
                    : connectionStatus === "disconnected"
                      ? "Connection error"
                      : "Connecting..."}
                </p>
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
