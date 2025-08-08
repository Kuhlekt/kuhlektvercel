"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedTextarea } from "./enhanced-textarea"
import { ImageIcon } from 'lucide-react'
import { ImagePasteTest } from './image-paste-test'

export default function ImagePasteTestPage() {
  return (
    <div className="container mx-auto py-8">
      <ImagePasteTest />
    </div>
  )
}
