"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from '@/lib/auth-context'

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")

  const [selectedPayment, setSelectedPayment] = useState("")
  const [processing, setProcessing] = useState(false)
  const [booking, setBooking] = useState<any>(null)
  const [error, setError] = useState("")

  

  useEffect(() => {
    const load = async () => {
      const storedBooking = localStorage.getItem('currentBooking')
      if (storedBooking) {
        const bookingData = JSON.parse(storedBooking)
        if (bookingData._id === bookingId || bookingData.bookingId === bookingId) {
          setBooking(bookingData)
          return
        }
      }

      if (bookingId) {
        try {
          const res = await fetch(`/api/bookings/${bookingId}`)
          const data = await res.json()
          if (data.success) {
            setBooking(data.data)
            localStorage.setItem('currentBooking', JSON.stringify(data.data))
          } else {
            setError('Booking not found')
          }
        } catch (err) {
          console.error('Failed to fetch booking from API', err)
          setError('Failed to load booking details')
        }
      } else {
        setError('Booking not found')
      }
    }

    load()
  }, [bookingId])

  const paymentMethods = [
    { id: "upi", name: "UPI", icon: "💳" },
    { id: "card", name: "Credit/Debit Card", icon: "💳" },
    { id: "netbanking", name: "Net Banking", icon: "🏦" },
    { id: "wallet", name: "Digital Wallet", icon: "👛" },
  ]

  const { user } = useAuth()

  const handlePayment = async () => {
    if (!selectedPayment) {
      alert("Please select a payment method")
      return
    }

    if (!bookingId) {
      alert("Invalid booking ID")
      return
    }

    setProcessing(true)
    setError("")

    // Simulate payment processing
    setTimeout(async () => {
      try {
        const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`

        // update booking in DB (use _id if present)
        const bookingDbId = booking?._id || bookingId
        if (bookingDbId) {
          try {
            const res = await fetch('/api/bookings', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ bookingId: bookingDbId, status: 'confirmed', paymentMethod: selectedPayment, transactionId, customerId: user?.id || null })
            })

            const patchData = await res.json()
            if (!patchData.success) {
              console.warn('Failed to update booking status on server', patchData)
            }
          } catch (err) {
            console.error('Failed to PATCH booking:', err)
          }
        }

        // Update booking status in localStorage
        const updatedBooking = { ...booking, status: 'confirmed', paymentMethod: selectedPayment, transactionId }
        localStorage.setItem('currentBooking', JSON.stringify(updatedBooking))

        router.push(`/booking/receipt?bookingId=${bookingDbId}`)
      } catch (error) {
        console.error('Payment failed:', error)
        setError('Payment processing failed')
        alert('Payment failed. Please try again.')
      } finally {
        setProcessing(false)
      }
    }, 2000)
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-semibold">{error}</p>
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
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Payment</h1>

          {booking && (
            <div className="mb-6 p-4 bg-blue-900/30 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">Booking Summary</h3>
              <div className="text-sm space-y-1 text-gray-300">
                <div className="flex justify-between">
                  <span>Movie:</span>
                  <span className="font-semibold">{booking.movieDetails?.title || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Seats:</span>
                  <span className="font-semibold">{booking.seats?.join(", ") || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-semibold">{booking.customerEmail || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-700">
                  <span>Total Amount:</span>
                  <span className="text-green-400">₹{booking.totalAmount || 0}</span>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-white">Select Payment Method</h2>
            <div className="space-y-3">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  disabled={processing}
                  className={`w-full p-4 border-2 rounded-lg flex items-center gap-4 transition ${
                    selectedPayment === method.id
                      ? "border-blue-500 bg-blue-800"
                      : "border-gray-700 hover:border-gray-600"
                  } ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span className="text-3xl">{method.icon}</span>
                  <span className="font-semibold text-white">{method.name}</span>
                  {selectedPayment === method.id && (
                    <span className="ml-auto text-blue-400">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {selectedPayment === "card" && (
            <div className="mb-6 space-y-4 p-4 bg-gray-800 rounded-lg">
              <input
                type="text"
                placeholder="Card Number (e.g., 4111 1111 1111 1111)"
                className="w-full px-4 py-2 border rounded bg-gray-700 text-white"
                disabled={processing}
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-1/2 px-4 py-2 border rounded bg-gray-700 text-white"
                  disabled={processing}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="w-1/2 px-4 py-2 border rounded bg-gray-700 text-white"
                  disabled={processing}
                />
              </div>
              <input
                type="text"
                placeholder="Cardholder Name"
                className="w-full px-4 py-2 border rounded bg-gray-700 text-white"
                disabled={processing}
              />
            </div>
          )}

          {selectedPayment === "upi" && (
            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
              <input
                type="text"
                placeholder="Enter UPI ID (e.g., user@paytm)"
                className="w-full px-4 py-2 border rounded bg-gray-700 text-white"
                disabled={processing}
              />
            </div>
          )}

          {selectedPayment === "netbanking" && (
            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
              <select className="w-full px-4 py-2 border rounded bg-gray-700 text-white" disabled={processing}>
                <option value="">Select Bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
              </select>
            </div>
          )}

          {selectedPayment === "wallet" && (
            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
              <select className="w-full px-4 py-2 border rounded bg-gray-700 text-white" disabled={processing}>
                <option value="">Select Wallet</option>
                <option value="paytm">Paytm</option>
                <option value="phonepe">PhonePe</option>
                <option value="googlepay">Google Pay</option>
                <option value="amazonpay">Amazon Pay</option>
              </select>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-800 border border-red-700 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={!selectedPayment || processing}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Processing Payment...
              </span>
            ) : (
              "Pay Now"
            )}
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            🔒 Your payment is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  )
}
