export interface Project {
  id: string
  title: string
  description: string
  year: string
  tags: string[]
  link: string
  order?: number
}

export const projects: Project[] = [
  {
    id: "1",
    title: "SS-Timer",
    description: "スポーツスタッキング専用のタイマーアプリ。",
    year: "2025",
    tags: ["React", "Vite", "Firebase", "Vercel"],
    link: "https://ss-timer.vercel.app/",
  },
  {
    id: "2",
    title: "NOLENN",
    description: "企業の強み・リスクをAIが要約するウェブアプリケーション。",
    year: "2025",
    tags: ["Next.js", "React", "TypeScript", "Firebase", "Vercel"],
    link: "https://www.nolenn.com/",
  },
  {
    id: "3",
    title: "YoshiYoshi",
    description: "N中等部横浜CPオリジナル通貨の吉を管理、取引できるウェブアプリケーション。",
    year: "2025",
    tags: ["TypeScript", "React", "Supabase", "Vercel"],
    link: "https://yoshiyoshi.vercel.app/",
  },
  {
    id: "4",
    title: "TraveLog",
    description: "シンプルな旅行計画アプリ",
    year: "2025",
    tags: ["Swift", "Firebase"],
    link: "#",
  },
]
