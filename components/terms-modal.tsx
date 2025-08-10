"use client"
import { X } from "lucide-react"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Terms of Trade</h2>
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
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Terms of Service</h3>
            <p className="mb-4">Last updated: January 2025</p>
            <p className="mb-4">
              These Terms of Service ("Terms") govern your use of Kuhlekt's accounts receivable automation platform and
              services. By using our services, you agree to these terms.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">1. Service Description</h4>
            <p className="mb-4">
              Kuhlekt provides cloud-based accounts receivable automation, digital collections, and credit management
              software solutions for businesses.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">2. Account Registration</h4>
            <ul className="space-y-2 ml-4">
              <li>• You must provide accurate and complete information during registration</li>
              <li>• You are responsible for maintaining the security of your account credentials</li>
              <li>• You must notify us immediately of any unauthorized access</li>
              <li>• One account per organization unless otherwise agreed</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">3. Acceptable Use</h4>
            <p className="mb-4">You agree not to:</p>
            <ul className="space-y-2 ml-4">
              <li>• Use the service for illegal activities or to violate any laws</li>
              <li>• Attempt to gain unauthorized access to our systems</li>
              <li>• Interfere with or disrupt the service</li>
              <li>• Share your account with unauthorized users</li>
              <li>• Use the service to send spam or malicious content</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">4. Payment Terms</h4>
            <ul className="space-y-2 ml-4">
              <li>• Subscription fees are billed monthly or annually in advance</li>
              <li>• All fees are non-refundable unless otherwise stated</li>
              <li>• We may change pricing with 30 days' notice</li>
              <li>• Accounts may be suspended for non-payment</li>
              <li>• You're responsible for all applicable taxes</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">5. Data and Privacy</h4>
            <ul className="space-y-2 ml-4">
              <li>• You retain ownership of your data</li>
              <li>• We process data according to our Privacy Policy</li>
              <li>• You're responsible for the accuracy of data you input</li>
              <li>• We implement security measures but cannot guarantee absolute security</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">6. Service Availability</h4>
            <ul className="space-y-2 ml-4">
              <li>• We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
              <li>• Scheduled maintenance will be announced in advance</li>
              <li>• We're not liable for service interruptions beyond our control</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">7. Limitation of Liability</h4>
            <p className="mb-4">
              To the maximum extent permitted by law, Kuhlekt shall not be liable for any indirect, incidental, special,
              or consequential damages arising from your use of our services.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">8. Termination</h4>
            <ul className="space-y-2 ml-4">
              <li>• Either party may terminate with 30 days' written notice</li>
              <li>• We may terminate immediately for breach of terms</li>
              <li>• Upon termination, you may export your data for 30 days</li>
              <li>• All payment obligations survive termination</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">9. Changes to Terms</h4>
            <p className="mb-4">
              We may modify these terms at any time. Material changes will be communicated via email or through our
              platform at least 30 days before taking effect.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">10. Contact Information</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>
                <strong>Email:</strong> legal@kuhlekt.com
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
              By using Kuhlekt's services, you acknowledge that you have read, understood, and agree to be bound by
              these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
