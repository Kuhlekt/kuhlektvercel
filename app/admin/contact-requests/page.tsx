"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface ContactRequest {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  company: string | null
  message: string
  form_data: any
  status: string
  created_at: string
  country?: string | null
  isNorthAmerica?: boolean
}

export default function ContactRequestsPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRequests()
  }, [])

  async function loadRequests() {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/contact-requests")
      if (!response.ok) {
        throw new Error("Failed to load contact requests")
      }
      const data = await response.json()
      setRequests(data.requests || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteAll() {
    if (!confirm("Are you sure you want to delete ALL chat handoff requests? This action cannot be undone.")) {
      return
    }

    try {
      setIsDeleting(true)
      const response = await fetch("/api/admin/delete-all-chats", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete chat handoffs")
      }

      alert("All chat handoffs deleted successfully")
      await loadRequests()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const chatRequests = requests.filter((req) => {
    try {
      return req.form_data && typeof req.form_data === "object" && req.form_data.source === "chat_widget"
    } catch {
      return false
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            ← Back to Admin Dashboard
          </Link>
          {chatRequests.length > 0 && (
            <button
              onClick={handleDeleteAll}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isDeleting ? "Deleting..." : "Delete All Chats"}
            </button>
          )}
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Chat Handoff Requests</h1>
          <p className="text-gray-600 mt-2">Contact requests from the chat widget requiring agent follow-up</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date/Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversation ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {chatRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No chat handoff requests yet
                    </td>
                  </tr>
                ) : (
                  chatRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(request.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {request.first_name} {request.last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{request.email}</div>
                        {request.phone && <div className="text-sm text-gray-500">{request.phone}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.company || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="line-clamp-2">{request.message || "-"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                        {request.form_data?.conversationId
                          ? `${request.form_data.conversationId.substring(0, 12)}...`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            request.status === "new"
                              ? "bg-green-100 text-green-800"
                              : request.status === "contacted"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {request.status || "unknown"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>
            Total chat handoff requests: <span className="font-semibold">{chatRequests.length}</span>
          </p>
          <p className="mt-1">
            New requests: <span className="font-semibold">{chatRequests.filter((r) => r.status === "new").length}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
