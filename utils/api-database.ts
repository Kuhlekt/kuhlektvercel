interface DatabaseData {
  categories: any[]
  users: any[]
  auditLog: any[]
  pageVisits: number
}

class ApiDatabase {
  private baseUrl = "/api/data"

  async loadData(): Promise<DatabaseData> {
    try {
      const response = await fetch(this.baseUrl)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error loading data:", error)
      throw error
    }
  }

  async saveData(data: DatabaseData): Promise<void> {
    try {
      const response = await fetch(this.baseUrl, {
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
      console.error("Error saving data:", error)
      throw error
    }
  }

  async incrementPageVisits(): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/page-visits`, {
        method: "POST",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data.pageVisits
    } catch (error) {
      console.error("Error incrementing page visits:", error)
      throw error
    }
  }

  async addArticle(categories: any[], articleData: any): Promise<any> {
    const data = await this.loadData()

    const newArticle = {
      id: Date.now().toString(),
      ...articleData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Find the category and add the article
    const updatedCategories = data.categories.map((category) => {
      if (category.id === articleData.categoryId) {
        return {
          ...category,
          articles: [...(category.articles || []), newArticle],
        }
      }

      // Check subcategories
      if (category.subcategories) {
        const updatedSubcategories = category.subcategories.map((sub: any) => {
          if (sub.id === articleData.categoryId) {
            return {
              ...sub,
              articles: [...(sub.articles || []), newArticle],
            }
          }
          return sub
        })

        if (updatedSubcategories !== category.subcategories) {
          return {
            ...category,
            subcategories: updatedSubcategories,
          }
        }
      }

      return category
    })

    await this.saveData({
      ...data,
      categories: updatedCategories,
    })

    return newArticle
  }

  async updateArticle(categories: any[], articleId: string, updatedArticle: any): Promise<any[]> {
    const data = await this.loadData()

    const updatedCategories = data.categories.map((category: any) => {
      // Check main category articles
      if (category.articles) {
        const articleIndex = category.articles.findIndex((a: any) => a.id === articleId)
        if (articleIndex !== -1) {
          const newArticles = [...category.articles]
          newArticles[articleIndex] = { ...updatedArticle, updatedAt: new Date() }
          return { ...category, articles: newArticles }
        }
      }

      // Check subcategory articles
      if (category.subcategories) {
        const updatedSubcategories = category.subcategories.map((sub: any) => {
          if (sub.articles) {
            const articleIndex = sub.articles.findIndex((a: any) => a.id === articleId)
            if (articleIndex !== -1) {
              const newArticles = [...sub.articles]
              newArticles[articleIndex] = { ...updatedArticle, updatedAt: new Date() }
              return { ...sub, articles: newArticles }
            }
          }
          return sub
        })

        return { ...category, subcategories: updatedSubcategories }
      }

      return category
    })

    await this.saveData({
      ...data,
      categories: updatedCategories,
    })

    return updatedCategories
  }

  async deleteArticle(categories: any[], articleId: string): Promise<any[]> {
    const data = await this.loadData()

    const updatedCategories = data.categories.map((category: any) => {
      // Check main category articles
      if (category.articles) {
        const filteredArticles = category.articles.filter((a: any) => a.id !== articleId)
        if (filteredArticles.length !== category.articles.length) {
          return { ...category, articles: filteredArticles }
        }
      }

      // Check subcategory articles
      if (category.subcategories) {
        const updatedSubcategories = category.subcategories.map((sub: any) => {
          if (sub.articles) {
            const filteredArticles = sub.articles.filter((a: any) => a.id !== articleId)
            return { ...sub, articles: filteredArticles }
          }
          return sub
        })

        return { ...category, subcategories: updatedSubcategories }
      }

      return category
    })

    await this.saveData({
      ...data,
      categories: updatedCategories,
    })

    return updatedCategories
  }

  async addCategory(categories: any[], name: string, description?: string): Promise<any[]> {
    const data = await this.loadData()

    const newCategory = {
      id: Date.now().toString(),
      name,
      description,
      articles: [],
      subcategories: [],
    }

    const updatedCategories = [...data.categories, newCategory]

    await this.saveData({
      ...data,
      categories: updatedCategories,
    })

    return updatedCategories
  }

  async addSubcategory(categories: any[], parentId: string, name: string, description?: string): Promise<any[]> {
    const data = await this.loadData()

    const newSubcategory = {
      id: Date.now().toString(),
      name,
      description,
      articles: [],
    }

    const updatedCategories = data.categories.map((category: any) => {
      if (category.id === parentId) {
        return {
          ...category,
          subcategories: [...(category.subcategories || []), newSubcategory],
        }
      }
      return category
    })

    await this.saveData({
      ...data,
      categories: updatedCategories,
    })

    return updatedCategories
  }

  async deleteCategory(categories: any[], categoryId: string): Promise<any[]> {
    const data = await this.loadData()

    const updatedCategories = data.categories.filter((category: any) => category.id !== categoryId)

    await this.saveData({
      ...data,
      categories: updatedCategories,
    })

    return updatedCategories
  }

  async deleteSubcategory(categories: any[], categoryId: string, subcategoryId: string): Promise<any[]> {
    const data = await this.loadData()

    const updatedCategories = data.categories.map((category: any) => {
      if (category.id === categoryId && category.subcategories) {
        return {
          ...category,
          subcategories: category.subcategories.filter((sub: any) => sub.id !== subcategoryId),
        }
      }
      return category
    })

    await this.saveData({
      ...data,
      categories: updatedCategories,
    })

    return updatedCategories
  }

  async addAuditEntry(auditLog: any[], entry: any): Promise<any[]> {
    const data = await this.loadData()

    const newEntry = {
      id: Date.now().toString(),
      ...entry,
      timestamp: new Date(),
    }

    const updatedAuditLog = [newEntry, ...data.auditLog]

    await this.saveData({
      ...data,
      auditLog: updatedAuditLog,
    })

    return updatedAuditLog
  }

  async updateUserLastLogin(users: any[], userId: string): Promise<any[]> {
    const data = await this.loadData()

    const updatedUsers = data.users.map((user: any) => {
      if (user.id === userId) {
        return {
          ...user,
          lastLogin: new Date(),
        }
      }
      return user
    })

    await this.saveData({
      ...data,
      users: updatedUsers,
    })

    return updatedUsers
  }
}

export const apiDatabase = new ApiDatabase()
