"use server"

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    // const role = formData.get("role") as string
    // const companySize = formData.get("companySize") as string
    const message = formData.get("message") as string

    console.log(email, company)

    // Validate required fields
    if (!firstName || !lastName || !email || !company || !message) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      }
    }

    // Simulate email sending (in a real app, you'd use a service like Resend, SendGrid, etc.)
    const emailContent = `
New Contact Form Submission from Kuhlekt Website

Contact Information:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Company: ${company}
- Role: ${role || "Not specified"}
- Company Size: ${companySize || "Not specified"}

Message:
${message}

Please follow up with this inquiry.
    `

    // In a real implementation, you would send the email here
    // For now, we'll simulate a successful submission
    console.log("Contact form submitted:", {
      firstName,
      lastName,
      email,
      company,
      role,
      companySize,
      message,
      emailContent,
    })

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      message: "Thank you for your message! We've received your inquiry and will get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      message:
        "Sorry, there was an error sending your message. Please try again or contact us directly at enquiries@kuhlekt.com",
    }
  }
}
