import { AdminStats } from "@/components/admin-stats"
import { RecentActivity } from "@/components/recent-activity"

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Kuhlekt admin dashboard</p>
      </div>

      <AdminStats />
      <RecentActivity />
    </div>
  )
}
