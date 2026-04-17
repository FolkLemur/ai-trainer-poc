"use client"

import { saveWorkout } from "@/lib/saveWorkout"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/app-context"
import { ExerciseCard } from "@/components/exercise-card"
import { SwipeButton } from "@/components/swipe-button"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function TrainingScreen() {
  const router = useRouter()
  const {
    exercises,
    currentExerciseIndex,
    setCurrentExerciseIndex,
    addEmptyExercise,
    selectedPlanDayId,
    setExercisesFromPlan,
    setPlanDays,
    clearExercises
  } = useApp()

  const [showFinishMessage, setShowFinishMessage] = useState(false)

  useEffect(() => {
    async function loadPlan() {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      console.log("CURRENT USER:", user)

      if (!user) {
        console.log("NO USER")
        return
      }

      const { data: userProfile, error: userError } = await supabase
        .from("users")
        .select("active_plan_id")
        .eq("id", user.id)
        .single()

      if (userError) {
        console.error("USER PROFILE ERROR:", userError)
        return
      }

      if (!userProfile?.active_plan_id) {
      console.log("NO ACTIVE PLAN")
    
      setPlanDays([])
      clearExercises() // 🔥 to jest właściwy reset
      return
      }

      const { data: planDays, error: planError } = await supabase
        .from("plan_days")
        .select(`
          *,
          plan_exercises (
            *,
            exercises (*)
          )
        `)
        .eq("plan_id", userProfile.active_plan_id)
        .order("order_index", { ascending: true })

      if (planError) {
        console.error("PLAN LOAD ERROR:", planError)
        return
      }

      console.log("PLAN DATA:", planDays)

      setPlanDays(planDays)
      await setExercisesFromPlan(planDays)
    }

    loadPlan()
  }, [])

  const goToPrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentExerciseIndex === exercises.length - 1) {
      addEmptyExercise()
    }
    setCurrentExerciseIndex(currentExerciseIndex + 1)
  }

  const handleFinishWorkout = async () => {
    await saveWorkout(exercises, selectedPlanDayId)
    console.log("SELECTED PLAN DAY:", selectedPlanDayId)

    setShowFinishMessage(true)

    setTimeout(() => {
      router.push("/trainer")
    }, 1500)
  }

  if (showFinishMessage) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] pt-16 items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Workout Complete!</h2>
          <p className="text-muted-foreground">Great job! Redirecting to chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] pt-16">
      <div className="flex-1 overflow-hidden py-4">
        <ExerciseCard exerciseIndex={currentExerciseIndex} />
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPrevious}
            disabled={currentExerciseIndex === 0}
            className="p-3 rounded-lg hover:bg-secondary disabled:opacity-30"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex-1">
            <SwipeButton onSwipeComplete={handleFinishWorkout} label=">>>" className="h-12" />
          </div>

          <button
            onClick={goToNext}
            className="p-3 rounded-lg hover:bg-secondary"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}
