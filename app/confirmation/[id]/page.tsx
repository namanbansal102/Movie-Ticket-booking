"use client";

import type React from "react";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Check, Copy, Download } from "lucide-react";

export default function Confirmation() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const movieId = params.id as string;

  const seatIds = searchParams.get("seats")?.split(",") || [];
  const totalPrice = Number.parseInt(searchParams.get("price") || "0");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | null>(
    null
  );
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const { user } = useAuth() as any;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerEmail) {
      alert("Please fill in your details");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    if (paymentMethod === "card" && (!cardNumber || !expiryDate || !cvv)) {
      alert("Please fill in all card details");
      return;
    }

    if (paymentMethod === "upi" && !upiId) {
      alert("Please enter your UPI ID");
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`;

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId,
          seats: seatIds,
          totalAmount: totalPrice,
          customerName,
          customerEmail,
          customerId: user?.id || null,
        }),
      });

      const data = await res.json();

      if (data.success && data.data) {
        const bookingDbId = data.data._id || data.data.bookingId;
        
        // Update booking with payment details
        await fetch('/api/bookings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            bookingId: bookingDbId, 
            status: 'confirmed', 
            paymentMethod, 
            transactionId,
            customerId: user?.id || null
          })
        });

        setBookingId(data.data.bookingId);
        setConfirmed(true);
      } else {
        throw new Error(data.message || "Failed to book seats");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("An error occurred during booking");
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = () => {
    const receiptContent = `
MOVIE TICKET RECEIPT
========================================
Booking ID: ${bookingId}
Customer Name: ${customerName}
Email: ${customerEmail}

BOOKING DETAILS
----------------------------------------
Number of Seats: ${seatIds.length}
Total Amount: ₹${totalPrice}
Amount per Seat: ₹${Math.round(totalPrice / seatIds.length)}

PAYMENT INFORMATION
----------------------------------------
Payment Method: ${paymentMethod?.toUpperCase()}
Status: CONFIRMED

========================================
Thank you for booking with us!
This is a valid receipt for your booking.
Date: ${new Date().toLocaleString()}
========================================
`;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(receiptContent)
    );
    element.setAttribute("download", `receipt_${bookingId}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-8">
        <div className="max-w-md w-full mx-4 animate-scale-in">
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <Check className="w-8 h-8 text-primary" />
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your payment has been processed successfully.
            </p>

            <div className="bg-secondary rounded-lg p-4 mb-6">
              <p className="text-muted-foreground text-sm mb-2">Booking ID</p>
              <div className="flex items-center justify-between bg-background rounded p-3">
                <p className="text-lg font-mono font-bold text-primary">
                  {bookingId}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(bookingId);
                    alert("Copied to clipboard!");
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div>
                <p className="text-muted-foreground text-sm">
                  Number of Seats
                </p>
                <p className="text-xl font-bold text-foreground">
                  {seatIds.length}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">
                  Total Amount Paid
                </p>
                <p className="text-2xl font-bold text-accent">₹{totalPrice}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">
                  Confirmation sent to
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {customerEmail}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <Button
                onClick={downloadReceipt}
                variant="outline"
                className="w-full gap-2 bg-transparent"
              >
                <Download className="w-4 h-4" />
                Download Receipt
              </Button>
              <Link href="/" className="block">
                <Button className="w-full">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/seats/${movieId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      {/* Payment Form */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold mb-8 text-foreground">
            Complete Payment
          </h1>

          <form onSubmit={handlePayment} className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-foreground">
                Booking Summary
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Number of Seats</span>
                  <span className="font-semibold text-foreground">
                    {seatIds.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price per Seat</span>
                  <span className="font-semibold text-foreground">
                    ₹{Math.round(totalPrice / seatIds.length)}
                  </span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="font-semibold text-foreground">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold text-accent">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Your Details
              </h2>
              <Input
                type="text"
                placeholder="Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Email Address"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Select Payment Method
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  <p className="font-semibold text-foreground">
                    Credit/Debit Card
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === "upi"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  <p className="font-semibold text-foreground">UPI</p>
                </button>
              </div>
            </div>

            {/* Card Payment Fields */}
            {paymentMethod === "card" && (
              <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
                <h3 className="font-semibold text-foreground">Card Details</h3>
                <Input
                  type="text"
                  placeholder="Card Number (16 digits)"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))
                  }
                  maxLength={16}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 4) {
                        const formatted =
                          val.length <= 2
                            ? val
                            : `${val.slice(0, 2)}/${val.slice(2)}`;
                        setExpiryDate(formatted);
                      }
                    }}
                    maxLength={5}
                  />
                  <Input
                    type="password"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                    }
                    maxLength={3}
                  />
                </div>
              </div>
            )}

            {/* UPI Payment Fields */}
            {paymentMethod === "upi" && (
              <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
                <h3 className="font-semibold text-foreground">UPI Details</h3>
                <Input
                  type="text"
                  placeholder="Enter UPI ID (e.g., user@upi)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing Payment..." : "Complete Payment"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
