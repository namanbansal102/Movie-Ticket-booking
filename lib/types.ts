export interface Movie {
  _id?: string
  title: string
  description: string
  posterUrl: string
  duration: number
  rating: string
  genre: string[]
  createdAt?: Date
}

export interface ShowTime {
  _id?: string
  movieId: string
  date: string
  time: string
  hall: string
  basePrice: number
  createdAt?: Date
}

export interface Seat {
  _id?: string
  showTimeId: string
  row: string
  number: number
  status: "available" | "booked" | "reserved"
  createdAt?: Date
}

export interface Booking {
  _id?: string
  showTimeId: string
  seatIds: string[]
  customerName: string
  customerEmail: string
  totalPrice: number
  bookingId: string
  createdAt?: Date
}
