'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState, useEffect } from "react"

const GiftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6">
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13" />
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
  </svg>
)

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2 h-8 w-8">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 flex-shrink-0 mt-1">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

export default function BlackFridayPage() {
  const [timeRemaining, setTimeRemaining] = useState('')

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()
      const endDate = new Date('2024-12-02T00:00:00') // Midnight Monday Dec 1st (technically start of Dec 2nd)
      const diff = endDate.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeRemaining('Offer Ended')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      setTimeRemaining(`${days}d ${hours}h ${minutes}m`)
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 text-lg px-6 py-2 bg-red-600 hover:bg-red-700">
            <CalendarIcon />
            Ends Midnight Monday December 1st
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-pulse">
            BLACK FRIDAY SALE
          </h1>
          
          <div className="text-4xl md:text-6xl font-bold mb-8">
            <span className="text-yellow-400">50% OFF</span>
            <span className="text-white"> + </span>
            <span className="text-cyan-400">FREE SETUP</span>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Transform your accounts receivable process with Kuhlekt. Get started today with our biggest savings of the year.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="#claim">
              <Button size="lg" className="text-xl px-8 py-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                <GiftIcon />
                Claim Your Code
              </Button>
            </Link>
          </div>

          <div className="text-2xl font-bold text-red-400 mb-2">
            Offer Expires In:
          </div>
          <div className="text-lg text-gray-400">
            {timeRemaining || 'Calculating...'}
          </div>
        </div>

        {/* What's Included */}
        <div className="max-w-5xl mx-auto mb-16">
          <Card className="bg-gray-800 border-yellow-500 border-2 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-3xl text-white text-center">
                Black Friday Special Includes:
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg">
                  <div className="text-green-400">
                    <CheckIcon />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">50% Off First Year</h3>
                    <p className="text-gray-300">
                      Save thousands on your subscription. Pay half price for your entire first year of service.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg">
                  <div className="text-cyan-400">
                    <CheckIcon />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Free Setup ($2,500 Value)</h3>
                    <p className="text-gray-300">
                      Complete implementation, training, and onboarding at no additional cost.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg">
                  <div className="text-purple-400">
                    <CheckIcon />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Priority Implementation</h3>
                    <p className="text-gray-300">
                      Jump the queue and go live within 1 week with dedicated support.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg">
                  <div className="text-yellow-400">
                    <CheckIcon />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Full Feature Access</h3>
                    <p className="text-gray-300">
                      Automated collections, customer portal, real-time analytics, and more.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Promo Code Section */}
        <div id="claim" className="max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-black">
                <ZapIcon />
                Your Exclusive Promo Code
              </CardTitle>
              <CardDescription className="text-center text-black text-lg">
                Use this code when requesting your demo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-black rounded-lg p-8 text-center">
                <div className="text-sm text-gray-400 mb-2">Promo Code</div>
                <div className="text-4xl md:text-5xl font-mono font-bold text-yellow-400 tracking-wider">
                  BLACKFRIDAY2024
                </div>
                <div className="text-sm text-gray-400 mt-2">Valid until midnight Monday December 1st</div>
              </div>

              <div className="text-center">
                <Link href="/demo">
                  <Button size="lg" className="text-xl px-8 py-6 bg-black hover:bg-gray-900 text-yellow-400 font-bold w-full">
                    Request Demo Now
                  </Button>
                </Link>
              </div>

              <div className="text-center text-black text-sm">
                Enter code at checkout to claim your 50% discount + free setup
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Terms */}
        <div className="max-w-3xl mx-auto mt-12 text-center text-gray-400 text-sm">
          <p className="mb-2">
            * Offer valid until midnight Monday December 1st, 2024. 50% discount applies to first year subscription only.
            Free setup valued at $2,500. Must request demo and mention promo code to qualify.
          </p>
          <p>
            New customers only. Cannot be combined with other offers.
          </p>
        </div>
      </div>
    </div>
  )
}
