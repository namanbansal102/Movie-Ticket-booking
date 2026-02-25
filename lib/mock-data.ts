import type { Movie, Showtime } from "./types"

export const mockMovies: Movie[] = [
  {
    id: "1",
    title: "Quantum Nexus",
    description: "A mind-bending sci-fi thriller about parallel dimensions and corporate espionage.",
    genre: ["Sci-Fi", "Thriller", "Action"],
    rating: 8.5,
    duration: 148,
    releaseDate: "2024-12-15",
    posterUrl: "/quantum-nexus-movie-poster-scifi-neon.jpg",
    language: "English",
    ageRating: "13+",
  },
  {
    id: "2",
    title: "Echoes of Tomorrow",
    description: "A romantic drama set in a dystopian future where emotions are forbidden.",
    genre: ["Drama", "Romance", "Sci-Fi"],
    rating: 7.8,
    duration: 135,
    releaseDate: "2024-12-10",
    posterUrl: "/echoes-tomorrow-movie-poster-romantic-drama-futuri.jpg",
    language: "English",
    ageRating: "15+",
  },
  {
    id: "3",
    title: "Shadow Protocol",
    description: "An intense action-spy thriller with international locations and high stakes.",
    genre: ["Action", "Thriller", "Spy"],
    rating: 8.2,
    duration: 156,
    releaseDate: "2024-12-08",
    posterUrl: "/shadow-protocol-spy-action-thriller-movie-poster.jpg",
    language: "English",
    ageRating: "15+",
  },
  {
    id: "4",
    title: "Midnight Garden",
    description: "A magical fantasy adventure where dreams become reality.",
    genre: ["Fantasy", "Adventure", "Family"],
    rating: 8.1,
    duration: 128,
    releaseDate: "2024-12-12",
    posterUrl: "/midnight-garden-fantasy-adventure-magical-movie-po.jpg",
    language: "English",
    ageRating: "U",
  },
  {
    id: "5",
    title: "The Crimson Code",
    description: "A psychological thriller about a detective hunting a serial killer in the city.",
    genre: ["Thriller", "Crime", "Drama"],
    rating: 8.7,
    duration: 142,
    releaseDate: "2024-12-18",
    posterUrl: "/crimson-code-thriller-crime-movie-poster-dark.jpg",
    language: "English",
    ageRating: "18+",
  },
  {
    id: "6",
    title: "Aurora Rising",
    description: "An epic superhero film where a teenager discovers her incredible powers.",
    genre: ["Action", "Superhero", "Adventure"],
    rating: 8.0,
    duration: 152,
    releaseDate: "2024-12-14",
    posterUrl: "/aurora-rising-superhero-movie-poster-epic-action.jpg",
    language: "English",
    ageRating: "12+",
  },
]

export const mockShowtimes: Showtime[] = [
  { id: "s1", movieId: "1", time: "10:00 AM", format: "2D", price: 8.99, availableSeats: 45, totalSeats: 96 },
  { id: "s2", movieId: "1", time: "01:30 PM", format: "3D", price: 11.99, availableSeats: 12, totalSeats: 96 },
  { id: "s3", movieId: "1", time: "05:00 PM", format: "2D", price: 8.99, availableSeats: 78, totalSeats: 96 },
  { id: "s4", movieId: "1", time: "08:30 PM", format: "3D", price: 11.99, availableSeats: 24, totalSeats: 96 },
  { id: "s5", movieId: "2", time: "11:00 AM", format: "2D", price: 8.99, availableSeats: 65, totalSeats: 96 },
  { id: "s6", movieId: "2", time: "02:15 PM", format: "2D", price: 8.99, availableSeats: 34, totalSeats: 96 },
  { id: "s7", movieId: "2", time: "06:00 PM", format: "3D", price: 11.99, availableSeats: 8, totalSeats: 96 },
  { id: "s8", movieId: "3", time: "09:00 AM", format: "2D", price: 8.99, availableSeats: 56, totalSeats: 96 },
  { id: "s9", movieId: "3", time: "12:30 PM", format: "2D", price: 8.99, availableSeats: 42, totalSeats: 96 },
  { id: "s10", movieId: "3", time: "04:00 PM", format: "3D", price: 11.99, availableSeats: 18, totalSeats: 96 },
]

export const generateSeatsForShowtime = (showtimeId: string) => {
  const seats = []
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]
  const seatsPerRow = 12

  for (const row of rows) {
    for (let i = 1; i <= seatsPerRow; i++) {
      seats.push({
        id: `${showtimeId}-${row}${i}`,
        row,
        number: i,
        isAvailable: Math.random() > 0.3,
        showtimeId,
      })
    }
  }

  return seats
}
