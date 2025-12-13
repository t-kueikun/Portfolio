"use client"

import type { SVGProps } from "react"
import { useInView } from "react-intersection-observer"
import { ArrowUpRight, Mail, Github } from "lucide-react"

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
            <p className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-balance max-w-4xl space-y-2">
              <span className="block">新しいプロジェクトや協業の機会について、</span>
              <span className="block">お気軽にご連絡ください。</span>
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

    </section>
  )
}
