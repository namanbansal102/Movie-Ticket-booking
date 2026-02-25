import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const client = await connectToDatabase()
    const db = client.db
    const users = await db.collection("users").findOne({ email, password })

    if (!users) {
      return Response.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    return Response.json({
      success: true,
      user: { id: users._id.toString(), email: users.email, name: users.name },
    })
  } catch (error) {
    console.error("Login error:", error)
    return Response.json({ success: false, message: "Login failed" }, { status: 500 })
  }
}
