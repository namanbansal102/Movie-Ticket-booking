import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    const client = await connectToDatabase()
    const db = client.db

    const existing = await db.collection("users").findOne({ email })
    if (existing) {
      return Response.json({ success: false, message: "Email already exists" }, { status: 400 })
    }

    const result = await db.collection("users").insertOne({
      name,
      email,
      password,
      createdAt: new Date(),
    })

    return Response.json({
      success: true,
      user: { id: result.insertedId.toString(), email, name },
    })
  } catch (error) {
    console.error("Register error:", error)
    return Response.json({ success: false, message: "Registration failed" }, { status: 500 })
  }
}
