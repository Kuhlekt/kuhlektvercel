"use client"

import type React from "react"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { submitContactForm, type ContactFormState } from "./actions"
import Recaptcha from "@/components/recaptcha"

const initialState: ContactFormState = {
  success: false,
  message: "",
  errors: {},
}

export default function ContactFormComponent() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
  const [recaptchaToken, setRecaptchaToken] = useState<string>("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.append("recaptcha-token", recaptchaToken)
    formAction(formData)
  }

  const handleRecaptchaVerify = (token: string) => {
    setRecaptchaToken(token)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Recaptcha onVerify={handleRecaptchaVerify} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              required
              className={state.errors?.firstName ? "border-red-500" : ""}
            />
            {state.errors?.firstName && <p className="text-red-500 text-sm mt-1">{state.errors.firstName}</p>}
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              required
              className={state.errors?.lastName ? "border-red-500" : ""}
            />
            {state.errors?.lastName && <p className="text-red-500 text-sm mt-1">{state.errors.lastName}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className={state.errors?.email ? "border-red-500" : ""}
          />
          {state.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" type="text" className={state.errors?.company ? "border-red-500" : ""} />
          {state.errors?.company && <p className="text-red-500 text-sm mt-1">{state.errors.company}</p>}
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" rows={5} className={state.errors?.message ? "border-red-500" : ""} />
          {state.errors?.message && <p className="text-red-500 text-sm mt-1">{state.errors.message}</p>}
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Sending..." : "Send Message"}
        </Button>

        {state.message && (
          <Alert className={state.success ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
            <AlertDescription className={state.success ? "text-green-700" : "text-red-700"}>
              {state.message}
            </AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  )
}
