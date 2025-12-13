"use client"

import { Travel } from "@/components/travel"
import { Navigation } from "@/components/navigation"

export default function TravelPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-32">
        <Travel />
      </div>
    </main>
  )
}
