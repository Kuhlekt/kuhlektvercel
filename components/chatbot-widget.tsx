"use client"

import { X } from "lucide-react"
import { useState } from "react"

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const openChat = () => {
    const width = 350
    const height = 600
    const left = window.screen.width - width - 20
    const top = (window.screen.height - height) / 2

    window.open(
      "https://v0-website-chatbot-dlyj8h1nu-uhlekt.vercel.app",
      "KuhlektChat",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    )
  }

  return (
    <>
      {isOpen && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              zIndex: 9998,
            }}
            onClick={() => setIsOpen(false)}
          />

          <div
            style={{
              position: "fixed",
              top: "50%",
              right: "20px",
              transform: "translateY(-50%)",
              width: "380px",
              maxHeight: "520px",
              background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)",
              borderRadius: "24px",
              boxShadow: "0 10px 40px rgba(59, 130, 246, 0.15)",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1px solid rgba(59, 130, 246, 0.1)",
              opacity: 0.8,
            }}
          >
            <div
              style={{
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "linear-gradient(135deg, #dbeafe 0%, #f0f9ff 100%)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20200%20Pxls%20-%20Copy-60iaM5ygzmdd6ULAwb5yMc9bzHJ8J6.png"
                  alt="Kuhlekt"
                  style={{ height: "32px", objectFit: "contain" }}
                />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "12px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 1)"
                  e.currentTarget.style.transform = "scale(1.05)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)"
                  e.currentTarget.style.transform = "scale(1)"
                }}
                aria-label="Close chat"
              >
                <X size={18} color="#6b7280" />
              </button>
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 32px",
                textAlign: "center",
                gap: "24px",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                }}
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20200%20Pxls%20-%20Copy-60iaM5ygzmdd6ULAwb5yMc9bzHJ8J6.png"
                  alt="Kuhlekt"
                  style={{ width: "80px", objectFit: "contain" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: 600,
                    margin: 0,
                    color: "#1e40af",
                    lineHeight: "1.3",
                  }}
                >
                  Hi there! 👋
                  <br />
                  How can we help you today?
                </h3>
                <p
                  style={{
                    fontSize: "15px",
                    color: "#64748b",
                    margin: 0,
                    lineHeight: "1.6",
                    maxWidth: "280px",
                  }}
                >
                  We're here to answer your questions and help you discover how Kuhlekt can transform your business.
                </p>
              </div>

              <button
                onClick={openChat}
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "16px",
                  padding: "16px 32px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s",
                  width: "100%",
                  boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(59, 130, 246, 0.4)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(59, 130, 246, 0.3)"
                }}
              >
                Start Chatting
              </button>

              <p
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                Available 24/7 to assist you
              </p>
            </div>
          </div>
        </>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "white",
            border: "2px solid rgba(59, 130, 246, 0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(59, 130, 246, 0.25)",
            transition: "all 0.3s",
            zIndex: 9999,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)"
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(59, 130, 246, 0.35)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)"
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.25)"
          }}
          aria-label="Open chat"
        >
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20200%20Pxls%20-%20Copy-60iaM5ygzmdd6ULAwb5yMc9bzHJ8J6.png"
            alt="Chat with us"
            style={{ width: "48px", height: "48px", objectFit: "contain" }}
          />
        </button>
      )}
    </>
  )
}
