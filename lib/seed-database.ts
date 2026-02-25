import { connectToDatabase } from "./mongodb"

const movies = [
  {
    title: "Oppenheimer",
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    posterUrl: "/images/posters/oppenheimer-poster.png",
    duration: 180,
    rating: "PG-13",
    genre: ["Biography", "Drama", "History"],
  },
  {
    title: "Barbie",
    description: "Barbie escapes her perfect plastic world and comes to Los Angeles in search of her creator.",
    posterUrl: "/barbie-movie-poster-pink.jpg",
    duration: 114,
    rating: "PG",
    genre: ["Comedy", "Fantasy"],
  },
  {
    title: "Killers of the Flower Moon",
    description: "An FBI agent infiltrates an organization of cattlemen hit men.",
    posterUrl: "/killers-of-the-flower-moon-poster.jpg",
    duration: 206,
    rating: "PG-13",
    genre: ["Crime", "Drama", "Western"],
  },
  {
    title: "The Nun II",
    description:
      "A nun sets out to stop a demonic force that threatens to kill her sister and the orphans under her care.",
    posterUrl: "/the-nun-horror-movie-poster.jpg",
    duration: 110,
    rating: "R",
    genre: ["Horror", "Thriller"],
  },
  {
    title: "Quantum Nexus",
    description: "A mind-bending sci-fi thriller about parallel dimensions and corporate espionage.",
    genre: ["Sci-Fi", "Thriller", "Action"],
    rating: "13+",
    duration: 148,
    posterUrl: "/quantum-nexus-movie-poster-scifi-neon.jpg",
  },
  {
    title: "Echoes of Tomorrow",
    description: "A romantic drama set in a dystopian future where emotions are forbidden.",
    genre: ["Drama", "Romance", "Sci-Fi"],
    rating: "15+",
    duration: 135,
    posterUrl: "/echoes-tomorrow-movie-poster-romantic-drama-futuri.jpg",
  },
  {
    title: "Shadow Protocol",
    description: "An intense action-spy thriller with international locations and high stakes.",
    genre: ["Action", "Thriller", "Spy"],
    rating: "15+",
    duration: 156,
    posterUrl: "/shadow-protocol-spy-action-thriller-movie-poster.jpg",
  },
  {
    title: "Midnight Garden",
    description: "A magical fantasy adventure where dreams become reality.",
    genre: ["Fantasy", "Adventure", "Family"],
    rating: "U",
    duration: 128,
    posterUrl: "/midnight-garden-fantasy-adventure-magical-movie-po.jpg",
  },
]

let isSeeding = false
let seedPromise: Promise<void> | null = null

export async function seedDatabaseOnStartup() {
  if (isSeeding) {
    return seedPromise
  }

  if (seedPromise) {
    return seedPromise
  }

  isSeeding = true

  seedPromise = (async () => {
    try {
      const { db } = await connectToDatabase()

      // Check if movies already exist
      const existingMovies = await db.collection("movies").findOne({})

      if (existingMovies) {
        console.log("[v0] Database already seeded, skipping...")
        return
      }

      console.log("[v0] Seeding database with movies...")

      // Insert movies
      const movieResult = await db.collection("movies").insertMany(
        movies.map((m) => ({
          ...m,
          createdAt: new Date(),
        })),
      )

      console.log(`[v0] Inserted ${movieResult.insertedCount} movies`)

      // Insert showtimes for each movie
      const movieIds = Array.from(movieResult.insertedIds)
      const showtimes = []
      const today = new Date()

      for (let m = 0; m < movieIds.length; m++) {
        for (let d = 0; d < 7; d++) {
          const showDate = new Date(today)
          showDate.setDate(showDate.getDate() + d)

          for (const time of ["10:00", "13:00", "16:00", "19:00", "22:00"]) {
            showtimes.push({
              movieId: movieIds[m].toString(),
              date: showDate.toISOString().split("T")[0],
              time,
              hall: `${m + 1}`,
              basePrice: 250 + Math.random() * 100,
              createdAt: new Date(),
            })
          }
        }
      }

      const showResult = await db.collection("showtimes").insertMany(showtimes)
      console.log(`[v0] Inserted ${showResult.insertedCount} showtimes`)

      // Insert seats for each showtime
      let seatCount = 0
      for (const showId of showResult.insertedIds) {
        const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]
        const seats = []

        for (const row of rows) {
          for (let i = 1; i <= 12; i++) {
            seats.push({
              showTimeId: showId.toString(),
              row,
              number: i,
              status: "available",
              createdAt: new Date(),
            })
          }
        }

        await db.collection("seats").insertMany(seats)
        seatCount += seats.length
      }

      console.log(`[v0] Inserted ${seatCount} seats`)
      console.log("[v0] Database seeded successfully!")
    } catch (error) {
      console.error("[v0] Database seeding error:", error)
    } finally {
      isSeeding = false
    }
  })()

  return seedPromise
}
