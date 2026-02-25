import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message } = body || {}

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 })
    }

    // For now just log the message server-side. You can later save to DB or send email.
    console.log('Contact form message received:', { name, email, message })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ success: false, message: 'Failed to process message' }, { status: 500 })
  }
}
