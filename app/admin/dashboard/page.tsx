"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Plus, LogOut } from "lucide-react"

interface Movie {
  _id: string
  title: string
  posterUrl: string
  duration: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    posterUrl: "",
    duration: "",
    rating: "",
    genre: "",
  })

  useEffect(() => {
    const isAdmin = localStorage.getItem("adminAuth")
    if (!isAdmin) {
      router.push("/admin")
      return
    }

    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      const res = await fetch("/api/movies")
      const data = await res.json()
      setMovies(data.data || [])
    } catch (error) {
      console.error("Failed to fetch movies:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          duration: Number.parseInt(formData.duration),
          genre: formData.genre.split(",").map((g) => g.trim()),
        }),
      })

      if (res.ok) {
        setFormData({
          title: "",
          description: "",
          posterUrl: "",
          duration: "",
          rating: "",
          genre: "",
        })
        setShowForm(false)
        fetchMovies()
      }
    } catch (error) {
      console.error("Failed to add movie:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <Button variant="outline" onClick={handleLogout} size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">Manage Movies</h2>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Movie
          </Button>
        </div>

        {/* Add Movie Form */}
        {showForm && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8 animate-scale-in">
            <form onSubmit={handleAddMovie} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Movie Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <Input
                  placeholder="Rating (e.g., PG-13)"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  required
                />
                <Input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
                <Input
                  placeholder="Genres (comma separated)"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  required
                />
              </div>
              <Input
                placeholder="Poster URL"
                value={formData.posterUrl}
                onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border border-border bg-secondary px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
                required
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Add Movie
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Movies List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : movies.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground">No movies yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((movie, index) => (
              <Link
                key={movie._id}
                href={`/admin/movie/${movie._id}`}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-all duration-300">
                  <div className="relative h-48 bg-secondary overflow-hidden">
                    <img
                      src={movie.posterUrl || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{movie.duration} mins</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
