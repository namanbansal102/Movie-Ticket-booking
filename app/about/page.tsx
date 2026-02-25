import React from "react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-gray-300 mb-6">
            Welcome to CineMagic — your friendly neighborhood movie booking app. We make it simple to discover
            films, pick showtimes, reserve seats, and get a printable receipt — all in a few clicks.
          </p>

          <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
          <p className="text-gray-300 mb-6">
            We want to make cinema-going delightful again by bringing a fast, clean and reliable booking experience
            to movie lovers. We care about performance, accessibility and making sure you get to your seat on time.
          </p>

          <h2 className="text-2xl font-semibold mb-3">What We Value</h2>
          <ul className="list-disc pl-5 text-gray-300 space-y-2 mb-6">
            <li>Simple, usable interfaces.</li>
            <li>Accurate showtime and seating information.</li>
            <li>Privacy — we only store the details needed for bookings.</li>
            <li>Fast support and clear receipts.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-3">The Team</h2>
          <p className="text-gray-300 mb-6">
            A small team of engineers and cinema lovers building better ticketing software. We're always open to
            feedback — use the Contact page to send us a message.
          </p>

          <div className="mt-6">
            <a href="/contact" className="inline-block px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-600">
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
