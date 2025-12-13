export interface Photo {
  id: string
  title: string
  location: string
  image: string
  order?: number
}

export const photos: Photo[] = [
  {
    id: "1",
    title: "EXPO 2025 Osaka",
    location: "Osaka, Japan",
    image: "/IMG_0575.webp",
  },
  {
    id: "2",
    title: "Haneda Airport Terminal 2",
    location: "Tokyo, Japan",
    image: "/MG_7887.webp",
  },
  {
    id: "3",
    title: "Bangkok",
    location: "Bangkok, Thailand",
    image: "/MG_8546.webp",
  },
  {
    id: "4",
    title: "ANA B777-300",
    location: "Haneda, Tokyo",
    image: "/MG_8689.webp",
  },
  {
    id: "5",
    title: "Haneda Tower",
    location: "Haneda, Tokyo",
    image: "/MG_9181.webp",
  },
  {
    id: "6",
    title: "B787 Engine",
    location: "Haneda, Tokyo",
    image: "/MG_9202.webp",
  },
    {
    id: "7",
    title: "ANA A320",
    location: "Haneda, Tokyo",
    image: "/MG_9568.webp",
  },
]
