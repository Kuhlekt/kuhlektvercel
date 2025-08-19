import Link from "next/link"

const Navigation = () => {
  return (
    <nav className="bg-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt Logo" className="h-8 w-8 object-contain" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Kuhlekt KB</h1>
            <p className="text-xs text-gray-500">Knowledge Base</p>
          </div>
        </div>
        <div className="space-x-4">
          <Link href="/">
            <a className="text-gray-600 hover:text-gray-800">Home</a>
          </Link>
          <Link href="/about">
            <a className="text-gray-600 hover:text-gray-800">About</a>
          </Link>
          <Link href="/contact">
            <a className="text-gray-600 hover:text-gray-800">Contact</a>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
