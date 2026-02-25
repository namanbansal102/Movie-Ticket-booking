import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = await connectToDatabase().then((c) => c.db)
    console.log("my params are::::",params);
    
    const showtime = await db.collection("showtimes").findOne({ _id: new ObjectId(params.id) })

    if (!showtime) {
      return Response.json({ success: false, message: "Showtime not found" }, { status: 404 })
    }

    return Response.json({
      success: true,
      data: { ...showtime, _id: showtime._id?.toString() },
    })
  } catch (error) {
    console.error("GET /api/showtimes/[id] error:", error)
    return Response.json({ success: false, message: "Failed to fetch showtime" }, { status: 500 })
  }
}
