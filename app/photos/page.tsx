"use client"

import { Photos } from "@/components/photos"
import { Navigation } from "@/components/navigation"

export default function PhotosPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-32">
        <Photos />
      </div>
    </main>
  )
}
