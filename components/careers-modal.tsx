"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Users } from 'lucide-react'

interface CareersModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CareersModal({ isOpen, onClose }: CareersModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Join Our Team</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-gray-600">
            <p className="mb-4">
              At Kuhlekt, we're revolutionizing how businesses manage their accounts receivable. We're always 
              looking for talented individuals to join our growing team.
            </p>
          </div>

          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No positions available at this time</h3>
            <p className="text-gray-600 mb-6">
              We're not currently hiring, but we're always interested in hearing from talented professionals 
              who are passionate about fintech and AR automation.
            </p>
            <Button variant="outline" className="border-cyan-600 text-cyan-600 hover:bg-cyan-50">
              Send Us Your Resume
            </Button>
          </div>

          <div className="bg-cyan-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Work at Kuhlekt?</h3>
            <div className="grid md:grid-cols-2 gap-4 text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Benefits & Perks</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Competitive salary and equity</li>
                  <li>• Comprehensive health insurance</li>
                  <li>• Flexible work arrangements</li>
                  <li>• Professional development budget</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Culture & Growth</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Collaborative team environment</li>
                  <li>• Opportunity to shape product direction</li>
                  <li>• Work with cutting-edge technology</li>
                  <li>• Make a real impact in fintech</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Interested in future opportunities? We'd love to hear from you.
            </p>
            <Button variant="outline" className="border-cyan-600 text-cyan-600 hover:bg-cyan-50">
              Get in Touch
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
