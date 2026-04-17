"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { getLastSetsForExercise } from "@/lib/getLastWorkout"
import { getNextWeight } from "@/lib/getNextWeight"
import { getExercises } from "@/lib/getExercises"
import { getLastWorkoutSession } from "@/lib/getLastWorkoutSession"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ExerciseSet {
  reps: number
  weight: number
  targetReps: number
  targetWeight: number
}

interface Exercise {
  id: string
  name: string
  tip: string
  breakTime: string
  sets: ExerciseSet[]
}

interface AppContextType {
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
  isSideNavOpen: boolean
  setIsSideNavOpen: (value: boolean) => void
  messages: Message[]
  addMessage: (message: Omit<Message, "id">) => void
  exercises: Exercise[]
  updateExercise: (
    exerciseId: string,
    setIndex: number,
    field: "reps" | "weight" | "targetReps" | "targetWeight",
    value: number
  ) => void
  replaceExerciseAtIndex: (index: number, exerciseName: string) => void
  addEmptyExercise: () => void
  currentExerciseIndex: number
  setCurrentExerciseIndex: (index: number) => void
  setExercisesFromPlan: (data: any) => Promise<void>
  planDays: any[]
  setPlanDays: (days: any[]) => void
  selectedPlanDayId: string | null
  setSelectedPlanDayId: (id: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)
  const [planDays, setPlanDays] = useState<any[]>([])
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hey! I'm your AI trainer. How can I help you today?",
    },
  ])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selectedPlanDayId, setSelectedPlanDayId] = useState<string | null>(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)

const setExercisesFromPlan = async (planData: any) => {
  if (!planData || !planData[0]) return

  // 🔥 1. wybierz dzień NAJPIERW
  let day = planData[0]

  const lastSession = await getLastWorkoutSession()
  console.log("LAST SESSION:", lastSession)

  if (lastSession?.plan_day_id) {
    const currentIndex = planData.findIndex(
      (d: any) => d.id === lastSession.plan_day_id
    )
    console.log(
  "PLAN DAYS IDS:",
  planData.map((d: any) => d.id)
)

console.log("LAST PLAN DAY:", lastSession.plan_day_id)

    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % planData.length
      day = planData[nextIndex]
    }
  }

  setSelectedPlanDayId(day.id)

  // 🔥 2. dopiero TERAZ robimy mapped
  const dbExercises = (await getExercises()) || []

  const exerciseMap = Object.fromEntries(
    dbExercises.map((e: any) => [e.name, e.id])
  )

  const mapped = await Promise.all(
    day.plan_exercises
      .sort((a: any, b: any) => a.order_index - b.order_index)
      .map(async (ex: any, index: number) => {
        const exerciseName = ex.exercises.name
        const exerciseId = exerciseMap[exerciseName]

        let targetWeight = 0
        let lastSets: any[] = []

        if (exerciseId) {
          lastSets = await getLastSetsForExercise(exerciseId)
          targetWeight = getNextWeight(lastSets)
        }

        return {
          id: (index + 1).toString(),
          name: exerciseName,
          tip: "",
          breakTime: `${ex.exercises.rest_time} min`,
          sets: Array.from({ length: ex.target_sets }).map((_, i) => ({
            reps: lastSets[i]?.actual_reps ?? 0,
            weight: lastSets[i]?.actual_weight ?? 0,
            targetReps: ex.target_reps,
            targetWeight,
          })),
        }
      })
  )

  setExercises(mapped)
}

  const addMessage = (message: Omit<Message, "id">) => {
    const newMessage = { ...message, id: Date.now().toString() }
    setMessages((prev) => [...prev, newMessage])
  }

  // 🔥 KLUCZOWA ZMIANA TUTAJ
  const updateExercise = (
    exerciseId: string,
    setIndex: number,
    field: "reps" | "weight" | "targetReps" | "targetWeight",
    value: number
  ) => {
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.id === exerciseId) {
          const newSets = [...exercise.sets]
          newSets[setIndex] = {
            ...newSets[setIndex],
            [field]: value,
          }
          return { ...exercise, sets: newSets }
        }
        return exercise
      })
    )
  }

  const clearExercises = () => {
  setExercises([])
  }
  
  const replaceExerciseAtIndex = (index: number, exerciseName: string) => {
    setExercises((prev) => {
      const newExercises = [...prev]
      newExercises[index] = {
        id: Date.now().toString(),
        name: exerciseName,
        tip: "",
        breakTime: "",
        sets: [
          { reps: 0, weight: 0, targetReps: 0, targetWeight: 0 },
          { reps: 0, weight: 0, targetReps: 0, targetWeight: 0 },
          { reps: 0, weight: 0, targetReps: 0, targetWeight: 0 },
        ],
      }
      return newExercises
    })
  }
  
  const addEmptyExercise = () => {
    setExercises((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        tip: "",
        breakTime: "",
        sets: [
          { reps: 0, weight: 0, targetReps: 0, targetWeight: 0 },
          { reps: 0, weight: 0, targetReps: 0, targetWeight: 0 },
          { reps: 0, weight: 0, targetReps: 0, targetWeight: 0 },
        ],
      },
    ])
  }

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isSideNavOpen,
        setIsSideNavOpen,
        messages,
        addMessage,
        exercises,
        updateExercise,
        clearExercises,
        replaceExerciseAtIndex,
        addEmptyExercise,
        currentExerciseIndex,
        setCurrentExerciseIndex,
        setExercisesFromPlan,
        selectedPlanDayId,
        setSelectedPlanDayId,
        planDays,
        setPlanDays,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
