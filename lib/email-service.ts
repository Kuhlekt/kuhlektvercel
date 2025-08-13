import { sendEmail } from "./aws-ses"

interface DemoRequestData {
  firstName: string
  lastName: string
  email: string
  company: string
  jobTitle?: string
  phone?: string
  companySize?: string
  currentSolution?: string
  timeline?: string
  challenges?: string
  affiliateCode?: string
  affiliateInfo?: any
}

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  company?: string
  phone?: string
  message: string
}

export async function sendDemoRequestEmail(data: DemoRequestData): Promise<boolean> {
  try {
    const subject = `New Demo Request from ${data.firstName} ${data.lastName}`
    
    const html = `
      <h2>New Demo Request</h2>
      <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Company:</strong> ${data.company}</p>
      ${data.jobTitle ? `<p><strong>Job Title:</strong> ${data.jobTitle}</p>` : ''}
      ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
      ${data.companySize ? `<p><strong>Company Size:</strong> ${data.companySize}</p>` : ''}
      ${data.currentSolution ? `<p><strong>Current Solution:</strong> ${data.currentSolution}</p>` : ''}
      ${data.timeline ? `<p><strong>Timeline:</strong> ${data.timeline}</p>` : ''}
      ${data.challenges ? `<p><strong>Challenges:</strong> ${data.challenges}</p>` : ''}
      ${data.affiliateCode ? `<p><strong>Affiliate Code:</strong> ${data.affiliateCode}</p>` : ''}
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    `

    const text = `
      New Demo Request
      
      Name: ${data.firstName} ${data.lastName}
      Email: ${data.email}
      Company: ${data.company}
      ${data.jobTitle ? `Job Title: ${data.jobTitle}` : ''}
      ${data.phone ? `Phone: ${data.phone}` : ''}
      ${data.companySize ? `Company Size: ${data.companySize}` : ''}
      ${data.currentSolution ? `Current Solution: ${data.currentSolution}` : ''}
      ${data.timeline ? `Timeline: ${data.timeline}` : ''}
      ${data.challenges ? `Challenges: ${data.challenges}` : ''}
      ${data.affiliateCode ? `Affiliate Code: ${data.affiliateCode}` : ''}
      
      Submitted: ${new Date().toLocaleString()}
    `

    const result = await sendEmail({
      to: [process.env.AWS_SES_FROM_EMAIL || "demo@kuhlekt.com"],
      subject,
      html,
      text,
    })

    return result.success
  } catch (error) {
    console.error("Failed to send demo request email:", error)
    return false
  }
}

export async function sendContactEmail(data: ContactFormData): Promise<boolean> {
  try {
    const subject = `New Contact Form Submission from ${data.firstName} ${data.lastName}`
    
    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
      ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    `

    const text = `
      New Contact Form Submission
      
      Name: ${data.firstName} ${data.lastName}
      Email: ${data.email}
      ${data.company ? `Company: ${data.company}` : ''}
      ${data.phone ? `Phone: ${data.phone}` : ''}
      
      Message:
      ${data.message}
      
      Submitted: ${new Date().toLocaleString()}
    `

    const result = await sendEmail({
      to: [process.env.AWS_SES_FROM_EMAIL || "contact@kuhlekt.com"],
      subject,
      html,
      text,
    })

    return result.success
  } catch (error) {
    console.error("Failed to send contact email:", error)
    return false
  }
}
