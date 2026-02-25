"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function SeatSelectionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const showtimeId = searchParams.get("showtimeId")
  const movieId = searchParams.get("movieId")
  const { user } = useAuth()

  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [email, setEmail] = useState(user?.email || "")
  const [pricePerSeat, setPricePerSeat] = useState<number>(250)
  const [movie, setMovie] = useState<any>(null)
  const [loadingBooking, setLoadingBooking] = useState(false)

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]
  const seatsPerRow = 12
  // Booked seats for this user (from localStorage)
  const [userBookedSeats, setUserBookedSeats] = useState<string[]>([])
  // Demo booked seats (could be fetched from server in real app)
  // Only use userBookedSeats for filtering, not for disabling
  const bookedSeats = ["A5", "A6", "C3", "D7", "E8", "F5"]
  // Load user-booked seats for this movie/showtime from localStorage
  useEffect(() => {
    if (!movieId || !showtimeId) return;
    try {
      const raw = localStorage.getItem('userBookedSeats')
      if (raw) {
        const arr = JSON.parse(raw)
        if (Array.isArray(arr)) {
          const filtered = arr.filter((s: any) => s.movieId === movieId && s.showtimeId === showtimeId)
          setUserBookedSeats(filtered.map((s: any) => s.seat))
        }
      }
    } catch {}
  }, [movieId, showtimeId])

  useEffect(() => {
    async function loadShowtime() {
      if (!movieId) return
      try {
        const m = await fetch(`/api/movies/${movieId}`).then(r => r.json())
        if (m?.success) setMovie(m.data)
      } catch (err) {
        console.error('Failed to fetch movie details', err)
      }
      try {
        const res = await fetch(`/api/showtimes?movieId=${movieId}`)
        const data = await res.json()
        if (data.success) {
          const found = data.data.find((s: any) => String(s._id) === String(showtimeId) || s._id === showtimeId)
          if (found && found.price) {
            setPricePerSeat(found.price)
          }
        }
      } catch (err) {
        console.error("Failed to load showtime price:", err)
      }
    }

    loadShowtime()
  }, [movieId, showtimeId])

  const toggleSeat = (seat: string) => {
    if (bookedSeats.includes(seat)) return
    setSelectedSeats(prev =>
      prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
    )
    // Save to localStorage immediately as "booked" for this user
    try {
      const raw = localStorage.getItem('userBookedSeats')
      let arr = []
      if (raw) arr = JSON.parse(raw)
      if (!Array.isArray(arr)) arr = []
      // Only add if not already present for this seat/movie/showtime
      if (!arr.some((s: any) => s.seat === seat && s.movieId === movieId && s.showtimeId === showtimeId)) {
        arr.push({ seat, movieId, showtimeId })
        localStorage.setItem('userBookedSeats', JSON.stringify(arr))
      }
    } catch {}
  }

  const handleProceedToPayment = async () => {
    if (selectedSeats.length === 0 || !email) {
      alert("Please select seats and enter your email")
      return
    }
    if (!movie) {
      alert('Movie details missing. Please go back and select a movie.')
      return
    }

    setLoadingBooking(true)
    try {
      const payload = {
        movieId,
        showtimeId,
        seats: selectedSeats,
        totalAmount: selectedSeats.length * pricePerSeat,
        customerEmail: email,
        customerName: user?.name || null,
        customerId: user?.id || null
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!data.success) {
        alert('Failed to create booking: ' + (data.message || 'Unknown'))
        return
      }

      // store a copy locally for quick access on payment/receipt
      localStorage.setItem('currentBooking', JSON.stringify(data.data))

      router.push(`/booking/payment?bookingId=${data.data._id}`)
    } catch (err) {
      console.error('Create booking failed', err)
      alert('Failed to create booking. See console for details.')
    } finally {
      setLoadingBooking(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Select Your Seats</h1>
          
          {/* Screen */}
          <div className="mb-8">
            <div className="bg-gray-800 text-white text-center py-2 rounded-t-3xl">
              SCREEN
            </div>
          </div>

          {/* Seats Grid */}
          <div className="space-y-2 mb-8">
            {rows.map(row => (
              <div key={row} className="flex items-center justify-center gap-2">
                <span className="w-8 font-semibold text-gray-600">{row}</span>
                {Array.from({ length: seatsPerRow }, (_, i) => {
                  const seatNum = `${row}${i + 1}`
                  // If seat is in userBookedSeats, do not render it at all
                  if (userBookedSeats.includes(seatNum)) return null
                  const isBooked = bookedSeats.includes(seatNum)
                  const isSelected = selectedSeats.includes(seatNum)

                  return (
                    <button
                      key={seatNum}
                      onClick={() => toggleSeat(seatNum)}
                      disabled={isBooked}
                      className={`w-8 h-8 rounded-t-lg text-xs font-semibold transition ${
                        isBooked
                          ? "bg-gray-400 cursor-not-allowed"
                          : isSelected
                          ? "bg-green-500 text-white"
                          : "bg-blue-200 hover:bg-blue-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-200 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-400 rounded"></div>
              <span>Booked</span>
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Summary */}
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span>Selected Seats:</span>
              <span className="font-semibold">{selectedSeats.join(", ") || "None"}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span>₹{selectedSeats.length * pricePerSeat}</span>
            </div>
          </div>

          <button
            onClick={handleProceedToPayment}
            disabled={selectedSeats.length === 0 || !email || loadingBooking}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loadingBooking ? 'Creating booking...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </div>
  )
}
