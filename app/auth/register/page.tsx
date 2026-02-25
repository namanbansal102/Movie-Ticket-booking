"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading, error } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [localError, setLocalError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters")
      return
    }

    try {
      await register(name, email, password)
      router.push("/")
    } catch (err) {
      setLocalError("Registration failed. Email may already be in use.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1a1f2e] flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="glass-effect border border-white/10 rounded-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold gradient-text">CineBook</h1>
            <p className="text-[#94a3b8] mt-2">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#f1f5f9] block mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#06b6d4] transition-colors"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#f1f5f9] block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#06b6d4] transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#f1f5f9] block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#06b6d4] transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {(localError || error) && (
              <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded border border-red-500/20">
                {localError || error}
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-[#94a3b8] text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#06b6d4] hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
