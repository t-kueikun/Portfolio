"use client"

import type { SVGProps } from "react"
import { useInView } from "react-intersection-observer"
import { ArrowUpRight, Mail, Github, Linkedin } from "lucide-react"
import { LiquidGlass } from "@/components/liquid-glass"

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 512 512" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
    </svg>
  )
}

export function Contact() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div
          ref={ref}
          className={`transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-sm font-medium text-muted-foreground mb-16 uppercase tracking-wider">Get In Touch</h2>

          <div className="space-y-16">
            <p className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-balance max-w-4xl">
              新しいプロジェクトや協業の機会について、お気軽にご連絡ください。
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <a
                href="mailto:your.tokueikun@gmail.com"
                className="group glass-light hover:bg-accent/5 p-8 transition-all duration-300 flex flex-col gap-4"
              >
                <Mail className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
                <div className="flex items-center gap-2">
                  <span className="text-sm">Email</span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
              </a>

              <a
                href="https://github.com/t-kueikun"
                target="_blank"
                rel="noopener noreferrer"
                className="group glass-light hover:bg-accent/5 p-8 transition-all duration-300 flex flex-col gap-4"
              >
                <Github className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
                <div className="flex items-center gap-2">
                  <span className="text-sm">GitHub</span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group glass-light hover:bg-accent/5 p-8 transition-all duration-300 flex flex-col gap-4"
              >
                <Linkedin className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
                <div className="flex items-center gap-2">
                  <span className="text-sm">LinkedIn</span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
              </a>

              <a
                href="https://x.com/tokueikun_apple"
                target="_blank"
                rel="noopener noreferrer"
                className="group glass-light hover:bg-accent/5 p-8 transition-all duration-300 flex flex-col gap-4"
              >
                <XIcon className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
                <div className="flex items-center gap-2">
                  <span className="text-sm">x</span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-32">
        <div className="rounded-3xl border border-white/20 bg-white/12 p-4 backdrop-blur-3xl shadow-[0_30px_120px_-70px_rgba(0,0,0,0.9)]">
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5">
            <LiquidGlass height={260} src="/modern-tokyo-cityscape-night.jpg" />
            {/* refracted caustics and streaks to make the glass pop */}
            <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-80 [mask-image:radial-gradient(80%_95%_at_50%_12%,black,transparent)] bg-[conic-gradient(from_110deg_at_50%_25%,rgba(255,255,255,0.9),rgba(255,255,255,0),rgba(255,255,255,0.95),rgba(255,255,255,0))] blur-xl" />
            <div className="pointer-events-none absolute inset-0 opacity-45 bg-[linear-gradient(115deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_16%,rgba(255,255,255,0.6)_32%,rgba(255,255,255,0)_48%,rgba(255,255,255,0.4)_64%,rgba(255,255,255,0)_80%)] blur-sm" />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/25 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass-light px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] text-white/90">
                Crafted with care · 2025
              </div>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
