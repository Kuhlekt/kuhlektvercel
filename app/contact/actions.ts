"use server"

// Direct email sending function that doesn't need imports
async function sendEmailDirect(params: {
  to: string[]
  subject: string
  body: string
  replyTo?: string
}) {
  // Check if AWS SES is configured
  const region = process.env.AWS_SES_REGION
  const accessKeyId = process.env.AWS_SES_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SES_SECRET_ACCESS_KEY
  const fromEmail = process.env.AWS_SES_FROM_EMAIL

  if (!region || !accessKeyId || !secretAccessKey || !fromEmail) {
    console.log('AWS SES not configured, skipping email send')
    return {
      success: false,
      message: 'Email service not configured',
      messageId: null
    }
  }

  try {
    // Use fetch to call AWS SES API directly
    const endpoint = `https://email.${region}.amazonaws.com/`
    
    // Create the email parameters
    const emailParams: Record<string, string> = {
      'Action': 'SendEmail',
      'Version': '2010-12-01',
      'Source': fromEmail,
      'Message.Subject.Data': params.subject,
      'Message.Body.Text.Data': params.body,
    }

    // Add destinations
    params.to.forEach((email, index) => {
      emailParams[`Destination.ToAddresses.member.${index + 1}`] = email
    })

    // Add reply-to if provided
    if (params.replyTo) {
      emailParams['ReplyToAddresses.member.1'] = params.replyTo
    }

    // Create AWS signature v4
    const timestamp = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '')
    const date = timestamp.substr(0, 8)
    
    // Create canonical request
    const method = 'POST'
    const canonicalUri = '/'
    const canonicalQueryString = ''
    const canonicalHeaders = `host:email.${region}.amazonaws.com\nx-amz-date:${timestamp}\n`
    const signedHeaders = 'host;x-amz-date'
    
    // Create payload
    const payload = new URLSearchParams(emailParams).toString()
    
    // Create string to sign
    const algorithm = 'AWS4-HMAC-SHA256'
    const credentialScope = `${date}/${region}/ses/aws4_request`
    const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${await sha256(payload)}`
    const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${await sha256(canonicalRequest)}`
    
    // Create signing key
    const kDate = await hmacSha256(`AWS4${secretAccessKey}`, date)
    const kRegion = await hmacSha256(kDate, region)
    const kService = await hmacSha256(kRegion, 'ses')
    const kSigning = await hmacSha256(kService, 'aws4_request')
    
    // Create signature
    const signature = await hmacSha256(kSigning, stringToSign, 'hex')
    
    // Create authorization header
    const authorization = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
    
    // Make the request
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Amz-Date': timestamp,
        'Authorization': authorization,
      },
      body: payload,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('AWS SES API Error:', errorText)
      throw new Error(`AWS SES API error: ${response.status} ${response.statusText}`)
    }

    const responseText = await response.text()
    
    // Parse the XML response to get MessageId
    const messageIdMatch = responseText.match(/<MessageId>([^<]+)<\/MessageId>/)
    const messageId = messageIdMatch ? messageIdMatch[1] : 'unknown'
    
    console.log('Email sent successfully via AWS SES API:', messageId)

    return {
      success: true,
      message: 'Email sent successfully',
      messageId: messageId
    }
  } catch (error) {
    console.error('AWS SES Error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      messageId: null
    }
  }
}

// Helper functions for AWS signature
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function hmacSha256(key: string | Uint8Array, message: string, encoding: 'hex' | 'binary' = 'binary'): Promise<string | Uint8Array> {
  const keyBuffer = typeof key === 'string' ? new TextEncoder().encode(key) : key
  const messageBuffer = new TextEncoder().encode(message)
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageBuffer)
  const signatureArray = new Uint8Array(signature)
  
  if (encoding === 'hex') {
    return Array.from(signatureArray).map(b => b.toString(16).padStart(2, '0')).join('')
  }
  
  return signatureArray
}

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const role = formData.get("role") as string
    const companySize = formData.get("companySize") as string
    const message = formData.get("message") as string

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

    const contactData = {
      firstName,
      lastName,
      email,
      company,
      role: role || "Not specified",
      companySize: companySize || "Not specified",
      message,
      timestamp: new Date().toISOString(),
    }

    console.log("Processing contact form submission:", {
      name: `${firstName} ${lastName}`,
      email,
      company,
    })

    // Try to send email using direct email function
    try {
      const emailResult = await sendEmailDirect({
        to: ["enquiries@kuhlekt.com"],
        subject: `New Contact Submission from ${firstName} ${lastName}`,
        body: `
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
        `,
        replyTo: email,
      })

      if (emailResult.success) {
        console.log("Contact form email sent successfully:", emailResult.messageId)
      } else {
        console.log("Email sending failed, logging contact data:", contactData)
        console.error("Email error:", emailResult.message)
      }
    } catch (emailError) {
      console.error("Error with email service:", emailError)
      console.log("Logging contact data for manual follow-up:", contactData)
    }

    // Always return success to user
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

// Server action to test AWS SES configuration - runs entirely on server
export async function testAWSSES() {
  try {
    console.log('Testing AWS SES configuration...')
    
    // Check environment variables
    const region = process.env.AWS_SES_REGION
    const accessKeyId = process.env.AWS_SES_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SES_SECRET_ACCESS_KEY
    const fromEmail = process.env.AWS_SES_FROM_EMAIL
    
    const envCheck = {
      region: !!region,
      accessKey: !!accessKeyId,
      secretKey: !!secretAccessKey,
      fromEmail: !!fromEmail,
    }
    
    console.log('Environment variables status:', envCheck)
    console.log('Environment variables values:', {
      region: region || 'NOT SET',
      accessKey: accessKeyId ? 'SET' : 'NOT SET',
      secretKey: secretAccessKey ? 'SET' : 'NOT SET',
      fromEmail: fromEmail || 'NOT SET',
    })

    // Check if all required variables are present
    const allConfigured = Object.values(envCheck).every(Boolean)
    
    if (!allConfigured) {
      return {
        success: false,
        message: 'AWS SES is not fully configured. Missing environment variables.',
        details: envCheck
      }
    }

    // Test the email service directly (no imports needed)
    try {
      console.log('Testing email sending...')
      
      const testResult = await sendEmailDirect({
        to: ['test@example.com'],
        subject: 'AWS SES Configuration Test',
        body: 'This is a test email from Kuhlekt AWS SES configuration test. If you receive this, the configuration is working correctly.',
      })

      if (testResult.success) {
        return {
          success: true,
          message: `AWS SES is working correctly! Test email sent with Message ID: ${testResult.messageId}`,
          details: envCheck
        }
      } else {
        return {
          success: false,
          message: `AWS SES test failed: ${testResult.message}`,
          details: envCheck
        }
      }
    } catch (testError) {
      console.error('Email service test error:', testError)
      const errorMessage = testError instanceof Error ? testError.message : 'Unknown test error'
      
      return {
        success: false,
        message: `Email service test failed: ${errorMessage}`,
        details: envCheck
      }
    }
  } catch (error) {
    console.error('Test function error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return {
      success: false,
      message: `Test failed: ${errorMessage}`,
      details: {
        region: false,
        accessKey: false,
        secretKey: false,
        fromEmail: false,
      }
    }
  }
}
