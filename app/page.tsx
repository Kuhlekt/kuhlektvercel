import KnowledgeBase from "../knowledge-base"

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img
        src="/images/kuhlekt-logo.jpg"
        alt="Kuhlekt Logo"
        className="h-20 w-auto mb-4" // Increased size with margin
      />
      <KnowledgeBase />
    </div>
  )
}

export default HomePage
