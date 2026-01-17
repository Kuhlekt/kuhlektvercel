"use client"
import { useEffect } from "react"

export function ChatbotWidget() {
  useEffect(() => {
    const script = document.createElement("script")
    script.innerHTML = `
      (function() {
        var script = document.createElement('script');
        script.src = 'https://hc-chatbot-v22.vercel.app/widget.js';
        script.setAttribute('data-tenant-id', 'c3a22737-835a-480b-9cd2-5ee9b40d3be4');
        document.body.appendChild(script);
      })();
    `

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return null
}
