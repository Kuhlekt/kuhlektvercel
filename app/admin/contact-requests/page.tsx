import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
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
}

async function getContactRequests() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("form_submitters").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching contact requests:", error)
      return []
    }

    return (data as ContactRequest[]) || []
  } catch (error) {
    console.error("[v0] Exception in getContactRequests:", error)
    return []
  }
}

export default async function ContactRequestsPage() {
  try {
    // Check admin authentication
    const cookieStore = await cookies()
    const adminAuth = cookieStore.get("admin-auth")

    if (!adminAuth || adminAuth.value !== "authenticated") {
      redirect("/admin/login")
    }

    const requests = await getContactRequests()
    const chatRequests = requests.filter((req) => {
      try {
        return req.form_data && typeof req.form_data === "object" && req.form_data.source === "chat_widget"
      } catch {
        return false
      }
    })

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <Link href="/admin" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              ← Back to Admin Dashboard
            </Link>
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
              New requests:{" "}
              <span className="font-semibold">{chatRequests.filter((r) => r.status === "new").length}</span>
            </p>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("[v0] Error in ContactRequestsPage:", error)
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
          <p className="text-gray-700 mb-4">There was an error loading the contact requests page.</p>
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
    )
  }
}
