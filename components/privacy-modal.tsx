"use client"
import { X } from "lucide-react"

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Privacy and Security Policy</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-gray-700">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy Policy</h3>
            <p className="mb-4">Last updated: January 2025</p>
            <p className="mb-4">
              At Kuhlekt, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you use our accounts receivable automation platform.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Information We Collect</h4>
            <ul className="space-y-2 ml-4">
              <li>
                • <strong>Account Information:</strong> Name, email address, company details, and contact information
              </li>
              <li>
                • <strong>Financial Data:</strong> Accounts receivable data, invoice information, and payment records
              </li>
              <li>
                • <strong>Usage Data:</strong> How you interact with our platform, features used, and performance
                metrics
              </li>
              <li>
                • <strong>Technical Data:</strong> IP address, browser type, device information, and log data
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">How We Use Your Information</h4>
            <ul className="space-y-2 ml-4">
              <li>• Provide and maintain our AR automation services</li>
              <li>• Process transactions and manage your account</li>
              <li>• Improve our platform and develop new features</li>
              <li>• Communicate with you about updates and support</li>
              <li>• Ensure security and prevent fraud</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Data Security</h4>
            <p className="mb-4">We implement industry-standard security measures to protect your data:</p>
            <ul className="space-y-2 ml-4">
              <li>• End-to-end encryption for all data transmission</li>
              <li>• SOC 2 Type II compliance</li>
              <li>• Regular security audits and penetration testing</li>
              <li>• Multi-factor authentication and access controls</li>
              <li>• Data backup and disaster recovery procedures</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Data Sharing</h4>
            <p className="mb-4">
              We do not sell, trade, or rent your personal information. We may share data only in these circumstances:
            </p>
            <ul className="space-y-2 ml-4">
              <li>• With your explicit consent</li>
              <li>• To comply with legal obligations</li>
              <li>• With trusted service providers under strict confidentiality agreements</li>
              <li>• To protect our rights and prevent fraud</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Your Rights</h4>
            <p className="mb-4">You have the right to:</p>
            <ul className="space-y-2 ml-4">
              <li>• Access and review your personal data</li>
              <li>• Request corrections to inaccurate information</li>
              <li>• Delete your account and associated data</li>
              <li>• Export your data in a portable format</li>
              <li>• Opt-out of marketing communications</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Us</h4>
            <p className="mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>
                <strong>Email:</strong> privacy@kuhlekt.com
              </p>
              <p>
                <strong>Address:</strong> Kuhlekt Inc., 123 Finance Street, San Francisco, CA 94105
              </p>
              <p>
                <strong>Phone:</strong> (555) 123-4567
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">
              This policy may be updated periodically. We will notify you of any material changes via email or through
              our platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
