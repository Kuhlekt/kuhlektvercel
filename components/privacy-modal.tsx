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
              <h2 className="text-xl font-bold text-gray-900 mb-4">We take security seriously</h2>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kuhlekt Privacy And Security Policy</h3>
              <p className="text-sm text-gray-500 mb-4">Last modified: August 30th 2018</p>
            </div>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">WHAT INFORMATION DO WE COLLECT</h3>
              <p className="mb-3">
                We collect information from you when you register on our site, subscribe to our newsletter or fill out a form. 
                When ordering or registering on our site, as appropriate, you may be asked to enter your: name, e-mail address, 
                mailing address, phone number. You may, however, visit our site anonymously.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">WHAT DO WE USE YOUR INFORMATION FOR?</h3>
              <p className="mb-3">Any of the information we collect from you may be used in one of the following ways:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>To personalize your experience (your information helps us to better respond to your individual needs)</li>
                <li>To improve our website (we continually strive to improve our website offerings based on the information and feedback we receive from you)</li>
                <li>To improve customer service (your information helps us to more effectively respond to your customer service requests and support needs)</li>
                <li>To process transactions</li>
                <li>Your information, whether public or private, will not be sold, exchanged, transferred, or given to any other company for any reason whatsoever, without your consent, other than for the express purpose of delivering the purchased product or service requested.</li>
                <li>To send periodic emails</li>
                <li>The email address you provide for order processing, may be used to send you information and updates pertaining to your order, in addition to receiving occasional company news, updates, related product or service information, etc.</li>
              </ol>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">HOW DO WE PROTECT YOUR INFORMATION?</h3>
              <p className="mb-3">
                We implement a variety of security measures to maintain the safety of your personal information when you enter, 
                submit, or access your personal information. We offer the use of a secure server. All supplied sensitive/credit 
                information is transmitted using the latest 256-bit Secure Socket Layer (SSL) encryption technology and then 
                encrypted into our Payment gateway providers database only to be accessible by those authorized with special 
                access rights to such systems, and are required to keep the information confidential.
              </p>
              <p className="mb-3">
                256-bit SSL encryption is approximated to take at least one trillion years to break, and is the industry standard. 
                If you have any questions regarding our security policy, please contact our support@kuhlekt.com Processing of 
                payments occurs using 3rd party payment gateways and as such, your credit card information is never stored on our servers.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">DO WE USE COOKIES?</h3>
              <p className="mb-3">
                Yes (Cookies are small files that a site or its service provider transfers to your computers hard drive through 
                your Web browser (if you allow) that enables the sites or service providers systems to recognize your browser 
                and capture and remember certain information)
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">DOES KUHLEKT ALLOW THIRD PARTIES TO USE COOKIES WHEN I AM BROWSING?</h3>
              <p className="mb-3">
                Kuhlekt uses Google Analytics™, a web site analysis service provided by Google Inc. Google Analytics uses cookies, 
                which are text files placed on your computer to help the web site analyse how its users utilise the site and to 
                create statistics. The data generated by the cookies concerning your use of the site (including your IP address) 
                are sent and stored by Google on servers located in the United States.
              </p>
              <p className="mb-3">
                Google will use this information in order to evaluate your use of the site, to compile reports on the site's 
                activity intended for its publisher, and to provide other services relating to the site's activity and to use 
                of the Internet. Google may communicate these data to third parties if legally obligated to do so, or when these 
                third parties process these data on behalf of Google, including the publisher of this site. Google will not match 
                your IP address to any other data held by Google.
              </p>
              <p className="mb-3">
                You can deactivate the use of cookies by selecting the appropriate settings on your browser. However, doing so 
                may prevent the use of certain of this site's functions.
              </p>
              <p className="mb-3">
                By using this Internet site, you expressly consent to the processing of your personal data by Google under the 
                conditions and for the purposes described above. To consult Google's Confidentiality Rules, navigate to: 
                <a href="https://policies.google.com/privacy?hl=en-GB" className="text-cyan-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  https://policies.google.com/privacy?hl=en-GB
                </a>.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">DO WE DISCLOSE ANY INFORMATION TO OUTSIDE PARTIES?</h3>
              <p className="mb-3">
                We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This 
                does not include trusted third parties who assist us in operating our website, conducting our business, or 
                servicing you, so long as those parties agree to keep this information confidential. We may also release your 
                information when we believe release is appropriate to comply with the law, enforce our site policies, or protect 
                ours or others rights, property, or safety. However, non-personally identifiable visitor information may be 
                provided to other parties for marketing, advertising, or other uses.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">THIRD PARTY LINKS</h3>
              <p className="mb-3">
                Occasionally, at our discretion, we may include or offer third party products or services on our website. These 
                third party sites have separate and independent privacy policies. We therefore have no responsibility or liability 
                for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site 
                and welcome any feedback about these sites.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">YOUR CONSENT</h3>
              <p className="mb-3">By using our site, you consent to our privacy policy</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">CHANGES TO OUR PRIVACY POLICY</h3>
              <p className="mb-3">
                If we decide to change our privacy policy, we will post those changes on this page, send an email notifying 
                you of any changes, and/or update the Privacy Policy modification date below.
              </p>
              <p className="text-sm text-gray-500">This policy was last modified on August 30th 2018</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <p><strong>Email:</strong> support@kuhlekt.com</p>
                <p><strong>Address:</strong> 112 3-5 Pendraat Parade Hope Island QLD 4212, Australia</p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
