"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function ReceiptPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")

  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {
    const storedBooking = localStorage.getItem('currentBooking')
    if (storedBooking) {
      const bookingData = JSON.parse(storedBooking)
      if (bookingData._id === bookingId || bookingData.bookingId === bookingId) {
        setBooking(bookingData)
      }
    }
  }, [bookingId])

  const handlePrint = () => {
    window.print()
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-semibold">Receipt not found</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">Your movie tickets have been booked successfully.</p>
          </div>

          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Booking Receipt</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Booking ID:</span>
                <span>{booking.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Movie:</span>
                <span>{booking.movieDetails?.title || booking.movieId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Showtime:</span>
                <span>{booking.showtimeDetails?.time || booking.showtimeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Seats:</span>
                <span>{booking.seats.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Customer:</span>
                <span>{booking.customerName || booking.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Payment Method:</span>
                <span>{booking.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t">
                <span>Total Amount:</span>
                <span>₹{booking.totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <button
              onClick={handlePrint}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-4"
            >
              Print Receipt
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Home
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Thank you for booking with us! Enjoy your movie.
          </p>
        </div>
      </div>
    </div>
  )
}