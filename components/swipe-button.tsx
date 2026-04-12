"use client"

import { useState, useRef } from "react"
import { ChevronRight } from "lucide-react"

interface SwipeButtonProps {
  onSwipeComplete: () => void
  label: string
  className?: string
}

export function SwipeButton({ onSwipeComplete, label, className = "" }: SwipeButtonProps) {
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef(0)

  const maxDrag = containerRef.current ? containerRef.current.offsetWidth - 56 : 200

  const handleStart = (clientX: number) => {
    setIsDragging(true)
    startXRef.current = clientX - dragX
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return
    const newX = Math.max(0, Math.min(clientX - startXRef.current, maxDrag))
    setDragX(newX)
  }

  const handleEnd = () => {
    setIsDragging(false)
    if (dragX > maxDrag * 0.8) {
      onSwipeComplete()
    }
    setDragX(0)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleEnd()
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

  return (
    <div
      ref={containerRef}
      className={`relative h-14 bg-secondary rounded-full overflow-hidden select-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-muted-foreground font-medium pl-12">{label}</span>
      </div>
      
      <div
        className="absolute top-1 left-1 bottom-1 w-12 bg-foreground rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform"
        style={{ transform: `translateX(${dragX}px)` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <ChevronRight className="w-6 h-6 text-background" />
        <ChevronRight className="w-6 h-6 text-background -ml-4" />
        <ChevronRight className="w-6 h-6 text-background -ml-4" />
      </div>
    </div>
  )
}
