"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Check, Edit, X } from "lucide-react"

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

export default function PricingTablePage() {
  const [currency, setCurrency] = useState<"USD" | "AUD">("USD")
  const [selectedTab, setSelectedTab] = useState("bronze")
  const [editMode, setEditMode] = useState(false)
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

  const features = [
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
    { name: "CSV SFTP load only", bronze: true, silver: true, gold: "Options", platinum: "Options" },
    { name: "Unlimited accounts", bronze: true, silver: true, gold: true, platinum: true },
    { name: "Unlimited open items", bronze: true, silver: true, gold: true, platinum: true },
    { name: "Regions / Businesses", bronze: "1", silver: "2", gold: "3", platinum: "Unlimited" },
    {
      name: "Onboarding credit application per region",
      bronze: { usd: "$150", aud: "$175" },
      silver: { usd: "✓", aud: "$175" },
      gold: "$175",
      platinum: "✓",
    },
    {
      name: "Setup Interactive credit report integration and monitoring",
      bronze: { usd: "$150", aud: "$175" },
      silver: { usd: "$150", aud: "$175" },
      gold: { usd: "$150", aud: "$175" },
      platinum: true,
    },
    { name: "Credit reports @cost + 10%", bronze: true, silver: true, gold: true, platinum: true },
    { name: "Approval process", bronze: false, silver: false, gold: true, platinum: true },
    {
      name: "ERP integration",
      bronze: "Get a quote",
      silver: "Get a quote",
      gold: "Get a quote",
      platinum: "Get a quote",
    },
    { name: "Kuhlekt collection management platform", bronze: true, silver: true, gold: true, platinum: true },
    { name: "Multiple dunning procedures", bronze: true, silver: true, gold: true, platinum: true },
    { name: "Escalations", bronze: true, silver: true, gold: true, platinum: true },
    { name: "Provisioning", bronze: true, silver: true, gold: true, platinum: true },
    { name: "Dispute workflow management", bronze: true, silver: true, gold: true, platinum: true },
    {
      name: "Setup Invoice Receiving & Copies Sending",
      bronze: { usd: "$150", aud: "$100" },
      silver: true,
      gold: true,
      platinum: true,
    },
    { name: "Immediate or Bulk statements", bronze: true, silver: true, gold: true, platinum: true },
    { name: "Reporting options", bronze: true, silver: true, gold: true, platinum: true },
    { name: "AI quick Action templates", bronze: true, silver: true, gold: true, platinum: true },
    { name: "AI Communications", bronze: true, silver: true, gold: true, platinum: true },
    { name: "KPI staff management", bronze: true, silver: true, gold: true, platinum: true },
    {
      name: "Payment management, Setup base is Stripe",
      bronze: { usd: "$140", aud: "$100" },
      silver: true,
      gold: true,
      platinum: true,
    },
    { name: "Scheduled", bronze: true, silver: true, gold: true, platinum: true },
    { name: "Ad hoc", bronze: true, silver: true, gold: true, platinum: true },
    { name: "Reminders", bronze: true, silver: true, gold: true, platinum: true },
    { name: "Kuhlekt portal", bronze: "$250", silver: { usd: "$175", aud: "$150" }, gold: true, platinum: true },
    { name: "Payments", bronze: false, silver: true, gold: true, platinum: true },
    { name: "Direct Debits", bronze: false, silver: true, gold: true, platinum: true },
    { name: "Download transactions CSV", bronze: false, silver: true, gold: true, platinum: true },
    { name: "Dispute lodgement", bronze: false, silver: true, gold: true, platinum: true },
    { name: "Invoice download", bronze: false, silver: true, gold: true, platinum: true },
    { name: "Statement download", bronze: false, silver: true, gold: true, platinum: true },
  ]

  const updatePricingData = (tier: keyof PricingData, field: string, value: string) => {
    setPricingData((prev) => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        [field]: value,
      },
    }))
  }

  const renderFeatureValue = (value: any) => {
    if (value === true) return <Check className="h-5 w-5 text-green-600" />
    if (value === false) return <span className="text-gray-400">—</span>
    if (typeof value === "object" && value.usd && value.aud) {
      return currency === "USD" ? value.usd : value.aud
    }
    return value
  }

  const tabs = [
    { id: "bronze", name: "Bronze", color: "bg-amber-600" },
    { id: "silver", name: "Silver", color: "bg-gray-500" },
    { id: "gold", name: "Gold", color: "bg-yellow-500" },
    { id: "platinum", name: "Platinum", color: "bg-purple-600" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Pricing Plans</h1>
              <Button
                onClick={() => setEditMode(!editMode)}
                variant={editMode ? "destructive" : "outline"}
                className="flex items-center gap-2"
              >
                {editMode ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                {editMode ? "Cancel Edit" : "Edit Mode"}
              </Button>
            </div>

            {/* Currency Switcher */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`font-medium ${currency === "AUD" ? "text-gray-500" : "text-gray-900"}`}>AUD</span>
              <Switch
                checked={currency === "USD"}
                onCheckedChange={(checked) => setCurrency(checked ? "USD" : "AUD")}
                className="data-[state=checked]:bg-cyan-500"
              />
              <span className={`font-medium ${currency === "USD" ? "text-gray-500" : "text-gray-900"}`}>USD</span>
            </div>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="md:hidden mb-6">
            <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    selectedTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Desktop Header */}
            <div className="hidden md:grid md:grid-cols-5 bg-gray-50 border-b">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">Features</h3>
              </div>

              {/* Bronze */}
              <div className="p-6 text-center border-l">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Bronze</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {editMode ? (
                      <Input
                        value={currency === "USD" ? pricingData.bronze.usd : pricingData.bronze.aud}
                        onChange={(e) =>
                          updatePricingData("bronze", currency === "USD" ? "usd" : "aud", e.target.value)
                        }
                        className="text-center text-3xl font-bold"
                      />
                    ) : (
                      `$${currency === "USD" ? pricingData.bronze.usd : pricingData.bronze.aud}`
                    )}
                  </div>
                  <div className="text-gray-600">/Month</div>
                  <div className="text-sm text-gray-500 mt-2 whitespace-pre-line">{pricingData.bronze.billing}</div>
                </div>
              </div>

              {/* Silver */}
              <div className="p-6 text-center border-l">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Silver</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {editMode ? (
                      <Input
                        value={currency === "USD" ? pricingData.silver.usd : pricingData.silver.aud}
                        onChange={(e) =>
                          updatePricingData("silver", currency === "USD" ? "usd" : "aud", e.target.value)
                        }
                        className="text-center text-3xl font-bold"
                      />
                    ) : (
                      `$${currency === "USD" ? pricingData.silver.usd : pricingData.silver.aud}`
                    )}
                  </div>
                  <div className="text-gray-600">/Month</div>
                  <div className="text-sm text-gray-500 mt-2 whitespace-pre-line">{pricingData.silver.billing}</div>
                </div>
              </div>

              {/* Gold */}
              <div className="p-6 text-center border-l relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Best Value
                  </span>
                </div>
                <div className="mb-4 pt-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Gold</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {editMode ? (
                      <Input
                        value={currency === "USD" ? pricingData.gold.usd : pricingData.gold.aud}
                        onChange={(e) => updatePricingData("gold", currency === "USD" ? "usd" : "aud", e.target.value)}
                        className="text-center text-3xl font-bold"
                      />
                    ) : (
                      `$${currency === "USD" ? pricingData.gold.usd : pricingData.gold.aud}`
                    )}
                  </div>
                  <div className="text-gray-600">/Month</div>
                  <div className="text-sm text-gray-500 mt-2 whitespace-pre-line">{pricingData.gold.billing}</div>
                </div>
              </div>

              {/* Platinum */}
              <div className="p-6 text-center border-l">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Platinum</h3>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {editMode ? (
                      <Input
                        value={pricingData.platinum.price}
                        onChange={(e) => updatePricingData("platinum", "price", e.target.value)}
                        className="text-center text-2xl font-bold"
                      />
                    ) : (
                      pricingData.platinum.price
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-2 whitespace-pre-line">{pricingData.platinum.billing}</div>
                </div>
              </div>
            </div>

            {/* Setup Fees Row */}
            <div className="hidden md:grid md:grid-cols-5 border-b bg-gray-50">
              <div className="p-4 font-medium text-gray-900">Setup fees</div>
              <div className="p-4 text-center border-l">
                {editMode ? (
                  <Input
                    value={currency === "USD" ? pricingData.bronze.setupFeeUsd : pricingData.bronze.setupFeeAud}
                    onChange={(e) =>
                      updatePricingData("bronze", currency === "USD" ? "setupFeeUsd" : "setupFeeAud", e.target.value)
                    }
                    className="text-center"
                  />
                ) : (
                  `$${currency === "USD" ? pricingData.bronze.setupFeeUsd : pricingData.bronze.setupFeeAud}`
                )}
              </div>
              <div className="p-4 text-center border-l">
                {editMode ? (
                  <Input
                    value={currency === "USD" ? pricingData.silver.setupFeeUsd : pricingData.silver.setupFeeAud}
                    onChange={(e) =>
                      updatePricingData("silver", currency === "USD" ? "setupFeeUsd" : "setupFeeAud", e.target.value)
                    }
                    className="text-center"
                  />
                ) : (
                  `$${currency === "USD" ? pricingData.silver.setupFeeUsd : pricingData.silver.setupFeeAud}`
                )}
              </div>
              <div className="p-4 text-center border-l">
                {editMode ? (
                  <Input
                    value={currency === "USD" ? pricingData.gold.setupFeeUsd : pricingData.gold.setupFeeAud}
                    onChange={(e) =>
                      updatePricingData("gold", currency === "USD" ? "setupFeeUsd" : "setupFeeAud", e.target.value)
                    }
                    className="text-center"
                  />
                ) : (
                  `$${currency === "USD" ? pricingData.gold.setupFeeUsd : pricingData.gold.setupFeeAud}`
                )}
              </div>
              <div className="p-4 text-center border-l">
                {editMode ? (
                  <Input
                    value={pricingData.platinum.setupFee}
                    onChange={(e) => updatePricingData("platinum", "setupFee", e.target.value)}
                    className="text-center"
                  />
                ) : (
                  pricingData.platinum.setupFee
                )}
              </div>
            </div>

            {/* Features */}
            <div className="divide-y divide-gray-200">
              {features.map((feature, index) => (
                <div key={index} className="hidden md:grid md:grid-cols-5 hover:bg-gray-50">
                  <div
                    className={`p-4 font-medium text-gray-900 ${feature.name.includes("Setup") || feature.name.includes("Scheduled") || feature.name.includes("Ad hoc") || feature.name.includes("Reminders") || feature.name.includes("Payments") || feature.name.includes("Direct Debits") || feature.name.includes("Download") || feature.name.includes("Dispute") || feature.name.includes("Invoice") || feature.name.includes("Statement") ? "pl-8 text-sm" : ""}`}
                  >
                    {feature.name}
                  </div>
                  <div className="p-4 text-center border-l">{renderFeatureValue(feature.bronze)}</div>
                  <div className="p-4 text-center border-l">{renderFeatureValue(feature.silver)}</div>
                  <div className="p-4 text-center border-l">{renderFeatureValue(feature.gold)}</div>
                  <div className="p-4 text-center border-l">{renderFeatureValue(feature.platinum)}</div>
                </div>
              ))}
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
              {selectedTab === "bronze" && (
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Bronze</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-1">
                      ${currency === "USD" ? pricingData.bronze.usd : pricingData.bronze.aud}
                    </div>
                    <div className="text-gray-600">/Month</div>
                    <div className="text-sm text-gray-500 mt-2 whitespace-pre-line">{pricingData.bronze.billing}</div>
                    <div className="mt-4 text-sm text-gray-600">
                      Setup fee: ${currency === "USD" ? pricingData.bronze.setupFeeUsd : pricingData.bronze.setupFeeAud}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-700">{feature.name}</span>
                        <span className="text-sm font-medium">{renderFeatureValue(feature.bronze)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === "silver" && (
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Silver</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-1">
                      ${currency === "USD" ? pricingData.silver.usd : pricingData.silver.aud}
                    </div>
                    <div className="text-gray-600">/Month</div>
                    <div className="text-sm text-gray-500 mt-2 whitespace-pre-line">{pricingData.silver.billing}</div>
                    <div className="mt-4 text-sm text-gray-600">
                      Setup fee: ${currency === "USD" ? pricingData.silver.setupFeeUsd : pricingData.silver.setupFeeAud}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-700">{feature.name}</span>
                        <span className="text-sm font-medium">{renderFeatureValue(feature.silver)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === "gold" && (
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="inline-block bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                      Best Value
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Gold</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-1">
                      ${currency === "USD" ? pricingData.gold.usd : pricingData.gold.aud}
                    </div>
                    <div className="text-gray-600">/Month</div>
                    <div className="text-sm text-gray-500 mt-2 whitespace-pre-line">{pricingData.gold.billing}</div>
                    <div className="mt-4 text-sm text-gray-600">
                      Setup fee: ${currency === "USD" ? pricingData.gold.setupFeeUsd : pricingData.gold.setupFeeAud}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-700">{feature.name}</span>
                        <span className="text-sm font-medium">{renderFeatureValue(feature.gold)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === "platinum" && (
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Platinum</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{pricingData.platinum.price}</div>
                    <div className="text-sm text-gray-500 mt-2 whitespace-pre-line">{pricingData.platinum.billing}</div>
                    <div className="mt-4 text-sm text-gray-600">Setup fee: {pricingData.platinum.setupFee}</div>
                  </div>
                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-700">{feature.name}</span>
                        <span className="text-sm font-medium">{renderFeatureValue(feature.platinum)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Disclaimers */}
          <div className="mt-8 text-sm text-gray-600 space-y-2">
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

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
              <p className="text-gray-600 mb-6">Contact us to discuss which plan is right for your business.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3">Schedule a Demo</Button>
                <Button variant="outline" className="px-8 py-3 bg-transparent">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
