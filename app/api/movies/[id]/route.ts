import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await connectToDatabase().then((c) => c.db)
    
    const movie = await db.collection("movies").findOne({ _id: new ObjectId(id) })

    if (!movie) {
      return Response.json({ success: false, message: "Movie not found" }, { status: 404 })
    }

    return Response.json({
      success: true,
      data: { ...movie, _id: movie._id?.toString() },
    })
  } catch (error) {
    console.error("GET /api/movies/[id] error:", error)
    return Response.json({ success: false, message: "Failed to fetch movie" }, { status: 500 })
  }
}
