"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sendChatMessage } from "@/app/actions/chat"

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

interface Message {
  role: "user" | "assistant"
  content: string
  isHtml?: boolean
}

interface ContactFormData {
  name: string
  email: string
}

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    name: "",
    email: "",
  })
  const [contactFormStatus, setContactFormStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastAssistantMessageRef = useRef<HTMLDivElement>(null)

  const conversationIdRef = useRef(generateId())
  const sessionIdRef = useRef(generateId())

  const handoffTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    console.log("[v0] Chat isOpen state changed to:", isOpen)
  }, [isOpen])

  useEffect(() => {
    console.log("[v0] showContactForm state changed to:", showContactForm)
  }, [showContactForm])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToLastAssistantMessage = () => {
    lastAssistantMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === "assistant" && !isLoading) {
      scrollToLastAssistantMessage()
    } else {
      scrollToBottom()
    }
  }, [messages, isLoading])

  useEffect(() => {
    return () => {
      if (handoffTimeoutRef.current) {
        clearTimeout(handoffTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isOpen && handoffTimeoutRef.current) {
      clearTimeout(handoffTimeoutRef.current)
      handoffTimeoutRef.current = null
    }
  }, [isOpen])

  useEffect(() => {
    const hasAutoOpened = sessionStorage.getItem("chat-auto-opened")
    console.log("[v0] Auto-open check - hasAutoOpened:", hasAutoOpened)

    if (!hasAutoOpened) {
      console.log("[v0] Setting auto-open timer for 1.5 seconds")
      const timer = setTimeout(() => {
        console.log("[v0] Auto-opening chat now")
        setIsOpen(true)
        sessionStorage.setItem("chat-auto-opened", "true")
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("[v0] ===== HANDLE SUBMIT CALLED =====")
    console.log("[v0] Input value:", input)
    console.log("[v0] isLoading:", isLoading)

    e.preventDefault()

    if (!input.trim() || isLoading) {
      console.log("[v0] Submission blocked - empty input or loading")
      return
    }

    const userMessage = input.trim()
    setInput("")

    const isFirstMessage = messages.length === 0

    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      console.log("[v0] Calling sendChatMessage with:", {
        message: userMessage,
        conversationId: conversationIdRef.current,
        sessionId: sessionIdRef.current,
        isFirstMessage,
      })

      const result = await sendChatMessage(userMessage, conversationIdRef.current, sessionIdRef.current, isFirstMessage)
      console.log("[v0] sendChatMessage result:", result)

      if (result.success && result.response) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: result.response,
            isHtml: true,
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I apologize, but I'm having trouble responding right now. Please try again.",
          },
        ])
      }
    } catch (error) {
      console.error("[v0] Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I'm having trouble responding right now. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingContact(true)
    setContactFormStatus({ type: null, message: "" })

    try {
      const response = await fetch("/api/chat-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contactFormData.name,
          email: contactFormData.email,
          conversationId: conversationIdRef.current,
        }),
      })

      const contentType = response.headers.get("content-type")
      let result

      if (contentType && contentType.includes("application/json")) {
        result = await response.json()
      } else {
        const text = await response.text()
        result = { success: false, message: text }
      }

      if (response.ok && result.success) {
        setContactFormStatus({
          type: "success",
          message: result.message || "Thank you! A team member will contact you shortly.",
        })

        handoffTimeoutRef.current = setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "I apologize for the delay in connecting you with a team member. Rest assured, an agent will contact you shortly using the information you provided. Thank you for your patience!",
            },
          ])
        }, 60000)

        setTimeout(() => {
          setShowContactForm(false)
          setContactFormData({
            name: "",
            email: "",
          })
          setContactFormStatus({ type: null, message: "" })
        }, 2000)
      } else {
        setContactFormStatus({
          type: "error",
          message: result.error || result.message || "Failed to submit. Please try again.",
        })
      }
    } catch (error) {
      console.error("Contact form error:", error)
      setContactFormStatus({
        type: "error",
        message: "An error occurred. Please try again.",
      })
    } finally {
      setIsSubmittingContact(false)
    }
  }

  return (
    <>
      {!isOpen ? (
        <button
          onClick={() => {
            console.log("[v0] Chat button clicked - opening chat")
            setIsOpen(true)
          }}
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
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
          <button
            onClick={() => {
              console.log("[v0] Close button clicked - closing chat")
              setIsOpen(false)
            }}
            className="absolute -top-2 -right-2 z-10 bg-white hover:bg-gray-100 shadow-md rounded-full w-8 h-8 flex items-center justify-center"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-between rounded-t-lg">
            <h2 className="text-lg font-semibold text-gray-900">Kali, the Kuhlekt AI</h2>
            <button
              onClick={() => {
                console.log("[v0] Talk to Human button clicked")
                setShowContactForm(true)
              }}
              className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded flex items-center gap-1"
            >
              <User className="w-3 h-3" />
              Talk to Human
            </button>
          </div>

          {/* Contact Form Modal */}
          {showContactForm && (
            <div className="absolute inset-0 bg-white rounded-lg z-20 flex flex-col">
              <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-between rounded-t-lg">
                <h2 className="text-lg font-semibold text-gray-900">Contact Our Team</h2>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-blue-100 rounded"
                  aria-label="Close contact form"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Fill out the form below and a team member will get back to you shortly.
                </p>

                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={contactFormData.name}
                      onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={contactFormData.email}
                      onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {contactFormStatus.type && (
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        contactFormStatus.type === "success"
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {contactFormStatus.message}
                    </div>
                  )}

                  <Button type="submit" disabled={isSubmittingContact} className="w-full bg-blue-500 hover:bg-blue-600">
                    {isSubmittingContact ? "Submitting..." : "Submit"}
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-600 text-sm mt-8 space-y-3">
                <p className="font-semibold text-base">👋 Hello! I'm Kali, your Kuhlekt AI assistant.</p>
                <p>I'm here to help you with:</p>
                <ul className="text-left inline-block space-y-1">
                  <li>• Product information and features</li>
                  <li>• Technical support and guidance</li>
                  <li>• Pricing and service options</li>
                  <li>• General inquiries about Kuhlekt</li>
                </ul>
                <p className="mt-3 text-blue-600 font-medium">How can I assist you today?</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                ref={message.role === "assistant" && index === messages.length - 1 ? lastAssistantMessageRef : null}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.isHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: message.content }} className="prose prose-sm max-w-none" />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
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

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  console.log("[v0] Input onChange - value:", e.target.value)
                  setInput(e.target.value)
                }}
                onFocus={() => console.log("[v0] Input focused")}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isLoading}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 flex items-center justify-center transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
