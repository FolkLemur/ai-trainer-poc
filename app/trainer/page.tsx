"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/app-context"
import { AppShell } from "@/components/app-shell"
import { ChatScreen } from "@/components/chat-screen"

export default function TrainerPage() {
  const { isLoggedIn } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/")
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) return null

  return (
    <AppShell>
      <ChatScreen />
    </AppShell>
  )
}
