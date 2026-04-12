"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/app-context"
import { AppShell } from "@/components/app-shell"
import { TrainingScreen } from "@/components/training-screen"

export default function TrainingPage() {
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
      <TrainingScreen />
    </AppShell>
  )
}
