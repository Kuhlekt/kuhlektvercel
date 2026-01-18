'use client';

import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, input: chatInput, setInput: setChatInput, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div className="flex flex-col justify-end min-h-full space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
              <div>
                <h2 className="text-2xl font-bold mb-2">Chat Assistant</h2>
                <p>Start a conversation by typing a message below.</p>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground px-4 py-2 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !chatInput.trim()}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
