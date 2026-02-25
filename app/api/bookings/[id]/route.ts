import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const db = await connectToDatabase().then((c) => c.db)
    const { id } = await params;
    // Try find by ObjectId first, but also allow lookup by bookingId string (e.g., BK...)
    let booking: any = null

    // attempt as ObjectId
    try {
      booking = await db.collection("bookings").findOne({ _id: new ObjectId(id) })
    } catch (err) {
      // invalid ObjectId, ignore
    }

    // if not found by _id, try by bookingId field
    if (!booking) {
      booking = await db.collection("bookings").findOne({ bookingId: params.id })
    }

    if (!booking) {
      return Response.json({ success: false, message: "Booking not found" }, { status: 404 })
    }

    const movie = booking.movieId ? await db.collection("movies").findOne({ _id: booking.movieId }) : null

    return Response.json({
      success: true,
      data: {
        ...booking,
        _id: booking._id.toString(),
        movie,
      },
    })
  } catch (error) {
    console.error("GET /api/bookings/[id] error:", error)
    return Response.json({ success: false, message: "Failed to fetch booking" }, { status: 500 })
  }
}
