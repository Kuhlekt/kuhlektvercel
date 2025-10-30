"use client"

import type React from "react"
import { sanitizeHtml } from "@/lib/html-sanitizer"
import { useState, useRef, useEffect } from "react"
import { X, Send, User } from "@/lib/icons"
import { Button } from "@/components/ui/button"
import { sendChatMessage, sendMessageToAgent } from "@/app/actions/chat"

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

interface Message {
  role: "user" | "assistant"
  content: string
  isHtml?: boolean
  timestamp: string
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
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

  const [isWaitingForAgent, setIsWaitingForAgent] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("chat-waiting-for-agent")
      console.log("[v0] Initial isWaitingForAgent from sessionStorage:", stored)
      return stored === "true"
    }
    return false
  })
  const [handoffId, setHandoffId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("chat-handoff-id")
      console.log("[v0] Initial handoffId from sessionStorage:", stored)
      return stored
    }
    return null
  })
  const [waitingForPhoneNumber, setWaitingForPhoneNumber] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastAssistantMessageRef = useRef<HTMLDivElement>(null)

  const conversationIdRef = useRef(generateId())
  const sessionIdRef = useRef(generateId())

  const handoffTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const receivedAgentMessageIds = useRef<Set<string>>(new Set())
  const agentHasResponded = useRef(false)

  useEffect(() => {
    if (isOpen) {
      sessionStorage.setItem("chat-open", "true")
      console.log("[v0] Saved chat open state to sessionStorage: true")
    } else {
      sessionStorage.removeItem("chat-open")
      console.log("[v0] Removed chat open state from sessionStorage")
    }
  }, [isOpen])

  useEffect(() => {
    if (isWaitingForAgent) {
      sessionStorage.setItem("chat-waiting-for-agent", "true")
    } else {
      sessionStorage.removeItem("chat-waiting-for-agent")
    }
  }, [isWaitingForAgent])

  useEffect(() => {
    if (handoffId) {
      sessionStorage.setItem("chat-handoff-id", handoffId)
    } else {
      sessionStorage.removeItem("chat-handoff-id")
    }
  }, [handoffId])

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
    if (isWaitingForAgent && handoffId && !agentHasResponded.current) {
      console.log("[v0] Starting 90-second agent response timeout")

      handoffTimeoutRef.current = setTimeout(() => {
        console.log("[v0] 90-second timeout reached - no agent response")

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I'm sorry, but our human agents are not currently available to respond right now. However, they will reach out to you as soon as possible. Could you please provide your phone number so we can contact you?",
            timestamp: new Date().toISOString(),
          },
        ])

        setWaitingForPhoneNumber(true)
      }, 90000) // 90 seconds

      return () => {
        if (handoffTimeoutRef.current) {
          clearTimeout(handoffTimeoutRef.current)
          handoffTimeoutRef.current = null
        }
      }
    }
  }, [isWaitingForAgent, handoffId])

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
      console.log("[v0] Starting polling for agent responses with handoffId:", handoffId)

      const pollForAgentResponses = async () => {
        try {
          const response = await fetch(`/api/chat/check-agent-response?handoffId=${handoffId}`)
          if (response.ok) {
            const data = await response.json()
            if (data.hasResponse && data.messages && data.messages.length > 0) {
              const newMessages = data.messages.filter((msg: any) => {
                const msgId = `${msg.message}-${msg.timestamp}`
                if (receivedAgentMessageIds.current.has(msgId)) {
                  return false
                }
                receivedAgentMessageIds.current.add(msgId)
                return true
              })

              if (newMessages.length > 0) {
                console.log("[v0] Adding new agent messages:", newMessages.length)
                agentHasResponded.current = true
                if (handoffTimeoutRef.current) {
                  clearTimeout(handoffTimeoutRef.current)
                  handoffTimeoutRef.current = null
                  console.log("[v0] Cleared 90-second timeout - agent has responded")
                }

                setMessages((prev) => [
                  ...prev,
                  ...newMessages.map((msg: any) => ({
                    role: "assistant" as const,
                    content: msg.message,
                    timestamp: msg.timestamp || new Date().toISOString(),
                  })),
                ])
              }
            }
          }
        } catch (error) {
          console.error("[v0] Error polling for agent responses:", error)
        }
      }

      pollingIntervalRef.current = setInterval(pollForAgentResponses, 2000)
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
    e.preventDefault()

    if (!input.trim() || isLoading) {
      return
    }

    const userMessage = input.trim()
    setInput("")

    if (waitingForPhoneNumber && handoffId) {
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: userMessage,
          timestamp: new Date().toISOString(),
        },
      ])
      setIsLoading(true)

      try {
        const response = await fetch("/api/agent/save-phone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            handoffId,
            phoneNumber: userMessage,
          }),
        })

        const result = await response.json()

        if (result.success) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "Thank you! We've received your phone number and our team will reach out to you as soon as possible.",
              timestamp: new Date().toISOString(),
            },
          ])
          setWaitingForPhoneNumber(false)
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "There was an issue saving your phone number. Please try again or contact us directly.",
              timestamp: new Date().toISOString(),
            },
          ])
        }
      } catch (error) {
        console.error("Error saving phone number")
      } finally {
        setIsLoading(false)
      }
      return
    }

    if (isWaitingForAgent && handoffId) {
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: userMessage,
          timestamp: new Date().toISOString(),
        },
      ])
      setIsLoading(true)

      try {
        const result = await sendMessageToAgent(userMessage, handoffId)

        if (!result.success) {
          console.error("Failed to send message to agent")
        }
      } catch (error) {
        console.error("Error sending message to agent")
      } finally {
        setIsLoading(false)
      }
      return
    }

    const isFirstMessage = messages.length === 0

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: new Date().toISOString(),
      },
    ])
    setIsLoading(true)

    try {
      console.log("[v0] Calling sendChatMessage with message:", userMessage)

      const result = await sendChatMessage(userMessage, conversationIdRef.current, sessionIdRef.current, isFirstMessage)

      console.log("[v0] sendChatMessage result:", result)
      console.log("[v0] result.success:", result.success)
      console.log("[v0] result.response:", result.response?.substring(0, 100))

      if (result.success && result.response) {
        console.log("[v0] Adding assistant message to UI")
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: result.response,
            isHtml: true,
            timestamp: new Date().toISOString(),
          },
        ])
      } else {
        console.log(
          "[v0] NOT adding assistant message - success:",
          result.success,
          "response exists:",
          !!result.response,
        )
      }
    } catch (error) {
      console.error("[v0] Chat error:", error)
      console.error("[v0] Error details:", error instanceof Error ? error.message : "Unknown error")
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

      const result = await response.json()

      if (response.ok && result.success) {
        const receivedHandoffId = result.handoffId || conversationIdRef.current

        setHandoffId(receivedHandoffId)
        setIsWaitingForAgent(true)

        setContactFormStatus({
          type: "success",
          message: result.message || "Thank you! A team member will contact you shortly.",
        })

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Thank you for providing your information! Our team has received your details and will reach out to you as soon as possible.",
            timestamp: new Date().toISOString(),
          },
        ])

        setTimeout(() => {
          setShowContactForm(false)
          setContactFormData({ name: "", email: "" })
          setContactFormStatus({ type: null, message: "" })
        }, 2000)
      } else {
        setContactFormStatus({
          type: "error",
          message: result.error || "Failed to submit. Please try again.",
        })
      }
    } catch (error) {
      console.error("Contact form error")
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
                </ul>
                <p className="mt-3 text-blue-600 font-medium text-xs sm:text-sm">How can I assist you today?</p>
              </div>
            )}

            {[...messages]
              .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
              .map((message, index) => (
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
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(message.content) }}
                        className="prose prose-sm max-w-none text-xs sm:text-sm"
                      />
                    ) : (
                      <p className="text-xs sm:text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                    <p className={`text-[10px] mt-1 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}>
                      {formatTimestamp(message.timestamp)}
                    </p>
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
            {isWaitingForAgent && !waitingForPhoneNumber && (
              <div className="mb-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                💬 Connected to human agent. Your messages will be sent directly to them.
              </div>
            )}
            {waitingForPhoneNumber && (
              <div className="mb-2 text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
                📞 Please enter your phone number below
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
                placeholder={
                  waitingForPhoneNumber
                    ? "Enter your phone number..."
                    : isWaitingForAgent
                      ? "Message the agent..."
                      : "Type your message..."
                }
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
