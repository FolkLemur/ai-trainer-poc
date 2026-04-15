"use client"

import { ChevronDown, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import { useApp } from "@/contexts/app-context"

interface ExerciseCardProps {
  exerciseIndex: number
}

export function ExerciseCard({ exerciseIndex }: ExerciseCardProps) {
  const router = useRouter()
  const { exercises, updateExercise, replaceExerciseAtIndex } = useApp()
  const exercise = exercises[exerciseIndex]
  const [showDropdown, setShowDropdown] = useState(false)

  if (!exercise) return null

  const handleSelectExercise = (option: string) => {
    replaceExerciseAtIndex(exerciseIndex, option)
    setShowDropdown(false)
  }

  const isEmptySlot = exercise.name === ""

  return (
    <div className="flex flex-col h-full px-4">
      <div className="relative mb-4 flex items-center">
        <button
          onClick={() => router.push("/trainer")}
          className="p-2 rounded-lg hover:bg-secondary transition-colors mr-2"
        >
          <MessageCircle className="w-5 h-5 text-muted-foreground" />
        </button>

        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-lg font-semibold"
        >
          {isEmptySlot ? "Select Exercise" : exercise.name}
          <ChevronDown className={`w-5 h-5 ${showDropdown ? "rotate-180" : ""}`} />
        </button>

        <div className="w-9" />

        {showDropdown && (
          <div className="absolute top-full left-0 right-0 bg-secondary rounded-lg shadow-lg z-10 mt-1">
            {["Bench Press", "Squat", "Deadlift", "Shoulder Press"].map((option) => (
              <button
                key={option}
                onClick={() => handleSelectExercise(option)}
                className="w-full px-4 py-3 text-left hover:bg-background/20"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-center text-muted-foreground text-sm">{exercise.tip}</p>

      {exercise.breakTime && (
        <p className="text-center text-muted-foreground text-xs mb-6">
          {exercise.breakTime}
        </p>
      )}

      <div className="grid grid-cols-[0.5fr_1fr_1fr] gap-4 mb-4 text-xs text-muted-foreground uppercase">
        <div className="text-center">Set</div>
        <div className="text-center">Reps</div>
        <div className="text-center">Weight</div>
      </div>

      <div className="flex-1 space-y-2">
        {exercise.sets.map((set, index) => (
          <SetRow
            key={index}
            setNumber={index + 1}
            reps={set.reps}
            weight={set.weight}
            targetReps={set.targetReps}
            targetWeight={set.targetWeight}
            onRepsChange={(v) => updateExercise(exercise.id, index, "reps", v)}
            onWeightChange={(v) => updateExercise(exercise.id, index, "weight", v)}
            onTargetRepsChange={(v) => updateExercise(exercise.id, index, "targetReps", v)}
            onTargetWeightChange={(v) => updateExercise(exercise.id, index, "targetWeight", v)}
          />
        ))}
      </div>
    </div>
  )
}

interface SetRowProps {
  setNumber: number
  reps: number
  weight: number
  targetReps: number
  targetWeight: number
  onRepsChange: (value: number) => void
  onWeightChange: (value: number) => void
  onTargetRepsChange: (value: number) => void
  onTargetWeightChange: (value: number) => void
}

function SetRow({
  setNumber,
  reps,
  weight,
  targetReps,
  targetWeight,
  onRepsChange,
  onWeightChange,
  onTargetRepsChange,
  onTargetWeightChange,
}: SetRowProps) {
  const [editReps, setEditReps] = useState(false)
  const [editWeight, setEditWeight] = useState(false)
  const [tempReps, setTempReps] = useState(targetReps)
  const [tempWeight, setTempWeight] = useState(targetWeight)

  return (
    <div className="space-y-1">
      {/* TARGET */}
      <div className="grid grid-cols-[0.5fr_1fr_1fr] gap-4 text-sm text-muted-foreground">
        <div></div>

        <div className="text-center">
          {editReps ? (
            <input
              type="number"
              value={tempReps}
              onChange={(e) => setTempReps(Number(e.target.value))}
              onBlur={() => {
                onTargetRepsChange(tempReps)
                setEditReps(false)
              }}
              autoFocus
              className="w-14 text-center border-b bg-transparent"
            />
          ) : (
            <span onClick={() => setEditReps(true)}>{targetReps}</span>
          )}
        </div>

        <div className="text-center">
          {editWeight ? (
            <input
              type="number"
              step="0.5"
              value={tempWeight}
              onChange={(e) => setTempWeight(Number(e.target.value))}
              onBlur={() => {
                onTargetWeightChange(tempWeight)
                setEditWeight(false)
              }}
              autoFocus
              className="w-16 text-center border-b bg-transparent"
            />
          ) : (
            <span onClick={() => setEditWeight(true)}>
              {targetWeight}kg
            </span>
          )}
        </div>
      </div>

      {/* ACTUAL */}
      <div className="grid grid-cols-[0.5fr_1fr_1fr] gap-4 items-center pb-3">
        <div className="text-center text-2xl font-bold">{setNumber}</div>
        <SwipeValue value={reps} step={1} onChange={onRepsChange} />
        <SwipeValue value={weight} step={0.5} onChange={onWeightChange} />
      </div>
    </div>
  )
}

function SwipeValue({ value, step, onChange }: any) {
  const startX = useRef(0)
  const startVal = useRef(value)
  const [drag, setDrag] = useState(false)

  const move = (x: number) => {
    const diff = startX.current - x
    const steps = Math.round(diff / 25)
    const val = Math.max(0, startVal.current + steps * step)
    onChange(Math.round(val / step) * step)
  }

  return (
    <div
      className="text-[40px] font-bold text-center cursor-ew-resize"
      onMouseDown={(e) => {
        startX.current = e.clientX
        startVal.current = value
        setDrag(true)

        const moveHandler = (e: any) => move(e.clientX)
        const up = () => {
          setDrag(false)
          window.removeEventListener("mousemove", moveHandler)
          window.removeEventListener("mouseup", up)
        }

        window.addEventListener("mousemove", moveHandler)
        window.addEventListener("mouseup", up)
      }}
    >
      {value}
    </div>
  )
}
