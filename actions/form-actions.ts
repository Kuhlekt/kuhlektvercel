"use server"

import { getAffiliateError } from "@/lib/affiliates"

export async function submitContactForm(prevState: any, formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string
  const affiliateNumber = formData.get("affiliateNumber") as string

  // Validate affiliate number
  const affiliateError = getAffiliateError(affiliateNumber)
  if (affiliateError) {
    return {
      success: false,
      errors: {
        affiliateNumber: affiliateError,
      },
    }
  }

  // Simulate form submission delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Here you would typically save to database or send email
  console.log("Contact form submitted:", { name, email, message, affiliateNumber })

  return {
    success: true,
    message: "Thank you for your message! We'll get back to you soon.",
  }
}

export async function submitDemoForm(prevState: any, formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const company = formData.get("company") as string
  const phone = formData.get("phone") as string
  const affiliateNumber = formData.get("affiliateNumber") as string

  // Validate affiliate number
  const affiliateError = getAffiliateError(affiliateNumber)
  if (affiliateError) {
    return {
      success: false,
      errors: {
        affiliateNumber: affiliateError,
      },
    }
  }

  // Simulate form submission delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Here you would typically save to database or send email
  console.log("Demo form submitted:", { name, email, company, phone, affiliateNumber })

  return {
    success: true,
    message: "Demo request submitted! We'll contact you within 24 hours to schedule your demo.",
  }
}
