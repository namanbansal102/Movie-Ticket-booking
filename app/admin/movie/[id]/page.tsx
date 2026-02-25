"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"

interface ShowTime {
  _id: string
  date: string
  time: string
  hall: string
  basePrice: number
}

export default function MovieShowtimes() {
  const params = useParams()
  const router = useRouter()
  const movieId = params.id as string

  const [showTimes, setShowTimes] = useState<ShowTime[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    hall: "",
    basePrice: "",
  })

  useEffect(() => {
    fetchShowTimes()
  }, [movieId])

  const fetchShowTimes = async () => {
    try {
      const res = await fetch(`/api/showtimes?movieId=${movieId}`)
      const data = await res.json()
      setShowTimes(data.data || [])
    } catch (error) {
      console.error("Failed to fetch showtimes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddShowtime = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/showtimes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId,
          ...formData,
          basePrice: Number.parseInt(formData.basePrice),
        }),
      })

      if (res.ok) {
        setFormData({ date: "", time: "", hall: "", basePrice: "" })
        setShowForm(false)
        fetchShowTimes()
      }
    } catch (error) {
      console.error("Failed to add showtime:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Manage Showtimes</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Showtime
          </Button>
        </div>

        {/* Add Showtime Form */}
        {showForm && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8 animate-scale-in">
            <form onSubmit={handleAddShowtime} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
                <Input
                  placeholder="Hall Number"
                  value={formData.hall}
                  onChange={(e) => setFormData({ ...formData, hall: e.target.value })}
                  required
                />
                <Input
                  type="number"
                  placeholder="Base Price"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Add Showtime
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Showtimes List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : showTimes.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground">No showtimes yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showTimes.map((showtime, index) => (
              <div
                key={showtime._id}
                className="bg-card border border-border rounded-lg p-6 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-muted-foreground text-sm mb-2">{new Date(showtime.date).toLocaleDateString()}</p>
                <p className="text-2xl font-bold text-primary mb-2">{showtime.time}</p>
                <p className="text-muted-foreground text-sm mb-2">Hall {showtime.hall}</p>
                <p className="text-lg font-semibold text-accent">₹{showtime.basePrice}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
