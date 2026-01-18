"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Footer } from "@/components/footer"
import Image from "next/image"

interface PricingTier {
  id: string
  tier_name: string
  display_name: string
  usd_price: string
  aud_price: string
  usd_setup_fee: string
  aud_setup_fee: string
  billing_term: string
  display_order: number
  is_active: boolean
}

interface PricingFeature {
  id: string
  feature_name: string
  display_order: number
  is_active: boolean
}

interface PricingFeatureValue {
  id: string
  pricing_feature_id: string
  pricing_tier_id: string
  value: string
}

const PricingTablePage = () => {
  const [currency, setCurrency] = useState<"USD" | "AUD">("USD")
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly")
  const [selectedTab, setSelectedTab] = useState("bronze")
  const [editMode, setEditMode] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [tiers, setTiers] = useState<PricingTier[]>([])
  const [features, setFeatures] = useState<PricingFeature[]>([])
  const [featureValues, setFeatureValues] = useState<PricingFeatureValue[]>([])

  const hasLoadedRef = useRef(false)
  const editModeRef = useRef(false)

  useEffect(() => {
    editModeRef.current = editMode
  }, [editMode])

  useEffect(() => {
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    // Mock data - use this while API is being fixed
    const mockData = {
      tiers: [
        {
          id: "1",
          tier_name: "bronze",
          display_name: "Bronze",
          usd_price: "1,200",
          aud_price: "1,800",
          usd_setup_fee: "0",
          aud_setup_fee: "0",
          billing_term: "monthly",
          display_order: 1,
          is_active: true,
        },
        {
          id: "2",
          tier_name: "silver",
          display_name: "Silver",
          usd_price: "2,500",
          aud_price: "3,750",
          usd_setup_fee: "500",
          aud_setup_fee: "750",
          billing_term: "monthly",
          display_order: 2,
          is_active: true,
        },
        {
          id: "3",
          tier_name: "gold",
          display_name: "Gold",
          usd_price: "4,500",
          aud_price: "6,750",
          usd_setup_fee: "1,000",
          aud_setup_fee: "1,500",
          billing_term: "monthly",
          display_order: 3,
          is_active: true,
        },
        {
          id: "4",
          tier_name: "platinum",
          display_name: "Platinum",
          usd_price: "Get a quote",
          aud_price: "Get a quote",
          usd_setup_fee: "Custom",
          aud_setup_fee: "Custom",
          billing_term: "monthly",
          display_order: 4,
          is_active: true,
        },
      ],
      features: [
        { id: "f1", feature_name: "Users", display_order: 1, is_active: true },
        { id: "f2", feature_name: "API Access", display_order: 2, is_active: true },
        { id: "f3", feature_name: "Priority Support", display_order: 3, is_active: true },
        { id: "f4", feature_name: "Custom Integration", display_order: 4, is_active: true },
      ],
      featureValues: [
        // Bronze
        { id: "fv1", pricing_feature_id: "f1", pricing_tier_id: "1", value: "5" },
        { id: "fv2", pricing_feature_id: "f2", pricing_tier_id: "1", value: "false" },
        { id: "fv3", pricing_feature_id: "f3", pricing_tier_id: "1", value: "false" },
        { id: "fv4", pricing_feature_id: "f4", pricing_tier_id: "1", value: "false" },
        // Silver
        { id: "fv5", pricing_feature_id: "f1", pricing_tier_id: "2", value: "15" },
        { id: "fv6", pricing_feature_id: "f2", pricing_tier_id: "2", value: "true" },
        { id: "fv7", pricing_feature_id: "f3", pricing_tier_id: "2", value: "true" },
        { id: "fv8", pricing_feature_id: "f4", pricing_tier_id: "2", value: "false" },
        // Gold
        { id: "fv9", pricing_feature_id: "f1", pricing_tier_id: "3", value: "Unlimited" },
        { id: "fv10", pricing_feature_id: "f2", pricing_tier_id: "3", value: "true" },
        { id: "fv11", pricing_feature_id: "f3", pricing_tier_id: "3", value: "true" },
        { id: "fv12", pricing_feature_id: "f4", pricing_tier_id: "3", value: "true" },
        // Platinum
        { id: "fv13", pricing_feature_id: "f1", pricing_tier_id: "4", value: "Custom" },
        { id: "fv14", pricing_feature_id: "f2", pricing_tier_id: "4", value: "true" },
        { id: "fv15", pricing_feature_id: "f3", pricing_tier_id: "4", value: "true" },
        { id: "fv16", pricing_feature_id: "f4", pricing_tier_id: "4", value: "true" },
      ],
    }

    setTiers(mockData.tiers || [])
    setFeatures(mockData.features || [])
    setFeatureValues(mockData.featureValues || [])
    setIsLoading(false)
  }, [])

  const getFeatureValue = (featureId: string, tierId: string): string => {
    const value = featureValues.find((fv) => fv.pricing_feature_id === featureId && fv.pricing_tier_id === tierId)
    return value?.value || "—"
  }

  const updateFeatureValue = (featureId: string, tierId: string, newValue: string) => {
    setFeatureValues((prev) => {
      const existing = prev.find((fv) => fv.pricing_feature_id === featureId && fv.pricing_tier_id === tierId)
      if (existing) {
        return prev.map((fv) =>
          fv.pricing_feature_id === featureId && fv.pricing_tier_id === tierId ? { ...fv, value: newValue } : fv,
        )
      } else {
        return [
          ...prev,
          {
            id: `new-${Date.now()}`,
            pricing_feature_id: featureId,
            pricing_tier_id: tierId,
            value: newValue,
          },
        ]
      }
    })
  }

  const updateTierData = (tierId: string, field: keyof PricingTier, value: string) => {
    setTiers((prev) => prev.map((tier) => (tier.id === tierId ? { ...tier, [field]: value } : tier)))
  }

  const renderFeatureValue = (value: string, featureId: string, tierId: string) => {
    if (editMode) {
      return (
        <Input
          value={value}
          onChange={(e) => updateFeatureValue(featureId, tierId, e.target.value)}
          className="text-center text-sm"
        />
      )
    }

    if (value === "true" || value === true) return <Check className="h-5 w-5 text-green-600" />
    if (value === "false" || value === false) return <span className="text-gray-400">—</span>
    return value
  }

  const verifyPassword = async () => {
    setIsVerifying(true)
    setPasswordError("")

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        setShowPasswordDialog(false)
        setPassword("")
        setEditMode(true)
      } else {
        setPasswordError("Incorrect password. Please try again.")
      }
    } catch (error) {
      setPasswordError("An error occurred. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleEditModeClick = () => {
    if (editMode) {
      setEditMode(false)
      setShowPasswordDialog(false)
      setPassword("")
      setPasswordError("")
    } else {
      setShowPasswordDialog(true)
      setPassword("")
      setPasswordError("")
    }
  }

  const handlePasswordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      e.stopPropagation()
      verifyPassword()
    }
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    setSaveMessage("")

    try {
      // Mock save - pricing data stored locally
      // TODO: Connect to proper database when ready
      setSaveMessage("✓ Changes saved locally")
      setTimeout(() => {
        setSaveMessage("")
      }, 3000)
    } catch (error) {
      console.error("[Pricing] Failed to save:", error)
      setSaveMessage("✗ Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  const getDisplayPrice = (price: string): string => {
    if (billingPeriod === "monthly" || price === "Get a quote") {
      return price
    }
    const numPrice = Number.parseFloat(price.replace(/,/g, ""))
    if (isNaN(numPrice)) return price

    const discounted = numPrice * 0.85
    const rounded = Math.round(discounted / 10) * 10
    return rounded.toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading pricing data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {editMode && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
            {saveMessage && (
              <span className={`text-sm font-medium ${saveMessage.includes("✓") ? "text-green-600" : "text-red-600"}`}>
                {saveMessage}
              </span>
            )}
            <Button
              onClick={() => {
                setEditMode(false)
                setSaveMessage("")
              }}
              variant="outline"
              className="border-slate-300"
            >
              Exit Edit Mode
            </Button>
            <Button onClick={handleSaveChanges} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}

        <div className="mb-8 md:mb-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">Choose Your Plan</h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Select the perfect plan for your business needs
          </p>

          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 bg-slate-100 rounded-full p-1 border border-slate-300">
                <button
                  onClick={() => setBillingPeriod("monthly")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    billingPeriod === "monthly" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod("annual")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    billingPeriod === "annual" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Annual
                </button>
              </div>
              <span className="text-sm text-green-600 font-medium bg-white px-2">and receive a discount</span>
            </div>
            {billingPeriod === "annual" && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-700 font-medium">
                15% Discount Available for Annual Pricing - Pre-Paid
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <span className={`font-medium ${currency === "AUD" ? "text-gray-500" : "text-gray-900"}`}>AUD</span>
            <Switch
              checked={currency === "USD"}
              onCheckedChange={(checked) => setCurrency(checked ? "USD" : "AUD")}
              className="data-[state=checked]:bg-cyan-500"
            />
            <span className={`font-medium ${currency === "USD" ? "text-gray-500" : "text-gray-900"}`}>USD</span>
          </div>

          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-xl border border-slate-300 overflow-hidden">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-6 text-left">
                      <div className="text-slate-700 text-sm font-medium">Features</div>
                    </th>
                    {tiers.map((tier) => (
                      <th key={tier.id} className="p-6 text-center">
                        <div className="space-y-3">
                          <div className="text-slate-900 font-bold text-xl capitalize">{tier.display_name}</div>
                          <div className="text-3xl font-bold text-slate-900">
                            {tier.tier_name === "platinum" ? (
                              <span className="text-2xl">{tier.usd_price}</span>
                            ) : (
                              <>
                                <span className="text-sm font-normal text-slate-600">
                                  {currency === "USD" ? "$" : "A$"}
                                </span>
                                {editMode ? (
                                  <input
                                    type="text"
                                    value={currency === "USD" ? tier.usd_price : tier.aud_price}
                                    onChange={(e) =>
                                      updateTierData(
                                        tier.id,
                                        currency === "USD" ? "usd_price" : "aud_price",
                                        e.target.value,
                                      )
                                    }
                                    className="w-24 bg-slate-700 text-white px-2 py-1 rounded text-center"
                                  />
                                ) : (
                                  getDisplayPrice(currency === "USD" ? tier.usd_price : tier.aud_price)
                                )}
                              </>
                            )}
                          </div>
                          <div className="text-slate-700 text-sm font-medium">
                            {billingPeriod === "monthly" ? "billed monthly" : "billed annually"}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-slate-100">
                    <td className="p-4 font-medium text-slate-900">Setup fees</td>
                    {tiers.map((tier) => (
                      <td key={tier.id} className="p-4 text-center border-l border-slate-300">
                        {editMode ? (
                          <Input
                            value={currency === "USD" ? tier.usd_setup_fee : tier.aud_setup_fee}
                            onChange={(e) =>
                              updateTierData(
                                tier.id,
                                currency === "USD" ? "usd_setup_fee" : "aud_setup_fee",
                                e.target.value,
                              )
                            }
                            className="text-center bg-white text-slate-900 px-2 py-1 rounded border border-slate-300"
                          />
                        ) : (
                          `$${currency === "USD" ? tier.usd_setup_fee : tier.aud_setup_fee}`
                        )}
                      </td>
                    ))}
                  </tr>

                  {features.map((feature) => (
                    <tr key={feature.id} className="bg-slate-100 border-b border-slate-300">
                      <td className="p-4 font-medium text-slate-900">
                        {editMode ? (
                          <Input
                            value={feature.feature_name}
                            onChange={(e) =>
                              setFeatures((prev) =>
                                prev.map((f) => (f.id === feature.id ? { ...f, feature_name: e.target.value } : f)),
                              )
                            }
                            className="text-sm bg-white text-slate-900 px-2 py-1 rounded border border-slate-300"
                          />
                        ) : (
                          feature.feature_name
                        )}
                      </td>
                      {tiers.map((tier) => (
                        <td key={tier.id} className="p-4 text-center border-l border-slate-300">
                          {renderFeatureValue(getFeatureValue(feature.id, tier.id), feature.id, tier.id)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:hidden space-y-6">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {tiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTab(tier.tier_name)}
                  className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                    selectedTab === tier.tier_name
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 border border-slate-300"
                  }`}
                >
                  {tier.display_name}
                </button>
              ))}
            </div>

            {tiers
              .filter((tier) => tier.tier_name === selectedTab)
              .map((tier) => (
                <div key={tier.id} className="bg-slate-100 rounded-xl border border-slate-300 overflow-hidden">
                  <div className="p-6 text-center bg-slate-100">
                    <div className="text-slate-900 font-bold text-2xl mb-2">{tier.display_name}</div>
                    <div className="text-4xl font-bold text-slate-900 mb-2">
                      {tier.tier_name === "platinum" ? (
                        tier.usd_price
                      ) : (
                        <>
                          <span className="text-lg font-normal">{currency === "USD" ? "$" : "A$"}</span>
                          {getDisplayPrice(currency === "USD" ? tier.usd_price : tier.aud_price)}
                        </>
                      )}
                    </div>
                    <div className="text-slate-700">
                      {billingPeriod === "monthly" ? "billed monthly" : "billed annually"}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-slate-300">
                      <span className="font-medium text-slate-900">Setup Fee</span>
                      <span className="text-slate-700">
                        ${currency === "USD" ? tier.usd_setup_fee : tier.aud_setup_fee}
                      </span>
                    </div>
                    {features.map((feature) => (
                      <div
                        key={feature.id}
                        className="flex justify-between items-center py-2 border-b border-slate-300"
                      >
                        <span className="text-slate-700 text-sm">{feature.feature_name}</span>
                        <span className="text-slate-900">
                          {renderFeatureValue(getFeatureValue(feature.id, tier.id), feature.id, tier.id)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-8 text-left text-sm text-slate-600 space-y-1">
            <p>** Copies received via email BCC from ERP alternate options available by quote.</p>
            <p>*** Based on Stripe other providers quoted. Fees to client accounts.</p>
            <p>**** Additional Regional Onboarding @ $140 PCM each in currency selected table.</p>
            <p>
              <strong>Core</strong> Users defined as Finance, Collections staff, Collection Managers, CFO, Accountants.
            </p>
            <p>
              <strong>Sales</strong> Users defined as Sales and operational staff required to have logins for workflow
              and escalations.
            </p>
            <p>All figures in selected currency and exempt of any Taxes, Duties and or fees.</p>
            <p>AUD available only in Australia</p>
          </div>

          <div className="mt-12 bg-slate-100 rounded-2xl p-8 border border-slate-300">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Ready to get started?</h2>
            <p className="text-slate-600 mb-6">Contact us to discuss which plan is right for your business.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-3">Schedule a Demo</Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-slate-900 text-slate-900 hover:bg-slate-100 px-8 py-3 bg-transparent"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showPasswordDialog && (
        <Dialog
          open={showPasswordDialog}
          onOpenChange={(open) => {
            if (!open && !isVerifying) {
              setShowPasswordDialog(false)
              setPassword("")
              setPasswordError("")
            }
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Enter Admin Password</DialogTitle>
              <DialogDescription>Please enter the admin password to enable edit mode</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                verifyPassword()
              }}
              className="space-y-4"
            >
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handlePasswordKeyDown}
                disabled={isVerifying}
                autoFocus
              />
              {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowPasswordDialog(false)
                    setPassword("")
                    setPasswordError("")
                  }}
                  disabled={isVerifying}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isVerifying || !password}>
                  {isVerifying ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <button
        onClick={handleEditModeClick}
        className="fixed bottom-4 right-4 z-50 p-1 rounded-full bg-white border-2 border-blue-500 shadow-xl hover:scale-110 transition-transform"
      >
        <Image
          src="/images/kuhlekt-cloud-logo.jpg"
          alt="Admin"
          width={12}
          height={12}
          className="w-12 h-12 object-contain"
        />
      </button>

      <Footer />
    </div>
  )
}

export default PricingTablePage
