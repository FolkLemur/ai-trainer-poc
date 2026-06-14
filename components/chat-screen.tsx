"use client"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { supabase } from "@/lib/supabase"

export function ChatScreen() {
  const [input, setInput] = useState("")
  const { messages, addMessage, setMessages} = useApp()
  console.log("MESSAGES:", messages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
  async function loadChatMenu() {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data: userProfile } = await supabase
      .from("users")
      .select("active_plan_id")
      .eq("id", user.id)
      .single()

    if (userProfile?.active_plan_id) {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: "I've loaded the next day from your active training plan.",
          options: [
            "Train",
            "Change Day",
            "Free Workout",
            "Ready Workouts",
            "Edit Plan",
          ],
        },
      ])
    } else {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: "You don't have an active training plan.",
          options: [
            "Create / Select Plan",
            "Free Workout",
            "Ready Workouts",
          ],
        },
      ])
    }
  }

  loadChatMenu()
}, [])

  const handleSend = () => {
    if (!input.trim()) return

    addMessage({ role: "user", content: input })
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      addMessage({
        role: "assistant",
        content: "That's a great question! Based on your workout history, I recommend focusing on compound movements today. Would you like me to suggest a routine?",
      })
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] pt-16">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
  <div
    key={message.id}
    className={`flex flex-col ${
      message.role === "user" ? "items-end" : "items-start"
    }`}
  >
    <div
      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
        message.role === "user"
          ? "bg-foreground text-background rounded-br-md"
          : "bg-secondary text-foreground rounded-bl-md"
      }`}
    >
      <p className="text-sm leading-relaxed">{message.content}</p>
    </div>

    {message.options && (
      <div className="flex flex-wrap gap-2 mt-2">
        {message.options.map((option) => (
          <button
            key={option}
            onClick={() =>
            addMessage({
              role: "user",
              content: option,
            })
          }
            className="px-3 py-2 rounded-full bg-secondary text-sm hover:bg-secondary/80"
          >
            {option}
          </button>
        ))}
      </div>
    )}
  </div>
))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="..."
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
          />
          <button
            onClick={handleSend}
            className="p-2 rounded-full hover:bg-background/10 transition-colors"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
