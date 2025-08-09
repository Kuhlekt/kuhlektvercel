'use client'

import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Category } from '../types/knowledge-base'
import { FolderOpen, Folder } from 'lucide-react'

interface CategoryTreeProps {
  categories: Category[]
  selectedCategory: string
  onCategorySelect: (category: string) => void
  getArticleCount: (categoryName: string) => number
}

export function CategoryTree({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  getArticleCount 
}: CategoryTreeProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
      
      <Button
        variant={selectedCategory === '' ? 'default' : 'ghost'}
        className="w-full justify-start"
        onClick={() => onCategorySelect('')}
      >
        <FolderOpen className="h-4 w-4 mr-2" />
        All Articles
        <Badge variant="secondary" className="ml-auto">
          {categories.reduce((total, cat) => total + getArticleCount(cat.name), 0)}
        </Badge>
      </Button>
      
      {categories.map(category => (
        <Button
          key={category.id}
          variant={selectedCategory === category.name ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => onCategorySelect(category.name)}
        >
          <Folder className="h-4 w-4 mr-2" />
          {category.name}
          <Badge variant="secondary" className="ml-auto">
            {getArticleCount(category.name)}
          </Badge>
        </Button>
      ))}
    </div>
  )
}
