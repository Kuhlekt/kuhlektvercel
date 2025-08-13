"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: "📊" },
  { name: "Visitors", href: "/admin/visitors", icon: "👥" },
  { name: "Analytics", href: "/admin/analytics", icon: "📈" },
  { name: "Database", href: "/admin/database", icon: "🗄️" },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-900 text-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Kuhlekt Admin</h2>
      </div>
      <nav className="mt-6">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-6 py-3 text-sm font-medium hover:bg-gray-800 ${
              pathname === item.href ? "bg-gray-800 border-r-2 border-blue-500" : ""
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}
