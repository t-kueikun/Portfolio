"use client"

import { useEffect, useState } from "react"
import { addDoc, collection, doc, updateDoc, writeBatch } from "firebase/firestore"
import { Copy, Check, Pencil, ArrowUp, ArrowDown, X } from "lucide-react"

import { Navigation } from "@/components/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { projects as fallbackProjects, type Project } from "@/config/work"
import { photos as fallbackPhotos, type Photo } from "@/config/photos"
import { travelHistory as fallbackTravel, type TravelDestination } from "@/config/travel"
import { db, isFirebaseEnabled } from "@/lib/firebase"
import { loadProjects, loadPhotos, loadTravelHistory } from "@/lib/content-loaders"

type Direction = "up" | "down"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("work")
  const [copied, setCopied] = useState<string | null>(null)
  const [authorized, setAuthorized] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

  const [projectList, setProjectList] = useState<Project[]>(fallbackProjects)
  const [photoList, setPhotoList] = useState<Photo[]>(fallbackPhotos)
  const [travelList, setTravelList] = useState<TravelDestination[]>(fallbackTravel)

  const [editingWorkId, setEditingWorkId] = useState<string | null>(null)
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null)
  const [editingTravelId, setEditingTravelId] = useState<string | null>(null)

  const [workForm, setWorkForm] = useState({
    title: "",
    description: "",
    year: "",
    tags: "",
    link: "",
  })

  const [photoForm, setPhotoForm] = useState({
    title: "",
    location: "",
    image: "",
    storagePath: "",
  })

  const [travelForm, setTravelForm] = useState({
    location: "",
    country: "",
    date: "",
    description: "",
    highlights: "",
    image: "",
    storagePath: "",
  })

  const { toast } = useToast()

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const workJson = JSON.stringify(projectList, null, 2)
  const photosJson = JSON.stringify(photoList, null, 2)
  const travelJson = JSON.stringify(travelList, null, 2)

  useEffect(() => {
    if (!authorized) return
    loadProjects().then(setProjectList).catch(() => {})
    loadPhotos().then(setPhotoList).catch(() => {})
    loadTravelHistory().then(setTravelList).catch(() => {})
  }, [authorized])

  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = localStorage.getItem("admin-auth") === "true"
    if (saved) setAuthorized(true)
  }, [])

  const handleLogin = () => {
    if (!adminPassword) {
      toast({
        title: "パスワード未設定",
        description: ".env.local に NEXT_PUBLIC_ADMIN_PASSWORD を設定してください",
        variant: "destructive",
      })
      return
    }
    if (passwordInput === adminPassword) {
      setAuthorized(true)
      localStorage.setItem("admin-auth", "true")
      setPasswordInput("")
      toast({ title: "ログインしました" })
    } else {
      toast({ title: "パスワードが違います", description: "入力を確認してください", variant: "destructive" })
    }
  }

  const ensureFirebase = () => {
    if (!isFirebaseEnabled || !db) {
      toast({
        title: "Firebase未設定",
        description: ".env.local に NEXT_PUBLIC_FIREBASE_* を設定してください",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const persistOrder = async <T extends { id: string }>(collectionName: string, items: T[]) => {
    if (!ensureFirebase()) return
    try {
      const batch = writeBatch(db!)
      items.forEach((item, idx) => {
        batch.update(doc(db!, collectionName, item.id), { order: idx })
      })
      await batch.commit()
      toast({ title: "順序を更新しました" })
    } catch (error) {
      console.error(error)
      toast({ title: "順序の保存に失敗しました", variant: "destructive" })
    }
  }

  const reorderList = <T extends { id: string }>(
    list: T[],
    setList: (items: T[]) => void,
    index: number,
    direction: Direction,
    collectionName: string,
  ) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= list.length) return
    const newList = [...list]
    const [item] = newList.splice(index, 1)
    newList.splice(targetIndex, 0, item)
    setList(newList)
    persistOrder(collectionName, newList)
  }

  const startEditWork = (project: Project) => {
    setEditingWorkId(project.id)
    setWorkForm({
      title: project.title,
      description: project.description,
      year: project.year,
      tags: project.tags.join(", "),
      link: project.link,
    })
  }

  const startEditPhoto = (photo: Photo) => {
    setEditingPhotoId(photo.id)
    setPhotoForm({
      title: photo.title,
      location: photo.location,
      image: photo.image ?? "",
      storagePath: (photo as any).storagePath ?? "",
    })
  }

  const startEditTravel = (travel: TravelDestination) => {
    setEditingTravelId(travel.id)
    setTravelForm({
      location: travel.location,
      country: travel.country,
      date: travel.date,
      description: travel.description ?? "",
      highlights: travel.highlights.join(", "),
      image: travel.image ?? "",
      storagePath: (travel as any).storagePath ?? "",
    })
  }

  const saveWork = async () => {
    if (!ensureFirebase()) return
    const payload = {
      title: workForm.title.trim(),
      description: workForm.description.trim(),
      year: workForm.year.trim(),
      tags: workForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
      link: workForm.link.trim() || "#",
    }

    try {
      if (editingWorkId) {
        await updateDoc(doc(db!, "work", editingWorkId), payload)
        toast({ title: "更新しました", description: "Workコレクションを更新しました" })
      } else {
        await addDoc(collection(db!, "work"), { ...payload, order: projectList.length })
        toast({ title: "追加しました", description: "Workコレクションに保存しました" })
      }
      setWorkForm({ title: "", description: "", year: "", tags: "", link: "" })
      setEditingWorkId(null)
      loadProjects().then(setProjectList).catch(() => {})
    } catch (error) {
      console.error(error)
      toast({ title: "保存に失敗しました", description: "入力内容を確認してください", variant: "destructive" })
    }
  }

  const savePhoto = async () => {
    if (!ensureFirebase()) return
    const payload = {
      title: photoForm.title.trim(),
      location: photoForm.location.trim(),
      image: photoForm.image.trim(),
      storagePath: photoForm.storagePath.trim(),
    }

    try {
      if (editingPhotoId) {
        await updateDoc(doc(db!, "photos", editingPhotoId), payload)
        toast({ title: "更新しました", description: "Photosコレクションを更新しました" })
      } else {
        await addDoc(collection(db!, "photos"), { ...payload, order: photoList.length })
        toast({ title: "追加しました", description: "Photosコレクションに保存しました" })
      }
      setPhotoForm({ title: "", location: "", image: "", storagePath: "" })
      setEditingPhotoId(null)
      loadPhotos().then(setPhotoList).catch(() => {})
    } catch (error) {
      console.error(error)
      toast({ title: "保存に失敗しました", description: "入力内容を確認してください", variant: "destructive" })
    }
  }

  const saveTravel = async () => {
    if (!ensureFirebase()) return
    const payload = {
      location: travelForm.location.trim(),
      country: travelForm.country.trim(),
      date: travelForm.date.trim(),
      description: travelForm.description.trim(),
      highlights: travelForm.highlights.split(",").map((t) => t.trim()).filter(Boolean),
      image: travelForm.image.trim(),
      storagePath: travelForm.storagePath.trim(),
    }

    try {
      if (editingTravelId) {
        await updateDoc(doc(db!, "travel", editingTravelId), payload)
        toast({ title: "更新しました", description: "Travelコレクションを更新しました" })
      } else {
        await addDoc(collection(db!, "travel"), { ...payload, order: travelList.length })
        toast({ title: "追加しました", description: "Travelコレクションに保存しました" })
      }
      setTravelForm({
        location: "",
        country: "",
        date: "",
        description: "",
        highlights: "",
        image: "",
        storagePath: "",
      })
      setEditingTravelId(null)
      loadTravelHistory().then(setTravelList).catch(() => {})
    } catch (error) {
      console.error(error)
      toast({ title: "保存に失敗しました", description: "入力内容を確認してください", variant: "destructive" })
    }
  }

  const cancelEdit = (type: "work" | "photos" | "travel") => {
    if (type === "work") {
      setEditingWorkId(null)
      setWorkForm({ title: "", description: "", year: "", tags: "", link: "" })
    } else if (type === "photos") {
      setEditingPhotoId(null)
      setPhotoForm({ title: "", location: "", image: "", storagePath: "" })
    } else {
      setEditingTravelId(null)
      setTravelForm({ location: "", country: "", date: "", description: "", highlights: "", image: "", storagePath: "" })
    }
  }

  if (!authorized) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-medium">Admin Login</h1>
            <p className="text-muted-foreground text-sm">
              管理用パスワードを入力してください。パスワードは .env.local の NEXT_PUBLIC_ADMIN_PASSWORD で設定します。
            </p>
          </div>
          <div className="space-y-3">
            <Label>パスワード</Label>
            <Input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin()
              }}
              placeholder="••••••••"
            />
            <Button onClick={handleLogin} className="w-full">
              ログイン
            </Button>
            {!adminPassword && (
              <p className="text-xs text-destructive">
                NEXT_PUBLIC_ADMIN_PASSWORD が未設定です。設定後に再読み込みしてください。
              </p>
            )}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-32 pb-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-medium mb-4">管理ダッシュボード</h1>
            <p className="text-muted-foreground">
              Firestore/Storage を使って Work・Photos・Travel を追加・更新・並び替えできます（未設定ならローカルデータを表示）
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="work">Work</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="travel">Travel</TabsTrigger>
            </TabsList>

            <TabsContent value="work">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>プロジェクト管理</CardTitle>
                      <CardDescription>Firestoreに保存し、フロントで即反映します</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(workJson, "work")} className="gap-2">
                      {copied === "work" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied === "work" ? "コピー済み" : "JSONをコピー"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>現在のプロジェクト一覧</Label>
                      <div className="bg-muted p-4 rounded-lg space-y-3">
                        {projectList.map((project, index) => (
                          <div key={project.id} className="bg-background p-3 rounded border space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-medium">{project.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                  {project.tags.map((tag) => (
                                    <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => reorderList(projectList, setProjectList, index, "up", "work")}>
                                    <ArrowUp className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => reorderList(projectList, setProjectList, index, "down", "work")}>
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                </div>
                                <Button variant="secondary" size="sm" className="gap-2" onClick={() => startEditWork(project)}>
                                  <Pencil className="h-4 w-4" />
                                  編集
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>JSON形式でコピー・編集</Label>
                      <Textarea value={workJson} readOnly rows={12} className="font-mono text-xs" />
                    </div>
                  </div>

                  <div className="pt-6 border-t space-y-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{editingWorkId ? "編集" : "新規追加"}</CardTitle>
                      <div className="flex items-center gap-3">
                        {!isFirebaseEnabled && (
                          <span className="text-xs text-destructive">Firebase未設定 (.env.local を確認)</span>
                        )}
                        {editingWorkId && (
                          <Button variant="ghost" size="sm" className="gap-1" onClick={() => cancelEdit("work")}>
                            <X className="h-4 w-4" />
                            キャンセル
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>タイトル</Label>
                        <Input
                          value={workForm.title}
                          onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })}
                          placeholder="例: 新しいプロジェクト"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>年</Label>
                        <Input
                          value={workForm.year}
                          onChange={(e) => setWorkForm({ ...workForm, year: e.target.value })}
                          placeholder="2025"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>概要</Label>
                        <Textarea
                          rows={3}
                          value={workForm.description}
                          onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })}
                          placeholder="プロジェクトの説明"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>タグ（カンマ区切り）</Label>
                        <Input
                          value={workForm.tags}
                          onChange={(e) => setWorkForm({ ...workForm, tags: e.target.value })}
                          placeholder="Next.js, Firebase"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>リンク</Label>
                        <Input
                          value={workForm.link}
                          onChange={(e) => setWorkForm({ ...workForm, link: e.target.value })}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    <Button onClick={saveWork} className="w-full md:w-auto">
                      {editingWorkId ? "更新" : "Firestoreに追加"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="photos">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>写真管理</CardTitle>
                      <CardDescription>Firestore/Storageの内容がサイトに反映されます</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(photosJson, "photos")}
                      className="gap-2"
                    >
                      {copied === "photos" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied === "photos" ? "コピー済み" : "JSONをコピー"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>現在の写真一覧</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {photoList.map((photo, index) => (
                          <div key={photo.id} className="bg-muted p-3 rounded space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="font-medium text-sm">{photo.title}</div>
                                <div className="text-xs text-muted-foreground">{photo.location}</div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => reorderList(photoList, setPhotoList, index, "up", "photos")}
                                  >
                                    <ArrowUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => reorderList(photoList, setPhotoList, index, "down", "photos")}
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                </div>
                                <Button variant="secondary" size="sm" className="gap-2" onClick={() => startEditPhoto(photo)}>
                                  <Pencil className="h-4 w-4" />
                                  編集
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>JSON形式でコピー・編集</Label>
                      <Textarea value={photosJson} readOnly rows={12} className="font-mono text-xs" />
                    </div>

                    <div className="pt-6 border-t space-y-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{editingPhotoId ? "編集" : "新規追加"}</CardTitle>
                        <div className="flex items-center gap-3">
                          {!isFirebaseEnabled && (
                            <span className="text-xs text-destructive">Firebase未設定 (.env.local を確認)</span>
                          )}
                          {editingPhotoId && (
                            <Button variant="ghost" size="sm" className="gap-1" onClick={() => cancelEdit("photos")}>
                              <X className="h-4 w-4" />
                              キャンセル
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>タイトル</Label>
                          <Input
                            value={photoForm.title}
                            onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                            placeholder="例: Sunset"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>場所</Label>
                          <Input
                            value={photoForm.location}
                            onChange={(e) => setPhotoForm({ ...photoForm, location: e.target.value })}
                            placeholder="Tokyo, Japan"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>写真リンク (画像URL)</Label>
                          <Input
                            value={photoForm.image}
                            onChange={(e) => setPhotoForm({ ...photoForm, image: e.target.value })}
                            placeholder="https://..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Storageパス（オプション）</Label>
                          <Input
                            value={photoForm.storagePath}
                            onChange={(e) => setPhotoForm({ ...photoForm, storagePath: e.target.value })}
                            placeholder="photos/example.jpg"
                          />
                        </div>
                      </div>
                      <Button onClick={savePhoto} className="w-full md:w-auto">
                        {editingPhotoId ? "更新" : "Firestoreに追加"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="travel">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>旅行履歴管理</CardTitle>
                      <CardDescription>Firestoreの旅行データを編集・追加できます</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(travelJson, "travel")}
                      className="gap-2"
                    >
                      {copied === "travel" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied === "travel" ? "コピー済み" : "JSONをコピー"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>現在の旅行履歴一覧</Label>
                      <div className="bg-muted p-4 rounded-lg space-y-3">
                        {travelList.map((destination, index) => (
                          <div key={destination.id} className="bg-background p-3 rounded border space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{destination.location}</h3>
                                <p className="text-sm text-muted-foreground">{destination.country}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => reorderList(travelList, setTravelList, index, "up", "travel")}
                                  >
                                    <ArrowUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => reorderList(travelList, setTravelList, index, "down", "travel")}
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                </div>
                                <Button variant="secondary" size="sm" className="gap-2" onClick={() => startEditTravel(destination)}>
                                  <Pencil className="h-4 w-4" />
                                  編集
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm mt-1">{destination.description ?? ""}</p>
                            <div className="flex flex-wrap gap-1">
                              {destination.highlights.map((highlight, i) => (
                                <span key={i} className="text-xs bg-muted px-2 py-1 rounded">
                                  {highlight}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>JSON形式でコピー・編集</Label>
                      <Textarea value={travelJson} readOnly rows={12} className="font-mono text-xs" />
                    </div>

                    <div className="pt-6 border-t space-y-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{editingTravelId ? "編集" : "新規追加"}</CardTitle>
                        <div className="flex items-center gap-3">
                          {!isFirebaseEnabled && (
                            <span className="text-xs text-destructive">Firebase未設定 (.env.local を確認)</span>
                          )}
                          {editingTravelId && (
                            <Button variant="ghost" size="sm" className="gap-1" onClick={() => cancelEdit("travel")}>
                              <X className="h-4 w-4" />
                              キャンセル
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>場所</Label>
                          <Input
                            value={travelForm.location}
                            onChange={(e) => setTravelForm({ ...travelForm, location: e.target.value })}
                            placeholder="京都"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>国</Label>
                          <Input
                            value={travelForm.country}
                            onChange={(e) => setTravelForm({ ...travelForm, country: e.target.value })}
                            placeholder="日本"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>日時</Label>
                          <Input
                            value={travelForm.date}
                            onChange={(e) => setTravelForm({ ...travelForm, date: e.target.value })}
                            placeholder="2025年1月"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>概要</Label>
                          <Textarea
                            rows={3}
                            value={travelForm.description}
                            onChange={(e) => setTravelForm({ ...travelForm, description: e.target.value })}
                            placeholder="旅行の説明"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>ハイライト（カンマ区切り）</Label>
                          <Input
                            value={travelForm.highlights}
                            onChange={(e) => setTravelForm({ ...travelForm, highlights: e.target.value })}
                            placeholder="金閣寺, 伏見稲荷大社"
                          />
                        </div>
                        <div className="space-y-2">
                        <Label>写真リンク (画像URL)</Label>
                        <Input
                          value={travelForm.image}
                          onChange={(e) => setTravelForm({ ...travelForm, image: e.target.value })}
                          placeholder="https://..."
                        />
                        </div>
                        <div className="space-y-2">
                          <Label>Storageパス（オプション）</Label>
                          <Input
                            value={travelForm.storagePath}
                            onChange={(e) => setTravelForm({ ...travelForm, storagePath: e.target.value })}
                            placeholder="travel/kyoto.jpg"
                          />
                        </div>
                      </div>
                      <Button onClick={saveTravel} className="w-full md:w-auto">
                        {editingTravelId ? "更新" : "Firestoreに追加"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
