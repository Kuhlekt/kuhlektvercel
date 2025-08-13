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
import { FileText } from 'lucide-react'

export function TermsModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Terms of Service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Terms of Service
          </DialogTitle>
          <DialogDescription>Last updated: January 15, 2024</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full pr-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">1. Acceptance of Terms</h3>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using Kuhlekt's services, you accept and agree to be bound by the terms and provision
                of this agreement. These Terms of Service apply to all users of the service.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">2. Description of Service</h3>
              <p className="text-gray-600 leading-relaxed">
                Kuhlekt provides accounts receivable automation software and related services. The service helps
                businesses manage their invoicing, collections, and customer payment processes through automated
                workflows and analytics.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">3. User Accounts</h3>
              <p className="text-gray-600 leading-relaxed mb-2">To use our services, you must:</p>
              <ul className="list-disc ml-4 space-y-1 text-gray-600">
                <li>Provide accurate and complete account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Promptly update account information as needed</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">4. Acceptable Use</h3>
              <p className="text-gray-600 leading-relaxed mb-2">You agree not to:</p>
              <ul className="list-disc ml-4 space-y-1 text-gray-600">
                <li>Use the service for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Upload or transmit malicious code</li>
                <li>Reverse engineer or copy our software</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">5. Payment Terms</h3>
              <p className="text-gray-600 leading-relaxed">
                Payment for services is due according to the billing schedule selected during signup. We accept major
                credit cards and ACH transfers. Failure to pay may result in service suspension or termination.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">6. Data Ownership</h3>
              <p className="text-gray-600 leading-relaxed">
                You retain ownership of all data you input into our service. We do not claim ownership of your content.
                However, you grant us the right to use your data to provide and improve our services.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">7. Service Availability</h3>
              <p className="text-gray-600 leading-relaxed">
                We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. We may perform
                maintenance that temporarily affects service availability, and we will provide advance notice when
                possible.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">8. Termination</h3>
              <p className="text-gray-600 leading-relaxed">
                Either party may terminate this agreement at any time. Upon termination, your access to the service will
                be discontinued, and we will provide you with a reasonable opportunity to export your data.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">9. Limitation of Liability</h3>
              <p className="text-gray-600 leading-relaxed">
                Our liability for any damages arising from your use of the service is limited to the amount you have
                paid us in the twelve months preceding the claim. We are not liable for any indirect or consequential
                damages.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">10. Contact Information</h3>
              <p className="text-gray-600 leading-relaxed">
                For questions about these Terms of Service, contact us at{" "}
                <a href="mailto:legal@kuhlekt.com" className="text-blue-600 hover:underline">
                  legal@kuhlekt.com
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
