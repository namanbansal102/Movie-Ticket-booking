"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simple password check (in production, use proper auth)
    if (password === "admin123") {
      localStorage.setItem("adminAuth", "true")
      router.push("/admin/dashboard")
    } else {
      setError("Invalid password")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-4 animate-scale-in">
        <div className="bg-card border border-border rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Admin Login
          </h1>
          <p className="text-muted-foreground mb-8">Enter admin password to continue</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
