"use client"

import { ChevronDown, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"

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
      {/* Exercise Name Dropdown with Chat Button */}
      <div className="relative mb-4 flex items-center">
        {/* Ask AI / Go to Chat Button */}
        <button
          onClick={() => router.push("/trainer")}
          className="p-2 rounded-lg hover:bg-secondary transition-colors mr-2"
          aria-label="Go to AI chat"
        >
          <MessageCircle className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Exercise Dropdown */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-lg font-semibold"
        >
          {isEmptySlot ? "Select Exercise" : exercise.name}
          <ChevronDown className={`w-5 h-5 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
        </button>
        
        {/* Spacer for visual balance */}
        <div className="w-9" />
        
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 bg-secondary rounded-lg shadow-lg z-10 mt-1 max-h-48 overflow-y-auto">
            {exerciseOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleSelectExercise(option)}
                className={`w-full px-4 py-3 text-left hover:bg-background/20 transition-colors ${
                  option === exercise.name ? "bg-primary/20 text-primary" : ""
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Exercise Tip */}
      <p className="text-center text-muted-foreground text-sm mb-1">{exercise.tip}</p>
      
      {/* Break Time */}
      {exercise.breakTime && (
        <p className="text-center text-muted-foreground text-xs mb-6">{exercise.breakTime}</p>
      )}

      {/* Table Header */}
      <div className="grid grid-cols-[0.5fr_1fr_1fr] gap-4 mb-4 text-xs text-muted-foreground uppercase tracking-wider">
        <div className="text-center">Set</div>
        <div className="text-center">Reps</div>
        <div className="text-center">Weight</div>
      </div>

      {/* Sets with individual targets */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {exercise.sets.map((set, index) => (
          <SetRow
            key={index}
            setNumber={index + 1}
            reps={set.reps}
            weight={set.weight}
            targetReps={set.targetReps}
            targetWeight={set.targetWeight}
            onRepsChange={(value) => updateExercise(exercise.id, index, "reps", value)}
            onWeightChange={(value) => updateExercise(exercise.id, index, "weight", value)}
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
}

function SetRow({ setNumber, reps, weight, targetReps, targetWeight, onRepsChange, onWeightChange }: SetRowProps) {
  return (
    <div className="space-y-1">
      {/* Target row for this set */}
      <div className="grid grid-cols-[0.5fr_1fr_1fr] gap-4 text-[20px] text-muted-foreground">
        <div className="text-center"></div>
        <div className="text-center">{targetReps}</div>
        <div className="text-center">{targetWeight}kg</div>
      </div>
      
      {/* Actual values row */}
      <div className="grid grid-cols-[0.5fr_1fr_1fr] gap-4 items-center pb-3">
        <div className="text-center text-3xl font-bold">{setNumber}</div>
        <SwipeValue value={reps} step={1} onChange={onRepsChange} />
        <SwipeValue value={weight} step={1} onChange={onWeightChange} />
      </div>
    </div>
  )
}

interface SwipeValueProps {
  value: number
  step: number
  onChange: (value: number) => void
}

function SwipeValue({ value, step, onChange }: SwipeValueProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef(0)
  const startValueRef = useRef(value)
  const [isDragging, setIsDragging] = useState(false)
  const [showBubble, setShowBubble] = useState(false)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const formatValue = (val: number) => {
    return Number.isInteger(val) ? val.toString() : val.toFixed(1)
  }

  const handleStart = (clientX: number) => {
    startXRef.current = clientX
    startValueRef.current = value
    setIsDragging(true)
    setShowBubble(true)
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
  }

  const handleMove = (clientX: number) => {
    const diff = startXRef.current - clientX // Inverted: swipe left = increase
    const steps = Math.round(diff / 25) // 25px per step
    const newValue = Math.max(0, startValueRef.current + steps * step)
    // Round to avoid floating point issues
    const roundedValue = Math.round(newValue / step) * step
    onChange(roundedValue)
  }

  const handleEnd = () => {
    setIsDragging(false)
    // Delay hiding the bubble by 0.7s
    hideTimeoutRef.current = setTimeout(() => {
      setShowBubble(false)
    }, 700)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX)
    
    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX)
    }
    
    const handleMouseUp = () => {
      handleEnd()
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
    
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  return (
    <div className="relative">
      {/* Floating bubble showing value while dragging */}
      {isDragging && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-lg font-bold shadow-lg z-20 whitespace-nowrap">
          {formatValue(value)}
          {/* Arrow pointing down */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-primary" />
        </div>
      )}
      
      <div
        ref={containerRef}
        className={`flex items-center justify-center cursor-ew-resize select-none touch-none h-10 ${
          isDragging ? "scale-105" : ""
        } transition-transform`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {/* Current value (prominent, bigger) */}
        <span className="text-[48px] font-bold">
          {formatValue(value)}
        </span>
      </div>
    </div>
  )
}
