"use client"

import { useEffect, useState } from "react"
import { X, MessageCircle } from "lucide-react"

export function ChatbotWidget() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)

  useEffect(() => {
    ;(window as any).chatbotConfig = {
      tenantSlug: "",
      apiUrl: "https://chatbot.hindleconsultants.com",
    }

    const script = document.createElement("script")
    script.src = "https://chatbot.hindleconsultants.com/embed-inline.js"
    script.async = true

    script.onload = () => {
      const container = document.getElementById("kali-chat-container")
      if (container) {
        container.style.display = "block"
        container.style.visibility = "visible"
        container.style.opacity = "1"

        setTimeout(() => {
          const buttons = container.querySelectorAll("button, a")
          buttons.forEach((btn) => {
            const text = btn.textContent?.toLowerCase() || ""
            if (text.includes("talk") || text.includes("human")) {
              btn.addEventListener("click", (e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowContactForm(true)
              })
            }
          })
        }, 1000)
      }
    }

    script.onerror = (error) => {
      console.error("[v0] Failed to load chatbot script:", error)
    }

    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
    <>
      {!isMinimized && (
        <>
          <div
            id="kali-chat-container"
            style={{
              width: "350px",
              height: "637px",
              position: "fixed",
              bottom: 0,
              right: 0,
              zIndex: 9999,
              display: "block",
              visibility: "visible",
              opacity: 1,
              backgroundColor: "#f5f5f5",
            }}
          />
          <button
            onClick={() => setIsMinimized(true)}
            style={{
              position: "fixed",
              bottom: "597px",
              right: "8px",
              zIndex: 10000,
            }}
            className="rounded-full bg-white/90 p-1 text-gray-700 shadow-md transition-all duration-200 hover:bg-white hover:text-gray-900 hover:shadow-lg"
            aria-label="Minimize chatbot"
            title="Minimize chatbot"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </>
      )}

      {isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 10000,
          }}
          className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
          aria-label="Open chatbot"
          title="Open chatbot"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {showContactForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 10001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowContactForm(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "2rem",
              maxWidth: "500px",
              width: "90%",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowContactForm(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-900">Talk to a Human</h2>
            <p className="text-gray-600 mb-6">Fill out the form below and our team will get back to you shortly.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                // Contact form will be sent to /contact page endpoint
                const formData = new FormData(e.currentTarget)
                window.location.href = `/contact?name=${encodeURIComponent(formData.get("name") as string)}&email=${encodeURIComponent(formData.get("email") as string)}&message=${encodeURIComponent(formData.get("message") as string)}`
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
