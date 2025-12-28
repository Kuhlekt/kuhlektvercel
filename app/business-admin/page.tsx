"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"

function BusinessAdminContent() {
  const searchParams = useSearchParams()
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    businessNumber: "",
    adminName: "",
    adminEmail: "",
  })

  useEffect(() => {
    // Check if this is a Stripe redirect
    const sessionId = searchParams.get("session_id")
    const customerEmail = searchParams.get("email")
    const customerName = searchParams.get("name")
    const plan = searchParams.get("plan")

    console.log("[v0] Business Admin - Stripe redirect params:", { sessionId, customerEmail, customerName, plan })

    if (sessionId) {
      // Pre-fill credentials from Stripe redirect
      setFormData((prev) => ({
        ...prev,
        email: customerEmail || "",
        adminEmail: customerEmail || "",
        adminName: customerName || "",
      }))

      // Auto-open wizard
      setIsWizardOpen(true)
      console.log("[v0] Business Admin - Opening wizard automatically with pre-filled data")
    }
  }, [searchParams])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    console.log("[v0] Business Admin - Wizard completed with data:", formData)
    // TODO: Send data to backend API to create account
    alert("Setup complete! Your account is being created.")
    setIsWizardOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Business Admin Portal</h1>
          <p className="text-gray-600 mb-8">
            Welcome to your Kuhlekt business administration portal. Complete the setup wizard to get started.
          </p>

          {!isWizardOpen && (
            <Button onClick={() => setIsWizardOpen(true)} size="lg">
              Open Setup Wizard
            </Button>
          )}
        </div>
      </div>

      {/* Setup Wizard Modal */}
      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Business Setup Wizard</DialogTitle>
            <DialogDescription>Step {currentStep} of 3 - Complete your account setup</DialogDescription>
          </DialogHeader>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step ? "bg-cyan-500 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > step ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 3 && <div className={`w-20 h-1 mx-2 ${currentStep > step ? "bg-cyan-500" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Business Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Business Information</h3>

              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="Enter your company name"
                />
              </div>

              <div>
                <Label htmlFor="email">Business Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="contact@company.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Business Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <Label htmlFor="businessNumber">Business Registration Number</Label>
                <Input
                  id="businessNumber"
                  value={formData.businessNumber}
                  onChange={(e) => handleInputChange("businessNumber", e.target.value)}
                  placeholder="ABN/ACN/Tax ID"
                />
              </div>
            </div>
          )}

          {/* Step 2: Admin Account */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Administrator Account</h3>

              <div>
                <Label htmlFor="adminName">Administrator Name</Label>
                <Input
                  id="adminName"
                  value={formData.adminName}
                  onChange={(e) => handleInputChange("adminName", e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="adminEmail">Administrator Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => handleInputChange("adminEmail", e.target.value)}
                  placeholder="admin@company.com"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">
                  This will be your primary administrator account. You can add more users later.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Review and Confirm */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Review Your Information</h3>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Company Name</p>
                  <p className="font-medium">{formData.companyName || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Business Email</p>
                  <p className="font-medium">{formData.email || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Business Phone</p>
                  <p className="font-medium">{formData.phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Business Number</p>
                  <p className="font-medium">{formData.businessNumber || "Not provided"}</p>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-500">Administrator Name</p>
                  <p className="font-medium">{formData.adminName || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Administrator Email</p>
                  <p className="font-medium">{formData.adminEmail || "Not provided"}</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-green-800">
                  Click "Complete Setup" to finalize your account creation. You'll receive a confirmation email shortly.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-4 border-t">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                Complete Setup
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function BusinessAdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <BusinessAdminContent />
    </Suspense>
  )
}
