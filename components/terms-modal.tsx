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
              <p className="text-sm text-gray-500 mb-4">Service Terms and Conditions</p>
              <p className="mb-4">
                These Service Terms and Conditions constitute an agreement (this "Agreement") by and between 
                Kuhlekt Pty Ltd of 112 3-5 Pendraat Parade Hope Island QLD 4212 ("Kuhlekt") ABN 44 608 435 972 
                and ("Customer")
              </p>
            </div>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Definitions</h3>
              <div className="space-y-3 text-sm">
                <p><strong>Account</strong> refers to the Service plans and features selected by Customer through Kuhlekt's customer website at the time of subscription and accepted by Kuhlekt, as such plans and features may change by mutual consent of the parties, as recorded by Kuhlekt through such website.</p>
                
                <p><strong>AUP</strong> refers to Kuhlekt's acceptable use policy as set out in Schedule 3.</p>
                
                <p><strong>Business Hours</strong> means 8:00am to 8:00pm AEST on any Business Day.</p>
                
                <p><strong>Business Day</strong> means a day that is not a Saturday, Sunday, federal public holiday in Australia.</p>
                
                <p><strong>Confidential Information</strong> means the Customer Data and all other information disclosed by one party to the other party pursuant to this Agreement, that is marked or noted as confidential or proprietary at the time of its disclosure or that the receiving Party should reasonably understand to be confidential in nature based on the circumstances of its disclosure but does not include information or material which:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>is already in the public domain, or enters the public domain other than due to a breach of this Agreement;</li>
                  <li>is independently developed by either Party without reference to the other Party's Confidential Information;</li>
                  <li>is disclosed by either Party to a third party who is not bound by an obligation of confidentiality with respect to such information;</li>
                  <li>Can be proven to be already known by the receiving Party at the time of disclosure, other than through any disclosure under this Agreement; or</li>
                  <li>is obtained from a source other than the disclosing Party, where that source is entitled to disclose it without an obligation of confidentiality.</li>
                </ul>
                
                <p><strong>Customer Data</strong> refers to data in electronic form input or collected through the Service by or from Customer.</p>
                
                <p><strong>Fees</strong> means the fees for the Services as set out in Schedule 1.</p>
                
                <p><strong>Force Majeure Event</strong> means any event outside the affected party's reasonable control, including but not limited to an act of God, government or quasi-government act or regulation, riot, act of terrorism, war, flood, fire, industrial dispute, epidemic, or any risk to health or safety.</p>
                
                <p><strong>Effective Date</strong> means ######### or such other date as agreed between the parties in writing.</p>
                
                <p><strong>Emergency Maintenance</strong> means Maintenance Services that are necessary to restore the Services to working order or protect against a substantial risk threatening the Services or Customer Data.</p>
                
                <p><strong>Maintenance Services</strong> means system hardware or software upgrades, updates, modifications, repairs, patches and configuration changes.</p>
                
                <p><strong>Materials</strong> refers to written and graphical content provided by or through the Service, including, without limitation, text, photographs, illustrations, designs software used to provide the Service, and all logos and trademarks reproduced through the Service provided by Kuhlekt or its licensors.</p>
                
                <p><strong>Privacy Act</strong> means the Privacy Act 1988 (Cth) as amended, and includes the regulations and any guidelines issued by the Privacy Commissioner from time to time.</p>
                
                <p><strong>Privacy and Security Policy</strong> refers to Kuhlekt's privacy and security policy, set out in Schedule 4.</p>
                
                <p><strong>Production Site</strong> means the version of the System provided for the Customer's production use of the Services.</p>
                
                <p><strong>Service</strong> refers to Kuhlekt's hosted software applications including the System that is provided for use by the Customer under this Agreement and any associated services.</p>
                
                <p><strong>SLA</strong> refers to the service level agreement set out in Schedule 2.</p>
                
                <p><strong>System</strong> means the hosted Kuhlekt accounts receivable management system software components provided to the Customer as part of the Services.</p>
                
                <p><strong>Subscriber</strong> means a user provided a renewable, irrevocable (unless as provided for herein), nonexclusive, royalty-free, and worldwide right for any company employee, contractor, or agent, or any other individual or entity authorized by company.</p>
                
                <p><strong>UAT Site</strong> means a version of the System provided to the Customer for the purpose of testing functionality in a non-production environment.</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Service & Payment</h3>
              <div className="space-y-3 text-sm">
                <p><strong>Service.</strong> Subject to the terms of this Agreement, Kuhlekt will provide the Service to Customer from the Effective Date pursuant to the terms of this Agreement.</p>
                
                <p><strong>Payment.</strong> Kuhlekt will invoice the Customer each month in arrears for the Fees, payment is due 14 days from the invoice date of each rendered invoice. Kuhlekt may suspend provision of the Service to Customer during any period that the Fees are due and outstanding for more than 14 days and with not less than 2 reminders delivered by email, with a minimum of 3 business days separation and are not the subject of a genuine dispute.</p>
                
                <p>Should the undisputed Fees or part thereof be unpaid 14 days after the due date or 14 days after resolution of a dispute in accordance with clause 11(j), Kuhlekt may, in addition to the rights of termination in clause 10, require Customer to pay on demand interest calculated on daily rests on the unpaid Fees until its payment at the default interest rate of 10% per annum or the Commonwealth Bank rate for loans in excess of $100,000 plus 3%, whichever is the higher.</p>
                
                <p>The parties will attempt in good faith to resolve any invoice or payment dispute or claim. If the dispute cannot be resolved within 14 days from the date on which either party has served written notice on the other of the dispute the parties will refer the dispute to mediation in accordance with clause 11(j).</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm">
                <p><strong>Kuhlekt Pty Ltd</strong></p>
                <p>ABN: 44 608 435 972</p>
                <p>Address: 112 3-5 Pendraat Parade Hope Island QLD 4212</p>
                <p>Email: support@kuhlekt.biz</p>
              </div>
            </section>

            <div className="text-xs text-gray-500 mt-8">
              <p>This is a condensed version of the full Service Terms and Conditions. The complete terms include additional sections covering Service Level Agreement, Materials & IP, Warranties, Liability, Confidentiality, Termination, and other legal provisions. Please contact us for the complete terms document.</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
