"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CareersModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CareersModal({ isOpen, onClose }: CareersModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="flex justify-center mb-6">
          <img
            src="/images/design-mode/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20175%20Pxls%20-%20Copy.png"
            alt="Kuhlekt Logo"
            className="h-15"
          />
        </div>

        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 text-center">Join Our Team</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-gray-600 text-center">
            <p>At Kuhlekt, we're revolutionizing how businesses manage their accounts receivable.</p>
          </div>

          <div className="text-center py-8">
            <p className="text-lg text-gray-900">Kuhlekt have no positions available at this time.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
