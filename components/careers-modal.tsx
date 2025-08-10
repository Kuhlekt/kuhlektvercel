"use client"
import { X } from "lucide-react"

interface CareersModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CareersModal({ isOpen, onClose }: CareersModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Careers at Kuhlekt</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Join Our Team</h3>
            <p className="text-gray-600 mb-4">
              At Kuhlekt, we're building the future of accounts receivable automation. We're looking for passionate
              individuals who want to make a real impact in the fintech space.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Current Openings</h4>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900">Senior Full Stack Developer</h5>
                <p className="text-gray-600 text-sm mt-1">Remote • Full-time</p>
                <p className="text-gray-600 mt-2">
                  Join our engineering team to build scalable AR automation solutions using React, Node.js, and cloud
                  technologies.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900">Product Manager</h5>
                <p className="text-gray-600 text-sm mt-1">San Francisco, CA • Full-time</p>
                <p className="text-gray-600 mt-2">
                  Lead product strategy and roadmap for our AR automation platform, working closely with customers and
                  engineering.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900">Customer Success Manager</h5>
                <p className="text-gray-600 text-sm mt-1">New York, NY • Full-time</p>
                <p className="text-gray-600 mt-2">
                  Help our customers maximize value from Kuhlekt's platform and drive adoption across finance teams.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Why Kuhlekt?</h4>
            <ul className="space-y-2 text-gray-600">
              <li>• Competitive salary and equity package</li>
              <li>• Comprehensive health, dental, and vision insurance</li>
              <li>• Flexible work arrangements and unlimited PTO</li>
              <li>• Professional development budget</li>
              <li>• Work with cutting-edge fintech technology</li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <p className="text-gray-600 mb-4">
              Interested in joining our team? Send your resume and a brief note about why you're excited about Kuhlekt
              to:
            </p>
            <p className="font-semibold text-cyan-600">careers@kuhlekt.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
