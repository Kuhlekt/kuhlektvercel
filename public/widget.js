;(() => {
  const VERSION = "2.3"
  console.log(`[Kali Widget] Initializing v${VERSION} with handoff support`)

  // Get API URL from window or use current origin
  const API_URL = window.KALI_API_URL || window.location.origin
  console.log(`[Kali Widget] API URL: ${API_URL}`)

  // Generate session ID
  const SESSION_ID = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Widget state
  let isOpen = false
  const messages = []
  let isTyping = false
  let agentActive = false
  let agentName = ""

  // Create widget HTML
  function createWidget() {
    const widgetHTML = `
      <div id="kali-widget-container" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: system-ui, -apple-system, sans-serif;">
        <div id="kali-chat-window" style="display: none; width: 380px; height: 600px; background: white; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.15); flex-direction: column; overflow: hidden;">
          <div id="kali-chat-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 600; font-size: 16px;">Kuhlekt Assistant</div>
              <div id="kali-agent-status" style="font-size: 12px; opacity: 0.9; margin-top: 2px;">AI Assistant</div>
            </div>
            <button id="kali-close-btn" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center;">×</button>
          </div>
          <div id="kali-messages" style="flex: 1; overflow-y: auto; padding: 16px; background: #f7f7f7;"></div>
          <div id="kali-handoff-form" style="display: none; padding: 16px; background: white; border-top: 1px solid #e5e5e5;">
            <div style="font-weight: 600; margin-bottom: 12px;">Request Human Agent</div>
            <input id="kali-handoff-name" type="text" placeholder="Your Name" style="width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;" />
            <input id="kali-handoff-email" type="email" placeholder="Your Email" style="width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;" />
            <input id="kali-handoff-phone" type="tel" placeholder="Phone (optional)" style="width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;" />
            <div style="display: flex; gap: 8px;">
              <button id="kali-handoff-cancel" style="flex: 1; padding: 10px; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer;">Cancel</button>
              <button id="kali-handoff-submit" style="flex: 1; padding: 10px; border: none; background: #667eea; color: white; border-radius: 6px; cursor: pointer; font-weight: 600;">Submit</button>
            </div>
          </div>
          <div id="kali-input-container" style="padding: 16px; background: white; border-top: 1px solid #e5e5e5;">
            <div style="display: flex; gap: 8px;">
              <input id="kali-message-input" type="text" placeholder="Type your message..." style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 24px; outline: none;" />
              <button id="kali-send-btn" style="background: #667eea; color: white; border: none; width: 48px; height: 48px; border-radius: 50%; cursor: pointer; font-size: 20px;">→</button>
            </div>
            <button id="kali-handoff-btn" style="margin-top: 8px; width: 100%; padding: 8px; border: 1px solid #667eea; background: white; color: #667eea; border-radius: 6px; cursor: pointer; font-size: 13px;">Request Human Agent</button>
          </div>
        </div>
        <button id="kali-widget-btn" style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; color: white; font-size: 28px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center;">💬</button>
      </div>
    `

    document.body.insertAdjacentHTML("beforeend", widgetHTML)
    console.log("[Kali Widget] Widget created successfully")

    // Attach event listeners
    attachEventListeners()
  }

  function attachEventListeners() {
    const widgetBtn = document.getElementById("kali-widget-btn")
    const closeBtn = document.getElementById("kali-close-btn")
    const sendBtn = document.getElementById("kali-send-btn")
    const messageInput = document.getElementById("kali-message-input")
    const handoffBtn = document.getElementById("kali-handoff-btn")
    const handoffCancel = document.getElementById("kali-handoff-cancel")
    const handoffSubmit = document.getElementById("kali-handoff-submit")

    widgetBtn.addEventListener("click", toggleWidget)
    closeBtn.addEventListener("click", toggleWidget)
    sendBtn.addEventListener("click", sendMessage)
    messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage()
    })
    handoffBtn.addEventListener("click", showHandoffForm)
    handoffCancel.addEventListener("click", hideHandoffForm)
    handoffSubmit.addEventListener("click", submitHandoff)
  }

  function toggleWidget() {
    isOpen = !isOpen
    const chatWindow = document.getElementById("kali-chat-window")
    const widgetBtn = document.getElementById("kali-widget-btn")

    if (isOpen) {
      chatWindow.style.display = "flex"
      widgetBtn.style.display = "none"
      if (messages.length === 0) {
        addMessage("bot", "Hello! How can I help you today?")
      }
    } else {
      chatWindow.style.display = "none"
      widgetBtn.style.display = "flex"
    }
  }

  function addMessage(role, content) {
    const messagesContainer = document.getElementById("kali-messages")
    const messageDiv = document.createElement("div")
    messageDiv.style.cssText = `
      margin-bottom: 12px;
      display: flex;
      ${role === "user" ? "justify-content: flex-end;" : "justify-content: flex-start;"}
    `

    const bubble = document.createElement("div")
    bubble.style.cssText = `
      max-width: 70%;
      padding: 10px 14px;
      border-radius: 18px;
      ${
        role === "user"
          ? "background: #667eea; color: white;"
          : "background: white; color: #333; border: 1px solid #e5e5e5;"
      }
    `
    bubble.textContent = content

    messageDiv.appendChild(bubble)
    messagesContainer.appendChild(messageDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight

    messages.push({ role, content, timestamp: Date.now() })
  }

  function showTyping() {
    if (isTyping) return
    isTyping = true

    const messagesContainer = document.getElementById("kali-messages")
    const typingDiv = document.createElement("div")
    typingDiv.id = "kali-typing-indicator"
    typingDiv.style.cssText = "margin-bottom: 12px; display: flex; justify-content: flex-start;"
    typingDiv.innerHTML = `
      <div style="background: white; padding: 10px 14px; border-radius: 18px; border: 1px solid #e5e5e5;">
        <span style="animation: pulse 1.5s ease-in-out infinite;">●</span>
        <span style="animation: pulse 1.5s ease-in-out 0.2s infinite;">●</span>
        <span style="animation: pulse 1.5s ease-in-out 0.4s infinite;">●</span>
      </div>
    `
    messagesContainer.appendChild(typingDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  function hideTyping() {
    isTyping = false
    const typingIndicator = document.getElementById("kali-typing-indicator")
    if (typingIndicator) typingIndicator.remove()
  }

  async function sendMessage() {
    const input = document.getElementById("kali-message-input")
    const message = input.value.trim()

    if (!message) return

    addMessage("user", message)
    input.value = ""

    showTyping()

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          sessionId: SESSION_ID,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await response.json()
      hideTyping()

      if (data.agentActive) {
        agentActive = true
        agentName = data.agentName || "Agent"
        updateAgentStatus()
      }

      if (data.response) {
        addMessage("bot", data.response)
      } else if (agentActive) {
        addMessage("bot", `${agentName} will respond shortly...`)
        startPolling()
      }
    } catch (error) {
      hideTyping()
      console.error("[Kali Widget] Error sending message:", error)
      addMessage("bot", "Sorry, I encountered an error. Please try again.")
    }
  }

  function updateAgentStatus() {
    const statusEl = document.getElementById("kali-agent-status")
    if (agentActive) {
      statusEl.textContent = `Connected to ${agentName}`
    } else {
      statusEl.textContent = "AI Assistant"
    }
  }

  function showHandoffForm() {
    document.getElementById("kali-handoff-form").style.display = "block"
    document.getElementById("kali-input-container").style.display = "none"
  }

  function hideHandoffForm() {
    document.getElementById("kali-handoff-form").style.display = "none"
    document.getElementById("kali-input-container").style.display = "block"
  }

  async function submitHandoff() {
    const name = document.getElementById("kali-handoff-name").value.trim()
    const email = document.getElementById("kali-handoff-email").value.trim()
    const phone = document.getElementById("kali-handoff-phone").value.trim()

    if (!name || !email) {
      alert("Please provide your name and email")
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/chat/handoff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: SESSION_ID,
          userName: name,
          userEmail: email,
          phone,
          firstName: name.split(" ")[0],
          lastName: name.split(" ").slice(1).join(" "),
          reason: "User requested human assistance",
        }),
      })

      const data = await response.json()

      if (data.success) {
        hideHandoffForm()
        addMessage("bot", "Thank you! An agent will contact you shortly.")
        agentActive = true
        updateAgentStatus()
        startPolling()
      }
    } catch (error) {
      console.error("[Kali Widget] Error submitting handoff:", error)
      alert("Failed to submit handoff request. Please try again.")
    }
  }

  let pollingInterval
  function startPolling() {
    if (pollingInterval) return

    pollingInterval = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/api/messages?sessionId=${SESSION_ID}`)
        const data = await response.json()

        if (data.messages && data.messages.length > 0) {
          data.messages.forEach((msg) => {
            if (!messages.find((m) => m.timestamp === msg.timestamp)) {
              addMessage("bot", msg.content)
            }
          })
        }
      } catch (error) {
        console.error("[Kali Widget] Error polling messages:", error)
      }
    }, 3000)
  }

  // Initialize widget when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createWidget)
  } else {
    createWidget()
  }

  // Add CSS animation
  const style = document.createElement("style")
  style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }
  `
  document.head.appendChild(style)
})()
