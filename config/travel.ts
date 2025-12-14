export interface TravelDestination {
  id: string
  location: string
  country: string
  date: string
  description?: string
  image: string
  highlights: string[]
  order?: number
}

export const travelHistory: TravelDestination[] = [
  {
    id: "1",
    location: "大阪",
    country: "日本",
    date: "2024年4月",
    image: "/IMG_2812.webp",
    highlights: ["道頓堀",],
  },
  {
    id: "2",
    location: "北陸",
    country: "日本",
    date: "2024年8月",
    image: "/toyama.webp",
    highlights: ["黒部ダム",],
  },
  {
    id: "3",
    location: "伊予市",
    country: "日本",
    date: "2024年11月",
    image: "/iyoshi.webp",
    highlights: ["下灘駅",],
  },
    {
    id: "4",
    location: "京都",
    country: "日本",
    date: "2024年12月",
    image: "/kyoto.webp",
    highlights: ["清水寺",],
  },
    {
    id: "5",
    location: "福岡",
    country: "日本",
    date: "2025年1月",
    image: "/Fukuoka-Apple.webp",
    highlights: ["Apple Store 福岡",],
  },
    {
    id: "6",
    location: "秋田",
    country: "日本",
    date: "2025年2月",
    image: "/akita.webp",
    highlights: ["秋田駅前",],
  },
    {
    id: "7",
    location: "マーチソン滝",
    country: "ウガンダ",
    date: "2025年3月",
    image: "/uganda.webp",
    highlights: ["マーチソン・フォールズ国立公園",],
  },
      {
    id: "8",
    location: "ドーハ",
    country: "カタール",
    date: "2025年3月",
    image: "/doha.webp",
    highlights: ["カタール国立博物館",],
  },
      {
    id: "9",
    location: "夢洲",
    country: "日本",
    date: "2025年5月",
    image: "/expo-1.webp",
    highlights: ["大阪関西万博2025",],
  },
      {
    id: "10",
    location: "大阪",
    country: "日本",
    date: "2025年6月",
    image: "/tennoji.webp",
    highlights: ["あべのハルカス",],
  },
      {
    id: "11",
    location: "兵庫北部",
    country: "日本",
    date: "2025年7月",
    image: "/hyogo.webp",
    highlights: ["鎧駅",],
  },
      {
    id: "12",
    location: "バンコク",
    country: "タイ",
    date: "2025年8月",
    image: "/bangkok.webp",
    highlights: ["バンコク",],
  },
        {
    id: "13",
    location: "夢洲",
    country: "日本",
    date: "2025年9月",
    image: "/expo-2.webp",
    highlights: ["大阪関西万博2025",],
  },
        {
    id: "14",
    location: "双葉町",
    country:  "日本",
    date: "2025年10月",
    image: "/namie.webp",
    highlights: ["双葉町",],
  },
]
