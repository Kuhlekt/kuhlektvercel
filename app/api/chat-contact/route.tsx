import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { name, email, conversationId } = body

    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 })
    }

    // Split name into first and last name
    const nameParts = name.trim().split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    const supabase = await createClient()

    const insertData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: null,
      company: null,
      message: "User requested to speak with a human agent",
      form_type: "contact",
      form_data: {
        conversationId: conversationId,
        source: "chat_widget",
      },
      status: "new",
      submitted_at: new Date().toISOString(),
    }

    // Insert into form_submitters table
    const { data, error } = await supabase.from("form_submitters").insert(insertData).select().single()

    if (error) {
      console.error("Supabase error during handoff creation")
      return NextResponse.json({ success: false, error: "Failed to save contact request" }, { status: 500 })
    }

    try {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
              .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; }
              .label { font-weight: bold; color: #4b5563; margin-bottom: 5px; }
              .value { color: #1f2937; margin-bottom: 15px; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
              .badge { display: inline-block; background: #ef4444; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">🚨 New Chat Handoff Request</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">A user has requested to speak with a human agent</p>
              </div>
              
              <div class="content">
                <div class="section">
                  <h2 style="margin-top: 0; color: #1f2937; font-size: 18px;">Contact Information</h2>
                  <div class="label">Name:</div>
                  <div class="value">${name}</div>
                  
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${email}" style="color: #3b82f6;">${email}</a></div>
                  
                  <div class="label">Conversation ID:</div>
                  <div class="value"><code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${conversationId || "N/A"}</code></div>
                  
                  <div class="label">Request Time:</div>
                  <div class="value">${new Date().toLocaleString()}</div>
                  
                  <div class="label">Status:</div>
                  <div class="value"><span class="badge">NEW</span></div>
                </div>
                
                <div class="section">
                  <h2 style="margin-top: 0; color: #1f2937; font-size: 18px;">Next Steps</h2>
                  <p style="margin: 0;">Please respond to this customer as soon as possible. You can:</p>
                  <ul style="margin: 10px 0;">
                    <li>Reply directly to their email: <a href="mailto:${email}" style="color: #3b82f6;">${email}</a></li>
                    <li>View full conversation history in the admin dashboard</li>
                    <li>Check the chat logs for context using Conversation ID: ${conversationId || "N/A"}</li>
                  </ul>
                </div>
              </div>
              
              <div class="footer">
                <p>This is an automated notification from Kuhlekt Chat System</p>
                <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `

      const emailResponse = await fetch("https://rest.clicksend.com/v3/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(`${process.env.CLICKSEND_USERNAME}:${process.env.CLICKSEND_API_KEY}`).toString("base64"),
        },
        body: JSON.stringify({
          to: [
            {
              email: "enquiries@kuhlekt.com",
              name: "Kuhlekt Team",
            },
          ],
          from: {
            email_address_id: Number.parseInt(process.env.CLICKSEND_EMAIL_ADDRESS_ID || "0"),
            name: "Kuhlekt Chat System",
          },
          subject: `🚨 New Chat Handoff Request from ${name}`,
          body: emailHtml,
        }),
      })

      const emailResult = await emailResponse.json()

      if (!emailResponse.ok) {
        console.error("Failed to send admin notification email")
      }
    } catch (emailError) {
      console.error("Error sending admin notification email")
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! We'll be in touch soon.",
      handoffId: data.id, // Return the handoff ID for polling
    })
  } catch (error) {
    console.error("Chat contact API error")
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred",
      },
      { status: 500 },
    )
  }
}
