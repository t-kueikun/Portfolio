"use client"

import { Work } from "@/components/work"
import { Navigation } from "@/components/navigation"

export default function WorkPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-32">
        <Work />
      </div>
    </main>
  )
}
