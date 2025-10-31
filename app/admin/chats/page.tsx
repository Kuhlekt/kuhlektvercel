import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

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
}

interface ChatMessage {
  id: string
  role: string
  content: string
  created_at: string
}

async function getChatConversations() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("chat_conversations")
    .select("*")
    .order("last_message_at", { ascending: false })
    .limit(100)

  if (error) {
    console.error("[v0] Error fetching chat conversations:", error)
    return []
  }

  return data as ChatConversation[]
}

async function getChatMessages(conversationId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching chat messages:", error)
    return []
  }

  return data as ChatMessage[]
}

export default async function ChatsPage({
  searchParams,
}: {
  searchParams: { conversation?: string }
}) {
  const conversations = await getChatConversations()
  const selectedConversation = searchParams.conversation
  const messages = selectedConversation ? await getChatMessages(selectedConversation) : []

  const activeChats = conversations.filter((c) => c.status === "active")
  const handoffChats = conversations.filter((c) => c.handoff_requested)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-4">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            ← Back to Admin Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Chat Conversations</h1>
          <p className="text-gray-600 mt-2">View and monitor all chat conversations with the Kali chatbot</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500">Total Conversations</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{conversations.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500">Active Chats</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{activeChats.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500">Handoff Requests</div>
            <div className="text-3xl font-bold text-orange-600 mt-2">{handoffChats.length}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversations List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Recent Conversations</h2>
            </div>
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No conversations yet</div>
              ) : (
                conversations.map((conv) => (
                  <Link
                    key={conv.id}
                    href={`/admin/chats?conversation=${conv.conversation_id}`}
                    className={`block p-4 hover:bg-gray-50 transition-colors ${
                      selectedConversation === conv.conversation_id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {conv.user_name || "Anonymous User"}
                          </span>
                          {conv.handoff_requested && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded">
                              Handoff
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded ${
                              conv.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {conv.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {conv.message_count} messages • Last active {new Date(conv.last_message_at).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 font-mono truncate">
                          ID: {conv.conversation_id.substring(0, 20)}...
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Messages View */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedConversation ? "Conversation Messages" : "Select a Conversation"}
              </h2>
            </div>
            <div className="p-4 max-h-[600px] overflow-y-auto">
              {!selectedConversation ? (
                <div className="text-center text-gray-500 py-12">
                  Select a conversation from the list to view messages
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 py-12">No messages in this conversation</div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="text-xs opacity-75 mb-1">{msg.role === "user" ? "User" : "Kali"}</div>
                        <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                        <div className="text-xs opacity-75 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
