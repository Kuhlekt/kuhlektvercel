"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"
import Image from "next/image"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl bg-white max-h-[90vh] overflow-hidden">
        <CardContent className="p-0 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors z-10 bg-white shadow-sm"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[90vh] p-8">
            {/* Logo */}
            <div className="mb-8 text-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20400%20Pxls%20-%20Copy-NQUjz8mdwGIo3E40fzD7DhXQzE0leS.png"
                alt="Kuhlekt Logo"
                width={120}
                height={40}
                className="h-8 w-auto mx-auto"
              />
            </div>

            {/* Terms of Service Content */}
            <div className="prose prose-gray max-w-none">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Kuhlekt - General Terms of Service</h1>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Effective Date:</strong> April 12th, 2025
                  </p>
                  <p>
                    <strong>Last Updated:</strong> April 12th, 2025
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-sm leading-relaxed">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    Welcome to Kuhlekt.com – a cloud-based accounts receivable (AR) automation platform. These Terms of
                    Service ("Terms") form a binding agreement between you ("Customer", "you", or "your") and Kuhlekt
                    Pty Ltd ("Kuhlekt", "we", "us", or "our") and govern your access to and use of our services.
                  </p>
                  <p className="text-gray-700 mt-2">
                    By signing up online, accessing, or using Kuhlekt's services, you agree to these Terms.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Eligibility and Sign-up</h2>
                  <p className="text-gray-700 mb-3">
                    Our services are available to any business managing accounts receivable, including SMEs,
                    enterprises, and service providers.
                  </p>
                  <p className="text-gray-700 mb-3">To use the platform, you must:</p>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Be 18 years or older</li>
                    <li>Have authority to bind the subscribing organization</li>
                    <li>Agree to these Terms by registering through our online sign-up form</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Our Services</h2>
                  <p className="text-gray-700 mb-3">Kuhlekt is a SaaS platform offering:</p>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>AR automation workflows</li>
                    <li>Debt collection and escalation tools</li>
                    <li>Dispute management features</li>
                    <li>KPI dashboards and analytics</li>
                    <li>Customer self-service portals</li>
                    <li>Reporting tools</li>
                    <li>Secure payment processing via Stripe or configured alternative</li>
                    <li>Cash Application</li>
                    <li>Client onboarding Automation</li>
                  </ul>
                  <p className="text-gray-700 mt-3">
                    We may improve, modify, or discontinue features at any time, with reasonable notice where
                    applicable.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Account Access</h2>
                  <p className="text-gray-700 mb-3">
                    You are responsible for maintaining account security and ensuring authorized users comply with these
                    Terms.
                  </p>
                  <p className="text-gray-700">You must notify us immediately if you suspect unauthorized access.</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Fees & Billing</h2>

                  <div className="ml-4 space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">4.1 Subscription Fees</h3>
                      <p className="text-gray-700">
                        Fees are based on your selected plan during online signup or as agreed in a separate written
                        agreement.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">4.2 Terms of Subscription Fees</h3>
                      <p className="text-gray-700">
                        Fees are levied on a 14-day basis unless otherwise specified in a written agreement.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">4.3 Payment</h3>
                      <p className="text-gray-700">
                        Payments are securely processed via Stripe. You authorize Kuhlekt and Stripe to charge your
                        payment method per the plan you've selected.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">4.4 Late Payments</h3>
                      <p className="text-gray-700">
                        Unpaid fees may result in immediate suspension of access and interest charges.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Customer Data & Privacy</h2>

                  <div className="ml-4 space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">5.1 Ownership</h3>
                      <p className="text-gray-700">
                        You retain ownership of all Customer Data input into Kuhlekt. We use this data only to provide
                        and improve our services.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">5.2 GDPR Compliance</h3>
                      <p className="text-gray-700">
                        If you are based in the EU/EEA or process data of EU/EEA residents, Kuhlekt acts as a data
                        processor and complies with the General Data Protection Regulation (GDPR). Refer to the Data
                        Processing Addendum (DPA).
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">5.3 Data Processing</h3>
                      <p className="text-gray-700">
                        We process personal data in accordance with our Privacy Policy and applicable privacy laws
                        including the Australian Privacy Act 1988 and GDPR. By using the platform, you consent to such
                        processing.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">5.4 Third Parties</h3>
                      <p className="text-gray-700">
                        We may share necessary data with trusted sub-processors (e.g., Stripe, hosting providers), bound
                        by confidentiality and data protection obligations.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Acceptable Use</h2>
                  <p className="text-gray-700 mb-3">You agree not to:</p>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Use the platform for illegal or harmful purposes</li>
                    <li>Interfere with or disrupt our services</li>
                    <li>Attempt to gain unauthorized access to systems or data</li>
                    <li>Resell or sublicense the platform without written permission</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Uptime & Support</h2>
                  <p className="text-gray-700 mb-2">
                    We strive to maintain 99.9% uptime, excluding planned maintenance.
                  </p>
                  <p className="text-gray-700 mb-2">Basic support is available via support@kuhlekt.com.</p>
                  <p className="text-gray-700">Premium support plans may be available on request.</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Intellectual Property</h2>
                  <p className="text-gray-700">
                    All intellectual property in the platform (excluding your data) remains the property of Kuhlekt or
                    its licensors. You may not copy, modify, or reproduce any part without permission.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Termination</h2>
                  <p className="text-gray-700 mb-3">
                    You may cancel your subscription at any time via your account settings or by contacting support.
                    Upon cancellation:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Access will be revoked at the end of the billing cycle</li>
                    <li>You may request a copy of your data within 30 days of termination</li>
                  </ul>
                  <p className="text-gray-700 mt-3">
                    We reserve the right to suspend or terminate your account for violations of these Terms or
                    non-payment.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Limitation of Liability</h2>
                  <p className="text-gray-700 mb-3">To the extent permitted by law:</p>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Kuhlekt is not liable for indirect or consequential damages</li>
                    <li>Our total liability is limited to the fees paid by you in the 3 months preceding the claim</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Jurisdiction</h2>
                  <p className="text-gray-700">
                    These Terms are governed by the laws of Queensland, Australia. Disputes shall be subject to the
                    exclusive jurisdiction of the courts of Queensland.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">12. Changes to Terms</h2>
                  <p className="text-gray-700">
                    We may update these Terms periodically. Significant changes will be communicated via email or in-app
                    notifications. Continued use constitutes acceptance of the revised Terms.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">13. Contact</h2>
                  <p className="text-gray-700 mb-3">Questions or concerns? Contact us at:</p>
                  <ul className="list-none ml-4 space-y-1 text-gray-700">
                    <li>
                      📧{" "}
                      <a href="mailto:support@kuhlekt.com" className="text-cyan-600 hover:text-cyan-700">
                        support@kuhlekt.com
                      </a>
                    </li>
                    <li>
                      🌐{" "}
                      <a href="https://www.kuhlekt.com" className="text-cyan-600 hover:text-cyan-700">
                        www.kuhlekt.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Close Button */}
              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <Button onClick={onClose} className="bg-cyan-500 hover:bg-cyan-600 text-white px-8">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
