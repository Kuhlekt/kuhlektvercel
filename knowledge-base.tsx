"use client"

import { useState } from "react"
import { LoginModal } from "./components/login-modal"
import { LoginDebug } from "./components/login-debug"

const KnowledgeBase = ({ users }) => {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  const handleLogin = (user) => {
    setCurrentUser(user)
    setShowLoginModal(false)
  }

  return (
    <div>
      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        users={users}
      />

      {/* Debug Component - Remove this in production */}
      {!currentUser && <LoginDebug users={users} onLogin={handleLogin} />}

      {/* Knowledge Base Content */}
      {currentUser && (
        <div>
          <h1>Welcome to the Knowledge Base, {currentUser.name}!</h1>
          {/* Display knowledge base articles here */}
        </div>
      )}
    </div>
  )
}

export default KnowledgeBase
