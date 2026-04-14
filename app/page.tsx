"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginScreen } from "@/components/login-screen"
import { useApp } from "@/contexts/app-context"
import { getFirstPlanDay } from "@/lib/api"

export default function Home() {
  const { isLoggedIn, setExercisesFromPlan } = useApp()
  const router = useRouter()

  useEffect(() => {
  if (isLoggedIn) {
    getFirstPlanDay().then((data) => {
      setExercisesFromPlan(data)
    })
  }
}, [isLoggedIn])

  if (!isLoggedIn) return <LoginScreen />

return null
}
