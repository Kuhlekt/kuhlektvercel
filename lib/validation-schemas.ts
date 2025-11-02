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
  password: z.string().min(1, "Password is required"),
})

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  company: z.string().max(100, "Company name too long").optional(),
  message: z.string().min(1, "Message is required").max(5000, "Message too long").optional(),
  recaptchaToken: z.string().optional(),
})

export const chatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(2000, "Message too long"),
  conversationId: z.string().min(1, "Conversation ID required"),
})

export const handoffRequestSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID required"),
  reason: z.string().max(500, "Reason too long").optional(),
})

export const externalHandoffSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100, "First name too long"),
  lastName: z.string().min(1, "Last name is required").max(100, "Last name too long"),
  email: z.string().email("Invalid email format"),
  phone: z.string().max(20, "Phone number too long").optional(),
})
