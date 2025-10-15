"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Send, RefreshCw, CheckCircle, Lightbulb } from "lucide-react"

interface ChatConversation {
  id: string
  conversation_id: string
  session_id: string
  status: string
  started_at: string
  last_message_at: string
  message_count: number
  user_email: string | null
  user_name: string | null
  handoff_requested: boolean
  handoff_at: string | null
  handoff_status: string
  agent_name: string | null
  resolution_notes: string | null
}

interface ChatMessage {
  id: string
  role: string
  content: string
  created_at: string
}

export default function AgentConsolePage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [suggestion, setSuggestion] = useState("")
  const [agentName, setAgentName] = useState("Support Agent")

  useEffect(() => {
    loadConversations()
    const interval = setInterval(loadConversations, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation)
    }
  }, [selectedConversation])

  const loadConversations = async () => {
    try {
      const response = await fetch("/api/agent/conversations")
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error("Error loading conversations:", error)
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
      console.error("Error loading messages:", error)
    }
  }

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/agent/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation,
          message: messageInput,
          agentName,
        }),
      })

      if (response.ok) {
        setMessageInput("")
        setSuggestion("")
        await loadMessages(selectedConversation)
        await loadConversations()
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSuggestion = async () => {
    if (!selectedConversation) return

    setIsSuggesting(true)
    try {
      const lastUserMessage = messages.filter((m) => m.role === "user").pop()

      const response = await fetch("/api/agent/kali-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userQuestion: lastUserMessage?.content || "",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSuggestion(data.suggestion)
      }
    } catch (error) {
      console.error("Error getting suggestion:", error)
    } finally {
      setIsSuggesting(false)
    }
  }

  const updateStatus = async (status: string) => {
    if (!selectedConversation) return

    try {
      const response = await fetch("/api/agent/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation,
          status,
        }),
      })

      if (response.ok) {
        await loadConversations()
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const pendingConversations = conversations.filter((c) => c.handoff_status === "pending")
  const inProgressConversations = conversations.filter((c) => c.handoff_status === "in_progress")
  const selectedConv = conversations.find((c) => c.conversation_id === selectedConversation)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-4">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            ← Back to Admin Dashboard
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Agent Console</h1>
          <p className="text-gray-600 mt-2">Respond to customer handoff requests with Kali knowledge base support</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="text-sm font-medium text-orange-700">Pending Handoffs</div>
            <div className="text-2xl font-bold text-orange-900 mt-1">{pendingConversations.length}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-blue-700">In Progress</div>
            <div className="text-2xl font-bold text-blue-900 mt-1">{inProgressConversations.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <label className="text-sm font-medium text-gray-700">Agent Name</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="mt-1 w-full px-3 py-1 border rounded text-sm"
              placeholder="Your name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Conversations List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Handoff Requests</h2>
              <button onClick={loadConversations} className="p-1 hover:bg-gray-100 rounded">
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {conversations.filter((c) => c.handoff_requested).length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">No handoff requests</div>
              ) : (
                conversations
                  .filter((c) => c.handoff_requested)
                  .map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.conversation_id)}
                      className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
                        selectedConversation === conv.conversation_id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-gray-900">{conv.user_name || "Anonymous"}</span>
                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded ${
                                conv.handoff_status === "pending"
                                  ? "bg-orange-100 text-orange-800"
                                  : conv.handoff_status === "in_progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {conv.handoff_status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {conv.message_count} msgs • {new Date(conv.last_message_at).toLocaleTimeString()}
                          </div>
                          {conv.agent_name && (
                            <div className="text-xs text-blue-600 mt-1">Agent: {conv.agent_name}</div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
              )}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col" style={{ height: "650px" }}>
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start responding
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-gray-900">{selectedConv?.user_name || "Anonymous User"}</h2>
                      <p className="text-xs text-gray-500">{selectedConv?.user_email}</p>
                    </div>
                    <div className="flex gap-2">
                      {selectedConv?.handoff_status === "pending" && (
                        <button
                          onClick={() => updateStatus("in_progress")}
                          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Start
                        </button>
                      )}
                      {selectedConv?.handoff_status === "in_progress" && (
                        <button
                          onClick={() => updateStatus("resolved")}
                          className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === "user"
                            ? "bg-blue-500 text-white"
                            : msg.role === "agent"
                              ? "bg-green-100 text-gray-900"
                              : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="text-xs opacity-75 mb-1">
                          {msg.role === "user" ? "User" : msg.role === "agent" ? "Agent" : "Kali"}
                        </div>
                        <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                        <div className="text-xs opacity-75 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Kali Suggestion */}
                {suggestion && (
                  <div className="p-3 bg-yellow-50 border-t border-yellow-200">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-yellow-800 mb-1">Kali Suggestion:</div>
                        <div className="text-sm text-gray-700">{suggestion}</div>
                        <button
                          onClick={() => {
                            setMessageInput(suggestion)
                            setSuggestion("")
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                        >
                          Use this response
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={getSuggestion}
                      disabled={isSuggesting || messages.length === 0}
                      className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 disabled:opacity-50 flex items-center gap-1"
                    >
                      <Lightbulb className="w-3 h-3" />
                      {isSuggesting ? "Getting..." : "Get Kali Suggestion"}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                      placeholder="Type your response..."
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      disabled={isLoading}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={isLoading || !messageInput.trim()}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
