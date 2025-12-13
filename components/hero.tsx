"use client"

import { useEffect, useState } from "react"
import { profile } from "@/config/profile"

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />

      {/* Liquid glass orb that follows cursor */}
      <div
        className="absolute w-96 h-96 glass rounded-full blur-3xl opacity-30 transition-all duration-1000 ease-out pointer-events-none"
        style={{
          left: `${mousePosition.x - 192}px`,
          top: `${mousePosition.y - 192}px`,
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto space-y-8">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-balance animate-fade-up">
          {profile.name}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {profile.role}
        </p>
        <p
          className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          {profile.description}
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground/30 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
