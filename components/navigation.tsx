import type React from "react"

const Navigation: React.FC = () => {
  return (
    <nav className="bg-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt" className="h-8 w-auto" />
        </div>
        {/* rest of code here */}
      </div>
    </nav>
  )
}

export default Navigation
