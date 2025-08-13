export function AdminStats() {
  const stats = [
    { name: "Total Visitors", value: "1,234", change: "+12%" },
    { name: "Form Submissions", value: "89", change: "+5%" },
    { name: "Demo Requests", value: "23", change: "+18%" },
    { name: "Contact Forms", value: "66", change: "+3%" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className="text-sm text-green-600">{stat.change}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
