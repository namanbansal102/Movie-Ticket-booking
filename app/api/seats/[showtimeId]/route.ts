export async function GET(request: Request, { params }: { params: Promise<{ showtimeId: string }> }) {
  const { showtimeId } = await params
  const { generateSeatsForShowtime } = await import("@/lib/mock-data")

  const seats = generateSeatsForShowtime(showtimeId)

  return Response.json({
    success: true,
    data: seats,
    count: seats.length,
  })
}
