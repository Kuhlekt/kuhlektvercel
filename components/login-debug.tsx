"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { storage } from "../utils/storage"
import { initialUsers } from "../data/initial-users"
import type { User } from "../types/knowledge-base"

interface LoginDebugProps {
  users: User[]
  onLogin: (user: User) => void
}

export function LoginDebug({ users, onLogin }: LoginDebugProps) {
  const [debugInfo, setDebugInfo] = useState("")

  const checkUsers = () => {
    const info = {
      propsUsers: users || [],
      storageUsers: storage.getUsers(),
      initialUsers: initialUsers,
      storageHealth: storage.checkHealth(),
    }
    setDebugInfo(JSON.stringify(info, null, 2))
    console.log("User Debug Info:", info)
  }

  const resetUsers = () => {
    try {
      storage.saveUsers(initialUsers)
      setDebugInfo("Users reset to initial state")
      console.log("Users reset successfully")
    } catch (error) {
      setDebugInfo(`Error resetting users: ${error}`)
      console.error("Error resetting users:", error)
    }
  }

  const testLogin = (user: User) => {
    console.log("Testing login for:", user.username)
    onLogin(user)
  }

  return (
    <Card className="m-4 max-w-2xl">
      <CardHeader>
        <CardTitle>Login Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button onClick={checkUsers}>Check Users</Button>
          <Button onClick={resetUsers} variant="outline">
            Reset Users to Initial State
          </Button>
        </div>

        {debugInfo && (
          <Alert>
            <AlertDescription>
              <pre className="text-xs overflow-auto max-h-40">{debugInfo}</pre>
            </AlertDescription>
          </Alert>
        )}

        <div>
          <h4 className="font-semibold mb-2">Test Login (Props Users):</h4>
          {users && users.length > 0 ? (
            users.map((user) => (
              <Button key={user.id} onClick={() => testLogin(user)} variant="outline" size="sm" className="mr-2 mb-2">
                {user.username} ({user.role})
              </Button>
            ))
          ) : (
            <p className="text-red-500">No users in props</p>
          )}
        </div>

        <div>
          <h4 className="font-semibold mb-2">Test Login (Initial Users):</h4>
          {initialUsers.map((user) => (
            <Button key={user.id} onClick={() => testLogin(user)} variant="outline" size="sm" className="mr-2 mb-2">
              {user.username} ({user.role})
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
