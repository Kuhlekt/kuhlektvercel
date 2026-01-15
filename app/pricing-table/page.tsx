"use client"

import type React from "react"
import Link from "next/link"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Check, Pencil } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PricingData {
  bronze: {
    usd: string
    billing: string
    setupFeeUsd: string
  }
  silver: {
    usd: string
    billing: string
    setupFeeUsd: string
  }
  gold: {
    usd: string
    billing: string
    setupFeeUsd: string
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

const USD_TO_AUD_RATE = 1.3 // 30% markup from USD

const convertUsdToAud = (usdPrice: string): string => {
  const numPrice = Number.parseFloat(usdPrice.replace(/,/g, ""))
  if (isNaN(numPrice)) return usdPrice
  const audPrice = numPrice * USD_TO_AUD_RATE
  const rounded = Math.round(audPrice / 10) * 10
  return rounded.toLocaleString()
}

const convertAudToUsd = (audPrice: string): string => {
  const numPrice = Number.parseFloat(audPrice.replace(/,/g, ""))
  if (isNaN(numPrice)) return audPrice
  const usdPrice = numPrice / USD_TO_AUD_RATE
  const rounded = Math.round(usdPrice / 10) * 10
  return rounded.toLocaleString()
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
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)

  const [editValues, setEditValues] = useState<Record<string, string>>({})

  const [pricingData, setPricingData] = useState<PricingData>({
    bronze: {
      usd: "980",
      billing: "No contract\nbilled monthly",
      setupFeeUsd: "990",
    },
    silver: {
      usd: "1,900",
      billing: "No contract\nbilled monthly",
      setupFeeUsd: "1,350",
    },
    gold: {
      usd: "2,900",
      billing: "on annual contract\nbilled monthly",
      setupFeeUsd: "1,600",
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
    const savedPricing = localStorage.getItem("pricing-table-data")
    const savedFeatures = localStorage.getItem("pricing-table-features")

    if (savedPricing) {
      try {
        setPricingData(JSON.parse(savedPricing))
      } catch (e) {
        console.error("Failed to load pricing data:", e)
      }
    }

    if (savedFeatures) {
      try {
        setFeatures(JSON.parse(savedFeatures))
      } catch (e) {
        console.error("Failed to load features data:", e)
      }
    }
  }, [])

  const updatePricingData = (tier: keyof PricingData, field: string, value: string) => {
    setHasUnsavedChanges(true)
    setPricingData((prev) => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        [field]: value,
      },
    }))
  }

  const updateFeatureValue = (index: number, tier: "bronze" | "silver" | "gold" | "platinum", value: string) => {
    setHasUnsavedChanges(true)
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

  const renderFeatureValue = useCallback(
    (value: any, featureIndex: number, tier: "bronze" | "silver" | "gold" | "platinum") => {
      if (editMode) {
        return (
          <Input
            key={`feature-${featureIndex}-${tier}`}
            ref={(el) => {
              if (el) inputRefs.current[`feature-${featureIndex}-${tier}`] = el
            }}
            value={String(value)}
            onChange={(e) => updateFeatureValue(featureIndex, tier, e.target.value)}
            className="text-center text-sm"
          />
        )
      }

      // Display logic
      if (value === "true" || value === true) return <Check className="h-5 w-5 text-green-600" />
      if (value === "false" || value === false) return <span className="text-gray-400">—</span>
      return value
    },
    [editMode],
  )

  const tabs = [
    { id: "bronze", name: "Bronze", color: "bg-amber-600" },
    { id: "silver", name: "Silver", color: "bg-gray-500" },
    { id: "gold", name: "Gold", color: "bg-yellow-500" },
    { id: "platinum", name: "Platinum", color: "bg-purple-600" },
  ]

  const handleEditModeClick = () => {
    if (editMode) {
      if (hasUnsavedChanges) {
        setShowExitDialog(true)
      } else {
        setEditMode(false)
        setHasUnsavedChanges(false)
      }
    } else {
      setShowPasswordDialog(true)
      setPassword("")
      setPasswordError("")
    }
  }

  const initializeEditValues = () => {
    const values: Record<string, string> = {}
    const tiers = ["bronze", "silver", "gold"] as const
    tiers.forEach((tier) => {
      const usdPrice = pricingData[tier].usd
      const usdSetup = pricingData[tier].setupFeeUsd
      values[`${tier}-usd`] = currency === "AUD" ? convertUsdToAud(usdPrice) : usdPrice
      values[`${tier}-setupFeeUsd`] = currency === "AUD" ? convertUsdToAud(usdSetup) : usdSetup
    })
    setEditValues(values)
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
        initializeEditValues()
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

  const handleSaveChanges = useCallback(() => {
    setIsSaving(true)
    setSaveMessage("")

    try {
      // Convert edit values back to USD before saving
      const updatedPricingData = { ...pricingData }
      const tiers = ["bronze", "silver", "gold"] as const

      tiers.forEach((tier) => {
        const priceKey = `${tier}-usd`
        const setupKey = `${tier}-setupFeeUsd`

        if (editValues[priceKey] !== undefined) {
          const rawValue = editValues[priceKey]
          updatedPricingData[tier] = {
            ...updatedPricingData[tier],
            usd: currency === "AUD" ? convertAudToUsd(rawValue) : rawValue,
          }
        }
        if (editValues[setupKey] !== undefined) {
          const rawValue = editValues[setupKey]
          updatedPricingData[tier] = {
            ...updatedPricingData[tier],
            setupFeeUsd: currency === "AUD" ? convertAudToUsd(rawValue) : rawValue,
          }
        }
      })

      setPricingData(updatedPricingData)
      localStorage.setItem("pricing-table-data", JSON.stringify(updatedPricingData))
      localStorage.setItem("pricing-table-features", JSON.stringify(features))
      setSaveMessage("✓ Changes saved successfully!")
      setHasUnsavedChanges(false)

      setTimeout(() => {
        setSaveMessage("")
      }, 3000)
    } catch (e) {
      console.error("Failed to save pricing data:", e)
      setSaveMessage("✗ Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }, [pricingData, editValues, currency, features])

  const getPriceForCurrency = (tier: "bronze" | "silver" | "gold", field: "usd" | "setupFeeUsd"): string => {
    const usdValue = pricingData[tier][field]
    if (currency === "USD") {
      return usdValue
    }
    // Calculate AUD from USD
    return convertUsdToAud(usdValue)
  }

  const getDisplayPrice = (price: string): string => {
    if (billingPeriod === "monthly" || price === "Get a quote") {
      return price
    }
    // Remove commas and convert to number
    const numPrice = Number.parseFloat(price.replace(/,/g, ""))
    if (isNaN(numPrice)) return price

    // Apply 15% discount
    const discounted = numPrice * 0.85
    // Round to nearest 10
    const rounded = Math.round(discounted / 10) * 10
    // Format with commas
    return rounded.toLocaleString()
  }

  const handlePriceChange = (tier: "bronze" | "silver" | "gold", field: "usd" | "setupFeeUsd", value: string) => {
    setHasUnsavedChanges(true)
    setEditValues((prev) => ({
      ...prev,
      [`${tier}-${field}`]: value,
    }))
  }

  const getEditInputValue = (tier: "bronze" | "silver" | "gold", field: "usd" | "setupFeeUsd"): string => {
    const key = `${tier}-${field}`
    if (editValues[key] !== undefined) {
      return editValues[key]
    }
    const usdValue = pricingData[tier][field]
    if (currency === "USD") {
      return usdValue
    }
    return convertUsdToAud(usdValue)
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && isVerifying) {
      return
    }
    setShowPasswordDialog(open)
  }

  const handleExitDialogOpenChange = (open: boolean) => {
    if (!open && hasUnsavedChanges) {
      setShowExitDialog(true)
      return
    }
    setShowExitDialog(open)
  }

  const handleExitWithoutSaving = () => {
    setEditMode(false)
    setHasUnsavedChanges(false)
    setShowExitDialog(false)
  }

  const handleSaveAndExit = () => {
    handleSaveChanges()
    setShowExitDialog(false)
  }

  const scrollPositionRef = useRef(0)
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const handleCurrencyChange = (checked: boolean) => {
    if (editMode) {
      return // Prevent currency changes while editing
    }
    setCurrency(checked ? "AUD" : "USD")
  }

  const handleBillingPeriodChange = useCallback((period: "monthly" | "annual") => {
    setBillingPeriod(period)
  }, [])

  const handleTabChange = useCallback((tabId: string) => {
    setSelectedTab(tabId)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="mb-8 md:mb-12 text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
              Choose Your Plan
            </h1>
            <button
              onClick={handleEditModeClick}
              className={`p-2 rounded-full transition-colors ${
                editMode ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              title={editMode ? "Exit Edit Mode" : "Edit Pricing"}
            >
              <Pencil className="h-5 w-5" />
            </button>
          </div>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Select the perfect plan for your business needs
          </p>

          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 bg-slate-100 rounded-full p-1 border border-slate-300">
                <button
                  onClick={() => handleBillingPeriodChange("monthly")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    billingPeriod === "monthly" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => handleBillingPeriodChange("annual")}
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
                💰 15% Discount Available for Annual Pricing - Pre-Paid
              </div>
            )}
          </div>

          {/* Currency Selector - swapped positions so USD is on left */}
          <div className="flex justify-center gap-4 mt-6 items-center">
            <span className={`font-medium ${currency === "USD" ? "text-gray-900" : "text-gray-500"}`}>USD</span>
            <Switch
              checked={currency === "AUD"}
              onCheckedChange={handleCurrencyChange}
              disabled={editMode}
              className="data-[state=checked]:bg-cyan-500"
            />
            <span className={`font-medium ${currency === "AUD" ? "text-gray-900" : "text-gray-500"}`}>AUD</span>
            {/* Visual feedback when currency selector is disabled */}
            {editMode && <span className="text-xs text-slate-500 ml-2">(locked during edit)</span>}
          </div>

          {/* Desktop View */}
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
                                  <Input
                                    type="text"
                                    value={getEditInputValue(tier as "bronze" | "silver" | "gold", "usd")}
                                    onChange={(e) =>
                                      handlePriceChange(tier as "bronze" | "silver" | "gold", "usd", e.target.value)
                                    }
                                    className="w-24 bg-slate-700 text-white px-2 py-1 rounded text-center"
                                  />
                                ) : (
                                  getDisplayPrice(getPriceForCurrency(tier as "bronze" | "silver" | "gold", "usd"))
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
                  {/* Setup Fees Row */}
                  <tr className="bg-slate-100">
                    <td className="p-4 font-medium text-slate-900">Setup fees</td>
                    {["bronze", "silver", "gold", "platinum"].map((tier) => (
                      <td key={tier} className="p-4 text-center border-l border-slate-300">
                        {tier === "platinum" ? (
                          pricingData.platinum.setupFee
                        ) : editMode ? (
                          <Input
                            value={getEditInputValue(tier as "bronze" | "silver" | "gold", "setupFeeUsd")}
                            onChange={(e) =>
                              handlePriceChange(tier as "bronze" | "silver" | "gold", "setupFeeUsd", e.target.value)
                            }
                            className="text-center bg-white text-slate-900 px-2 py-1 rounded border border-slate-300"
                          />
                        ) : (
                          `${currency === "USD" ? "$" : "A$"}${getPriceForCurrency(tier as "bronze" | "silver" | "gold", "setupFeeUsd")}`
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Features */}
                  {features.map((feature, index) => (
                    <tr key={index} className="bg-slate-100 border-b border-slate-300">
                      <td className="p-4 text-left font-medium text-slate-700 text-sm">{feature.name}</td>
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

          {/* Mobile View */}
          <div className="lg:hidden space-y-6">
            <div className="flex gap-2 justify-center flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedTab === tab.id
                      ? `${tab.color} text-white`
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Memoized Mobile Card */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-6 space-y-4 min-h-[400px]">
              <div>
                <div className="text-slate-600 text-sm">Plan</div>
                <div className="text-2xl font-bold text-slate-900 capitalize">{selectedTab}</div>
              </div>

              <div>
                <div className="text-slate-600 text-sm">Price</div>
                <div className="text-3xl font-bold text-slate-900">
                  {selectedTab === "platinum" ? (
                    <span className="text-2xl">{pricingData.platinum.price}</span>
                  ) : (
                    <>
                      <span className="text-sm font-normal text-slate-600">{currency === "USD" ? "$" : "A$"}</span>
                      {editMode ? (
                        <Input
                          type="text"
                          value={getEditInputValue(selectedTab as "bronze" | "silver" | "gold", "usd")}
                          onChange={(e) =>
                            handlePriceChange(selectedTab as "bronze" | "silver" | "gold", "usd", e.target.value)
                          }
                          className="w-32 bg-slate-700 text-white px-2 py-1 rounded text-center"
                        />
                      ) : (
                        getDisplayPrice(getPriceForCurrency(selectedTab as "bronze" | "silver" | "gold", "usd"))
                      )}
                    </>
                  )}
                </div>
              </div>

              <div>
                <div className="text-slate-600 text-sm">Setup fees</div>
                <div className="text-lg font-bold text-slate-900">
                  {selectedTab === "platinum" ? (
                    pricingData.platinum.setupFee
                  ) : editMode ? (
                    <Input
                      value={getEditInputValue(selectedTab as "bronze" | "silver" | "gold", "setupFeeUsd")}
                      onChange={(e) =>
                        handlePriceChange(selectedTab as "bronze" | "silver" | "gold", "setupFeeUsd", e.target.value)
                      }
                      className="w-32 bg-slate-700 text-white px-2 py-1 rounded text-center"
                    />
                  ) : (
                    `${currency === "USD" ? "$" : "A$"}${getPriceForCurrency(selectedTab as "bronze" | "silver" | "gold", "setupFeeUsd")}`
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-sm text-slate-700">{feature.name}</span>
                    <span className="text-sm font-medium text-slate-900">
                      {renderFeatureValue(
                        feature[selectedTab as keyof Feature],
                        index,
                        selectedTab as "bronze" | "silver" | "gold" | "platinum",
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Edit Mode Controls */}
          <div className="mt-8 flex justify-center gap-4">
            <Button onClick={handleEditModeClick} variant={editMode ? "destructive" : "outline"}>
              {editMode ? "Exit Edit Mode" : "Edit Pricing"}
            </Button>
            {editMode && (
              <>
                <Button onClick={handleSaveChanges} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                {saveMessage && (
                  <span className={`self-center ${saveMessage.includes("✓") ? "text-green-600" : "text-red-600"}`}>
                    {saveMessage}
                  </span>
                )}
                {hasUnsavedChanges && (
                  <span className="self-center text-sm text-yellow-600 font-medium">⚠️ Unsaved changes</span>
                )}
              </>
            )}
          </div>

          {editMode && (
            <div className="mt-4 text-sm text-slate-600">
              <p>Edit prices in {currency}. Calculations are automatically handled.</p>
            </div>
          )}
        </div>

        {/* Password Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={handleDialogOpenChange}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Enter Admin Password</DialogTitle>
              <DialogDescription>Enter your admin password to edit pricing and features</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handlePasswordKeyDown}
                disabled={isVerifying}
                autoFocus
              />
              {passwordError && <div className="text-red-600 text-sm">{passwordError}</div>}
              <Button
                onClick={verifyPassword}
                disabled={isVerifying || !password}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white"
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Exit Dialog */}
        <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Unsaved Changes</DialogTitle>
              <DialogDescription>You have unsaved changes. What would you like to do?</DialogDescription>
            </DialogHeader>
            <div className="flex gap-3">
              <Button onClick={handleSaveAndExit} className="flex-1 bg-green-600 hover:bg-green-700">
                Save & Exit
              </Button>
              <Button onClick={handleExitWithoutSaving} variant="outline" className="flex-1 bg-transparent">
                Exit Without Saving
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link href="/" className="text-cyan-600 hover:text-cyan-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
