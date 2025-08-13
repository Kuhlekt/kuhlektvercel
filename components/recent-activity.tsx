export function RecentActivity() {
  const activities = [
    { type: "visitor", message: "New visitor from Google", time: "2 minutes ago" },
    { type: "form", message: "Demo request submitted", time: "5 minutes ago" },
    { type: "visitor", message: "Returning visitor", time: "8 minutes ago" },
    { type: "form", message: "Contact form submitted", time: "12 minutes ago" },
  ]

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div className="divide-y">
        {activities.map((activity, index) => (
          <div key={index} className="p-6 flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-3 ${activity.type === "visitor" ? "bg-blue-500" : "bg-green-500"}`}
              />
              <span className="text-sm text-gray-900">{activity.message}</span>
            </div>
            <span className="text-sm text-gray-500">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
