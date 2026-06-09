"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/app-context"
import { ExerciseCard } from "@/components/exercise-card"
import { SwipeButton } from "@/components/swipe-button"
import { useState } from "react"

export function TrainingScreen() {
  const router = useRouter()
  const { exercises, currentExerciseIndex, setCurrentExerciseIndex, addEmptyExercise } = useApp()
  const [showFinishMessage, setShowFinishMessage] = useState(false)

  const goToPrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentExerciseIndex === exercises.length - 1) {
      // At the last exercise, add an empty slot
      addEmptyExercise()
    }
    setCurrentExerciseIndex(currentExerciseIndex + 1)
  }

  const handleFinishWorkout = () => {
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
      {/* Exercise Card Area */}
      <div className="flex-1 overflow-hidden py-4">
        <ExerciseCard exerciseIndex={currentExerciseIndex} />
      </div>

      {/* Bottom Section */}
      <div className="border-t border-border p-4">
        {/* Navigation Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={goToPrevious}
            disabled={currentExerciseIndex === 0}
            className="p-3 rounded-lg hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous exercise"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex-1">
            <SwipeButton onSwipeComplete={handleFinishWorkout} label=">>>" className="h-12" />
          </div>

          <button
            onClick={goToNext}
            className="p-3 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Next exercise"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}
