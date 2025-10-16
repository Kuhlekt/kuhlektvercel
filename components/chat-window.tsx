"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sendChatMessage, sendMessageToAgent } from "@/app/actions/chat"

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
  const [isWaitingForAgent, setIsWaitingForAgent] = useState(false)
  const [handoffId, setHandoffId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastAssistantMessageRef = useRef<HTMLDivElement>(null)

  const conversationIdRef = useRef(generateId())
  const sessionIdRef = useRef(generateId())

  const handoffTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

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

  useEffect(() => {
    if (isWaitingForAgent && handoffId) {
      console.log("[v0] Starting polling for agent responses")

      const pollForAgentResponses = async () => {
        try {
          const response = await fetch(`/api/chat/check-agent-response?handoffId=${handoffId}`)
          if (response.ok) {
            const data = await response.json()
            if (data.hasResponse && data.messages && data.messages.length > 0) {
              console.log("[v0] Received agent responses:", data.messages)

              // Add agent messages to the chat
              data.messages.forEach((msg: any) => {
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "assistant",
                    content: msg.message,
                  },
                ])
              })

              // Stop polling once we receive responses
              setIsWaitingForAgent(false)
              if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current)
                pollingIntervalRef.current = null
              }
            }
          }
        } catch (error) {
          console.error("[v0] Error polling for agent responses:", error)
        }
      }

      pollingIntervalRef.current = setInterval(pollForAgentResponses, 2000)

      // Also check immediately
      pollForAgentResponses()

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
          pollingIntervalRef.current = null
        }
      }
    }
  }, [isWaitingForAgent, handoffId])

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("[v0] ===== HANDLE SUBMIT CALLED =====")
    console.log("[v0] Input value:", input)
    console.log("[v0] isLoading:", isLoading)
    console.log("[v0] isWaitingForAgent:", isWaitingForAgent)

    e.preventDefault()

    if (!input.trim() || isLoading) {
      console.log("[v0] Submission blocked - empty input or loading")
      return
    }

    const userMessage = input.trim()
    setInput("")

    if (isWaitingForAgent && handoffId) {
      console.log("[v0] Sending message to agent instead of bot")

      setMessages((prev) => [...prev, { role: "user", content: userMessage }])
      setIsLoading(true)

      try {
        const result = await sendMessageToAgent(userMessage, handoffId)

        if (result.success) {
          console.log("[v0] Message sent to agent successfully")
          // Message will appear when agent responds via polling
        } else {
          console.error("[v0] Failed to send message to agent:", result.error)
        }
      } catch (error) {
        console.error("[v0] Error sending message to agent:", error)
      } finally {
        setIsLoading(false)
      }
      return
    }

    // Normal bot conversation
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
        console.error("[v0] Bot failed to respond")
      }
    } catch (error) {
      console.error("[v0] Chat error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] ===== CONTACT FORM SUBMIT STARTED =====")
    console.log("[v0] Form data:", contactFormData)
    console.log("[v0] Conversation ID:", conversationIdRef.current)

    setIsSubmittingContact(true)
    setContactFormStatus({ type: null, message: "" })

    try {
      console.log("[v0] Sending POST request to /api/chat-contact")

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

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response ok:", response.ok)

      const contentType = response.headers.get("content-type")
      console.log("[v0] Response content-type:", contentType)

      let result

      if (contentType && contentType.includes("application/json")) {
        result = await response.json()
        console.log("[v0] Response JSON:", result)
      } else {
        const text = await response.text()
        console.log("[v0] Response text:", text)
        result = { success: false, message: text }
      }

      if (response.ok && result.success) {
        console.log("[v0] Contact form submission successful!")
        const receivedHandoffId = result.handoffId || conversationIdRef.current
        console.log("[v0] Setting handoffId to:", receivedHandoffId)
        console.log("[v0] Setting isWaitingForAgent to: true")

        setHandoffId(receivedHandoffId)
        setIsWaitingForAgent(true)

        // Verify state was set
        console.log("[v0] State update complete - handoffId should now be:", receivedHandoffId)

        setContactFormStatus({
          type: "success",
          message: result.message || "Thank you! A team member will contact you shortly.",
        })

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Thank you! I've connected you with our team. An agent will respond to you shortly.",
          },
        ])

        setTimeout(() => {
          setShowContactForm(false)
          setContactFormData({
            name: "",
            email: "",
          })
          setContactFormStatus({ type: null, message: "" })
        }, 2000)
      } else {
        console.error("[v0] Contact form submission failed:", result)
        setContactFormStatus({
          type: "error",
          message: result.error || result.message || "Failed to submit. Please try again.",
        })
      }
    } catch (error) {
      console.error("[v0] Contact form error:", error)
      console.error("[v0] Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      })
      setContactFormStatus({
        type: "error",
        message: "An error occurred. Please try again.",
      })
    } finally {
      console.log("[v0] ===== CONTACT FORM SUBMIT ENDED =====")
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
        <div className="fixed bottom-4 right-4 w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] sm:w-[340px] sm:h-[480px] md:w-[360px] md:h-[520px] lg:w-[400px] lg:h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
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
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Kali, the Kuhlekt AI</h2>
            <button
              onClick={() => {
                console.log("[v0] Talk to Human button clicked")
                setShowContactForm(true)
              }}
              className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded flex items-center gap-1"
            >
              <User className="w-3 h-3" />
              <span className="hidden sm:inline">Talk to Human</span>
              <span className="sm:hidden">Human</span>
            </button>
          </div>

          {/* Contact Form Modal */}
          {showContactForm && (
            <div className="absolute inset-0 bg-white rounded-lg z-20 flex flex-col">
              <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-between rounded-t-lg">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Contact Our Team</h2>
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
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-600 text-sm mt-4 sm:mt-8 space-y-2 sm:space-y-3">
                <p className="font-semibold text-sm sm:text-base">👋 Hello! I'm Kali, your Kuhlekt AI assistant.</p>
                <p className="text-xs sm:text-sm">I'm here to help you with:</p>
                <ul className="text-left inline-block space-y-1 text-xs sm:text-sm">
                  <li>• Product information and features</li>
                  <li>• Technical support and guidance</li>
                  <li>• Pricing and service options</li>
                  <li>• General inquiries about Kuhlekt</li>
                </ul>
                <p className="mt-3 text-blue-600 font-medium text-xs sm:text-sm">How can I assist you today?</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                ref={message.role === "assistant" && index === messages.length - 1 ? lastAssistantMessageRef : null}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 ${
                    message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.isHtml ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: message.content }}
                      className="prose prose-sm max-w-none text-xs sm:text-sm"
                    />
                  ) : (
                    <p className="text-xs sm:text-sm whitespace-pre-wrap">{message.content}</p>
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
          <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t bg-white rounded-b-lg">
            {isWaitingForAgent && (
              <div className="mb-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                💬 Connected to human agent. Your messages will be sent directly to them.
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  console.log("[v0] Input onChange - value:", e.target.value)
                  setInput(e.target.value)
                }}
                onFocus={() => console.log("[v0] Input focused")}
                placeholder={isWaitingForAgent ? "Message the agent..." : "Type your message..."}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                disabled={isLoading}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg px-3 sm:px-4 py-2 flex items-center justify-center transition-colors"
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
