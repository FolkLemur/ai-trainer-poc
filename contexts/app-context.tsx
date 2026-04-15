"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { getLastSetsForExercise } from "@/lib/getLastWorkout"
import { getNextWeight } from "@/lib/getNextWeight"
import { getExercises } from "@/lib/getExercises"

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
  updateExercise: (exerciseId: string, setIndex: number, field: "reps" | "weight", value: number) => void
  replaceExerciseAtIndex: (index: number, exerciseName: string) => void
  addEmptyExercise: () => void
  currentExerciseIndex: number
  setCurrentExerciseIndex: (index: number) => void
  setExercisesFromPlan: (data: any) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hey! I'm your AI trainer. How can I help you today?",
    },
  ])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)

  const setExercisesFromPlan = async (planData: any) => {
    if (!planData || !planData[0]) return

    const day = planData[0]

    const dbExercises = await getExercises() || []

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

          if (exerciseId) {
            const lastSets = await getLastSetsForExercise(exerciseId)
            targetWeight = getNextWeight(lastSets)
          }

          return {
            id: (index + 1).toString(),
            name: exerciseName,
            tip: "",
            breakTime: `${ex.exercises.rest_time} min`,
            sets: Array.from({ length: ex.target_sets }).map(() => ({
              reps: 0,
              weight: 0,
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

  const updateExercise = (
    exerciseId: string,
    setIndex: number,
    field: "reps" | "weight",
    value: number
  ) => {
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.id === exerciseId) {
          const newSets = [...exercise.sets]
          newSets[setIndex] = { ...newSets[setIndex], [field]: value }
          return { ...exercise, sets: newSets }
        }
        return exercise
      })
    )
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
        replaceExerciseAtIndex,
        addEmptyExercise,
        currentExerciseIndex,
        setCurrentExerciseIndex,
        setExercisesFromPlan,
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
