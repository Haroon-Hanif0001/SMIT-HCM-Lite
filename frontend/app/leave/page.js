"use client";

import { useState } from "react";

export default function LeavePage() {
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [requests, setRequests] = useState([]);

  function submitLeave(e) {
    e.preventDefault();

    if (endDate < startDate) {
      alert("End date cannot be before start date");
      return;
    }

    setRequests([
      ...requests,
      {
        id: Date.now(),
        leaveType,
        startDate,
        endDate,
        reason,
        status: "Pending",
      },
    ]);

    setStartDate("");
    setEndDate("");
    setReason("");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow">
        <h1 className="text-3xl font-bold">Leave Management</h1>

        <form onSubmit={submitLeave} className="mt-6 space-y-4">
          <label className="block">
            Leave Type
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="mt-1 w-full rounded-lg border p-3"
            >
              <option>Casual Leave</option>
              <option>Sick Leave</option>
              <option>Annual Leave</option>
            </select>
          </label>

          <label className="block">
            Start Date
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border p-3"
            />
          </label>

          <label className="block">
            End Date
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
              required
              className="mt-1 w-full rounded-lg border p-3"
            />
          </label>

          <label className="block">
            Reason
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border p-3"
              placeholder="Enter reason for leave"
            />
          </label>

          <button className="w-full rounded-lg bg-violet-600 p-3 font-semibold text-white">
            Submit Leave Request
          </button>
        </form>

        <h2 className="mt-8 text-xl font-bold">My Leave Requests</h2>

        {requests.length === 0 ? (
          <p className="mt-3 text-gray-500">No leave requests yet.</p>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="mt-3 rounded-lg border p-4">
              <p className="font-semibold">{request.leaveType}</p>
              <p>{request.startDate} to {request.endDate}</p>
              <p>Reason: {request.reason}</p>
              <p className="mt-2 text-amber-600">
                Status: {request.status}
              </p>
            </div>
          ))
        )}

        <a href="/dashboard" className="mt-6 inline-block text-violet-600">
          ← Back to Dashboard
        </a>
      </div>
    </main>
  );
}