"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

export default function ContactPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!name || !email || !message) {
      setError("Please fill all fields")
      return
    }

    setSending(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      })

      const data = await res.json()
      if (data?.success) {
        setSuccess("Message sent — thanks! We will get back to you shortly.")
        setName("")
        setEmail("")
        setMessage("")
        // optionally navigate to home after a short delay
        setTimeout(() => router.push('/'), 2200)
      } else {
        setError(data?.message || "Failed to send message")
      }
    } catch (err) {
      console.error("Contact submit failed:", err)
      setError("Failed to send message — try again later")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-900 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-300 mb-6">Have a question, feedback or need help with a booking? Send us a message.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-200">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-800 text-white border-gray-700"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-200">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full px-4 py-2 border rounded-lg bg-gray-800 text-white border-gray-700"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-200">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg h-36 bg-gray-800 text-white border-gray-700"
                placeholder="How can we help?"
              />
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}
            {success && <div className="text-green-400 text-sm">{success}</div>}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={sending}
                className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>

              <button
                type="button"
                onClick={() => { setName(""); setEmail(""); setMessage("") }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
