"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"

export default function MovieDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [movie, setMovie] = useState<any>(null)
  const [showtimes, setShowtimes] = useState<any[]>([])
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMovieAndShowtimes()
  }, [params.id])

  const fetchMovieAndShowtimes = async () => {
    try {
      const [movieRes, showtimesRes] = await Promise.all([
        fetch(`/api/movies/${params.id}`),
        fetch(`/api/showtimes?movieId=${params.id}`)
      ])

      const movieData = await movieRes.json()
      const showtimesData = await showtimesRes.json()

      if (movieData.success) setMovie(movieData.data)
      if (showtimesData.success) setShowtimes(showtimesData.data)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleShowtimeSelect = (showtime: any) => {
    setSelectedShowtime(showtime)
    router.push(`/seats/${params.id}`)
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  if (!movie) return <div className="p-8 text-center">Movie not found</div>

  const groupedShowtimes = showtimes.reduce((acc, st) => {
    if (!acc[st.date]) acc[st.date] = []
    acc[st.date].push(st)
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
          <p className="text-gray-600 mb-6">{movie.description}</p>
          <div className="flex gap-4 text-sm text-gray-700">
            <span>Genre: {movie.genre}</span>
            <span>Duration: {movie.duration} min</span>
            <span>Rating: {movie.rating}/10</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Select Showtime</h2>
          
          {Object.entries(groupedShowtimes).map(([date, times]) => (
            <div key={date} className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {times.map((showtime) => (
                  <button
                    key={showtime._id}
                    onClick={() => handleShowtimeSelect(showtime)}
                    className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                  >
                    <div className="font-semibold">{showtime.time}</div>
                    <div className="text-xs text-gray-600">{showtime.screen}</div>
                    <div className="text-sm text-green-600 mt-1">₹{showtime.price}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
