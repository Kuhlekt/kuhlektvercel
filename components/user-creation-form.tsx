"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { User } from "../types/knowledge-base"

interface UserCreationFormProps {
  onCreateUser: (userData: Omit<User, "id" | "createdAt" | "lastLogin">) => void
  error?: string
}

export function UserCreationForm({ onCreateUser, error }: UserCreationFormProps) {
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"admin" | "editor" | "viewer">("viewer")
  const [formError, setFormError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    if (!username.trim() || !name.trim()) {
      setFormError("Username and name are required")
      return
    }

    if (email && !email.includes("@")) {
      setFormError("Please enter a valid email address")
      return
    }

    onCreateUser({
      username: username.trim(),
      name: name.trim(),
      email: email.trim() || `${username}@example.com`,
      role,
    })

    // Reset form
    setUsername("")
    setName("")
    setEmail("")
    setRole("viewer")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New User</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(error || formError) && (
            <Alert variant="destructive">
              <AlertDescription>{error || formError}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="new-username">Username</Label>
            <Input
              id="new-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <Label htmlFor="new-name">Full Name</Label>
            <Input
              id="new-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="new-email">Email (optional)</Label>
            <Input
              id="new-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value: "admin" | "editor" | "viewer") => setRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer - Read only access</SelectItem>
                <SelectItem value="editor">Editor - Can add/edit articles</SelectItem>
                <SelectItem value="admin">Admin - Full access</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Create User
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
