"use server"

import bcrypt from "bcryptjs"

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

export async function validateServerEnvironment(): Promise<boolean> {
  return typeof process !== "undefined" && process.env !== undefined
}
