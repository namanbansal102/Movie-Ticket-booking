"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function MyBookingsPage() {
  const { user } = useAuth()
  const [email, setEmail] = useState(user?.email || "")
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email)
      fetchBookings(user.email)
    }
  }, [user])

  const fetchBookings = async (e?: string) => {
    const target = typeof e === "string" ? e : email
    if (!target) {
      setError("Please provide an email to fetch bookings")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/bookings?email=${encodeURIComponent(target)}`)
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
    return await Promise.all(
      list.map(async (b) => {
        const booking = { ...b }
        const seats = Array.isArray(booking.seats) ? booking.seats : (booking.seats ? String(booking.seats).split(",") : [])

        if (!booking.movieDetails && booking.movieId) {
          try {
            const r = await fetch(`/api/movies/${booking.movieId}`)
            const md = await r.json()
            if (md.success) booking.movieDetails = md.data
          } catch (err) {
            // ignore
          }
        }

        if (!booking.totalAmount || Number(booking.totalAmount) === 0) {
          const per = booking.showtimeDetails?.price ?? 250
          booking.totalAmount = seats.length * per
        }

        booking.seats = seats
        return booking
      })
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

        {!user && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">Enter your email to view bookings</label>
            <div className="flex gap-2">
              <input
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder="you@example.com"
                className="flex-1 px-4 py-2 border rounded"
              />
              <button onClick={() => fetchBookings()} className="px-4 py-2 bg-primary text-primary-foreground rounded">Fetch</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-muted-foreground">Loading bookings...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="text-muted-foreground">No bookings found.</div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b._id} className="p-4 bg-card rounded-lg border border-border">
                <div className="flex items-start gap-4">
                  <img src={b.movieDetails?.posterUrl || '/placeholder.svg'} alt={b.movieDetails?.title} className="w-24 h-32 object-cover rounded" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{b.movieDetails?.title || 'Movie'}</h3>
                      <div className={`px-2 py-1 rounded text-sm ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.status}</div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Show: {b.showtimeDetails?.date} {b.showtimeDetails?.time} · Hall: {b.showtimeDetails?.hall}</p>
                    <p className="text-sm mt-3">Seats: <span className="font-medium">{Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}</span></p>
                    <p className="text-sm mt-2">Total: <span className="font-semibold">₹{b.totalAmount}</span></p>
                    <div className="mt-4 flex items-center gap-3">
                      <Link href={`/booking/ticket?bookingId=${b._id}`} className="px-3 py-2 bg-primary text-primary-foreground rounded">View Ticket</Link>
                      <button onClick={() => navigator.clipboard?.writeText(b.bookingId || b._id)} className="px-3 py-2 border rounded">Copy Booking ID</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
