import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

function generateBookingId(): string {
  return "BK" + Date.now() + Math.random().toString(36).substr(2, 9)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("my body is:::::",body);
    
    let { showtimeId, movieId, seats, totalAmount, customerEmail, customerName, customerId } = body
    // movieId="690da33502bb45639914242e"
    const db = await connectToDatabase().then((c) => c.db)
    // fetch movie snapshot to store with booking
    const movie = movieId ? await db.collection("movies").findOne({ _id: new ObjectId(movieId) }) : null

    if (!movie) {
      return Response.json({ success: false, message: "Movie not found" }, { status: 404 })
    }

    if (!totalAmount || totalAmount <= 0) {
      return Response.json({ success: false, message: "Invalid total amount" }, { status: 400 })
    }

    const booking: any = {
      showtimeId: showtimeId || null,
      movieId: new ObjectId(movieId),
      seats: seats || [],
      totalAmount,
      customerEmail,
      customerName: customerName || null,
      // will set customerId below if provided
      customerId: null,
      movieDetails: {
        title: movie.title,
        posterUrl: movie.posterUrl,
        duration: movie.duration
      },
      showtimeDetails: null, // Showtimes are demo, not persisted
      status: "pending",
      createdAt: new Date(),
      bookingId: generateBookingId(),
    }
    if (customerId) {
      try {
        booking.customerId = new ObjectId(customerId)
      } catch (err) {
        booking.customerId = customerId
      }
    }

    const result = await db.collection("bookings").insertOne(booking)

    // prepare response booking with stringified ids for the client
    const responseBooking: any = {
      ...booking,
      _id: result.insertedId.toString(),
      movieId: booking.movieId ? booking.movieId.toString() : null,
      showtimeId: booking.showtimeId ? booking.showtimeId.toString() : null,
      customerId: null,
    }
    if (booking.customerId) {
      try {
        // ObjectId -> string
        responseBooking.customerId = booking.customerId instanceof ObjectId ? booking.customerId.toString() : booking.customerId
      } catch (err) {
        responseBooking.customerId = booking.customerId
      }
    }

    return Response.json({ success: true, data: responseBooking })
  } catch (error) {
    console.log("POST /api/bookings error:", error)
    return Response.json({ success: false, message: "Failed to create booking" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const email = url.searchParams.get("email")

    if (!email) {
      return Response.json({ success: false, message: "Missing email query parameter" }, { status: 400 })
    }

    const db = await connectToDatabase().then((c) => c.db)

    const rows = await db.collection("bookings").find({ customerEmail: email }).toArray()

    const data = rows.map((b: any) => ({
      ...b,
      _id: b._id.toString(),
      movieId: b.movieId ? b.movieId.toString() : null,
      showtimeId: b.showtimeId ? b.showtimeId.toString() : null,
    }))

    return Response.json({ success: true, data })
  } catch (error) {
    console.error("GET /api/bookings error:", error)
    return Response.json({ success: false, message: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { bookingId, status, paymentMethod, transactionId, paymentDetails, customerId } = body

    const db = await connectToDatabase().then((c) => c.db)
    
    // Try update by ObjectId first, fall back to bookingId field
    let result: any = { matchedCount: 0 }
    try {
      const update: any = {
        status,
        paymentMethod,
        paidAt: new Date(),
      }
      if (transactionId) update.transactionId = transactionId
      if (paymentDetails) update.paymentDetails = paymentDetails
      if (customerId) {
        try {
          update.customerId = new ObjectId(customerId)
        } catch (err) {
          update.customerId = customerId
        }
      }

      result = await db.collection("bookings").updateOne(
        { _id: new ObjectId(bookingId) },
        { 
          $set: update
        }
      )
    } catch (err) {
      // invalid ObjectId, try by bookingId string
      const update2: any = {
        status,
        paymentMethod,
        paidAt: new Date(),
      }
      if (transactionId) update2.transactionId = transactionId
      if (paymentDetails) update2.paymentDetails = paymentDetails
      if (customerId) update2.customerId = customerId

      result = await db.collection("bookings").updateOne(
        { bookingId: bookingId },
        {
          $set: update2
        }
      )
    }

    if (result.matchedCount === 0) {
      return Response.json({ success: false, message: "Booking not found" }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("PATCH /api/bookings error:", error)
    return Response.json({ success: false, message: "Failed to update booking" }, { status: 500 })
  }
}
