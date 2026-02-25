import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const showTimeId = url.searchParams.get("showTimeId")

    const db = await connectToDatabase().then((c) => c.db)

    const seats = await db.collection("seats").find({ showTimeId }).toArray()

    return Response.json({
      success: true,
      data: seats.map((s) => ({ ...s, _id: s._id?.toString() })),
    })
  } catch (error) {
    console.error("GET /api/seats error:", error)
    return Response.json({ success: false, message: "Failed to fetch seats" }, { status: 500 })
  }
}
