"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { photos as fallbackPhotos, type Photo } from "@/config/photos"
import { loadPhotos } from "@/lib/content-loaders"

export function Photos() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [photoList, setPhotoList] = useState<Photo[]>(fallbackPhotos)
  const [ratios, setRatios] = useState<Record<string, number>>({})

  useEffect(() => {
    let mounted = true

    loadPhotos()
      .then((data) => {
        if (mounted) setPhotoList(data)
      })
      .catch(() => {
        /* fallback already set */
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="min-h-screen py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <h1 className="text-4xl lg:text-6xl font-medium mb-6 text-balance">Photos</h1>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photoList.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => setSelectedPhoto(index)}
              className="group relative overflow-hidden rounded-2xl bg-muted hover-lift"
              style={{
                animationDelay: `${index * 100}ms`,
                aspectRatio: ratios[photo.id] ? `${ratios[photo.id]}` : "4/5",
              }}
            >
              <Image
                src={photo.image || "/placeholder.svg"}
                alt={photo.title}
                fill
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                quality={35}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                onLoadingComplete={({ naturalWidth, naturalHeight }) => {
                  setRatios((prev) => ({ ...prev, [photo.id]: naturalWidth / naturalHeight }))
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-lg font-medium mb-1">{photo.title}</h3>
                  <p className="text-white/80 text-sm">{photo.location}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Lightbox */}
        {selectedPhoto !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/60 hover:text-white text-sm transition-colors"
              onClick={() => setSelectedPhoto(null)}
            >
              Close
            </button>
            <div className="relative max-w-6xl max-h-[90vh] aspect-auto">
              <Image
                src={photoList[selectedPhoto].image || "/placeholder.svg"}
                alt={photoList[selectedPhoto].title}
                width={1200}
                height={800}
                quality={90}
                className="object-contain w-full h-full"
              />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-medium mb-2">{photoList[selectedPhoto].title}</h3>
                <p className="text-white/80">{photoList[selectedPhoto].location}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
