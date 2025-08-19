"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Modal, Button } from "antd"
import { LogIn } from "lucide-react"
import type { User } from "./types" // Assuming a User type is defined somewhere
import ArticleViewer from "./ArticleViewer" // Assuming ArticleViewer is defined somewhere
import AddArticleForm from "./AddArticleForm" // Assuming AddArticleForm is defined somewhere
import EditArticleForm from "./EditArticleForm" // Assuming EditArticleForm is defined somewhere
import AdminDashboard from "./AdminDashboard" // Assuming AdminDashboard is defined somewhere
import storage from "./storage" // Assuming storage is defined somewhere

const KnowledgeBase: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(true)
  const [currentView, setCurrentView] = useState("browse")
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [navigationContext, setNavigationContext] = useState({ type: "all" })
  const [categories, setCategories] = useState([]) // Assuming categories are defined somewhere
  const [auditLog, setAuditLog] = useState([]) // Assuming auditLog is defined somewhere
  const [editingArticle, setEditingArticle] = useState(null) // Assuming editingArticle is defined somewhere

  useEffect(() => {
    // Fetch users from an API or a local source
    const fetchUsers = async () => {
      const response = await fetch("/api/users")
      const data = await response.json()
      setUsers(data)
    }

    fetchUsers()
    // Data initialization completed - user must log in
    console.log("Data initialization completed - user must log in")
  }, [])

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    setShowLoginModal(false)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentView("browse")
    setSelectedArticle(null)
    setSearchQuery("")
    setSearchResults([])
    setNavigationContext({ type: "all" })
  }

  const handleAddArticle = (article) => {
    // Logic to handle adding an article
  }

  const handleEditArticle = (article) => {
    // Logic to handle editing an article
  }

  return (
    <div>
      {currentUser && (
        <div>
          <h1>Welcome, {currentUser.username}!</h1>
          <Button onClick={handleLogout}>Logout</Button>
          {/* Render knowledge base content here */}
        </div>
      )}
      {!currentUser && showLoginModal && (
        <Modal title="Login" visible={showLoginModal} onCancel={() => setShowLoginModal(false)} footer={null}>
          <div>
            {users.map((user) => (
              <Button key={user.id} onClick={() => handleLogin(user)}>
                Login as {user.username}
              </Button>
            ))}
          </div>
        </Modal>
      )}
      {currentView === "add" && !currentUser ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to add articles.</p>
          <Button onClick={() => setShowLoginModal(true)}>
            <LogIn className="h-4 w-4 mr-2" />
            Log In
          </Button>
        </div>
      ) : currentView === "add" && currentUser?.role !== "admin" ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Admin Access Required</h2>
          <p className="text-gray-600">You need admin privileges to add articles.</p>
        </div>
      ) : (
        currentView === "add" && (
          <AddArticleForm
            categories={categories}
            onSubmit={handleAddArticle}
            onCancel={() => setCurrentView("browse")}
          />
        )
      )}
      {currentView === "edit" && !currentUser ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to edit articles.</p>
          <Button onClick={() => setShowLoginModal(true)}>
            <LogIn className="h-4 w-4 mr-2" />
            Log In
          </Button>
        </div>
      ) : currentView === "edit" && currentUser?.role !== "admin" ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Admin Access Required</h2>
          <p className="text-gray-600">You need admin privileges to edit articles.</p>
        </div>
      ) : (
        currentView === "edit" &&
        editingArticle && (
          <EditArticleForm
            article={editingArticle}
            categories={categories}
            currentUser={currentUser}
            onSubmit={handleEditArticle}
            onCancel={() => {
              setCurrentView("browse")
              setEditingArticle(null)
            }}
          />
        )
      )}
      {currentView === "admin" && !currentUser ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access admin features.</p>
          <Button onClick={() => setShowLoginModal(true)}>
            <LogIn className="h-4 w-4 mr-2" />
            Log In
          </Button>
        </div>
      ) : currentView === "admin" && currentUser?.role !== "admin" ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Admin Access Required</h2>
          <p className="text-gray-600">You need admin privileges to access this section.</p>
        </div>
      ) : (
        currentView === "admin" && (
          <AdminDashboard
            categories={categories}
            users={users}
            auditLog={auditLog}
            onCategoriesUpdate={(newCategories) => {
              setCategories(newCategories)
              setAuditLog(storage.getAuditLog())
            }}
            onUsersUpdate={(newUsers) => {
              setUsers(newUsers)
              setAuditLog(storage.getAuditLog())
            }}
            onAuditLogUpdate={setAuditLog}
          />
        )
      )}
      {currentView === "browse" && <div>{/* Render browse view here */}</div>}
      {selectedArticle && (
        <ArticleViewer
          article={selectedArticle}
          categories={categories}
          onBack={() => {}}
          backButtonText=""
          onEdit={(article) => setEditingArticle(article)}
          onDelete={() => {}}
          currentUser={currentUser}
        />
      )}
    </div>
  )
}

export default KnowledgeBase
