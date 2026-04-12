"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { SwipeButton } from "@/components/swipe-button"
import { useApp } from "@/contexts/app-context"
import { useRouter } from "next/navigation"

export function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { setIsLoggedIn } = useApp()
  const router = useRouter()

  const handleLogin = () => {
    setIsLoggedIn(true)
    router.push("/trainer")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">trAIner</h1>
          <p className="text-muted-foreground">Your AI gym assistant</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-secondary border-0 rounded-lg text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-secondary border-0 rounded-lg text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <SwipeButton onSwipeComplete={handleLogin} label="Slide to login" />
      </div>
    </div>
  )
}
