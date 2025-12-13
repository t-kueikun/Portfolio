"use client"

import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Navigation } from "@/components/navigation"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
    </main>
  )
}
