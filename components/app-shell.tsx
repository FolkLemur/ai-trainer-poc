"use client"

import { Header } from "@/components/header"
import { SideNav } from "@/components/side-nav"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SideNav />
      <main>{children}</main>
    </div>
  )
}
