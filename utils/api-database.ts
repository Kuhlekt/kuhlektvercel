interface DatabaseData {
  categories: any[]
  users: any[]
  auditLog: any[]
  settings: {
    pageVisits: number
  }
}

export async function loadFromAPI(): Promise<DatabaseData> {
  try {
    const response = await fetch("/api/data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Failed to load data from API:", error)
    // Return default data structure if API fails
    return {
      categories: [],
      users: [
        {
          id: "1",
          username: "admin",
          password: "admin123",
          role: "admin",
          createdAt: new Date().toISOString(),
        },
      ],
      auditLog: [],
      settings: {
        pageVisits: 0,
      },
    }
  }
}

export async function saveToAPI(data: DatabaseData): Promise<void> {
  try {
    const response = await fetch("/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    console.error("Failed to save data to API:", error)
    throw error
  }
}
