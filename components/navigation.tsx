const Navigation = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <img
                src="/images/kuhlekt-logo.jpg"
                alt="Kuhlekt Logo"
                className="h-16 w-auto" // Increased from smaller size
              />
            </div>
            {/* Additional navigation links can be added here */}
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {/* Additional navigation items can be added here */}
          </div>
          <div className="md:hidden flex items-center">{/* Mobile menu button can be added here */}</div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
