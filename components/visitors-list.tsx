export function VisitorsList() {
  const visitors = [
    {
      id: "visitor_1",
      firstVisit: "2024-01-15T10:30:00Z",
      lastVisit: "2024-01-15T11:45:00Z",
      pageViews: 5,
      referrer: "google.com",
      userAgent: "Chrome/120.0.0.0",
    },
    {
      id: "visitor_2",
      firstVisit: "2024-01-15T09:15:00Z",
      lastVisit: "2024-01-15T09:20:00Z",
      pageViews: 2,
      referrer: "direct",
      userAgent: "Safari/17.0",
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-lg font-medium text-gray-900">Recent Visitors</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visitor ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                First Visit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Page Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referrer
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visitors.map((visitor) => (
              <tr key={visitor.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{visitor.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(visitor.firstVisit).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.pageViews}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.referrer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
