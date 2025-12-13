"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-4">
        <div
          className={`relative overflow-hidden rounded-full border backdrop-blur-xl ${
            scrolled
              ? "border-white/60 bg-white/12 shadow-[0_14px_60px_-45px_rgba(0,0,0,0.5)]"
              : "border-white/40 bg-white/6 shadow-[0_10px_40px_-40px_rgba(0,0,0,0.35)]"
          }`}
          style={{ height: 64, WebkitBackdropFilter: "blur(10px)" }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-full mix-blend-screen opacity-60 [mask-image:radial-gradient(130%_160%_at_0%_50%,black,transparent),radial-gradient(130%_160%_at_100%_50%,black,transparent)] bg-[radial-gradient(circle_at_0%_50%,rgba(255,255,255,0.85),rgba(255,255,255,0)_55%),radial-gradient(circle_at_100%_50%,rgba(255,255,255,0.85),rgba(255,255,255,0)_55%)] blur-md" />
          <div className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-b from-white/10 via-white/4 to-transparent" />

          <div className="relative flex h-full items-center justify-between px-6">
            <Link href="/" className="text-sm font-medium hover:opacity-80 transition-opacity">
              Portfolio
            </Link>

            <div className="flex items-center gap-7">
              <Link
                href="/work"
                className={`text-sm transition-colors ${
                  isActive("/work") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Work
              </Link>
              <Link
                href="/photos"
                className={`text-sm transition-colors ${
                  isActive("/photos") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Photos
              </Link>
              <Link
                href="/travel"
                className={`text-sm transition-colors ${
                  isActive("/travel") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Travel
              </Link>
              <Link
                href="/contact"
                className={`text-sm transition-colors ${
                  isActive("/contact") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
