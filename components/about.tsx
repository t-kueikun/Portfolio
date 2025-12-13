"use client"

import { useInView } from "react-intersection-observer"
import { profile } from "@/config/profile"

export function About() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="about" className="py-32 px-6 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <div
          ref={ref}
          className={`transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-sm font-medium text-muted-foreground mb-16 uppercase tracking-wider">About</h2>

          <div className="space-y-8">
            <p className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-balance">
              {profile.about.intro}
            </p>

            <div className="pt-12">
              <h3 className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">Expertise</h3>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-3 text-sm">
                {profile.about.expertise.map((skill, index) => (
                  <p key={index}>{skill}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
