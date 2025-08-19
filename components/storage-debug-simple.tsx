"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Bug, RefreshCw, Trash2 } from "lucide-react"

export function StorageDebugSimple() {
  const [isOpen, setIsOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const checkStorage = () => {
    const users = localStorage.getItem("kb_users")
    const currentUser = localStorage.getItem("kb_current_user")

    let parsedUsers = null
    let parsedCurrentUser = null

    try {
      parsedUsers = users ? JSON.parse(users) : null
    } catch (e) {
      parsedUsers = "ERROR: " + e
    }

    try {
      parsedCurrentUser = currentUser ? JSON.parse(currentUser) : null
    } catch (e) {
      parsedCurrentUser = "ERROR: " + e
    }

    setDebugInfo({
      hasUsers: !!users,
      usersRaw: users?.substring(0, 200) + "...",
      usersParsed: parsedUsers,
      hasCurrentUser: !!currentUser,
      currentUserParsed: parsedCurrentUser,
      storageKeys: Object.keys(localStorage).filter((key) => key.startsWith("kb_")),
    })
    setIsOpen(true)
  }

  const resetStorage = () => {
    if (confirm("This will clear ALL data and reload the page. Continue?")) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const reinitialize = () => {
    if (confirm("This will reinitialize the storage system. Continue?")) {
      // Clear KB data only
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("kb_")) {
          localStorage.removeItem(key)
        }
      })
      window.location.reload()
    }
  }

  return (
    <>
      <Button
        onClick={checkStorage}
        variant="outline"
        size="sm"
        className="fixed bottom-16 right-4 z-50 bg-white shadow-lg"
      >
        <Bug className="h-4 w-4 mr-2" />
        Debug Login
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Login Debug Information</DialogTitle>
            <DialogDescription>Check storage state and admin user status</DialogDescription>
          </DialogHeader>

          {debugInfo && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span>Users stored:</span>
                  <Badge variant={debugInfo.hasUsers ? "default" : "destructive"}>
                    {debugInfo.hasUsers ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span>Current user:</span>
                  <Badge variant={debugInfo.hasCurrentUser ? "default" : "secondary"}>
                    {debugInfo.hasCurrentUser ? "Yes" : "None"}
                  </Badge>
                </div>
              </div>

              {debugInfo.usersParsed && (
                <div>
                  <h4 className="font-medium mb-2">Available Users:</h4>
                  <div className="bg-gray-100 p-3 rounded text-sm">
                    {typeof debugInfo.usersParsed === "string" ? (
                      <span className="text-red-600">{debugInfo.usersParsed}</span>
                    ) : Array.isArray(debugInfo.usersParsed) ? (
                      debugInfo.usersParsed.map((user: any, index: number) => (
                        <div key={index} className="mb-1">
                          <strong>{user.username}</strong> ({user.role}) - Password: {user.password}
                        </div>
                      ))
                    ) : (
                      <span>No users found</span>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Storage Keys:</h4>
                <div className="flex flex-wrap gap-1">
                  {debugInfo.storageKeys.map((key: string) => (
                    <Badge key={key} variant="outline" className="text-xs">
                      {key}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={reinitialize} variant="outline" className="flex-1 bg-transparent">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reinitialize
                </Button>
                <Button onClick={resetStorage} variant="destructive" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
