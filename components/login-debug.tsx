"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Database, Users, Activity, HardDrive } from "lucide-react"
import { storage } from "../utils/storage"
import type { User } from "../types/knowledge-base"

interface LoginDebugProps {
  users: User[]
  onLogin: (user: User) => void
}

export function LoginDebug({ users, onLogin }: LoginDebugProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [storageInfo, setStorageInfo] = useState<any>(null)

  const refreshStorageInfo = () => {
    const health = storage.checkHealth()
    const info = storage.getStorageInfo()
    const visits = storage.getPageVisits()

    setStorageInfo({
      health,
      info,
      visits,
      timestamp: new Date().toLocaleTimeString(),
    })
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="bg-white shadow-lg border-2 border-blue-200 hover:border-blue-300"
        >
          <Activity className="h-4 w-4 mr-2" />
          Debug Panel
          <ChevronUp className="h-4 w-4 ml-2" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg border-2 border-blue-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              System Debug Panel
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)} className="h-6 w-6 p-0">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Users Section */}
          <div>
            <div className="flex items-center text-xs font-medium text-gray-700 mb-2">
              <Users className="h-3 w-3 mr-1" />
              Available Users ({users.length})
            </div>
            <div className="space-y-1">
              {users.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono">{user.username}</span>
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              ))}
              {users.length > 3 && <div className="text-xs text-gray-500">+{users.length - 3} more users</div>}
            </div>
          </div>

          {/* Storage Info */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-xs font-medium text-gray-700">
                <Database className="h-3 w-3 mr-1" />
                Storage Status
              </div>
              <Button variant="ghost" size="sm" onClick={refreshStorageInfo} className="h-5 text-xs px-2">
                Refresh
              </Button>
            </div>

            {storageInfo ? (
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Health:</span>
                  <Badge
                    variant={storageInfo.health.isAvailable ? "default" : "destructive"}
                    className="text-xs px-1 py-0"
                  >
                    {storageInfo.health.isAvailable ? "OK" : "Error"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Data:</span>
                  <span>{storageInfo.health.hasData ? "Present" : "Empty"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Size:</span>
                  <span>{formatBytes(storageInfo.info.totalSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Page Visits:</span>
                  <span>{storageInfo.visits}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Last updated: {storageInfo.timestamp}</div>
              </div>
            ) : (
              <div className="text-xs text-gray-500">Click refresh to load storage info</div>
            )}
          </div>

          {/* Environment Info */}
          <div>
            <div className="flex items-center text-xs font-medium text-gray-700 mb-2">
              <HardDrive className="h-3 w-3 mr-1" />
              Environment
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Mode:</span>
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {process.env.NODE_ENV || "development"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Local Storage:</span>
                <span>{typeof localStorage !== "undefined" ? "Available" : "Not Available"}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">Development Debug Panel</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
