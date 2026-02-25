"use client"
import Link from "next/link"
import type { Movie } from "@/lib/types"

interface MovieCardProps {
  movie: Movie
  index?: number
}

export default function MovieCard({ movie, index = 0 }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`}>
      <div
        className="group cursor-pointer h-full"
        style={{ animation: `slideUp 0.6s ease-out forwards`, animationDelay: `${index * 0.1}s` }}
      >
        <div className="relative overflow-hidden rounded-lg mb-4 glass-effect p-0 aspect-[3/4] hover-lift">
          <img
            src={movie.posterUrl || "/placeholder.svg"}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#ec4899] to-[#06b6d4] text-white font-semibold hover:shadow-2xl glow-pulse">
              Book Now
            </button>
          </div>
          <div className="absolute top-3 right-3 bg-[#ec4899] text-white px-3 py-1 rounded-full text-sm font-bold">
            {movie.ageRating}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg line-clamp-1 group-hover:text-[#06b6d4] transition-colors">{movie.title}</h3>
          <p className="text-sm text-[#cbd5e1] line-clamp-2 mb-2">{movie.description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-2">
              {movie.genre.slice(0, 2).map((g) => (
                <span key={g} className="px-2 py-1 rounded bg-[#1e293b] text-[#06b6d4] text-xs">
                  {g}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-[#fbbf24]">
              <span>★</span>
              <span className="font-bold">{movie.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
