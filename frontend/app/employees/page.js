"use client";

import { useState } from "react";

export default function EmployeesPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    salary: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://https://smit-hcm-lite-backend.vercel.app/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          salary: Number(form.salary),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Employee add nahi hua");
        return;
      }

      setMessage("Employee successfully add ho gaya!");

      setForm({
        name: "",
        email: "",
        department: "",
        position: "",
        salary: "",
      });
    } catch (error) {
      setMessage("Backend se connection nahi ho raha");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <p className="mt-2 text-gray-500">
          Add a new employee to your company.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {[
            ["name", "Full Name"],
            ["email", "Email"],
            ["department", "Department"],
            ["position", "Job Position"],
            ["salary", "Monthly Salary"],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="mb-1 block font-medium">{label}</label>
              <input
                name={name}
                type={name === "email" ? "email" : name === "salary" ? "number" : "text"}
                min={name === "salary" ? "0" : undefined}
                step={name === "salary" ? "any" : undefined}
                value={form[name]}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3"
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}

          {message && (
            <p className="rounded bg-gray-100 p-3 text-sm">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-violet-600 p-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Adding Employee..." : "Add Employee"}
          </button>
        </form>

        <a href="/dashboard" className="mt-5 inline-block text-violet-600">
          ← Back to Dashboard
        </a>
      </div>
    </main>
  );
}