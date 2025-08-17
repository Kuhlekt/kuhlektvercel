"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Edit, Eye, User, ChevronDown, ChevronUp } from "lucide-react"
import type { User as UserType } from "../types/knowledge-base"

interface LoginDebugProps {
  users: UserType[]
  onLogin: (user: UserType) => void
}

export function LoginDebug({ users, onLogin }: LoginDebugProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "editor":
        return <Edit className="h-4 w-4" />
      case "viewer":
        return <Eye className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive" as const
      case "editor":
        return "default" as const
      case "viewer":
        return "secondary" as const
      default:
        return "outline" as const
    }
  }

  const handleLogin = (user: UserType) => {
    const updatedUser = {
      ...user,
      lastLogin: new Date(),
    }
    onLogin(updatedUser)
  }

  if (users.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg border-2 border-blue-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-blue-700">Debug Login Panel</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-6 w-6 p-0">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="pt-0">
            <div className="space-y-2">
              <p className="text-xs text-gray-600 mb-3">Quick login for testing:</p>
              {users.slice(0, 4).map((user) => (
                <Button
                  key={user.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left bg-transparent"
                  onClick={() => handleLogin(user)}
                >
                  <div className="flex items-center space-x-2 w-full">
                    {getRoleIcon(user.role)}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{user.name}</div>
                      <div className="text-xs text-gray-500 truncate">@{user.username}</div>
                    </div>
                    <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                      {user.role}
                    </Badge>
                  </div>
                </Button>
              ))}
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500">Users loaded: {users.length} | Click to login instantly</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
