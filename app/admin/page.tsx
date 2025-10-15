import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

async function getStats() {
  const supabase = createClient()

  // Get contact requests count
  const { count: contactCount } = await supabase
    .from("form_submitters")
    .select("*", { count: "exact", head: true })
    .eq("form_type", "contact")

  // Get new contact requests count
  const { count: newContactCount } = await supabase
    .from("form_submitters")
    .select("*", { count: "exact", head: true })
    .eq("form_type", "contact")
    .eq("status", "new")

  // Get chat handoff requests count
  const { data: chatRequests } = await supabase.from("form_submitters").select("form_data").eq("form_type", "contact")

  const chatHandoffCount = chatRequests?.filter((req: any) => req.form_data?.source === "chat_widget").length || 0

  const { count: totalChats } = await supabase.from("chat_conversations").select("*", { count: "exact", head: true })

  const { count: activeChats } = await supabase
    .from("chat_conversations")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  return {
    totalContacts: contactCount || 0,
    newContacts: newContactCount || 0,
    chatHandoffs: chatHandoffCount,
    totalChats: totalChats || 0,
    activeChats: activeChats || 0,
  }
}

export default async function AdminDashboard() {
  // Check admin authentication
  const cookieStore = await cookies()
  const adminAuth = cookieStore.get("admin-auth")

  if (!adminAuth || adminAuth.value !== "authenticated") {
    redirect("/admin/login")
  }

  const stats = await getStats()

  const siteMap = [
    { name: "Home", path: "/", description: "Main landing page" },
    { name: "About", path: "/about", description: "Company information" },
    { name: "Product", path: "/product", description: "Product details and features" },
    { name: "Solutions", path: "/solutions", description: "Solutions overview" },
    { name: "Pricing", path: "/pricing-table", description: "Pricing plans and comparison" },
    { name: "Contact", path: "/contact", description: "Contact form" },
    { name: "Demo", path: "/demo", description: "Request a demo" },
    { name: "Help", path: "/help", description: "Help and support" },
  ]

  const adminFeatures = [
    {
      name: "Chat Conversations",
      path: "/admin/chats",
      description: "View all chat conversations with the Kali chatbot",
      count: stats.totalChats,
      newCount: stats.activeChats,
      badge: "Active",
    },
    {
      name: "Chat Handoff Requests",
      path: "/admin/contact-requests",
      description: "View and manage customer contact requests from chat",
      count: stats.chatHandoffs,
      newCount: stats.newContacts,
      badge: "New",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Kuhlekt Website Administration</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Chats</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalChats}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Chats</div>
            <div className="mt-2 text-3xl font-bold text-green-600">{stats.activeChats}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Contacts</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalContacts}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">New Requests</div>
            <div className="mt-2 text-3xl font-bold text-orange-600">{stats.newContacts}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Chat Handoffs</div>
            <div className="mt-2 text-3xl font-bold text-blue-600">{stats.chatHandoffs}</div>
          </div>
        </div>

        {/* Admin Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adminFeatures.map((feature) => (
              <Link
                key={feature.path}
                href={feature.path}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-200 hover:border-blue-500"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  </div>
                  {feature.newCount > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {feature.newCount} {feature.badge?.toLowerCase()}
                    </span>
                  )}
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Total: <span className="font-semibold text-gray-900">{feature.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Site Map */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Website Sitemap</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Path
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {siteMap.map((page) => (
                  <tr key={page.path} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{page.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-600">{page.path}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{page.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link href={page.path} target="_blank" className="text-blue-600 hover:text-blue-800 font-medium">
                        View Page →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
