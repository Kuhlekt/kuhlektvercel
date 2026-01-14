import { z } from "zod"

export const handoffIdSchema = z.object({
  handoffId: z.string().uuid("Invalid handoff ID format"),
})

export const phoneNumberSchema = z.object({
  handoffId: z.string().uuid("Invalid handoff ID format"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be at most 20 digits")
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, "Invalid phone number format"),
})

export const conversationIdSchema = z.object({
  conversationId: z.string().uuid("Invalid conversation ID format"),
})

export const agentMessageSchema = z.object({
  conversationId: z.string().uuid("Invalid conversation ID format"),
  message: z.string().min(1, "Message cannot be empty").max(5000, "Message too long"),
})

export const statusUpdateSchema = z.object({
  conversationId: z.string().uuid("Invalid conversation ID format"),
  status: z.enum(["pending", "in-progress", "resolved"], {
    errorMap: () => ({ message: "Invalid status value" }),
  }),
})

export const totpTokenSchema = z.object({
  token: z
    .string()
    .length(6, "TOTP token must be 6 digits")
    .regex(/^\d{6}$/, "TOTP token must be numeric"),
})

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Password is required").max(1000, "Password too long"),
})

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long").trim(),
  email: z.string().email("Invalid email address").max(255, "Email too long"),
  company: z
    .string()
    .max(100, "Company name too long")
    .optional()
    .transform((val) => val?.trim() || undefined),
  message: z
    .string()
    .min(1, "Message is required")
    .max(5000, "Message too long")
    .optional()
    .transform((val) => val?.trim() || undefined),
  recaptchaToken: z.string().optional(),
})

export const chatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(2000, "Message too long").trim(),
  conversationId: z.string().min(1, "Conversation ID required").max(100, "Conversation ID too long"),
})

export const handoffRequestSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID required"),
  reason: z.string().max(500, "Reason too long").optional(),
})

export const externalHandoffSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100, "First name too long").trim(),
  lastName: z.string().min(1, "Last name is required").max(100, "Last name too long").trim(),
  userEmail: z.string().min(1, "Email is required").max(255, "Email too long").email("Invalid email format"),
  phone: z.string().max(20, "Phone number too long").optional(),
  sessionId: z.string().optional(),
  userId: z.string().nullable().optional(),
  userName: z.string().max(100, "Username too long").optional(),
  reason: z.string().max(500, "Reason too long").optional(),
})

export const twoFactorSchema = z.object({
  token: z
    .string()
    .length(6, "2FA token must be 6 digits")
    .regex(/^\d{6}$/, "2FA token must be numeric"),
  password: z.string().min(1, "Password is required"),
})

export const demoRequestSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100, "First name too long").trim(),
  lastName: z.string().min(1, "Last name is required").max(100, "Last name too long").trim(),
  email: z.string().email("Invalid email").max(255, "Email too long"),
  phone: z.string().max(20, "Phone too long").optional(),
  company: z.string().min(1, "Company is required").max(100, "Company name too long").trim(),
  jobTitle: z.string().max(100, "Job title too long").optional(),
  companySize: z.string().max(50, "Company size too long").optional(),
  currentSolution: z.string().max(500, "Current solution description too long").optional(),
  challenges: z.string().max(2000, "Challenges description too long").optional(),
  timeline: z.string().max(100, "Timeline too long").optional(),
  promoCode: z.string().max(50, "Promo code too long").optional(),
})
