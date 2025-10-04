"use server"

export async function sendTestEmail(email: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email-test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error sending test email:", error)
    return { success: false, error: "Failed to send email" }
  }
}
