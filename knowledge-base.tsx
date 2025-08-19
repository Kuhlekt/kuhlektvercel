"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Modal, Button } from "antd"
import type { User } from "./types" // Assuming a User type is defined somewhere

const KnowledgeBase: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(true)

  useEffect(() => {
    // Fetch users from an API or a local source
    const fetchUsers = async () => {
      const response = await fetch("/api/users")
      const data = await response.json()
      setUsers(data)
    }

    fetchUsers()
  }, [])

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    setShowLoginModal(false)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setShowLoginModal(true)
  }

  return (
    <div>
      {currentUser && (
        <div>
          <h1>Welcome, {currentUser.username}!</h1>
          <Button onClick={handleLogout}>Logout</Button>
          {/* Render knowledge base content here */}
        </div>
      )}
      {!currentUser && showLoginModal && (
        <Modal title="Login" visible={showLoginModal} onCancel={() => setShowLoginModal(false)} footer={null}>
          <div>
            {users.map((user) => (
              <Button key={user.id} onClick={() => handleLogin(user)}>
                Login as {user.username}
              </Button>
            ))}
          </div>
        </Modal>
      )}
      {/* Render knowledge base content here */}
    </div>
  )
}

export default KnowledgeBase
