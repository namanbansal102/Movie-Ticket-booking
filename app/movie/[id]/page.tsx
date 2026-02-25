"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Users } from "lucide-react"
import { mockMovies, mockShowtimes } from "@/lib/mock-data"

interface Movie {
  _id?: string
  id?: string
  title: string
  description: string
  posterUrl: string
  duration: number
  rating: string | number
  genre: string[]
}

interface ShowTime {
  _id?: string
  id?: string
  movieId: string
  date?: string
  time: string
  hall?: string
  basePrice?: number
  price?: number
  format?: string
}

export default function MovieDetails() {
  const params = useParams()
  const router = useRouter()
  const movieId = params.id as string

  const [movie, setMovie] = useState<Movie | null>(null)
  const [showTimes, setShowTimes] = useState<ShowTime[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("[v0] Fetching movie with ID:", movieId)

        let movieData: Movie | null = null
        try {
          const movieRes = await fetch(`/api/movies/${movieId}`)
          const response = await movieRes.json()
          if (response.success && response.data) {
            movieData = response.data
          }
        } catch (error) {
          console.log("[v0] MongoDB fetch failed, using mock data")
        }

        // Fall back to mock data if MongoDB is empty
        if (!movieData) {
          const mockMovie = mockMovies.find((m) => m.id === movieId)
          if (mockMovie) {
            movieData = {
              id: mockMovie.id,
              title: mockMovie.title,
              description: mockMovie.description,
              posterUrl: mockMovie.posterUrl,
              duration: mockMovie.duration,
              rating: mockMovie.rating,
              genre: mockMovie.genre,
            }
          }
        }

        setMovie(movieData)

        let showtimesData: ShowTime[] = []
        try {
          const showRes = await fetch(`/api/showtimes?movieId=${movieId}`)
          const response = await showRes.json()
          if (response.success && response.data && response.data.length > 0) {
            showtimesData = response.data
          }
        } catch (error) {
          console.log("[v0] Showtimes fetch failed")
        }

        // Fall back to mock showtimes if MongoDB is empty
        if (showtimesData.length === 0) {
          showtimesData = mockShowtimes
            .filter((st) => st.movieId === movieId)
            .map((st, index) => ({
              id: st.id,
              movieId: st.movieId,
              time: st.time,
              price: st.price,
              basePrice: st.price,
              format: st.format,
              date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString(),
              hall: `${index + 1}`,
            }))
        }

        setShowTimes(showtimesData)
      } catch (error) {
        console.error("[v0] Failed to fetch movie:", error)
        setMovie(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [movieId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">Movie not found</p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Movies
            </Button>
          </Link>
        </div>
      </div>

      {/* Movie Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-slide-up">
          {/* Poster */}
          <div className="md:col-span-1">
            <div className="relative overflow-hidden rounded-lg border border-border h-96 md:h-full min-h-96 bg-card">
              <img
                src={movie.posterUrl || "/placeholder.svg?height=400&width=300&query=movie+poster"}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {movie.title}
            </h1>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-2 bg-primary/20 text-primary rounded-full font-semibold">{movie.rating}★</span>
              {movie.genre.map((g) => (
                <span key={g} className="px-4 py-2 bg-accent/20 text-accent rounded-full">
                  {g}
                </span>
              ))}
            </div>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{movie.description}</p>

            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Duration
              </p>
              <p className="text-2xl font-bold text-foreground">{movie.duration} minutes</p>
            </div>
          </div>
        </div>

        {/* Showtimes */}
        <div className="animate-slide-in" style={{ animationDelay: "200ms" }}>
          <h2 className="text-3xl font-bold mb-8 text-foreground flex items-center gap-2">
            <Calendar className="w-8 h-8 text-primary" />
            Select a Showtime
          </h2>

          {showTimes.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground">No showtimes available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {showTimes.map((showTime, index) => (
                <button
                  key={showTime._id || showTime.id}
                  onClick={() => router.push(`/seats/${movieId}`)}
                  className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 hover:border-primary hover:bg-card/80 transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <p className="text-muted-foreground text-sm mb-2">
                      {showTime.date ? new Date(showTime.date).toLocaleDateString() : `Today at ${index + 1} PM`}
                    </p>
                    <p className="text-3xl font-bold text-primary mb-2">{showTime.time}</p>
                    <p className="text-muted-foreground text-sm mb-4">Hall {showTime.hall || index + 1}</p>
                    <p className="text-lg font-semibold text-accent">₹{showTime.basePrice || showTime.price || 250}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
