"use server"

// Mock database functions - replace with your actual database queries
const mockDb = {
  async getAffiliates() {
    // This would be your actual database query
    return [
      {
        affiliate_number: "AFF001",
        name: "John Smith",
        company: "Marketing Pro LLC",
        phone: "+1-555-0101",
        email: "john@marketingpro.com",
        commission: 15.0,
        period: "Monthly",
        notes: "Top performer in Q1",
      },
      {
        affiliate_number: "AFF002",
        name: "Sarah Johnson",
        company: "Digital Solutions Inc",
        phone: "+1-555-0102",
        email: "sarah@digitalsolutions.com",
        commission: 12.5,
        period: "Quarterly",
        notes: "Specializes in tech sector",
      },
      {
        affiliate_number: "AFF003",
        name: "Mike Chen",
        company: "Growth Partners",
        phone: "+1-555-0103",
        email: "mike@growthpartners.com",
        commission: 20.0,
        period: "Monthly",
        notes: "High-value client referrals",
      },
      {
        affiliate_number: "AFF004",
        name: "Lisa Rodriguez",
        company: "Freelance Consultant",
        phone: "+1-555-0104",
        email: "lisa@consultant.com",
        commission: 10.0,
        period: "Per Sale",
        notes: "New affiliate - trial period",
      },
    ]
  },

  async validateAffiliate(affiliateNumber: string) {
    const affiliates = await this.getAffiliates()
    return affiliates.some((aff) => aff.affiliate_number === affiliateNumber)
  },

  async getVisitors() {
    return [
      {
        id: 1,
        ip_address: "192.168.1.100",
        country: "United States",
        duration: 245,
        user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        referrer: "https://google.com",
        page_visited: "/",
        visit_timestamp: "2024-01-15 10:30:00",
      },
      {
        id: 2,
        ip_address: "10.0.0.50",
        country: "Canada",
        duration: 180,
        user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X)",
        referrer: "https://facebook.com",
        page_visited: "/about",
        visit_timestamp: "2024-01-15 11:15:00",
      },
      {
        id: 3,
        ip_address: "172.16.0.25",
        country: "United Kingdom",
        duration: 320,
        user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS)",
        referrer: "direct",
        page_visited: "/contact",
        visit_timestamp: "2024-01-15 12:00:00",
      },
      {
        id: 4,
        ip_address: "203.0.113.45",
        country: "Australia",
        duration: 150,
        user_agent: "Mozilla/5.0 (Android 10)",
        referrer: "https://twitter.com",
        page_visited: "/demo",
        visit_timestamp: "2024-01-15 13:45:00",
      },
    ]
  },

  async getFormSubmissions() {
    return [
      {
        id: 1,
        visitor_id: 1,
        form_type: "contact",
        name: "Alice Brown",
        email: "alice@example.com",
        phone: "+1-555-1001",
        company: "Tech Corp",
        message: "Interested in your services",
        affiliate_number: "AFF001",
        ip_address: "192.168.1.100",
        country: "United States",
        submitted_at: "2024-01-15 10:35:00",
      },
      {
        id: 2,
        visitor_id: 2,
        form_type: "demo",
        name: "Bob Wilson",
        email: "bob@company.com",
        phone: "+1-555-1002",
        company: "Innovation Ltd",
        message: "Would like to schedule a demo",
        affiliate_number: "AFF002",
        ip_address: "10.0.0.50",
        country: "Canada",
        submitted_at: "2024-01-15 11:20:00",
      },
      {
        id: 3,
        visitor_id: 3,
        form_type: "contact",
        name: "Carol Davis",
        email: "carol@business.com",
        phone: "+1-555-1003",
        company: "Growth Co",
        message: "Need more information",
        affiliate_number: "AFF001",
        ip_address: "172.16.0.25",
        country: "United Kingdom",
        submitted_at: "2024-01-15 12:05:00",
      },
    ]
  },
}

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const company = formData.get("company") as string
  const message = formData.get("message") as string
  const affiliateNumber = formData.get("affiliateNumber") as string

  // Validate affiliate number if provided
  if (affiliateNumber && !(await mockDb.validateAffiliate(affiliateNumber))) {
    return {
      success: false,
      message: "Invalid affiliate number. Please check and try again.",
    }
  }

  // Here you would insert into your database
  console.log("Contact form submitted:", { name, email, phone, company, message, affiliateNumber })

  return {
    success: true,
    message: "Thank you for your message. We'll get back to you soon!",
  }
}

export async function submitDemoForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const company = formData.get("company") as string
  const message = formData.get("message") as string
  const affiliateNumber = formData.get("affiliateNumber") as string

  // Validate affiliate number if provided
  if (affiliateNumber && !(await mockDb.validateAffiliate(affiliateNumber))) {
    return {
      success: false,
      message: "Invalid affiliate number. Please check and try again.",
    }
  }

  // Here you would insert into your database
  console.log("Demo form submitted:", { name, email, phone, company, message, affiliateNumber })

  return {
    success: true,
    message: "Demo request submitted! We'll contact you to schedule your demo.",
  }
}

export async function getAffiliates() {
  return await mockDb.getAffiliates()
}

export async function getVisitors() {
  return await mockDb.getVisitors()
}

export async function getFormSubmissions() {
  return await mockDb.getFormSubmissions()
}
