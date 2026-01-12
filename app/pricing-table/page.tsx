"use client"

import { useState } from "react"

import type React from "react"
import Link from "next/link"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PricingData {
  bronze: {
    usd: string
    aud: string
    billing: string
    setupFeeUsd: string
    setupFeeAud: string
  }
  silver: {
    usd: string
    aud: string
    billing: string
    setupFeeUsd: string
    setupFeeAud: string
  }
  gold: {
    usd: string
    aud: string
    billing: string
    setupFeeUsd: string
    setupFeeAud: string
  }
  platinum: {
    price: string
    billing: string
    setupFee: string
  }
}

interface Feature {
  name: string
  bronze: string | boolean
  silver: string | boolean
  gold: string | boolean
  platinum: string | boolean
}

export default function PricingTablePage() {
  const [currency, setCurrency] = useState<"USD" | "AUD">("USD")
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly")
  const [selectedTab, setSelectedTab] = useState("bronze")
  const [editMode, setEditMode] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [pricingData, setPricingData] = useState<PricingData>({
    bronze: {
      usd: "980",
      aud: "1,140",
      billing: "No contract\nbilled monthly",
      setupFeeUsd: "990",
      setupFeeAud: "1,300",
    },
    silver: {
      usd: "1,900",
      aud: "2,510",
      billing: "No contract\nbilled monthly",
      setupFeeUsd: "1,350",
      setupFeeAud: "1,750",
    },
    gold: {
      usd: "2,900",
      aud: "3,150",
      billing: "on annual contract\nbilled monthly",
      setupFeeUsd: "1,600",
      setupFeeAud: "1,750",
    },
    platinum: {
      price: "Get a quote",
      billing: "on annual contract\nbilled monthly",
      setupFee: "Get a quote",
    },
  })

  const [features, setFeatures] = useState<Feature[]>([
    { name: "Minimum", bronze: "1 Admin user", silver: "1 Admin user", gold: "1 Admin user", platinum: "1 Admin user" },
    {
      name: "Maximum Core Users",
      bronze: "5 Core users",
      silver: "10 Core users",
      gold: "15 Core users",
      platinum: "∞ Users",
    },
    {
      name: "Maximum Sales Users",
      bronze: "20 Sales users",
      silver: "30 Sales users",
      gold: "40 Sales users",
      platinum: "∞ Sales",
    },
    { name: "CSV SFTP load only", bronze: "true", silver: "true", gold: "Options", platinum: "Options" },
    { name: "Unlimited accounts", bronze: "true", silver: "true", gold: "true", platinum: "true" },
    { name: "Unlimited open items", bronze: "true", silver: "true", gold: "true", platinum: "true" },
    { name: "Regions / Businesses", bronze: "1", silver: "2", gold: "3", platinum: "Unlimited" },
    {
      name: "Onboarding credit application per region",
      bronze: "$150 USD / $175 AUD",
      silver: "✓ USD / $175 AUD",
      gold: "$175",
      platinum: "✓",
    },
    {
      name: "Setup Interactive credit report integration and monitoring",
      bronze: "$150 USD / $175 AUD",
      silver: "$150 USD / $175 AUD",
      gold: "$150 USD / $175 AUD",
      platinum: "true",
    },
    { name: "Credit reports @cost + 10%", bronze: "true", silver: "true", gold: "true", platinum: "true" },
    { name: "Approval process", bronze: "false", silver: "false", gold: "true", platinum: "true" },
    {
      name: "ERP integration",
      bronze: "Get a quote",
      silver: "Get a quote",
      gold: "Get a quote",
      platinum: "Get a quote",
    },
    { name: "Kuhlekt collection management platform", bronze: "true", silver: "true", gold: "true", platinum: "true" },
    { name: "Multiple dunning procedures", bronze: "true", silver: "true", gold: "true", platinum: "true" },
    { name: "Escalations", bronze: "true", silver: "true", gold: "true", platinum: "true" },
    { name: "Provisioning", bronze: "true", silver: "true", gold: "true", platinum: "true" },
    { name: "Dispute workflow management", bronze: "true", silver: "true", gold: "true", platinum: "true" },
    {
      name: "Setup Invoice Receiving & Copies Sending",
      bronze: "$150 USD / $100 AUD",
      silver: "true",
      gold: "true",
      platinum: "true",
    },
    { name: "Immediate or Bulk statements", bronze: "true", silver: "true", gold: "true", platinum: "true" },
    { name: "Reporting options", bronze: "true", silver: "true", gold: "true", platinum: "true" },
    { name: "AI quick Action templates", bronze: "true", silver: "true", gold: "true", platinum: "true" },
    { name: "AI Communications", bronze: "true", silver: "true", gold: "true", platinum: "true" },
    { name: "KPI staff management", bronze: "true", silver: "true", gold: "true", platinum: "true" },
    {
      name: "Payment management, Setup base is Stripe",
      bronze: "$140 USD / $100 AUD",
      silver: "true",
      gold: "true",
      platinum: "true",
    },
    { name: "Scheduled", bronze: "true", silver: "true", gold: "true", platinum: "true" },
    { name: "Ad hoc", bronze: "true", silver: "true", gold: "true", platinum: "true" },
    { name: "Reminders", bronze: "true", silver: "true", gold: "true", platinum: "true" },
    { name: "Kuhlekt portal", bronze: "$250", silver: "$175 USD / $150 AUD", gold: "true", platinum: "true" },
    { name: "Payments", bronze: "false", silver: "true", gold: "true", platinum: "true" },
    { name: "Direct Debits", bronze: "false", silver: "true", gold: "true", platinum: "true" },
    { name: "Download transactions CSV", bronze: "false", silver: "true", gold: "true", platinum: "true" },
    { name: "Dispute lodgement", bronze: "false", silver: "true", gold: "true", platinum: "true" },
    { name: "Invoice download", bronze: "false", silver: "true", gold: "true", platinum: "true" },
    { name: "Statement download", bronze: "false", silver: "true", gold: "true", platinum: "true" },
  ])

  useEffect(() => {
    loadPricingData()
  }, [])

  const loadPricingData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/pricing")
      const data = await response.json()

      if (data.success && data.tiers && data.features) {
        const transformedPricingData: PricingData = {
          bronze: {
            usd: data.tiers.find((t: any) => t.tier_name === "bronze")?.usd_price || "980",
            aud: data.tiers.find((t: any) => t.tier_name === "bronze")?.aud_price || "1,140",
            billing:
              data.tiers.find((t: any) => t.tier_name === "bronze")?.billing_term || "No contract\\nbilled monthly",
            setupFeeUsd: data.tiers.find((t: any) => t.tier_name === "bronze")?.usd_setup_fee || "990",
            setupFeeAud: data.tiers.find((t: any) => t.tier_name === "bronze")?.aud_setup_fee || "1,300",
          },
          silver: {
            usd: data.tiers.find((t: any) => t.tier_name === "silver")?.usd_price || "1,900",
            aud: data.tiers.find((t: any) => t.tier_name === "silver")?.aud_price || "2,510",
            billing:
              data.tiers.find((t: any) => t.tier_name === "silver")?.billing_term || "No contract\\nbilled monthly",
            setupFeeUsd: data.tiers.find((t: any) => t.tier_name === "silver")?.usd_setup_fee || "1,350",
            setupFeeAud: data.tiers.find((t: any) => t.tier_name === "silver")?.aud_setup_fee || "1,750",
          },
          gold: {
            usd: data.tiers.find((t: any) => t.tier_name === "gold")?.usd_price || "2,900",
            aud: data.tiers.find((t: any) => t.tier_name === "gold")?.aud_price || "3,150",
            billing:
              data.tiers.find((t: any) => t.tier_name === "gold")?.billing_term ||
              "on annual contract\\nbilled monthly",
            setupFeeUsd: data.tiers.find((t: any) => t.tier_name === "gold")?.usd_setup_fee || "1,600",
            setupFeeAud: data.tiers.find((t: any) => t.tier_name === "gold")?.aud_setup_fee || "1,750",
          },
          platinum: {
            price: data.tiers.find((t: any) => t.tier_name === "platinum")?.usd_price || "Get a quote",
            billing:
              data.tiers.find((t: any) => t.tier_name === "platinum")?.billing_term ||
              "on annual contract\\nbilled monthly",
            setupFee: data.tiers.find((t: any) => t.tier_name === "platinum")?.usd_setup_fee || "Get a quote",
          },
        }

        const tierIds: any = {}
        data.tiers.forEach((tier: any) => {
          tierIds[tier.tier_name] = tier.id
        })

        const transformedFeatures: Feature[] = data.features.map((feature: any) => {
          const featureObj: Feature = {
            name: feature.feature_name,
            bronze: "false",
            silver: "false",
            gold: "false",
            platinum: "false",
          }

          data.featureValues.forEach((fv: any) => {
            if (fv.pricing_feature_id === feature.id) {
              const tier = data.tiers.find((t: any) => t.id === fv.pricing_tier_id)
              if (tier) {
                featureObj[tier.tier_name as keyof Feature] = fv.value
              }
            }
          })

          return featureObj
        })

        setPricingData(transformedPricingData)
        if (transformedFeatures.length > 0) {
          setFeatures(transformedFeatures)
        }
      }
    } catch (error) {
      console.error("Failed to load pricing data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const savePricingData = async () => {
    try {
      console.log("[v0] Starting save of pricing data")
      setIsSaving(true)
      const response = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pricingData,
          features,
        }),
      })

      console.log("[v0] API response status:", response.status)
      const data = await response.json()
      console.log("[v0] API response data:", data)

      if (response.status !== 200 || !data.success) {
        const errorMsg = data.message || data.error || "Unknown error"
        const details = data.details ? `\n\nDetails: ${data.details}` : ""
        console.error("[v0] Save failed:", errorMsg)
        alert(`Failed to save: ${errorMsg}${details}`)
      } else {
        console.log("[v0] Save successful!")
        alert("Pricing data saved successfully!")
      }
    } catch (error) {
      console.error("[v0] Failed to save pricing data:", error)
      alert(`Failed to save pricing data: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsSaving(false)
    }
  }

  const updatePricingData = (tier: keyof PricingData, field: string, value: string) => {
    setPricingData((prev) => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        [field]: value,
      },
    }))
  }

  const updateFeatureValue = (index: number, tier: "bronze" | "silver" | "gold" | "platinum", value: string) => {
    setFeatures((prev) =>
      prev.map((feature, i) =>
        i === index
          ? {
              ...feature,
              [tier]: value,
            }
          : feature,
      ),
    )
  }

  const renderFeatureValue = (value: any, featureIndex: number, tier: "bronze" | "silver" | "gold" | "platinum") => {
    if (editMode) {
      return (
        <Input
          value={String(value)}
          onChange={(e) => updateFeatureValue(featureIndex, tier, e.target.value)}
          className="text-center text-sm"
        />
      )
    }

    if (value === "true" || value === true) return <Check className="h-5 w-5 text-green-600" />
    if (value === "false" || value === false) return <span className="text-gray-400">—</span>
    return value
  }

  const tabs = [
    { id: "bronze", name: "Bronze", color: "bg-amber-600" },
    { id: "silver", name: "Silver", color: "bg-gray-500" },
    { id: "gold", name: "Gold", color: "bg-yellow-500" },
    { id: "platinum", name: "Platinum", color: "bg-purple-600" },
  ]

  const handleEditModeClick = () => {
    if (editMode) {
      savePricingData()
      setEditMode(false)
    } else {
      setShowPasswordDialog(true)
      setPassword("")
      setPasswordError("")
    }
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
        setEditMode(true)
        setShowPasswordDialog(false)
        setPassword("")
      } else {
        setPasswordError("Incorrect password. Please try again.")
      }
    } catch (error) {
      setPasswordError("An error occurred. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handlePasswordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      verifyPassword()
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
          <div className="text-2xl font-bold text-slate-900 mb-2">Loading pricing data...</div>
          <div className="text-slate-600">Please wait</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="mb-8 md:mb-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">Choose Your Plan</h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Select the perfect plan for your business needs
          </p>

          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="relative flex justify-center w-full">
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
              <div className="absolute left-1/2 translate-x-[calc(50%+1rem)] text-base font-semibold text-teal-600 whitespace-nowrap">
                Go Annual, Get a discount
              </div>
            </div>
            {billingPeriod === "annual" && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700 font-medium flex items-center gap-2 justify-center">
                <span className="text-lg">👍</span>
                <span>15% Discount Available for Annual Pricing - Pre-Paid</span>
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
                    {["bronze", "silver", "gold", "platinum"].map((tier) => (
                      <th key={tier} className="p-6 text-center">
                        <div className="space-y-3">
                          <div className="text-slate-900 font-bold text-xl capitalize">{tier}</div>
                          <div className="text-3xl font-bold text-slate-900">
                            {tier === "platinum" ? (
                              <span className="text-2xl">{pricingData.platinum.price}</span>
                            ) : (
                              <>
                                <span className="text-sm font-normal text-slate-600">
                                  {currency === "USD" ? "$" : "A$"}
                                </span>
                                {editMode ? (
                                  <input
                                    type="text"
                                    value={
                                      pricingData[tier as keyof PricingData][
                                        currency === "USD" ? "usd" : "aud"
                                      ] as string
                                    }
                                    onChange={(e) =>
                                      updatePricingData(
                                        tier as keyof PricingData,
                                        currency === "USD" ? "usd" : "aud",
                                        e.target.value,
                                      )
                                    }
                                    className="w-24 bg-slate-700 text-white px-2 py-1 rounded text-center"
                                  />
                                ) : (
                                  getDisplayPrice(
                                    pricingData[tier as keyof PricingData][
                                      currency === "USD" ? "usd" : "aud"
                                    ] as string,
                                  )
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
                    {["bronze", "silver", "gold", "platinum"].map((tier) => (
                      <td key={tier} className="p-4 text-center border-l border-slate-300">
                        {editMode ? (
                          <Input
                            value={
                              currency === "USD"
                                ? pricingData[tier as keyof PricingData].setupFeeUsd
                                : pricingData[tier as keyof PricingData].setupFeeAud
                            }
                            onChange={(e) =>
                              updatePricingData(
                                tier as keyof PricingData,
                                currency === "USD" ? "setupFeeUsd" : "setupFeeAud",
                                e.target.value,
                              )
                            }
                            className="text-center bg-white text-slate-900 px-2 py-1 rounded border border-slate-300"
                          />
                        ) : (
                          `$${currency === "USD" ? pricingData[tier as keyof PricingData].setupFeeUsd : pricingData[tier as keyof PricingData].setupFeeAud}`
                        )}
                      </td>
                    ))}
                  </tr>

                  {features.map((feature, index) => (
                    <tr key={index} className="bg-slate-100 border-b border-slate-300">
                      <td
                        className={`p-4 font-medium text-slate-900 ${feature.name.includes("Setup") || feature.name.includes("Scheduled") || feature.name.includes("Ad hoc") || feature.name.includes("Reminders") || feature.name.includes("Payments") || feature.name.includes("Direct Debits") || feature.name.includes("Download") || feature.name.includes("Dispute") || feature.name.includes("Invoice") || feature.name.includes("Statement") ? "pl-8 text-sm" : ""}`}
                      >
                        {editMode ? (
                          <Input
                            value={feature.name}
                            onChange={(e) =>
                              setFeatures((prev) =>
                                prev.map((f, i) => (i === index ? { ...f, name: e.target.value } : f)),
                              )
                            }
                            className="text-sm bg-white text-slate-900 px-2 py-1 rounded border border-slate-300"
                          />
                        ) : (
                          feature.name
                        )}
                      </td>
                      {["bronze", "silver", "gold", "platinum"].map((tier) => (
                        <td key={tier} className="p-4 text-center border-l border-slate-300">
                          {renderFeatureValue(
                            feature[tier as keyof Feature],
                            index,
                            tier as "bronze" | "silver" | "gold" | "platinum",
                          )}
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
              {(["bronze", "silver", "gold", "platinum"] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTab(tier)}
                  className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                    selectedTab === tier
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 border border-slate-300"
                  }`}
                >
                  {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-300 overflow-hidden">
              <div className="bg-slate-100 p-6 text-center">
                <div className="text-slate-900 font-bold text-2xl capitalize mb-3">{selectedTab}</div>
                <div className="text-4xl font-bold text-slate-900 mb-2">
                  {selectedTab === "platinum" ? (
                    <span className="text-3xl">{pricingData.platinum.price}</span>
                  ) : (
                    <>
                      <span className="text-lg font-normal text-slate-600">{currency === "USD" ? "$" : "A$"}</span>
                      {editMode ? (
                        <input
                          type="text"
                          value={
                            pricingData[selectedTab as keyof PricingData][currency === "USD" ? "usd" : "aud"] as string
                          }
                          onChange={(e) =>
                            updatePricingData(
                              selectedTab as keyof PricingData,
                              currency === "USD" ? "usd" : "aud",
                              e.target.value,
                            )
                          }
                          className="w-32 bg-white text-slate-900 px-2 py-1 rounded text-center border border-slate-300"
                        />
                      ) : (
                        getDisplayPrice(
                          pricingData[selectedTab as keyof PricingData][currency === "USD" ? "usd" : "aud"] as string,
                        )
                      )}
                    </>
                  )}
                </div>
                <div className="text-slate-700 text-sm font-medium">
                  {billingPeriod === "monthly" ? "billed monthly" : "billed annually"}
                </div>
                <div className="mt-4 text-sm text-slate-600">
                  Setup fee: $
                  {currency === "USD"
                    ? pricingData[selectedTab as keyof PricingData].setupFeeUsd
                    : pricingData[selectedTab as keyof PricingData].setupFeeAud}
                </div>
              </div>
              <div className="p-6 space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start py-3 border-b border-slate-300 last:border-0"
                  >
                    <div
                      className={`font-medium text-slate-900 ${feature.name.includes("Setup") || feature.name.includes("Scheduled") || feature.name.includes("Ad hoc") || feature.name.includes("Reminders") || feature.name.includes("Payments") || feature.name.includes("Direct Debits") || feature.name.includes("Download") || feature.name.includes("Dispute") || feature.name.includes("Invoice") || feature.name.includes("Statement") ? "pl-4 text-sm" : ""}`}
                    >
                      {editMode ? (
                        <Input
                          value={feature.name}
                          onChange={(e) =>
                            setFeatures((prev) =>
                              prev.map((f, i) => (i === index ? { ...f, name: e.target.value } : f)),
                            )
                          }
                          className="text-sm bg-white text-slate-900 px-2 py-1 rounded border border-slate-300"
                        />
                      ) : (
                        feature.name
                      )}
                    </div>
                    <div className="text-sm font-medium">
                      {renderFeatureValue(
                        feature[selectedTab as keyof Feature],
                        index,
                        selectedTab as "bronze" | "silver" | "gold" | "platinum",
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-2 text-sm text-slate-600">
            <p>
              <strong>**</strong> Copies received via email BCC from ERP alternate options available by quote.
            </p>
            <p>
              <strong>***</strong> Based on Stripe other providers quoted. Fees to client accounts.
            </p>
            <p>
              <strong>****</strong> Additional Regional Onboarding @ $140 PCM each in currency selected table.
            </p>
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

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16">
            <div className="bg-slate-50 rounded-lg p-12 text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to get started?</h2>
              <p className="text-lg text-slate-600 mb-8">
                Contact us to discuss which plan is right for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/demo">
                  <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg">
                    Schedule a Demo
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg bg-transparent">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Admin Password</DialogTitle>
            <DialogDescription>Please enter your admin password to enable edit mode.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handlePasswordKeyDown}
              autoFocus
            />
            {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                Cancel
              </Button>
              <Button onClick={verifyPassword} disabled={isVerifying}>
                {isVerifying ? "Verifying..." : "Confirm"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleEditModeClick}
          disabled={isSaving}
          className="w-20 h-20 rounded-full shadow-2xl hover:shadow-xl transition-all bg-white p-3 border-4 border-blue-500 hover:border-blue-600 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          title={isSaving ? "Saving..." : editMode ? "Save & Exit Edit Mode" : "Edit Mode"}
        >
          <img
            src="/images/kuhlekt-20cloud-20transparent-20b-ground-20with-20tm-20medium-2080-20pxls.jpg"
            alt="Edit"
            className="w-full h-full object-contain"
          />
        </button>
        {isSaving && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
            Saving changes...
          </div>
        )}
      </div>
    </div>
  )
}
