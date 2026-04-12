"use client"

import { Menu } from "lucide-react"
import { useApp } from "@/contexts/app-context"

export function Header() {
  const { setIsSideNavOpen } = useApp()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-background border-b border-border">
      <button
        onClick={() => setIsSideNavOpen(true)}
        className="p-2 rounded-lg hover:bg-secondary transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>
      
      <h1 className="text-xl font-semibold tracking-tight">trAIner</h1>
      
      <div className="w-10 h-10 rounded-full border-2 border-foreground/30 flex items-center justify-center">
        <span className="sr-only">User profile</span>
      </div>
    </header>
  )
}
