import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    console.log("my search params are::::::::::::::::::::::::::::::::::::::::",searchParams);
    
    const movieId = searchParams.get("movieId")

    if (!movieId) {
      return Response.json({ success: false, message: "Movie ID required" }, { status: 400 })
    }

    const db = await connectToDatabase().then((c) => c.db)
    
    // Generate demo showtimes for the next 3 days
    const showtimes = []
    const times = ["10:00 AM", "1:30 PM", "4:00 PM", "7:00 PM", "10:00 PM"]
    
    for (let i = 0; i < 3; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      
      for (const time of times) {
        showtimes.push({
          _id: new ObjectId(),
          movieId: new ObjectId(movieId),
          date: date.toISOString().split('T')[0],
          time,
          screen: `Screen ${Math.floor(Math.random() * 3) + 1}`,
          price: 250,
          availableSeats: 100
        })
      }
    }

    return Response.json({ success: true, data: showtimes })
  } catch (error) {
    console.error("GET /api/showtimes error:", error)
    return Response.json({ success: false, message: "Failed to fetch showtimes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await connectToDatabase().then((c) => c.db)

    const result = await db.collection("showtimes").insertOne({
      ...body,
      createdAt: new Date(),
    })

    // Create seats for this showtime
    const seats = []
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]
    const seatsPerRow = 12

    for (const row of rows) {
      for (let i = 1; i <= seatsPerRow; i++) {
        seats.push({
          showTimeId: result.insertedId.toString(),
          row,
          number: i,
          status: "available",
          createdAt: new Date(),
        })
      }
    }

    await db.collection("seats").insertMany(seats)

    return Response.json({
      success: true,
      data: { _id: result.insertedId, ...body },
    })
  } catch (error) {
    console.error("POST /api/showtimes error:", error)
    return Response.json({ success: false, message: "Failed to create showtime" }, { status: 500 })
  }
}
