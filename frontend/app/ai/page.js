"use client";

import { useState } from "react";

export default function AIPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();
console.log("SEND BUTTON CLICKED");

    if (!message.trim() || loading) return;

    const question = message.trim();

    setMessages((prev) => [
      ...prev,
      { role: "user", text: question },
    ]);

    setMessage("");
    setLoading(true);

    try {
      console.log("SENDING REQUEST TO BACKEND");
      const response = await fetch("http://https://smit-hcm-lite-backend.vercel.app/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: question }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "AI request failed");
      }

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "AI se connect nahi ho saka. Backend aur API key check karo.",
        },
      ]);

      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-5 sm:p-10">
      <div className="mx-auto max-w-3xl">
        <a
          href="/"
          className="text-sm font-medium text-violet-600 hover:underline"
        >
          ← Back to Dashboard
        </a>

        <div className="mt-5 rounded-2xl bg-slate-950 p-6 text-white">
          <p className="text-sm text-violet-300">
            GEMINI POWERED ASSISTANT
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            HCM AI Assistant
          </h1>

          <p className="mt-2 text-slate-300">
            Ask questions about HR, attendance, leave and payroll.
          </p>
        </div>

        <div className="mt-5 min-h-80 space-y-4 rounded-2xl border bg-white p-5">
          {messages.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-lg font-semibold text-slate-700">
                How can I help you?
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Try asking: How can HR manage employee leave requests?
              </p>
            </div>
          )}

          {messages.map((item, index) => (
            <div
              key={index}
              className={`rounded-xl p-4 ${
                item.role === "user"
                  ? "ml-6 bg-violet-100"
                  : "mr-6 bg-slate-100"
              }`}
            >
              <p className="mb-1 text-xs font-bold text-slate-500">
                {item.role === "user" ? "YOU" : "HCM AI"}
              </p>

              <p className="whitespace-pre-wrap text-sm leading-6">
                {item.text}
              </p>
            </div>
          ))}

          {loading && (
            <p className="text-sm text-slate-500">
              Gemini is thinking...
            </p>
          )}
        </div>

        <form
          onSubmit={sendMessage}
          className="mt-4 flex gap-2 rounded-2xl border bg-white p-3"
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask your HR question..."
            className="min-w-0 flex-1 rounded-xl px-3 py-3 outline-none"
          />

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="rounded-xl bg-violet-600 px-5 py-3 font-medium text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>

        <p className="mt-3 text-center text-xs text-slate-400">
          AI responses may need verification.
        </p>
      </div>
    </main>
  );
}
