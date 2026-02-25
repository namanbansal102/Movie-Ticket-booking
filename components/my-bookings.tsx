"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function MyBookings() {
  const { user } = useAuth()
  const [email, setEmail] = useState<string>(user?.email || "")
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email)
      fetchBookings(user.email)
    }
  }, [user])

  async function fetchBookings(targetEmail?: string) {
    const e = targetEmail ?? email
    if (!e) {
      setError("Enter an email to fetch bookings")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/bookings?email=${encodeURIComponent(e)}`)
      const data = await res.json()
      if (data.success) {
        const enriched = await enrichBookings(data.data)
        setBookings(enriched)
      }
      else setError(data.message || "Failed to fetch bookings")
    } catch (err) {
      console.error(err)
      setError("Failed to fetch bookings")
    } finally {
      setLoading(false)
    }
  }

  async function enrichBookings(list: any[]) {
    // For bookings missing movieDetails or totalAmount, try to fetch movie and compute amount
    return await Promise.all(
      list.map(async (b) => {
        const booking = { ...b }

        // Ensure seats is an array
        const seats = Array.isArray(booking.seats) ? booking.seats : (booking.seats ? String(booking.seats).split(",") : [])

        // Fetch movie if missing and movieId present
        if (!booking.movieDetails && booking.movieId) {
          try {
            const r = await fetch(`/api/movies/${booking.movieId}`)
            const md = await r.json()
            if (md.success) booking.movieDetails = md.data
          } catch (err) {
            // ignore
          }
        }

        // Determine amount: prefer stored totalAmount, else showtimeDetails.price, else fallback 250
        if (!booking.totalAmount || Number(booking.totalAmount) === 0) {
          const per = booking.showtimeDetails?.price ?? 250
          booking.totalAmount = seats.length * per
        }

        // Normalize display fields
        booking.seats = seats
        return booking
      })
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h4 className="text-2xl font-bold mb-4">My Bookings</h4>

      {!user && (
        <div className="mb-6 flex gap-2 items-center">
          <input
            className="flex-1 px-4 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <button onClick={() => fetchBookings()} className="px-4 py-2 bg-primary text-primary-foreground rounded">Fetch</button>
          <Link href="/booking" className="ml-2 text-sm text-muted-foreground underline">Open bookings page</Link>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-36 bg-card rounded-lg animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="text-muted-foreground">No bookings yet. Book a movie to see it here.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.slice(0, 6).map((b) => (
            <div key={b._id} className="p-4 bg-card rounded-lg border border-border">
              <div className="flex gap-3">
                <img src={b.movieDetails?.posterUrl || '/placeholder.svg'} alt={b.movieDetails?.title} className="w-20 h-28 object-cover rounded" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-sm">{b.movieDetails?.title || 'Movie'}</h5>
                    <div className={`text-xs px-2 py-1 rounded ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.status}</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Show: {b.showtimeDetails?.date} {b.showtimeDetails?.time}</p>
                  <p className="text-sm mt-2">Seats: <span className="font-medium">{Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}</span></p>
                  <div className="mt-3 flex items-center gap-2">
                    <Link href={`/booking/ticket?bookingId=${b._id}`} className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded">Ticket</Link>
                    <button onClick={() => navigator.clipboard?.writeText(b.bookingId || b._id)} className="text-xs px-2 py-1 border rounded">Copy ID</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
