"use client"

import { useState } from "react"
import type { User } from "./types" // Assuming User type is defined in a separate file

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  users: User[]
  onLogin: (user: User) => void
}

export function LoginModal({ isOpen, onClose, users = [], onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = () => {
    const user = users.find((u) => u.username === username && u.password === password)
    if (user) {
      onLogin(user)
      onClose()
    } else {
      setError("Invalid username or password")
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Demo Credentials */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">Demo Credentials (click to fill):</p>
          <div className="space-y-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setUsername("admin")
                setPassword("admin123")
              }}
              className="block w-full text-left p-1 hover:bg-blue-100 rounded"
            >
              <strong>Admin:</strong> admin / admin123
            </button>
            <button
              type="button"
              onClick={() => {
                setUsername("editor")
                setPassword("editor123")
              }}
              className="block w-full text-left p-1 hover:bg-blue-100 rounded"
            >
              <strong>Editor:</strong> editor / editor123
            </button>
            <button
              type="button"
              onClick={() => {
                setUsername("viewer")
                setPassword("viewer123")
              }}
              className="block w-full text-left p-1 hover:bg-blue-100 rounded"
            >
              <strong>Viewer:</strong> viewer / viewer123
            </button>
          </div>
        </div>

        <h2 className="text-lg font-medium mb-4">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button
          type="button"
          onClick={handleLogin}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full p-2 mt-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  )
}
