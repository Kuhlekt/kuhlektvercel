"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Briefcase } from 'lucide-react'

export function CareersModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Careers
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Careers at Kuhlekt
          </DialogTitle>
          <DialogDescription>Join our team and help transform accounts receivable</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">
            We're always looking for talented individuals to join our growing team. Currently, we don't have any open
            positions, but we'd love to hear from you.
          </p>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm">Future Opportunities:</h4>
              <ul className="text-sm text-gray-600 ml-4 list-disc">
                <li>Software Engineers</li>
                <li>Product Managers</li>
                <li>Sales Representatives</li>
                <li>Customer Success Managers</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600">
              Interested in joining us? Send your resume to{" "}
              <a href="mailto:careers@kuhlekt.com" className="text-blue-600 hover:underline">
                careers@kuhlekt.com
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
