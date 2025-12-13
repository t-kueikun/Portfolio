"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { travelHistory as fallbackTravel, type TravelDestination } from "@/config/travel"
import { loadTravelHistory } from "@/lib/content-loaders"

export function Travel() {
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null)
  const [destinations, setDestinations] = useState<TravelDestination[]>(fallbackTravel)
  const [ratios, setRatios] = useState<Record<string, number>>({})

  useEffect(() => {
    let mounted = true

    loadTravelHistory()
      .then((data) => {
        if (mounted) setDestinations(data)
      })
      .catch(() => {
        /* fallback already set */
      })

    return () => {
      mounted = false
    }
  }, [])

  const selected = selectedDestination ? destinations.find((d) => d.id === selectedDestination) : null

  return (
    <section className="min-h-screen py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <h1 className="text-4xl lg:text-6xl font-medium mb-6 text-balance">Travel</h1>
        </div>

        {/* Travel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <button
              key={destination.id}
              onClick={() => setSelectedDestination(destination.id)}
              className="group text-left hover-lift"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div
                className="relative overflow-hidden rounded-2xl bg-muted mb-6"
                style={{ aspectRatio: ratios[destination.id] ? `${ratios[destination.id]}` : "4/3" }}
              >
                <Image
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.location}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  quality={60}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  onLoadingComplete={({ naturalWidth, naturalHeight }) => {
                    setRatios((prev) => ({ ...prev, [destination.id]: naturalWidth / naturalHeight }))
                  }}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-2xl font-medium group-hover:text-muted-foreground transition-colors">
                    {destination.location}
                  </h3>
                  <span className="text-sm text-muted-foreground">{destination.date}</span>
                </div>
                <p className="text-muted-foreground text-pretty">{destination.description ?? ""}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Detail Modal */}
        {selected && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setSelectedDestination(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/60 hover:text-white text-sm transition-colors"
              onClick={() => setSelectedDestination(null)}
            >
              Close
            </button>
            <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
              <Image
                src={selected.image || "/placeholder.svg"}
                alt={selected.location}
                fill
                sizes="100vw"
                quality={60}
                className="object-contain"
              />
              </div>
              <div className="text-white space-y-6">
                <div>
                  <div className="flex items-baseline gap-4 mb-2">
                    <h2 className="text-4xl font-medium">{selected.location}</h2>
                    <span className="text-white/60">{selected.country}</span>
                  </div>
                  <p className="text-white/60">{selected.date}</p>
                </div>
                <p className="text-xl text-white/80 text-pretty">{selected.description ?? ""}</p>
                {selected.highlights.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">Highlights</h3>
                    <div className="flex flex-wrap gap-2">
                      {selected.highlights.map((highlight, i) => (
                        <span key={i} className="glass px-4 py-2 rounded-full text-sm">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
