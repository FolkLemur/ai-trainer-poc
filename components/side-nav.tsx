"use client"

import { X, MessageSquare, Dumbbell } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function SideNav() {
  const { isSideNavOpen, setIsSideNavOpen } = useApp()
  const pathname = usePathname()

  const navItems = [
    { href: "/trainer", label: "Trainer", icon: MessageSquare },
    { href: "/training", label: "Training", icon: Dumbbell },
  ]

  return (
    <>
      {/* Overlay */}
      {isSideNavOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsSideNavOpen(false)}
        />
      )}

      {/* Side Navigation */}
      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-background border-r border-border z-50 transform transition-transform duration-300 ease-in-out ${
          isSideNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={() => setIsSideNavOpen(false)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSideNavOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-secondary text-foreground"
                    : "hover:bg-secondary/50 text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
