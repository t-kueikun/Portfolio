"use client"

import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Github } from "lucide-react"

const projects = [
  {
    title: "Project One",
    description: "モダンなEコマースプラットフォーム。Next.jsとStripeを使用した決済機能を実装。",
    tags: ["Next.js", "TypeScript", "Stripe"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    title: "Project Two",
    description: "リアルタイムチャットアプリケーション。WebSocketとSupabaseでスケーラブルな構成。",
    tags: ["React", "Supabase", "WebSocket"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    title: "Project Three",
    description: "タスク管理ツール。直感的なUIとスムーズなアニメーションが特徴。",
    tags: ["Next.js", "Framer Motion", "PostgreSQL"],
    github: "https://github.com",
    demo: "https://example.com",
  },
]

export function Projects() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="projects" className="py-32 px-6 bg-accent/20">
      <div className="max-w-6xl mx-auto">
        <div
          ref={ref}
          className={`transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Projects</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <Card
                key={index}
                className="group hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{project.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Demo
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
