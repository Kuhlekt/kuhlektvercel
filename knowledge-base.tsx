"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { UserManagement } from "@/components/user-management"
import { CategoryManagement } from "@/components/category-management"
import { ArticleManagement } from "@/components/article-management"
import { DataManagement } from "@/components/data-management"
import { BackupRestore } from "@/components/backup-restore"
import { StorageDebugDetailed } from "@/components/storage-debug-detailed"
import { StorageDebugSimple } from "@/components/storage-debug-simple"
import { StorageDebug } from "@/components/storage-debug"
import { LoginDebug } from "@/components/login-debug"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { storage } from "@/utils/storage"
import type { User, Category, Article, AuditLog } from "@/types/knowledge-base"

interface KnowledgeBaseProps {
  initialUsers: User[]
  initialCategories: Category[]
  initialArticles: Article[]
  initialAuditLog: AuditLog[]
}

export default function KnowledgeBase({
  initialUsers,
  initialCategories,
  initialArticles,
  initialAuditLog,
}: KnowledgeBaseProps) {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [auditLog, setAuditLog] = useState<AuditLog[]>(initialAuditLog)
  const [currentUser, setCurrentUser] = useState<User | null>(storage.getCurrentUser())
  const { toast } = useToast()

  useEffect(() => {
    storage.init()
    setUsers(storage.getUsers())
    setCategories(storage.getCategories())
    setArticles(storage.getArticles())
    setAuditLog(storage.getAuditLog())
    setCurrentUser(storage.getCurrentUser())
  }, [])

  useEffect(() => {
    setUsers(storage.getUsers())
    setCategories(storage.getCategories())
    setArticles(storage.getArticles())
    setAuditLog(storage.getAuditLog())
  }, [currentUser])

  const handleDataRestored = () => {
    toast({
      title: "Backup Restored",
      description: "The knowledge base has been restored from backup.",
    })
    router.refresh()
  }

  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Please log in to access the Knowledge Base.</p>
      </div>
    )
  }

  return (
    <Tabs defaultValue="articles" className="w-[100%]">
      <TabsList>
        <TabsTrigger value="articles">Articles</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="data">Data</TabsTrigger>
        <TabsTrigger value="backup">Backup</TabsTrigger>
        <TabsTrigger value="storage-debug">Storage Debug</TabsTrigger>
      </TabsList>
      <TabsContent value="articles">
        <ArticleManagement
          articles={articles}
          categories={categories}
          currentUser={currentUser}
          onUpdateArticles={(updatedArticles) => {
            setArticles(updatedArticles)
            storage.saveArticles(updatedArticles)
          }}
        />
      </TabsContent>
      <TabsContent value="categories">
        <CategoryManagement
          categories={categories}
          currentUser={currentUser}
          onUpdateCategories={(updatedCategories) => {
            setCategories(updatedCategories)
            storage.saveCategories(updatedCategories)
          }}
        />
      </TabsContent>
      <TabsContent value="users">
        <UserManagement
          users={users}
          currentUser={currentUser}
          onUpdateUsers={(updatedUsers) => {
            setUsers(updatedUsers)
            storage.saveUsers(updatedUsers)
          }}
        />
      </TabsContent>
      <TabsContent value="data">
        <DataManagement />
      </TabsContent>
      <TabsContent value="backup">
        <BackupRestore
          users={users}
          categories={categories}
          articles={articles}
          auditLog={auditLog}
          currentUser={currentUser}
          onDataRestored={handleDataRestored}
        />
      </TabsContent>
      <TabsContent value="storage-debug">
        <StorageDebugDetailed />
        <StorageDebugSimple />
        <StorageDebug />
        <LoginDebug />
      </TabsContent>
    </Tabs>
  )
}
