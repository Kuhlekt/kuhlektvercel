"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Bug,
  ChevronDown,
  ChevronUp,
  Shield,
  UserCheck,
  User,
  Database,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react"
import { storage } from "../utils/storage"
import type { User as UserType } from "../types/knowledge-base"

interface LoginDebugProps {
  users: UserType[]
  onLogin: (user: UserType) => void
}

export function LoginDebug({ users, onLogin }: LoginDebugProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [storageInfo, setStorageInfo] = useState<any>(null)

  const handleQuickLogin = (user: UserType) => {
    const updatedUser = {
      ...user,
      lastLogin: new Date(),
    }
    onLogin(updatedUser)
  }

  const handleStorageCheck = () => {
    try {
      const info = storage.getStorageInfo()
      const health = storage.checkHealth()
      setStorageInfo({ ...info, health })
    } catch (error) {
      setStorageInfo({ error: error instanceof Error ? error.message : "Unknown error" })
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "editor":
        return <UserCheck className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "editor":
        return "secondary"
      default:
        return "outline"
    }
  }

  // Only show in development or when no users are available
  if (users.length === 0) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            No users available for login. Check data initialization.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="bg-white shadow-lg">
            <Bug className="h-4 w-4 mr-2" />
            Debug Panel
            {isOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <Card className="w-80 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Bug className="h-4 w-4" />
                <span>Development Debug Panel</span>
              </CardTitle>
              <CardDescription className="text-xs">Quick login and system diagnostics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Login Section */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>Quick Login</span>
                </h4>
                <div className="grid gap-1">
                  {users.slice(0, 3).map((user) => (
                    <Button
                      key={user.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickLogin(user)}
                      className="justify-start h-8 text-xs"
                    >
                      {getRoleIcon(user.role)}
                      <span className="flex-1 text-left ml-2">{user.username}</span>
                      <Badge variant={getRoleBadgeVariant(user.role) as any} className="text-xs">
                        {user.role}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              {/* System Info Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium flex items-center space-x-1">
                    <Database className="h-3 w-3" />
                    <span>System Status</span>
                  </h4>
                  <Button variant="ghost" size="sm" onClick={handleStorageCheck} className="h-6 text-xs">
                    Check
                  </Button>
                </div>

                {storageInfo && (
                  <div className="space-y-1">
                    {storageInfo.error ? (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-3 w-3 text-red-600" />
                        <AlertDescription className="text-xs text-red-800">{storageInfo.error}</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span>Categories:</span>
                          <Badge variant="outline" className="text-xs">
                            {storageInfo.categories}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Users:</span>
                          <Badge variant="outline" className="text-xs">
                            {storageInfo.users}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Audit Log:</span>
                          <Badge variant="outline" className="text-xs">
                            {storageInfo.auditLog}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Visits:</span>
                          <Badge variant="outline" className="text-xs">
                            {storageInfo.pageVisits}
                          </Badge>
                        </div>
                        {storageInfo.health && (
                          <div className="col-span-2 flex items-center space-x-1">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-green-600">Storage Healthy</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Info Section */}
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-3 w-3 text-blue-600" />
                <AlertDescription className="text-xs text-blue-800">
                  This panel is for development and testing. Use quick login buttons to access admin features.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
