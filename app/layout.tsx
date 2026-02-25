import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import { BookingProvider } from "@/lib/booking-context"
import { AuthProvider } from "@/lib/auth-context"
import { seedDatabaseOnStartup } from "@/lib/seed-database"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CineBook - Premium Movie Ticketing",
  description: "Book your favorite movies with ease. Premium cinema experience.",
    generator: 'v0.app'
}

seedDatabaseOnStartup().catch(console.error)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} bg-[#0f172a] text-[#f1f5f9]`}>
        <AuthProvider>
          <BookingProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
