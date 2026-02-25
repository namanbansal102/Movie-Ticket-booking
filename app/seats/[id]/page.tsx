"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { mockShowtimes, mockMovies } from "@/lib/mock-data"

interface Seat {
  _id?: string
  id?: string
  row: string
  number: number
  status?: "available" | "booked" | "reserved"
  isAvailable?: boolean
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
}

interface Movie {
  _id?: string
  id?: string
  title: string
}

export default function SeatSelection() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const movieId = (params.id as string) || ""

  const [seats, setSeats] = useState<Seat[]>([])
  const [movie, setMovie] = useState<Movie | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [pricePerSeat, setPricePerSeat] = useState<number>(250)
  const [loading, setLoading] = useState(true)

  // On mount, load booked seats for this movie from localStorage
  const [bookedSeats, setBookedSeats] = useState<string[]>([])
  useEffect(() => {
    if (!movieId) return;
    try {
      const raw = localStorage.getItem('userSeats')
      if (raw) {
        const arr = JSON.parse(raw)
        if (Array.isArray(arr)) {
          const filtered = arr.filter((s: any) => s.movieId === movieId)
          setBookedSeats(filtered.map((s: any) => s.seat))
        }
      }
    } catch {}
  }, [movieId])

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("[v0] Fetching data for movieId:", movieId)

        let seatsData: Seat[] = []
        let movieData: Movie | null = null

        // ---------- FETCH MOVIE ----------
        try {
          const movieRes = await fetch(`/api/movies/${movieId}`)
          const response = await movieRes.json()

          if (response.data) movieData = response.data
        } catch {
          console.log("[v0] Movie API failed")
        }

        // ---------- FALLBACK MOCK MOVIE ----------
        if (!movieData) {
          const mockMovie = mockMovies.find(
            (m) => m.id === movieId || m._id === movieId
          )
          if (mockMovie) {
            movieData = { id: mockMovie.id, title: mockMovie.title }
          }
        }

        setMovie(movieData)

        // ---------- STABLE SEAT GENERATION ----------
        const storageKey = `seats_${movieId}`
        const storedSeats = localStorage.getItem(storageKey)

        if (storedSeats) {
          // Load previously generated seat layout
          seatsData = JSON.parse(storedSeats)
        } else {
          // Generate only once per movie
          const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]
          const seatsPerRow = 12
          seatsData = []

          for (const row of rows) {
            for (let i = 1; i <= seatsPerRow; i++) {
              seatsData.push({
                id: `${movieId}-${row}${i}`,
                row,
                number: i,

                // Deterministic seat booking (no randomness)
                // Example rule: every 6th seat is booked
                status: i % 6 === 0 ? "booked" : "available",
              })
            }
          }

          // Save stable version in localStorage
          localStorage.setItem(storageKey, JSON.stringify(seatsData))
        }

        setSeats(seatsData)
      } catch (error) {
        console.error("[v0] Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user && movieId) fetchData()
  }, [movieId, user])

  if (!user && !authLoading) return null

  const toggleSeat = (seatId: string, status: string) => {
    // If seat is booked (from localStorage), do nothing
    if (status !== "available" || bookedSeats.includes(seatId)) return

    setSelectedSeats((prev) => {
      let updated;
      if (prev.includes(seatId)) {
        // Deselect: remove from localStorage
        updated = prev.filter((id) => id !== seatId)
        try {
          const raw = localStorage.getItem('userSeats')
          let arr = []
          if (raw) arr = JSON.parse(raw)
          if (!Array.isArray(arr)) arr = []
          arr = arr.filter((s: any) => !(s.seat === seatId && s.movieId === movieId))
          localStorage.setItem('userSeats', JSON.stringify(arr))
          setBookedSeats(arr.filter((s: any) => s.movieId === movieId).map((s: any) => s.seat))
        } catch {}
      } else {
        // Select: add to localStorage
        updated = [...prev, seatId]
        try {
          const raw = localStorage.getItem('userSeats')
          let arr = []
          if (raw) arr = JSON.parse(raw)
          if (!Array.isArray(arr)) arr = []
          if (!arr.some((s: any) => s.seat === seatId && s.movieId === movieId)) {
            arr.push({ seat: seatId, movieId })
            localStorage.setItem('userSeats', JSON.stringify(arr))
            setBookedSeats(arr.filter((s: any) => s.movieId === movieId).map((s: any) => s.seat))
          }
        } catch {}
      }
      return updated
    })
  }

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat")
      return
    }

    if (!movie) {
      alert("Movie info missing!")
      return
    }

    const totalPrice = pricePerSeat * selectedSeats.length

    router.push(
      `/confirmation/${movieId}?seats=${selectedSeats.join(",")}&price=${totalPrice}`
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const rows = Array.from(new Set(seats.map((s) => s.row))).sort()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href={`/movie/${movieId}`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Movie
            </Button>
          </Link>

          {movie && (
            <>
              <h1 className="text-2xl font-bold">{movie.title}</h1>
              <p className="text-muted-foreground">Select your seats</p>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="animate-slide-up">
          {/* Screen */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-b from-primary/50 to-accent/20 rounded-full w-4/5 h-2 relative">
                <p className="text-center text-muted-foreground text-sm absolute -top-8 left-1/2 -translate-x-1/2 font-semibold">
                  SCREEN
                </p>
              </div>
            </div>

            {/* Seat Grid */}
            <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
              {rows.map((row, rowIndex) => (
                <div
                  key={row}
                  className="flex items-center gap-3 mb-4 animate-slide-in"
                  style={{ animationDelay: `${rowIndex * 30}ms` }}
                >
                  <span className="w-8 text-center font-bold text-primary text-lg">
                    {row}
                  </span>

                  <div className="flex gap-2 flex-wrap justify-center flex-1">
                    {seats
                      .filter((s) => s.row === row)
                      .sort((a, b) => a.number - b.number)
                      .map((seat) => {
                        const seatId = seat._id || seat.id
                        const seatStatus =
                          seat.status ||
                          (seat.isAvailable ? "available" : "booked")
                        const isSelected = selectedSeats.includes(seatId!)
                        const isBooked = bookedSeats.includes(seatId!)

                        return (
                          <div key={seatId} className="relative group">
                            <button
                              onClick={() => toggleSeat(seatId!, seatStatus!)}
                              disabled={seatStatus !== "available" || isBooked}
                              className={`
                                w-10 h-10 rounded-lg font-bold flex items-center justify-center
                                ${
                                  isBooked
                                    ? "bg-red-400 text-white cursor-not-allowed opacity-80 border-2 border-red-700"
                                    : isSelected
                                    ? "bg-gradient-to-br from-primary to-accent text-white scale-110 shadow-lg"
                                    : seatStatus === "available"
                                    ? "bg-secondary hover:border-primary border-2"
                                    : "bg-muted/30 text-muted cursor-not-allowed opacity-40"
                                }
                              `}
                              tabIndex={isBooked ? -1 : 0}
                            >
                              {isBooked ? (
                                seat.number
                              ) : isSelected ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                seat.number
                              )}
                            </button>
                            {isBooked && (
                              <span className="absolute left-1/2 -bottom-8 -translate-x-1/2 bg-red-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                                Already booked
                              </span>
                            )}
                          </div>
                        )
                      })}
                  </div>

                  <span className="w-8 text-center font-bold text-primary text-lg">
                    {row}
                  </span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex gap-6 mt-8 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-secondary border-2 border-border rounded" />
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded" />
                <span className="text-sm">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-muted/30 rounded" />
                <span className="text-sm">Booked</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-card border border-border rounded-xl p-6 sticky bottom-0 shadow-lg flex justify-between items-center">
            <div>
              <p className="text-muted-foreground text-sm">Selected Seats</p>
              <p className="text-xl font-bold">
                {selectedSeats.length || "None"}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground text-sm">Total Price</p>
              <p className="text-xl font-bold">
                ₹{pricePerSeat * selectedSeats.length}
              </p>
            </div>

            <Button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
              className="px-8"
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
