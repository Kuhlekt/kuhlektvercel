"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitContactForm } from "@/actions/form-actions"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
        <CardDescription>Get in touch with our team. We'd love to hear from you.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" placeholder="Enter your full name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" name="email" type="email" placeholder="Enter your email address" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliateNumber">Affiliate# (Optional)</Label>
            <Input
              id="affiliateNumber"
              name="affiliateNumber"
              placeholder="Enter your affiliate number (e.g., AFF001)"
              className={state.errors?.affiliateNumber ? "border-red-500" : ""}
            />
            {state.errors?.affiliateNumber && (
              <p className="text-sm text-red-600" role="alert">
                {state.errors.affiliateNumber}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us how we can help you"
              className="min-h-[120px]"
              required
            />
          </div>

          {state.success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm">{state.message}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
