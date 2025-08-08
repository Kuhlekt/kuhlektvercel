"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"
import Image from "next/image"

interface CareersModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CareersModal({ isOpen, onClose }: CareersModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardContent className="p-8 text-center relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Logo */}
          <div className="mb-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20400%20Pxls%20-%20Copy-NQUjz8mdwGIo3E40fzD7DhXQzE0leS.png"
              alt="Kuhlekt Logo"
              width={120}
              height={40}
              className="h-8 w-auto mx-auto"
            />
          </div>

          {/* Message */}
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            There are no current positions available at Kuhlekt, at this time.
          </p>

          {/* Close Button */}
          <Button onClick={onClose} className="bg-cyan-500 hover:bg-cyan-600 text-white">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
