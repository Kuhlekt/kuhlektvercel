"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ChatConversation {
  id: string
  user_email: string
  user_name?: string
  handoff_status: "pending" | "in-progress" | "resolved"
  created_at: string
  last_message_at?: string
}

interface ChatMessage {
  id: string
  conversation_id: string
  message: string
  sender: "user" | "agent" | "bot"
  created_at: string
}

const QUICK_RESPONSES = [
  "Thank you for contacting us. I'm here to help you with your inquiry.",
  "I understand your concern. Let me look into this for you right away.",
  "I've reviewed your request and here's what I can do to help...",
  "Could you please provide more details about your situation?",
  "I'll need to check with our team on this. I'll get back to you shortly.",
  "Is there anything else I can help you with today?",
  "Thank you for your patience. I'll follow up with you as soon as I have more information.",
  "I'm happy to assist you further. Please don't hesitate to reach out if you have any questions.",
]

export default function AgentConsolePage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<"all" | "pending" | "in-progress" | "resolved">("all")
  const [showQuickResponses, setShowQuickResponses] = useState(false)
  const [lastConversationCount, setLastConversationCount] = useState(0)
  const [hasNewHandoffs, setHasNewHandoffs] = useState(false)

  useEffect(() => {
    loadConversations()
    const interval = setInterval(loadConversations, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
      const interval = setInterval(() => loadMessages(selectedConversation.id), 5000)
      return () => clearInterval(interval)
    }
  }, [selectedConversation])

  const loadConversations = async () => {
    try {
      const response = await fetch("/api/agent/conversations")
      if (response.ok) {
        const data = await response.json()
        const newConversations = data.conversations || []
        setConversations(newConversations)

        const pendingCount = newConversations.filter((c: ChatConversation) => c.handoff_status === "pending").length
        if (pendingCount > lastConversationCount && lastConversationCount > 0) {
          setHasNewHandoffs(true)
          playNotificationSound()
        }
        setLastConversationCount(pendingCount)
      }
    } catch (error) {
      console.error("Failed to load conversations:", error)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/agent/messages?conversationId=${conversationId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error("Failed to load messages:", error)
    }
  }

  const playNotificationSound = () => {
    const audio = new Audio("/notification.mp3")
    audio.play().catch(() => {})
  }

  const sendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return

    console.log("[v0] Sending message:", {
      conversationId: selectedConversation.id,
      message: newMessage,
    })

    setIsLoading(true)
    try {
      const response = await fetch("/api/agent/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          message: newMessage,
        }),
      })

      console.log("[v0] Send message response status:", response.status)
      const data = await response.json()
      console.log("[v0] Send message response data:", data)

      if (response.ok) {
        console.log("[v0] Message sent successfully")
        setNewMessage("")
        await loadMessages(selectedConversation.id)
      } else {
        console.error("[v0] Failed to send message:", data.error)
        alert(`Failed to send message: ${data.error}`)
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (status: "pending" | "in-progress" | "resolved") => {
    if (!selectedConversation) return

    try {
      const response = await fetch("/api/agent/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          status,
        }),
      })

      if (response.ok) {
        await loadConversations()
        setSelectedConversation({ ...selectedConversation, handoff_status: status })
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const insertQuickResponse = (response: string) => {
    setNewMessage(response)
    setShowQuickResponses(false)
  }

  const filteredConversations = conversations.filter((conv) => {
    if (filter === "all") return true
    return conv.handoff_status === filter
  })

  const pendingCount = conversations.filter((c) => c.handoff_status === "pending").length
  const inProgressCount = conversations.filter((c) => c.handoff_status === "in-progress").length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agent Console</h1>
            <p className="text-gray-600">Manage customer handoff requests</p>
          </div>
          {hasNewHandoffs && (
            <div className="animate-pulse rounded-lg bg-red-500 px-4 py-2 text-white">🔔 New Handoff Request!</div>
          )}
        </div>

        <div className="mb-4 flex gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
            All ({conversations.length})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
            className={pendingCount > 0 ? "relative" : ""}
          >
            Pending ({pendingCount})
            {pendingCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {pendingCount}
              </span>
            )}
          </Button>
          <Button variant={filter === "in-progress" ? "default" : "outline"} onClick={() => setFilter("in-progress")}>
            In Progress ({inProgressCount})
          </Button>
          <Button variant={filter === "resolved" ? "default" : "outline"} onClick={() => setFilter("resolved")}>
            Resolved
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-4 lg:col-span-1">
            <h2 className="mb-4 text-lg font-semibold">Conversations</h2>
            <div className="space-y-2">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setSelectedConversation(conv)
                    setHasNewHandoffs(false)
                  }}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    selectedConversation?.id === conv.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{conv.user_name || conv.user_email}</div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        conv.handoff_status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : conv.handoff_status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {conv.handoff_status}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">{conv.user_email}</div>
                  <div className="mt-1 text-xs text-gray-400">{new Date(conv.created_at).toLocaleString()}</div>
                </button>
              ))}
              {filteredConversations.length === 0 && (
                <div className="py-8 text-center text-gray-500">No conversations found</div>
              )}
            </div>
          </Card>

          <Card className="p-4 lg:col-span-2">
            {selectedConversation ? (
              <>
                <div className="mb-4 flex items-center justify-between border-b pb-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {selectedConversation.user_name || selectedConversation.user_email}
                    </h2>
                    <p className="text-sm text-gray-600">{selectedConversation.user_email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={selectedConversation.handoff_status === "pending" ? "default" : "outline"}
                      onClick={() => updateStatus("pending")}
                    >
                      Pending
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedConversation.handoff_status === "in-progress" ? "default" : "outline"}
                      onClick={() => updateStatus("in-progress")}
                    >
                      In Progress
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedConversation.handoff_status === "resolved" ? "default" : "outline"}
                      onClick={() => updateStatus("resolved")}
                    >
                      Resolved
                    </Button>
                  </div>
                </div>

                <div className="mb-4 h-96 space-y-4 overflow-y-auto rounded-lg border bg-gray-50 p-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          msg.sender === "agent" ? "bg-blue-500 text-white" : "bg-white text-gray-900"
                        }`}
                      >
                        <div className="text-sm">{msg.message}</div>
                        <div className={`mt-1 text-xs ${msg.sender === "agent" ? "text-blue-100" : "text-gray-500"}`}>
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="flex h-full items-center justify-center text-gray-500">No messages yet</div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowQuickResponses(!showQuickResponses)}
                      className="mb-2"
                    >
                      Quick Responses
                    </Button>
                    {showQuickResponses && (
                      <div className="absolute bottom-full left-0 z-10 mb-2 w-full rounded-lg border bg-white p-2 shadow-lg">
                        {QUICK_RESPONSES.map((response, index) => (
                          <button
                            key={index}
                            onClick={() => insertQuickResponse(response)}
                            className="w-full rounded p-2 text-left text-sm hover:bg-gray-100"
                          >
                            {response}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                      placeholder="Type your message..."
                      className="flex-1 rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
                      rows={3}
                    />
                    <Button onClick={sendMessage} disabled={isLoading || !newMessage.trim()}>
                      {isLoading ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                Select a conversation to view messages
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
