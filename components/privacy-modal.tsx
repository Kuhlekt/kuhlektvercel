"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Privacy and Security Policy</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-gray-600">
            <div>
              <p className="text-sm text-gray-500 mb-4">Last updated: January 2025</p>
              <p>
                At Kuhlekt, we take your privacy and the security of your data seriously. This Privacy and Security Policy 
                explains how we collect, use, protect, and share information when you use our AR automation platform.
              </p>
            </div>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Information We Collect</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">Account Information</h4>
                  <p>When you create an account, we collect your name, email address, company information, and contact details.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Financial Data</h4>
                  <p>We process accounts receivable data, customer information, and payment records as part of our service delivery.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Usage Information</h4>
                  <p>We collect information about how you use our platform, including features accessed and system interactions.</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2. How We Use Your Information</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Provide and improve our AR automation services</li>
                <li>Process payments and manage your account</li>
                <li>Communicate with you about our services</li>
                <li>Ensure platform security and prevent fraud</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Develop new features and enhance user experience</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Data Security</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">Encryption</h4>
                  <p>All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Access Controls</h4>
                  <p>We implement strict access controls, multi-factor authentication, and regular security audits.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Infrastructure</h4>
                  <p>Our platform is hosted on enterprise-grade cloud infrastructure with 99.9% uptime SLA.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Compliance</h4>
                  <p>We maintain SOC 2 Type II compliance and adhere to industry best practices for data protection.</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Data Sharing</h3>
              <p className="mb-3">We do not sell your personal information. We may share data in the following circumstances:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>With your explicit consent</li>
                <li>To provide services you've requested</li>
                <li>With trusted service providers under strict confidentiality agreements</li>
                <li>To comply with legal obligations or court orders</li>
                <li>To protect our rights and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Your Rights</h3>
              <p className="mb-3">You have the right to:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Access and review your personal information</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your data (subject to legal requirements)</li>
                <li>Export your data in a portable format</li>
                <li>Opt out of marketing communications</li>
                <li>Lodge a complaint with relevant authorities</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Data Retention</h3>
              <p>
                We retain your data for as long as necessary to provide our services and comply with legal obligations. 
                Financial data may be retained for up to 7 years as required by Australian tax and corporate law.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">7. International Transfers</h3>
              <p>
                Your data may be processed in countries outside Australia. We ensure appropriate safeguards are in place 
                and that all transfers comply with applicable privacy laws.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">8. Cookies and Tracking</h3>
              <p>
                We use essential cookies for platform functionality and analytics cookies to improve our services. 
                You can manage cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">9. Updates to This Policy</h3>
              <p>
                We may update this policy periodically. We'll notify you of significant changes via email or 
                through our platform. Continued use of our services constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">10. Contact Us</h3>
              <p>
                If you have questions about this Privacy and Security Policy or wish to exercise your rights, 
                please contact our Data Protection Officer at:
              </p>
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <p><strong>Email:</strong> privacy@kuhlekt.com</p>
                <p><strong>Phone:</strong> +61 2 8123 4567</p>
                <p><strong>Address:</strong> Level 15, 1 Bligh Street, Sydney NSW 2000, Australia</p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
