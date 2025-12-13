"use client"

import { Contact } from "@/components/contact"
import { Navigation } from "@/components/navigation"

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-32">
        <Contact />
      </div>
    </main>
  )
}
