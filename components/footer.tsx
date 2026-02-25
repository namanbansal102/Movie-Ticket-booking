"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CineBook</h4>
          <p className="text-sm text-muted-foreground">Your ticket to the best cinema experiences. Fast booking, great seats.</p>
        </div>

        <div className="flex flex-col">
          <h5 className="font-semibold mb-2">Explore</h5>
          <Link href="/movies" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-1">Movies</Link>
          <Link href="/booking" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-1">Bookings</Link>
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Admin</Link>
        </div>

        <div>
          <h5 className="font-semibold mb-2">Follow Us</h5>
          <div className="flex items-center gap-3 mt-2">
            <a aria-label="Facebook" className="p-2 rounded-md hover:bg-primary/10 transition-colors"><Facebook size={18} /></a>
            <a aria-label="Twitter" className="p-2 rounded-md hover:bg-primary/10 transition-colors"><Twitter size={18} /></a>
            <a aria-label="Instagram" className="p-2 rounded-md hover:bg-primary/10 transition-colors"><Instagram size={18} /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-muted-foreground flex items-center justify-between">
          <span>© {new Date().getFullYear()} CineBook. All rights reserved.</span>
          <span>Made with ❤️</span>
        </div>
      </div>
    </footer>
  )
}
