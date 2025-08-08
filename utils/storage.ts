export function saveToStorage<T>(key: string, data: T): void {
  try {
    const serializedData = JSON.stringify(data, (key, value) => {
      if (value instanceof Date) {
        return { __type: 'Date', value: value.toISOString() }
      }
      return value
    })
    localStorage.setItem(`kuhlekt_kb_${key}`, serializedData)
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`kuhlekt_kb_${key}`)
    if (item === null) {
      return defaultValue
    }
    
    const parsedData = JSON.parse(item, (key, value) => {
      if (value && typeof value === 'object' && value.__type === 'Date') {
        return new Date(value.value)
      }
      return value
    })
    
    return parsedData
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error)
    return defaultValue
  }
}

export function exportData() {
  const articles = loadFromStorage('articles', [])
  const categories = loadFromStorage('categories', [])
  const users = loadFromStorage('users', [])
  const auditLog = loadFromStorage('auditLog', [])
  
  return {
    articles,
    categories,
    users: users.map((user: any) => ({ ...user, password: '[REDACTED]' })),
    auditLog,
    exportedAt: new Date().toISOString(),
    version: '1.0'
  }
}

export function importData(data: any): boolean {
  try {
    if (data.articles) {
      saveToStorage('articles', data.articles)
    }
    if (data.categories) {
      saveToStorage('categories', data.categories)
    }
    if (data.users) {
      saveToStorage('users', data.users)
    }
    if (data.auditLog) {
      saveToStorage('auditLog', data.auditLog)
    }
    return true
  } catch (error) {
    console.error('Error importing data:', error)
    return false
  }
}

export function clearStorage(): void {
  try {
    const keys = ['articles', 'categories', 'users', 'auditLog']
    keys.forEach(key => {
      localStorage.removeItem(`kuhlekt_kb_${key}`)
    })
  } catch (error) {
    console.error('Error clearing storage:', error)
  }
}
