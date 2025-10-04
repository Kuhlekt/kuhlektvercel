"use server"

export async function testEmailSystem() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email-test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: process.env.ADMIN_EMAIL || "test@example.com" }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error testing email system:", error)
    return { success: false, error: "Failed to test email system" }
  }
}

export async function getEmailConfigStatus() {
  const requiredVars = ["AWS_SES_ACCESS_KEY_ID", "AWS_SES_SECRET_ACCESS_KEY", "AWS_SES_REGION", "AWS_SES_FROM_EMAIL"]

  const status = requiredVars.map((varName) => ({
    name: varName,
    configured: !!process.env[varName],
  }))

  return {
    allConfigured: status.every((s) => s.configured),
    variables: status,
  }
}

export async function testEmail(email: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email-test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error sending test email:", error)
    return { success: false, error: "Failed to send test email" }
  }
}
