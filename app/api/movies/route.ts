import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await connectToDatabase().then((c) => c.db)
    const movies = await db.collection("movies").find().toArray()

    return Response.json({
      success: true,
      data: movies.map((m) => ({ ...m, _id: m._id?.toString() })),
    })
  } catch (error) {
    console.error("GET /api/movies error:", error)
    return Response.json({ success: false, message: "Failed to fetch movies" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await connectToDatabase().then((c) => c.db)

    const result = await db.collection("movies").insertOne({
      ...body,
      createdAt: new Date(),
    })

    return Response.json({
      success: true,
      data: { _id: result.insertedId, ...body },
    })
  } catch (error) {
    console.error("POST /api/movies error:", error)
    return Response.json({ success: false, message: "Failed to create movie" }, { status: 500 })
  }
}
