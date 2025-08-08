"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Terms of Trade</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-gray-600">
            <div>
              <p className="text-sm text-gray-500 mb-4">Last updated: January 2025</p>
              <p>
                These Terms of Trade govern your use of Kuhlekt's AR automation platform and services. 
                By accessing or using our services, you agree to be bound by these terms.
              </p>
            </div>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Service Description</h3>
              <p className="mb-3">
                Kuhlekt provides cloud-based accounts receivable automation and digital collections software, including:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Automated invoice processing and payment tracking</li>
                <li>Digital collections and customer communication tools</li>
                <li>Credit management and risk assessment features</li>
                <li>Reporting and analytics dashboards</li>
                <li>Integration with accounting and ERP systems</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Subscription and Billing</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">Subscription Plans</h4>
                  <p>Services are provided on a subscription basis with monthly or annual billing cycles as selected during signup.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Payment Terms</h4>
                  <p>Subscription fees are due in advance and are non-refundable except as required by law. Late payments may result in service suspension.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Price Changes</h4>
                  <p>We may adjust pricing with 30 days' written notice. Existing subscriptions will be honored at current rates until renewal.</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">3. User Responsibilities</h3>
              <p className="mb-3">You agree to:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the service in compliance with applicable laws</li>
                <li>Not attempt to reverse engineer or compromise our systems</li>
                <li>Respect intellectual property rights</li>
                <li>Report security vulnerabilities responsibly</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Data and Privacy</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">Your Data</h4>
                  <p>You retain ownership of all data you input into our system. We process this data solely to provide our services.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Data Security</h4>
                  <p>We implement industry-standard security measures to protect your data, as detailed in our Privacy Policy.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Data Backup</h4>
                  <p>We maintain regular backups, but you remain responsible for maintaining your own data copies.</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Service Level Agreement</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">Uptime Commitment</h4>
                  <p>We target 99.9% uptime, excluding scheduled maintenance windows announced in advance.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Support</h4>
                  <p>Business hours support (9 AM - 6 PM AEST) is included. Premium support options are available.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Maintenance</h4>
                  <p>Scheduled maintenance will be performed during off-peak hours with advance notice when possible.</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Intellectual Property</h3>
              <p className="mb-3">
                Kuhlekt retains all rights to our software, algorithms, and proprietary technology. You receive a 
                limited license to use our services during your subscription period.
              </p>
              <p>
                Any feedback or suggestions you provide may be used by Kuhlekt without compensation or attribution.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">7. Limitation of Liability</h3>
              <p className="mb-3">
                To the maximum extent permitted by law, Kuhlekt's liability is limited to the amount paid by you 
                in the 12 months preceding the claim. We are not liable for:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Indirect, consequential, or punitive damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Third-party actions or integrations</li>
                <li>Force majeure events beyond our control</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">8. Termination</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">By You</h4>
                  <p>You may cancel your subscription at any time. Service continues until the end of your billing period.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">By Us</h4>
                  <p>We may terminate for breach of terms, non-payment, or if required by law, with appropriate notice.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Data Export</h4>
                  <p>You have 30 days after termination to export your data before it's permanently deleted.</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">9. Governing Law</h3>
              <p>
                These terms are governed by Australian law. Any disputes will be resolved in the courts of 
                New South Wales, Australia.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">10. Changes to Terms</h3>
              <p>
                We may update these terms periodically. Material changes will be communicated via email or 
                platform notification at least 30 days in advance.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">11. Contact Information</h3>
              <p>
                For questions about these Terms of Trade, please contact us:
              </p>
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <p><strong>Email:</strong> legal@kuhlekt.com</p>
                <p><strong>Phone:</strong> +61 2 8123 4567</p>
                <p><strong>Address:</strong> Level 15, 1 Bligh Street, Sydney NSW 2000, Australia</p>
                <p><strong>ABN:</strong> 12 345 678 901</p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
