"use client";

import { useState } from "react";

export default function AttendancePage() {
  const [status, setStatus] = useState("Not Checked In");
  const [message, setMessage] = useState("");

  function checkIn() {
    if (status === "Checked In") {
      setMessage("You have already checked in!");
      return;
    }

    setStatus("Checked In");
    setMessage("Check-in successful!");
  }

  function checkOut() {
    if (status !== "Checked In") {
      setMessage("Please check in first!");
      return;
    }

    setStatus("Checked Out");
    setMessage("Check-out successful!");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">Attendance</h1>

        <p className="mt-4 text-gray-600">Today's Status</p>

        <div className="my-4 rounded-lg bg-gray-100 p-4 text-lg font-semibold">
          {status}
        </div>

        <div className="flex gap-4">
          <button
            onClick={checkIn}
            className="flex-1 rounded-lg bg-green-600 p-3 text-white"
          >
            Check In
          </button>

          <button
            onClick={checkOut}
            className="flex-1 rounded-lg bg-red-600 p-3 text-white"
          >
            Check Out
          </button>
        </div>

        {message && <p className="mt-4">{message}</p>}

        <a href="/dashboard" className="mt-6 inline-block text-violet-600">
          ← Back to Dashboard
        </a>
      </div>
    </main>
  );
}