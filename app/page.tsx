"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginScreen } from "@/components/login-screen"
import { useApp } from "@/contexts/app-context"

export default function Home() {
  const { isLoggedIn } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/trainer")
    }
  }, [isLoggedIn, router])

  return <LoginScreen />
}
