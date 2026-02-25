"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { Booking } from "./types"

interface BookingContextType {
  bookings: Booking[]
  addBooking: (booking: Booking) => void
  getBookingById: (id: string) => Booking | undefined
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([])

  const addBooking = (booking: Booking) => {
    setBookings([...bookings, booking])
  }

  const getBookingById = (id: string) => {
    return bookings.find((b) => b.bookingId === id)
  }

  return <BookingContext.Provider value={{ bookings, addBooking, getBookingById }}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBooking must be used within BookingProvider")
  }
  return context
}
