"use server";

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({
  region: process.env.AWS_SES_REGION,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
});

export async function submitDemoRequest(prevState: any, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const company = formData.get("company") as string;
    const role = formData.get("role") as string;
    const challenges = formData.get("challenges") as string;

    // Validate required fields
    if (!firstName || !lastName || !email || !company) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      };
    }

    const subject = `New Enquiries Submission from ${firstName} ${lastName}`;
    const body = `
New Demo Request from Kuhlekt Website

Contact Information:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Company: ${company}
- Role: ${role}

Challenges:
${challenges || "Not specified"}

Please follow up with this prospect to schedule a demo.
    `;

    // In a real implementation, you would send the email here
    // For now, we'll simulate a successful submission
    const params = {
      Destination: {
        ToAddresses: ["enquiries@kuhlekt.com"],
      },
      Message: {
        Body: {
          Text: { Data: body },
        },
        Subject: { Data: subject },
      },
      Source: process.env.AWS_SES_FROM_EMAIL!,
      ReplyToAddresses: [email],
    };

    await ses.send(new SendEmailCommand(params));

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message:
        "Thank you! Your demo request has been submitted. We'll contact you within 24 hours to schedule your personalized demo.",
    };
  } catch (error) {
    console.error("Error submitting demo request:", error);
    return {
      success: false,
      message:
        "Sorry, there was an error submitting your request. Please try again or contact us directly at enquiries@kuhlekt.com",
    };
  }
}
