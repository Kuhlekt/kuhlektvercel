"use server"

import { createServerClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export interface AdminUser {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  role: "super_admin" | "admin" | "viewer"
  is_active: boolean
  last_login?: string
  failed_login_attempts: number
  locked_until?: string
  password_changed_at: string
  two_factor_enabled: boolean
  created_at: string
  updated_at: string
}

export async function getAdminUsers(): Promise<{ success: boolean; data?: AdminUser[]; error?: string }> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("admin_users").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching admin users:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error in getAdminUsers:", error)
    return { success: false, error: "Failed to fetch admin users" }
  }
}

export async function createAdminUser(userData: {
  username: string
  email: string
  password: string
  first_name?: string
  last_name?: string
  role: "super_admin" | "admin" | "viewer"
}): Promise<{ success: boolean; data?: AdminUser; error?: string }> {
  try {
    const supabase = createServerClient()

    // Hash the password
    const password_hash = await bcrypt.hash(userData.password, 12)

    const { data, error } = await supabase
      .from("admin_users")
      .insert([
        {
          username: userData.username,
          email: userData.email,
          password_hash,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role,
          password_changed_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating admin user:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in createAdminUser:", error)
    return { success: false, error: "Failed to create admin user" }
  }
}

export async function updateAdminUser(
  userId: number,
  updates: Partial<Omit<AdminUser, "id" | "password_hash" | "created_at" | "updated_at">>,
): Promise<{ success: boolean; data?: AdminUser; error?: string }> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("admin_users").update(updates).eq("id", userId).select().single()

    if (error) {
      console.error("Error updating admin user:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in updateAdminUser:", error)
    return { success: false, error: "Failed to update admin user" }
  }
}

export async function deleteAdminUser(userId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerClient()

    const { error } = await supabase.from("admin_users").delete().eq("id", userId)

    if (error) {
      console.error("Error deleting admin user:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteAdminUser:", error)
    return { success: false, error: "Failed to delete admin user" }
  }
}

export async function changeUserPassword(
  userId: number,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerClient()

    // Hash the new password
    const password_hash = await bcrypt.hash(newPassword, 12)

    const { error } = await supabase
      .from("admin_users")
      .update({
        password_hash,
        password_changed_at: new Date().toISOString(),
        failed_login_attempts: 0,
        locked_until: null,
      })
      .eq("id", userId)

    if (error) {
      console.error("Error changing user password:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in changeUserPassword:", error)
    return { success: false, error: "Failed to change password" }
  }
}

export async function toggleUserStatus(
  userId: number,
  isActive: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerClient()

    const { error } = await supabase.from("admin_users").update({ is_active: isActive }).eq("id", userId)

    if (error) {
      console.error("Error toggling user status:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in toggleUserStatus:", error)
    return { success: false, error: "Failed to toggle user status" }
  }
}
