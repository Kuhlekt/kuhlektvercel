"use client"

import { useState, useEffect, useCallback } from "react"
import { storage } from "@/utils/storage"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export function StorageDebugDetailed() {
  const [isOpen, setIsOpen] = useState(false)
  const [users, setUsers] = useState(storage.getUsers())
  const [categories, setCategories] = useState(storage.getCategories())
  const [articles, setArticles] = useState(storage.getArticles())
  const [currentUser, setCurrentUser] = useState(storage.getCurrentUser())
  const [auditLog, setAuditLog] = useState(storage.getAuditLog())

  const forceUpdate = useCallback(() => {
    setUsers(storage.getUsers())
    setCategories(storage.getCategories())
    setArticles(storage.getArticles())
    setCurrentUser(storage.getCurrentUser())
    setAuditLog(storage.getAuditLog())
  }, [])

  useEffect(() => {
    if (isOpen) {
      forceUpdate()
    }
  }, [isOpen, forceUpdate])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Storage Debug (Detailed)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Detailed Storage Debug</DialogTitle>
          <DialogDescription>Inspect all data in local storage.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Users</h3>
              <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">{JSON.stringify(users, null, 2)}</pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Categories</h3>
              <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">{JSON.stringify(categories, null, 2)}</pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Articles</h3>
              <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">{JSON.stringify(articles, null, 2)}</pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Current User</h3>
              <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">{JSON.stringify(currentUser, null, 2)}</pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Audit Log</h3>
              <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">{JSON.stringify(auditLog, null, 2)}</pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Storage Keys</h3>
              <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">
                {JSON.stringify(Object.keys(localStorage), null, 2)}
              </pre>
            </div>
          </div>
        </ScrollArea>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
