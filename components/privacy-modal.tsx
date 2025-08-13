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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield } from 'lucide-react'

export function PrivacyModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Privacy Policy
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Policy
          </DialogTitle>
          <DialogDescription>Last updated: January 15, 2024</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full pr-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">1. Information We Collect</h3>
              <p className="text-gray-600 leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, use our services,
                or contact us for support. This includes your name, email address, company information, and any other
                information you choose to provide.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">2. How We Use Your Information</h3>
              <p className="text-gray-600 leading-relaxed mb-2">We use the information we collect to:</p>
              <ul className="list-disc ml-4 space-y-1 text-gray-600">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Communicate with you about products, services, and events</li>
                <li>Monitor and analyze trends and usage</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">3. Information Sharing</h3>
              <p className="text-gray-600 leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your
                consent, except as described in this policy. We may share information with trusted service providers who
                assist us in operating our website and conducting our business.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">4. Data Security</h3>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. This includes encryption of sensitive data and regular
                security audits.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">5. Your Rights</h3>
              <p className="text-gray-600 leading-relaxed mb-2">You have the right to:</p>
              <ul className="list-disc ml-4 space-y-1 text-gray-600">
                <li>Access and update your personal information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">6. Cookies and Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze site usage, and assist in our
                marketing efforts. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">7. Contact Us</h3>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:privacy@kuhlekt.com" className="text-blue-600 hover:underline">
                  privacy@kuhlekt.com
                </a>
                .
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
