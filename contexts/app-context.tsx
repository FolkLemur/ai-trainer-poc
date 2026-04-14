"use client"

import { createContext, useContext, useState, ReactNode } from "react"

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
  setExercisesFromPlan: (data: any) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Exercise templates with default values
const exerciseTemplates: Record<string, { tip: string; breakTime: string; defaultSets: ExerciseSet[] }> = {
  "Bench Press": {
    tip: "Keep shoulder blades tight, focus on chest",
    breakTime: "1s/3s, 2min rest",
    defaultSets: [
      { reps: 12, weight: 30, targetReps: 12, targetWeight: 25 },
      { reps: 12, weight: 30, targetReps: 12, targetWeight: 30 },
      { reps: 12, weight: 30, targetReps: 12, targetWeight: 35 },
    ],
  },
  "Squat": {
    tip: "Keep your back straight, knees over toes",
    breakTime: "1s/3s, 2min rest",
    defaultSets: [
      { reps: 10, weight: 40, targetReps: 10, targetWeight: 35 },
      { reps: 10, weight: 40, targetReps: 10, targetWeight: 40 },
      { reps: 10, weight: 40, targetReps: 10, targetWeight: 45 },
    ],
  },
  "Deadlift": {
    tip: "Engage your core, lift with your legs",
    breakTime: "1s/3s, 3min rest",
    defaultSets: [
      { reps: 8, weight: 60, targetReps: 8, targetWeight: 55 },
      { reps: 8, weight: 60, targetReps: 8, targetWeight: 60 },
      { reps: 8, weight: 60, targetReps: 8, targetWeight: 65 },
    ],
  },
  "Shoulder Press": {
    tip: "Don't arch your back, controlled movement",
    breakTime: "1s/3s, 2min rest",
    defaultSets: [
      { reps: 12, weight: 15, targetReps: 12, targetWeight: 12.5 },
      { reps: 12, weight: 15, targetReps: 12, targetWeight: 15 },
      { reps: 12, weight: 15, targetReps: 12, targetWeight: 17.5 },
    ],
  },
  "Barbell Row": {
    tip: "Pull to your lower chest, squeeze shoulder blades",
    breakTime: "1s/3s, 2min rest",
    defaultSets: [
      { reps: 10, weight: 35, targetReps: 10, targetWeight: 30 },
      { reps: 10, weight: 35, targetReps: 10, targetWeight: 35 },
      { reps: 10, weight: 35, targetReps: 10, targetWeight: 40 },
    ],
  },
  "Pull-ups": {
    tip: "Full range of motion, controlled descent",
    breakTime: "1s/3s, 2min rest",
    defaultSets: [
      { reps: 8, weight: 0, targetReps: 8, targetWeight: 0 },
      { reps: 8, weight: 0, targetReps: 8, targetWeight: 0 },
      { reps: 8, weight: 0, targetReps: 8, targetWeight: 0 },
    ],
  },
  "Leg Press": {
    tip: "Don't lock your knees at the top",
    breakTime: "1s/3s, 2min rest",
    defaultSets: [
      { reps: 12, weight: 80, targetReps: 12, targetWeight: 70 },
      { reps: 12, weight: 80, targetReps: 12, targetWeight: 80 },
      { reps: 12, weight: 80, targetReps: 12, targetWeight: 90 },
    ],
  },
  "Bicep Curls": {
    tip: "Keep elbows stationary, control the weight",
    breakTime: "1s/3s, 90s rest",
    defaultSets: [
      { reps: 12, weight: 10, targetReps: 12, targetWeight: 8 },
      { reps: 12, weight: 10, targetReps: 12, targetWeight: 10 },
      { reps: 12, weight: 10, targetReps: 12, targetWeight: 12 },
    ],
  },
}

const createExercise = (name: string, id?: string): Exercise => {
  const template = exerciseTemplates[name]
  if (template) {
    return {
      id: id || Date.now().toString(),
      name,
      tip: template.tip,
      breakTime: template.breakTime,
      sets: [...template.defaultSets],
    }
  }
  // Empty exercise placeholder
  return {
    id: id || Date.now().toString(),
    name: "",
    tip: "Select an exercise",
    breakTime: "",
    sets: [
      { reps: 0, weight: 0, targetReps: 0, targetWeight: 0 },
      { reps: 0, weight: 0, targetReps: 0, targetWeight: 0 },
      { reps: 0, weight: 0, targetReps: 0, targetWeight: 0 },
    ],
  }
}

const initialExercises: Exercise[] = [
  createExercise("Bench Press", "1"),
  createExercise("Squat", "2"),
  createExercise("Deadlift", "3"),
  createExercise("Shoulder Press", "4"),
]

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
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const setExercisesFromPlan = (planData: any) => {
  if (!planData || !planData[0]) return

  const day = planData[0]

  const mapped = day.plan_exercises
    .sort((a: any, b: any) => a.order_index - b.order_index)
    .map((ex: any, index: number) => ({
      id: (index + 1).toString(),
      name: ex.exercises.name,
      tip: "",
      breakTime: `${ex.exercises.rest_time} min`,
      sets: Array.from({ length: ex.target_sets }).map(() => ({
        reps: 0,
        weight: 0,
        targetReps: ex.target_reps,
        targetWeight: 0,
      })),
    }))

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
      const newExercise = createExercise(exerciseName, prev[index]?.id || Date.now().toString())
      newExercises[index] = newExercise
      return newExercises
    })
  }

  const addEmptyExercise = () => {
    setExercises((prev) => [...prev, createExercise("")])
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
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

export const exerciseOptions = Object.keys(exerciseTemplates)
