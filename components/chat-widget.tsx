"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X, MessageCircle, Send, User } from "lucide-react"

interface Message {
  role: "user" | "bot" | "agent"
  content: string
  timestamp: number
}

interface HandoffFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const [showHandoffForm, setShowHandoffForm] = useState(false)
  const [handoffData, setHandoffData] = useState<HandoffFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [agentActive, setAgentActive] = useState(false)
  const [agentName, setAgentName] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Generate session ID on mount
  useEffect(() => {
    const id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    setSessionId(id)
    console.log("[v0] Chat widget initialized with session:", id)
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (message: string) => {
    if (!message.trim() || !sessionId) return

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          sessionId,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await response.json()

      if (data.success && data.response) {
        const botMessage: Message = {
          role: data.agentActive ? "agent" : "bot",
          content: data.response,
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, botMessage])

        if (data.agentActive) {
          setAgentActive(true)
          setAgentName(data.agentName || "Agent")
        }
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      const errorMessage: Message = {
        role: "bot",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  const handleHandoffSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/chat/handoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          userId: null,
          userEmail: handoffData.email,
          userName: `${handoffData.firstName} ${handoffData.lastName}`,
          firstName: handoffData.firstName,
          lastName: handoffData.lastName,
          phone: handoffData.phone,
          reason: "User requested human assistance",
        }),
      })

      const data = await response.json()

      if (data.success) {
        setShowHandoffForm(false)
        setAgentActive(true)
        const confirmMessage: Message = {
          role: "bot",
          content: "Thank you! An agent will be with you shortly.",
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, confirmMessage])
      }
    } catch (error) {
      console.error("[v0] Error submitting handoff:", error)
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">Kuhlekt Assistant</h3>
            {agentActive && <p className="text-xs opacity-90">{agentName} is here to help</p>}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Hi! How can I help you today?</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : msg.role === "agent"
                    ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                    : "bg-muted"
              }`}
            >
              {msg.role === "agent" && (
                <div className="flex items-center gap-1 text-xs font-semibold mb-1">
                  <User className="h-3 w-3" />
                  {agentName}
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Handoff Form */}
      {showHandoffForm && (
        <div className="p-4 border-t bg-muted/50">
          <form onSubmit={handleHandoffSubmit} className="space-y-2">
            <h4 className="font-semibold text-sm mb-2">Connect with an agent</h4>
            <Input
              placeholder="First Name"
              value={handoffData.firstName}
              onChange={(e) => setHandoffData((prev) => ({ ...prev, firstName: e.target.value }))}
              required
              className="h-9"
            />
            <Input
              placeholder="Last Name"
              value={handoffData.lastName}
              onChange={(e) => setHandoffData((prev) => ({ ...prev, lastName: e.target.value }))}
              required
              className="h-9"
            />
            <Input
              type="email"
              placeholder="Email"
              value={handoffData.email}
              onChange={(e) => setHandoffData((prev) => ({ ...prev, email: e.target.value }))}
              required
              className="h-9"
            />
            <Input
              type="tel"
              placeholder="Phone (optional)"
              value={handoffData.phone}
              onChange={(e) => setHandoffData((prev) => ({ ...prev, phone: e.target.value }))}
              className="h-9"
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" className="flex-1">
                Submit
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowHandoffForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Input */}
      {!showHandoffForm && (
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          {!agentActive && (
            <Button variant="link" size="sm" onClick={() => setShowHandoffForm(true)} className="mt-2 text-xs">
              Speak with a human agent
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}
