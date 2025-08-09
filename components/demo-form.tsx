"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitDemoForm } from "@/actions/form-actions"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function DemoForm() {
  const [state, formAction, isPending] = useActionState(submitDemoForm, initialState)

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Request a Demo</CardTitle>
        <CardDescription>See our platform in action. Schedule your personalized demo today.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="demo-name">Name *</Label>
            <Input id="demo-name" name="name" placeholder="Enter your full name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo-email">Email *</Label>
            <Input id="demo-email" name="email" type="email" placeholder="Enter your business email" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo-company">Company *</Label>
            <Input id="demo-company" name="company" placeholder="Enter your company name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo-phone">Phone</Label>
            <Input id="demo-phone" name="phone" type="tel" placeholder="Enter your phone number" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo-affiliateNumber">Affiliate# *</Label>
            <Input
              id="demo-affiliateNumber"
              name="affiliateNumber"
              placeholder="Enter your affiliate number (e.g., AFF001)"
              required
              className={state.errors?.affiliateNumber ? "border-red-500" : ""}
            />
            {state.errors?.affiliateNumber && (
              <p className="text-sm text-red-600" role="alert">
                {state.errors.affiliateNumber}
              </p>
            )}
          </div>

          {state.success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm">{state.message}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Requesting Demo..." : "Request Demo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
