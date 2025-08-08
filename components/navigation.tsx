'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Home, FileText } from 'lucide-react'

interface NavigationProps {
  selectedCategoryId: string | null
  onCategorySelect: (categoryId: string | null) => void
  totalArticles: number
}

export function Navigation({ selectedCategoryId, onCategorySelect, totalArticles }: NavigationProps) {
  return (
    <div className="space-y-2">
      <Button
        variant={selectedCategoryId === null ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => onCategorySelect(null)}
      >
        <Home className="h-4 w-4 mr-2" />
        All Articles
        <Badge variant="secondary" className="ml-auto">
          {totalArticles}
        </Badge>
      </Button>
    </div>
  )
}
