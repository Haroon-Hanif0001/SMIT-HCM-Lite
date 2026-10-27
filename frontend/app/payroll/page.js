"use client";

import { useState } from "react";

export default function PayrollPage() {
  const [name, setName] = useState("");
  const [salary, setSalary] = useState("");
  const [bonus, setBonus] = useState("0");
  const [deduction, setDeduction] = useState("0");
  const [records, setRecords] = useState([]);

  function addPayroll(e) {
    e.preventDefault();

    const basic = Number(salary);
    const extra = Number(bonus);
    const minus = Number(deduction);

    if (basic < 0 || extra < 0 || minus < 0 || minus > basic + extra) {
      alert("Please enter valid salary, bonus and deduction amounts.");
      return;
    }

    setRecords([
      ...records,
      {
        id: Date.now(),
        name,
        basic,
        extra,
        minus,
        net: basic + extra - minus,
      },
    ]);

    setName("");
    setSalary("");
    setBonus("0");
    setDeduction("0");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
        <h1 className="text-3xl font-bold">Payroll Management</h1>
        <p className="mt-2 text-gray-500">Calculate monthly net salary.</p>

        <form onSubmit={addPayroll} className="mt-6 space-y-4">
          <input
            className="w-full rounded-lg border p-3"
            placeholder="Employee name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="w-full rounded-lg border p-3"
            type="number"
            min="0"
            step="any"
            placeholder="Basic monthly salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />

          <input
            className="w-full rounded-lg border p-3"
            type="number"
            min="0"
            step="any"
            placeholder="Bonus"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
            required
          />

          <input
            className="w-full rounded-lg border p-3"
            type="number"
            min="0"
            step="any"
            placeholder="Deductions"
            value={deduction}
            onChange={(e) => setDeduction(e.target.value)}
            required
          />

          <button className="w-full rounded-lg bg-violet-600 p-3 font-semibold text-white">
            Calculate Payroll
          </button>
        </form>

        <h2 className="mt-8 text-xl font-bold">Payroll Records</h2>

        {records.length === 0 ? (
          <p className="mt-3 text-gray-500">No payroll records yet.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {records.map((record) => (
              <div key={record.id} className="rounded-lg border p-4">
                <p className="font-semibold">{record.name}</p>
                <p>Basic Salary: Rs. {record.basic.toLocaleString()}</p>
                <p>Bonus: Rs. {record.extra.toLocaleString()}</p>
                <p>Deductions: Rs. {record.minus.toLocaleString()}</p>
                <p className="mt-2 font-bold text-green-700">
                  Net Salary: Rs. {record.net.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        <a href="/dashboard" className="mt-6 inline-block text-violet-600">
          ← Back to Dashboard
        </a>
      </div>
    </main>
  );
}