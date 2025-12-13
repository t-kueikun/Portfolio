"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { ArrowUpRight } from "lucide-react"
import { projects as fallbackProjects, type Project } from "@/config/work"
import { loadProjects } from "@/lib/content-loaders"

export function Work() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [projectList, setProjectList] = useState<Project[]>(fallbackProjects)

  useEffect(() => {
    let mounted = true

    loadProjects()
      .then((data) => {
        if (mounted) setProjectList(data)
      })
      .catch(() => {
        /* fallback is already loaded */
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section id="work" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div
          ref={ref}
          className={`transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-sm font-medium text-muted-foreground mb-16 uppercase tracking-wider">Selected Work</h2>

          <div className="space-y-1">
            {projectList.map((project, index) => (
              <a
                key={project.id}
                href={project.link}
                className="group block glass-light hover:bg-accent/5 border-0 border-b border-border last:border-0 transition-all duration-300 p-8 md:p-12"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl md:text-3xl font-bold group-hover:text-accent transition-colors">
                        {project.title}
                      </h3>
                      <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>
                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-xs text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground md:text-right">{project.year}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
