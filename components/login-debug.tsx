"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { storage } from "../utils/storage"
import { initialUsers } from "../data/initial-users"
import type { User } from "../types/knowledge-base"

interface LoginDebugProps {
  users: User[]
  onLogin: (user: User) => void
}

export function LoginDebug({ users, onLogin }: LoginDebugProps) {
  const [storageUsers, setStorageUsers] = useState<User[]>([])

  useEffect(() => {
    const loadStorageUsers = () => {
      const stored = storage.getUsers()
      setStorageUsers(stored)
    }
    loadStorageUsers()
  }, [])

  const resetUsers = () => {
    console.log("Resetting users to initial state...")
    storage.saveUsers(initialUsers)
    setStorageUsers(initialUsers)
    window.location.reload()
  }

  const testLogin = (username: string, password: string) => {
    console.log("Testing login with:", { username, password })
    const user = users.find((u) => u.username === username && u.password === password)
    if (user) {
      console.log("Login successful!")
      onLogin(user)
    } else {
      console.log("Login failed!")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle>Login Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Users in Props ({users.length}):</h3>
          <div className="text-sm space-y-1">
            {users.map((user, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>
                  <strong>{user.username}</strong> / {user.password} ({user.role})
                </span>
                <Button size="sm" onClick={() => testLogin(user.username, user.password)}>
                  Test Login
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Users in Storage ({storageUsers.length}):</h3>
          <div className="text-sm space-y-1">
            {storageUsers.map((user, index) => (
              <div key={index} className="p-2 bg-blue-50 rounded">
                <strong>{user.username}</strong> / {user.password} ({user.role})
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Initial Users ({initialUsers.length}):</h3>
          <div className="text-sm space-y-1">
            {initialUsers.map((user, index) => (
              <div key={index} className="p-2 bg-green-50 rounded">
                <strong>{user.username}</strong> / {user.password} ({user.role})
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button onClick={resetUsers} variant="destructive">
            Reset Users to Initial State
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline">
            Reload Page
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
