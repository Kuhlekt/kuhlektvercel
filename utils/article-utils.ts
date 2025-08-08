import type { Article, Category } from '@/types/knowledge-base'

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function extractCleanText(content: string): string {
  // Remove HTML tags and decode HTML entities
  const withoutTags = content.replace(/<[^>]*>/g, '')
  const decoded = withoutTags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
  
  // Clean up extra whitespace
  return decoded.replace(/\s+/g, ' ').trim()
}

export function getArticleReadTime(content: string): number {
  const cleanText = extractCleanText(content)
  const wordCount = cleanText.split(/\s+/).length
  const wordsPerMinute = 200
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) return text
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
}

export function searchArticles(articles: Article[], query: string): Article[] {
  if (!query.trim()) return articles
  
  const searchTerm = query.toLowerCase()
  
  return articles.filter(article => {
    const titleMatch = article.title.toLowerCase().includes(searchTerm)
    const contentMatch = extractCleanText(article.content).toLowerCase().includes(searchTerm)
    const authorMatch = article.author.toLowerCase().includes(searchTerm)
    const tagMatch = article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    const excerptMatch = article.excerpt?.toLowerCase().includes(searchTerm)
    
    return titleMatch || contentMatch || authorMatch || tagMatch || excerptMatch
  })
}

export function getArticlesByCategory(articles: Article[], categoryId: string, categories: Category[]): Article[] {
  return articles.filter(article => article.categoryId === categoryId)
}

export function getCategoryPath(category: Category, categories: Category[]): string {
  return category.name
}
