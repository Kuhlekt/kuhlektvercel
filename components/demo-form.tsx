"use client"

import { useActionState } from "react"
import { submitDemoForm } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DemoForm() {
  const [state, action, isPending] = useActionState(submitDemoForm, null)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Request a Demo</CardTitle>
        <CardDescription>See our platform in action. Schedule a personalized demo with our team.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" name="phone" type="tel" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input id="company" name="company" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliateNumber">Affiliate Number (Optional)</Label>
            <Input id="affiliateNumber" name="affiliateNumber" placeholder="e.g., AFF001" className="font-mono" />
            <p className="text-sm text-muted-foreground">
              If you were referred by an affiliate, please enter their number here.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Tell us about your needs</Label>
            <Textarea
              id="message"
              name="message"
              className="min-h-[120px]"
              placeholder="What would you like to see in the demo? Any specific features or use cases?"
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Submitting..." : "Request Demo"}
          </Button>

          {state && (
            <div
              className={`p-4 rounded-md ${
                state.success
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {state.message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
