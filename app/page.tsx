"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"
import MyBookings from "@/components/my-bookings"

interface Movie {
  _id: string
  title: string
  posterUrl: string
  genre: string[]
  rating: string
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("/api/movies")
        const data = await res.json()
        setMovies(data.data || [])
      } catch (error) {
        console.error("Failed to fetch movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CineBook
          </h1>
          <div className="flex items-center gap-3">
            <Link href="/booking">
           
            </Link>
            <Link href="/admin">
              <Button variant="outline" size="sm">Admin</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-card to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-slide-up">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Book Your Next Movie
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Experience cinema like never before. Choose from the latest blockbusters.
          </p>
        </div>
      </section>

      {/* Featured / CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="animate-slide-up">
            <h3 className="text-4xl md:text-5xl font-bold mb-4">Find movies, choose seats, and book instantly</h3>
            <p className="text-muted-foreground mb-6">Discover trending films and reserve the best seats in just a few taps. Enjoy curated recommendations and special deals.</p>
            <div className="flex items-center gap-4">
              <Link href="/movies">
                <Button size="lg">Browse Movies</Button>
              </Link>
              <Link href="/booking/payment">
                <Button variant="ghost" size="lg">Quick Book</Button>
              </Link>
              <Link href="/booking">
                <Button variant="outline" size="lg">My Bookings</Button>
              </Link>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden bg-gradient-to-tr from-primary/10 to-accent/10 p-8 animate-hero-pulse">
            <div className="h-56 rounded-lg bg-[url('https://images.adsttc.com/media/images/58d5/3a58/e58e/ce48/a700/003f/large_jpg/002.jpg?1490369108')] bg-cover bg-center shadow-lg" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-card/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h4 className="text-2xl font-bold mb-8 text-center">Why CineBook?</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-shadow animate-slide-in">
              <h5 className="font-semibold mb-2">Fast Booking</h5>
              <p className="text-sm text-muted-foreground">Reserve seats in seconds with a streamlined checkout.</p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-shadow animate-slide-in" style={{ animationDelay: `120ms` }}>
              <h5 className="font-semibold mb-2">Curated Picks</h5>
              <p className="text-sm text-muted-foreground">Personalized recommendations based on what you love.</p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-shadow animate-slide-in" style={{ animationDelay: `240ms` }}>
              <h5 className="font-semibold mb-2">Secure Payments</h5>
              <p className="text-sm text-muted-foreground">Multiple payment options with safe checkout flows.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Now Showing / Movies Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold mb-12 text-foreground animate-slide-in">Now Showing</h3>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No movies available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.map((movie, index) => (
              <Link key={movie._id} href={`/movie/${movie._id}`}>
                <div className="group cursor-pointer animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="relative overflow-hidden rounded-lg mb-4 h-80 bg-card border border-border hover:border-primary transition-colors duration-300">
                    <img
                      src={movie.posterUrl || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <Button size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {movie.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm px-2 py-1 bg-primary/20 text-primary rounded">{movie.rating}</span>
                    <span className="text-sm text-muted-foreground">{movie.genre.join(", ")}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h4 className="text-2xl font-bold mb-6">What moviegoers say</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-card rounded-lg border border-border animate-fade-in">
              <p className="text-sm text-muted-foreground">“Seamless booking and great seats. Highly recommend!”</p>
              <div className="mt-4 font-semibold">— Priya</div>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border animate-fade-in" style={{ animationDelay: `120ms` }}>
              <p className="text-sm text-muted-foreground">“Love the recommendations — found movies I’d otherwise miss.”</p>
              <div className="mt-4 font-semibold">— Marcus</div>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border animate-fade-in" style={{ animationDelay: `240ms` }}>
              <p className="text-sm text-muted-foreground">“Fast checkout and reliable confirmations — great app.”</p>
              <div className="mt-4 font-semibold">— Aisha</div>
            </div>
          </div>
        </div>
      </section>

      {/* My Bookings widget */}
      <MyBookings />

      <Footer />
    </div>
  )
}
