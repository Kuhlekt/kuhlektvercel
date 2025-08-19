"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Bug, Database, FileText, Users, Activity } from "lucide-react"
import { storage } from "../utils/storage"

export function StorageDebugDetailed() {
  const [isOpen, setIsOpen] = useState(false)
  const [debugData, setDebugData] = useState<any>(null)

  const runDebug = () => {
    console.log("🔍 Running detailed storage debug...")

    // Get raw localStorage data
    const rawUsers = localStorage.getItem("kb_users")
    const rawCategories = localStorage.getItem("kb_categories")
    const rawArticles = localStorage.getItem("kb_articles")
    const rawAuditLog = localStorage.getItem("kb_audit_log")
    const rawCurrentUser = localStorage.getItem("kb_current_user")

    // Get parsed data from storage
    const parsedUsers = storage.getUsers()
    const parsedCategories = storage.getCategories()
    const parsedArticles = storage.getArticles()
    const parsedAuditLog = storage.getAuditLog()
    const currentUser = storage.getCurrentUser()

    const debug = {
      localStorage: {
        users: rawUsers ? JSON.parse(rawUsers) : null,
        categories: rawCategories ? JSON.parse(rawCategories) : null,
        articles: rawArticles ? JSON.parse(rawArticles) : null,
        auditLog: rawAuditLog ? JSON.parse(rawAuditLog) : null,
        currentUser: rawCurrentUser ? JSON.parse(rawCurrentUser) : null,
      },
      parsed: {
        users: parsedUsers,
        categories: parsedCategories,
        articles: parsedArticles,
        auditLog: parsedAuditLog,
        currentUser: currentUser,
      },
      counts: {
        rawUsers: rawUsers ? JSON.parse(rawUsers).length : 0,
        rawCategories: rawCategories ? JSON.parse(rawCategories).length : 0,
        rawArticles: rawArticles ? JSON.parse(rawArticles).length : 0,
        rawAuditLog: rawAuditLog ? JSON.parse(rawAuditLog).length : 0,
        parsedUsers: parsedUsers.length,
        parsedCategories: parsedCategories.length,
        parsedArticles: parsedArticles.length,
        parsedAuditLog: parsedAuditLog.length,
      },
      articleDetails: parsedArticles.map((article) => ({
        id: article.id,
        title: article.title,
        status: article.status,
        categoryId: article.categoryId,
        authorId: article.authorId,
        createdBy: article.createdBy,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        contentLength: article.content.length,
        tagsCount: article.tags.length,
      })),
    }

    console.log("🔍 Debug data:", debug)
    setDebugData(debug)
    setIsOpen(true)
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear ALL data? This cannot be undone.")) {
      storage.clearAll()
      storage.init()
      console.log("🗑️ All data cleared and reinitialized")
      runDebug()
    }
  }

  const reinitializeStorage = () => {
    storage.resetToDefaults()
    console.log("🔄 Storage reset to defaults")
    runDebug()
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 z-50">
        <Button onClick={runDebug} variant="outline" size="sm" className="bg-white shadow-lg">
          <Bug className="h-4 w-4 mr-2" />
          Debug Storage
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Storage Debug Information</span>
            </DialogTitle>
          </DialogHeader>

          {debugData && (
            <ScrollArea className="h-[60vh]">
              <div className="space-y-6">
                {/* Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Data Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">{debugData.counts.parsedUsers}</div>
                        <div className="text-sm text-blue-800">Users</div>
                        <div className="text-xs text-gray-500">Raw: {debugData.counts.rawUsers}</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">{debugData.counts.parsedCategories}</div>
                        <div className="text-sm text-green-800">Categories</div>
                        <div className="text-xs text-gray-500">Raw: {debugData.counts.rawCategories}</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-xl font-bold text-purple-600">{debugData.counts.parsedArticles}</div>
                        <div className="text-sm text-purple-800">Articles</div>
                        <div className="text-xs text-gray-500">Raw: {debugData.counts.rawArticles}</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-xl font-bold text-orange-600">{debugData.counts.parsedAuditLog}</div>
                        <div className="text-sm text-orange-800">Audit Log</div>
                        <div className="text-xs text-gray-500">Raw: {debugData.counts.rawAuditLog}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Current User */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Current User</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {debugData.parsed.currentUser ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Username:</span>
                          <Badge>{debugData.parsed.currentUser.username}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Role:</span>
                          <Badge variant="outline">{debugData.parsed.currentUser.role}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>ID:</span>
                          <span className="text-sm text-gray-600">{debugData.parsed.currentUser.id}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No user logged in</p>
                    )}
                  </CardContent>
                </Card>

                {/* Articles Detail */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Articles Detail</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {debugData.articleDetails.length > 0 ? (
                      <div className="space-y-3">
                        {debugData.articleDetails.map((article: any) => (
                          <div key={article.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{article.title}</h4>
                              <Badge variant={article.status === "published" ? "default" : "secondary"}>
                                {article.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                              <div>ID: {article.id}</div>
                              <div>Category: {article.categoryId}</div>
                              <div>Author: {article.authorId}</div>
                              <div>Created By: {article.createdBy}</div>
                              <div>Content: {article.contentLength} chars</div>
                              <div>Tags: {article.tagsCount}</div>
                              <div>Created: {new Date(article.createdAt).toLocaleDateString()}</div>
                              <div>Updated: {new Date(article.updatedAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No articles found</p>
                    )}
                  </CardContent>
                </Card>

                {/* Raw Data */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-4 w-4" />
                      <span>Raw LocalStorage Data</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Articles (Raw)</h4>
                        <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                          {JSON.stringify(debugData.localStorage.articles, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Categories (Raw)</h4>
                        <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                          {JSON.stringify(debugData.localStorage.categories, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Debug Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Button onClick={reinitializeStorage} variant="outline">
                        Reset to Defaults
                      </Button>
                      <Button onClick={clearAllData} variant="destructive">
                        Clear All Data
                      </Button>
                      <Button onClick={runDebug} variant="outline">
                        Refresh Debug
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
