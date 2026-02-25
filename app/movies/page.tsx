import Link from "next/link"
import { getDatabase } from "@/lib/mongodb"
import type { Movie } from "@/lib/types"

export const revalidate = 10

export default async function MoviesPage() {
  let movies: Movie[] = []

  try {
    const db = await getDatabase()
    const rows = await db.collection("movies").find().toArray()
    movies = rows.map((r: any) => ({ ...r, _id: r._id?.toString() }))
  } catch (err) {
    console.error("Failed to load movies for /movies page:", err)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-6">All Movies</h1>

        {movies.length === 0 ? (
          <div className="text-muted-foreground">No movies found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <Link key={movie._id} href={`/movie/${movie._id}`}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg mb-4 h-80 bg-card border border-border hover:border-primary transition-colors duration-300">
                    <img
                      src={movie.posterUrl || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{movie.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{movie.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
