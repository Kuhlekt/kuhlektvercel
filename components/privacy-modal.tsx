"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"
import Image from "next/image"

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
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

            {/* Privacy Policy Content */}
            <div className="prose prose-gray max-w-none">
              <div className="text-center mb-8">
                <p className="text-sm text-gray-600 mb-2">We take security seriously</p>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Kuhlekt Privacy And Security Policy</h1>
              </div>

              <div className="space-y-6 text-sm leading-relaxed">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">WHAT INFORMATION DO WE COLLECT</h2>
                  <p className="text-gray-700">
                    We collect information from you when you register on our site, subscribe to our newsletter or fill
                    out a form. When ordering or registering on our site, as appropriate, you may be asked to enter
                    your: name, e-mail address, mailing address, phone number. You may, however, visit our site
                    anonymously.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">WHAT DO WE USE YOUR INFORMATION FOR?</h2>
                  <p className="text-gray-700 mb-4">
                    Any of the information we collect from you may be used in one of the following ways:
                  </p>

                  <div className="space-y-4 ml-4">
                    <div className="flex gap-3">
                      <span className="font-semibold text-gray-900 flex-shrink-0">1</span>
                      <p className="text-gray-700">
                        To personalize your experience (your information helps us to better respond to your individual
                        needs)
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <span className="font-semibold text-gray-900 flex-shrink-0">2</span>
                      <p className="text-gray-700">
                        To improve our website (we continually strive to improve our website offerings based on the
                        information and feedback we receive from you)
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <span className="font-semibold text-gray-900 flex-shrink-0">3</span>
                      <p className="text-gray-700">
                        To improve customer service (your information helps us to more effectively respond to your
                        customer service requests and support needs)
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <span className="font-semibold text-gray-900 flex-shrink-0">4</span>
                      <p className="text-gray-700">To process transactions</p>
                    </div>

                    <div className="flex gap-3">
                      <span className="font-semibold text-gray-900 flex-shrink-0">5</span>
                      <p className="text-gray-700">
                        Your information, whether public or private, will not be sold, exchanged, transferred, or given
                        to any other company for any reason whatsoever, without your consent, other than for the express
                        purpose of delivering the purchased product or service requested.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <span className="font-semibold text-gray-900 flex-shrink-0">6</span>
                      <p className="text-gray-700">To send periodic emails</p>
                    </div>

                    <div className="flex gap-3">
                      <span className="font-semibold text-gray-900 flex-shrink-0">7</span>
                      <p className="text-gray-700">
                        The email address you provide for order processing, may be used to send you information and
                        updates pertaining to your order, in addition to receiving occasional company news, updates,
                        related product or service information, etc.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">HOW DO WE PROTECT YOUR INFORMATION?</h2>
                  <p className="text-gray-700">
                    We implement a variety of security measures to maintain the safety of your personal information when
                    you enter, submit, or access your personal information. We offer the use of a secure server. All
                    supplied sensitive/credit information is transmitted using the latest 256-bit Secure Socket Layer
                    (SSL) encryption technology and then encrypted into our Payment gateway providers database only to
                    be accessible by those authorized with special access rights to such systems, and are required to
                    keep the information confidential. 256-bit SSL encryption is approximately to take 4.6 sextillion
                    years to crack. This is the industry standard. If you have any questions regarding our security
                    policy, please contact our support@kuhlekt.com Processing of payments occurs using 3rd party payment
                    gateways and as such, your credit card information is never stored on our servers.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">DO WE USE COOKIES?</h2>
                  <p className="text-gray-700">
                    Yes (Cookies are small files that a site or its service provider transfers to your computers hard
                    drive through your Web browser (if you allow) that enables the sites or service providers systems to
                    recognize your browser and capture and remember certain information.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    DOES KUHLEKT ALLOW THIRD PARTIES TO USE COOKIES WHEN I AM BROWSING?
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Kuhlekt uses Google Analytics™, a web site analysis service provided by Google Inc. Google Analytics
                    uses cookies, which are text files placed on your computer to help the web site analyse how its
                    users utilise the site and to create statistics. The data generated by the cookies concerning your
                    use of the site (including your IP address) are sent and stored by Google on servers located in the
                    United States. Google will use this information in order to evaluate your use of the site, to
                    compile reports on the site's activity intended for its publisher, and to provide other services
                    relating to the site's activity and to use of the Internet. Google may communicate these data to
                    third parties if legally obligated to do so, or when these third parties process these data on
                    behalf of Google, including the publisher of this site. Google will not match your IP address to any
                    other data held by Google.
                  </p>
                  <p className="text-gray-700">
                    You can deactivate the use of cookies by selecting the appropriate settings on your browser (see
                    below). However, doing so may prevent the use of certain of this site's functions.
                  </p>
                </div>

                <div>
                  <p className="text-gray-700 mb-4">
                    By using this Internet site, you expressly consent to the processing of your personal data by Google
                    under the conditions and for the purposes described above. To consult Google's Confidentiality
                    Rules, navigate to: https://policies.google.com/privacy?hl=en-GB.
                  </p>
                  <p className="text-gray-700">
                    Google accepts the Safe Harbor Privacy Principles on data protection prepared by the U.S. Department
                    of Commerce. These principles, negotiated between the American authorities and the European
                    Commission in 2001, are essentially based on Directive 95/46 of 24 October 1995 and ensure adequate
                    protection of data transfers from the European Union to companies in the United States.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    DO WE DISCLOSE ANY INFORMATION TO OUTSIDE PARTIES?
                  </h2>
                  <p className="text-gray-700">
                    We do not sell, trade, or otherwise transfer to outside parties your personally identifiable
                    information. This does not include trusted third parties who assist us in operating our website,
                    conducting our business, or servicing you, so long as those parties agree to keep this information
                    confidential. We may also release your information when we believe release is appropriate to comply
                    with the law, enforce our site policies, or protect ours or others rights, property, or safety.
                    However, non-personally identifiable visitor information may be provided to other parties for
                    marketing, advertising, or other uses.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">THIRD PARTY LINKS</h2>
                  <p className="text-gray-700">
                    Occasionally, at our discretion, we may include or offer third party products or services on our
                    website. These third party sites have separate and independent privacy policies. We therefore have
                    no responsibility or liability for the content and activities of these linked sites. Nonetheless, we
                    seek to protect the integrity of our site and welcome any feedback about these sites.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">YOUR CONSENT</h2>
                  <p className="text-gray-700">By using our site, you consent to our privacy policy</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">CHANGES TO OUR PRIVACY POLICY</h2>
                  <p className="text-gray-700">
                    If we decide to change our privacy policy, we will post those changes on this page, send an email
                    notifying you of any changes, and/or update the Privacy Policy modification date below.
                  </p>
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
