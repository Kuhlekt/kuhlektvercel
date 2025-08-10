"use client"
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
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-8 pb-8 text-center">
          <div className="mb-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20400%20Pxls%20-%20Copy-NQUjz8mdwGIo3E40fzD7DhXQzE0leS.png"
              alt="Kuhlekt Logo"
              width={200}
              height={80}
              className="mx-auto"
            />
          </div>

          <h2 className="text-2xl font-medium text-gray-700 mb-8 leading-relaxed">
            There are no current positions available at Kuhlekt, at this time.
          </h2>

          <button
            onClick={onClose}
            className="bg-cyan-400 hover:bg-cyan-500 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
