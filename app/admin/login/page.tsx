"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate delay
    setTimeout(() => {
      if (password === "admin123") {
        localStorage.setItem("admin-authenticated", "true")
        router.push("/admin/dashboard")
      } else {
        setError("Invalid password")
      }
      setIsLoading(false)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-40 right-40 w-96 h-96 bg-[#ec4899] rounded-full mix-blend-screen filter blur-3xl"></div>
        <div className="absolute bottom-40 left-40 w-96 h-96 bg-[#06b6d4] rounded-full mix-blend-screen filter blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10 fade-in">
        <div className="text-center mb-8">
          <div className="inline-block mb-4 relative">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#ec4899] to-[#06b6d4] flex items-center justify-center">
              <span className="text-2xl font-bold text-white">⚙</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Admin Portal</h1>
          <p className="text-[#cbd5e1]">Manage movies and showtimes</p>
        </div>

        <form onSubmit={handleLogin} className="glass-effect p-8 rounded-lg border border-white/10 space-y-6 scale-in">
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#cbd5e1]">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-white/10 text-white placeholder-[#64748b] focus:outline-none focus:border-[#06b6d4] focus:ring-2 focus:ring-[#06b6d4]/20 transition-all"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium slide-up">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#ec4899] to-[#06b6d4] text-white font-bold hover:shadow-2xl glow-pulse disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? "Logging in..." : "Login to Dashboard"}
          </button>

          <div className="text-center">
            <Link href="/" className="text-[#06b6d4] hover:text-[#ec4899] transition-colors text-sm">
              ← Back to Movies
            </Link>
          </div>
        </form>

        <div className="mt-6 p-4 glass-effect rounded-lg border border-white/10 text-center text-sm text-[#cbd5e1]">
          <p>
            Demo Password: <span className="font-mono font-bold text-[#fbbf24]">admin123</span>
          </p>
        </div>
      </div>
    </div>
  )
}
