"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ec4899] to-[#06b6d4] flex items-center justify-center font-bold text-white">
            C
          </div>
          <span className="gradient-text font-bold text-xl hidden sm:inline">CineBook</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="hover:text-[#06b6d4] transition-colors">
            Movies
          </Link>
          <Link href="/about" className="hover:text-[#06b6d4] transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-[#06b6d4] transition-colors">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <div className="text-sm text-right">
                <p className="font-semibold text-[#f1f5f9]">{user.name}</p>
                <p className="text-[#94a3b8] text-xs">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg border border-white/10 hover:border-[#06b6d4] hover:text-[#06b6d4] transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <button className="px-4 py-2 rounded-lg border border-white/10 hover:border-[#06b6d4] hover:text-[#06b6d4] transition-colors">
                  Login
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#ec4899] to-[#06b6d4] hover:shadow-lg hover:shadow-[#06b6d4]/50 transition-all">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden w-10 h-10 rounded-lg glass-effect flex items-center justify-center hover:bg-white/10"
        >
          <span className="text-2xl">☰</span>
        </button>
      </div>

      {isOpen && (
        <nav className="md:hidden px-4 py-4 border-t border-white/10 space-y-3">
          <Link href="/" className="block hover:text-[#06b6d4]">
            Movies
          </Link>
          <Link href="#" className="block hover:text-[#06b6d4]">
            About
          </Link>
          <Link href="#" className="block hover:text-[#06b6d4]">
            Contact
          </Link>
          {user && (
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 rounded-lg border border-white/10 hover:border-[#06b6d4] hover:text-[#06b6d4] transition-colors mt-4"
            >
              Logout
            </button>
          )}
        </nav>
      )}
    </header>
  )
}
