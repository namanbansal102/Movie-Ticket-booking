import { connectToDatabase } from "../lib/mongodb"

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
]

async function seedDatabase() {
  try {
    const { db } = await connectToDatabase()

    // Clear existing data
    await db.collection("movies").deleteMany({})
    await db.collection("showtimes").deleteMany({})
    await db.collection("seats").deleteMany({})
    await db.collection("bookings").deleteMany({})

    // Insert movies
    const movieResult = await db.collection("movies").insertMany(movies.map((m) => ({ ...m, createdAt: new Date() })))

    console.log(`Inserted ${movieResult.insertedCount} movies`)

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
    console.log(`Inserted ${showResult.insertedCount} showtimes`)

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

    console.log(`Inserted ${seatCount} seats`)
    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Seeding error:", error)
  }
}

seedDatabase()
