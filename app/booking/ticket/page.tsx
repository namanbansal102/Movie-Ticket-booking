"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"

export default function TicketPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get("bookingId")
  const ticketRef = useRef<HTMLDivElement>(null)

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBooking()
  }, [bookingId])

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`)
      const data = await res.json()

      if (data.success) {
        setBooking(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch booking:", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadTicket = () => {
    if (ticketRef.current) {
      const printWindow = window.open('', '', 'height=600,width=800')
      if (printWindow) {
        printWindow.document.write('<html><head><title>Movie Ticket</title>')
        printWindow.document.write('<style>body{font-family:Arial;padding:20px;}</style>')
        printWindow.document.write('</head><body>')
        printWindow.document.write(ticketRef.current.innerHTML)
        printWindow.document.write('</body></html>')
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  if (loading) return <div className="min-h-screen bg-black text-white p-8 text-center">Loading...</div>

  if (!booking) return <div className="min-h-screen bg-black text-white p-8 text-center">Booking not found</div>

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-green-400 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-400">Your tickets have been sent to {booking.customerEmail}</p>
        </div>

        <div ref={ticketRef} className="bg-gray-900 rounded-lg shadow-lg p-8 mb-6 border border-gray-800">
          <div className="border-4 border-dashed border-gray-700 rounded-lg p-6">
            {/* Ticket Header */}
            <div className="text-center mb-6 pb-6 border-b-2 border-dashed border-gray-700">
              <h2 className="text-2xl font-bold mb-2 text-white">{booking.movie?.title || booking.movieDetails?.title}</h2>
              <div className="text-gray-400">
                {booking.movie?.genre && `${booking.movie.genre} • `}{booking.movie?.duration || booking.movieDetails?.duration} min
              </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-sm text-gray-500">Booking ID</div>
                <div className="font-semibold text-white">{booking.bookingId}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Seats</div>
                <div className="font-semibold text-white">{booking.seats?.join(", ")}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Date & Time</div>
                <div className="font-semibold text-white">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Amount</div>
                <div className="font-semibold text-green-400">₹{booking.totalAmount}</div>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white rounded">
                <QRCodeSVG 
                  value={JSON.stringify({
                    bookingId: booking.bookingId,
                    movieTitle: booking.movie?.title || booking.movieDetails?.title,
                    seats: booking.seats,
                    date: new Date(booking.createdAt).toLocaleDateString(),
                    amount: booking.totalAmount
                  })}
                  size={128}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>

            <div className="text-center text-xs text-gray-500">
              Show this ticket at the cinema entrance
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={downloadTicket}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            📥 Download Ticket
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition border border-gray-700"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
