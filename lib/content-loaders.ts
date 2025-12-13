import { collection, getDocs } from "firebase/firestore"
import { getDownloadURL, ref } from "firebase/storage"

import { photos as fallbackPhotos, type Photo } from "@/config/photos"
import { travelHistory as fallbackTravel, type TravelDestination } from "@/config/travel"
import { projects as fallbackProjects, type Project } from "@/config/work"
import { db, storage, isFirebaseEnabled } from "./firebase"

async function resolveImage(data: { image?: string; storagePath?: string }): Promise<string> {
  if (data.image) return data.image

  if (storage && data.storagePath) {
    try {
      return await getDownloadURL(ref(storage, data.storagePath))
    } catch (error) {
      console.warn("Failed to fetch image from Firebase Storage, falling back.", error)
    }
  }

  return ""
}

export async function loadProjects(): Promise<Project[]> {
  if (!isFirebaseEnabled || !db) return fallbackProjects

  try {
    const snapshot = await getDocs(collection(db, "work"))
    const docs: Project[] = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title ?? "",
        description: data.description ?? "",
        year: data.year ?? "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        link: data.link ?? "#",
        order: typeof data.order === "number" ? data.order : undefined,
      }
    })

    const ordered = docs
      .map((item, idx) => ({ ...item, order: typeof item.order === "number" ? item.order : idx }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

    return ordered.length ? ordered : fallbackProjects
  } catch (error) {
    console.warn("Failed to load work from Firestore, using fallback.", error)
    return fallbackProjects
  }
}

export async function loadPhotos(): Promise<Photo[]> {
  if (!isFirebaseEnabled || !db) return fallbackPhotos

  try {
    const snapshot = await getDocs(collection(db, "photos"))

    const docs: Photo[] = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title ?? "",
          location: data.location ?? "",
          image: (await resolveImage(data)) || "/placeholder.svg",
          order: typeof data.order === "number" ? data.order : undefined,
        }
      }),
    )

    const ordered = docs
      .map((item, idx) => ({ ...item, order: typeof item.order === "number" ? item.order : idx }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

    return ordered.length ? ordered : fallbackPhotos
  } catch (error) {
    console.warn("Failed to load photos from Firestore, using fallback.", error)
    return fallbackPhotos
  }
}

export async function loadTravelHistory(): Promise<TravelDestination[]> {
  if (!isFirebaseEnabled || !db) return fallbackTravel

  try {
    const snapshot = await getDocs(collection(db, "travel"))

    const docs: TravelDestination[] = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          location: data.location ?? "",
          country: data.country ?? "",
          date: data.date ?? "",
          description: data.description ?? "",
          image: (await resolveImage(data)) || "/placeholder.svg",
          highlights: Array.isArray(data.highlights) ? data.highlights : [],
          order: typeof data.order === "number" ? data.order : undefined,
        }
      }),
    )

    const ordered = docs
      .map((item, idx) => ({ ...item, order: typeof item.order === "number" ? item.order : idx }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

    return ordered.length ? ordered : fallbackTravel
  } catch (error) {
    console.warn("Failed to load travel history from Firestore, using fallback.", error)
    return fallbackTravel
  }
}
