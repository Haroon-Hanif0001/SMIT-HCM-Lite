
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const stats = [
  { title: "Total Employees", value: "0", icon: "♙" },
  { title: "Present Today", value: "0", icon: "✓" },
  { title: "Pending Leave Requests", value: "0", icon: "◷" },
  { title: "Payroll This Month", value: "Not Generated", icon: "$" },
];

const modules = [
  {
    title: "Employee Management",
    description: "Register employees and manage their records.",
    icon: "♙",
    link: "/employees",
    button: "Manage Employees",
  },
  {
    title: "Attendance",
    description: "Track employee check-in and check-out.",
    icon: "◷",
    link: "/attendance",
    button: "Open Attendance",
  },
  {
    title: "Leave Management",
    description: "Review and approve leave requests.",
    icon: "📅",
    link: "/leave",
    button: "Manage Leaves",
  },
  {
    title: "Payroll",
    description: "Calculate salaries and prepare payslips.",
    icon: "$",
    link: "/payroll",
    button: "Open Payroll",
  },
  {
    title: "AI Assistant",
    description: "Ask questions about HR management, employees, attendance, leave and payroll.",
    icon: "🤖",
    link: "/ai",
    button: "Chat with AI",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUserName(user.name || "Admin");
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800 md:flex">
      <aside className="bg-slate-950 p-6 text-white md:min-h-screen md:w-64 md:shrink-0">
        <h1 className="text-2xl font-bold">
          HCM Lite<span className="text-violet-400">.</span>
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Human Capital Management
        </p>

        <nav className="mt-10 space-y-2">
          <a href="/dashboard" className="block rounded-xl bg-violet-600 px-4 py-3 font-medium">
            ▦ Dashboard
          </a>
          <a href="/employees" className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800">
            ♙ Employees
          </a>
          <a href="/attendance" className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800">
            ◷ Attendance
          </a>
          <a href="/leave" className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800">
            📅 Leave Requests
          </a>
          <a href="/payroll" className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800">
            $ Payroll
          </a>
          <a href="/ai" className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800">
            🤖 AI Assistant
          </a>
        </nav>

        <div className="mt-12 rounded-2xl bg-slate-900 p-4">
          <p className="font-semibold">Admin Panel</p>
          <p className="mt-2 text-sm text-slate-400">
            Manage your organization from one place.
          </p>
        </div>
      </aside>

      <section className="min-w-0 flex-1 p-5 sm:p-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">
              HCM Lite / Overview
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              Admin Dashboard
            </h2>
            <p className="mt-2 text-slate-500">
              Welcome, {userName}! Manage your workforce.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-violet-600 px-5 py-3 font-medium text-white hover:bg-violet-700"
          >
            Logout
          </button>
        </header>

        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-slate-500">{stat.title}</p>
                <span className="rounded-lg bg-violet-50 px-3 py-2 text-lg text-violet-600">
                  {stat.icon}
                </span>
              </div>
              <p className="mt-5 text-2xl font-bold">{stat.value}</p>
            </article>
          ))}
        </section>

        <section className="mt-8">
          <h3 className="text-xl font-bold">HR Management Modules</h3>
          <p className="mt-1 text-sm text-slate-500">
            Manage the main activities of your organization.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {modules.map((module) => (
              <article
                key={module.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="text-2xl text-violet-600">
                  {module.icon}
                </span>
                <h4 className="mt-4 text-lg font-bold">
                  {module.title}
                </h4>
                <p className="mt-2 text-sm text-slate-500">
                  {module.description}
                </p>
                <a
                  href={module.link}
                  className="mt-5 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                >
                  {module.button} →
                </a>
              </article>
            ))}
          </div>
        </section>

        <footer className="mt-10 text-center text-sm text-slate-400">
          HCM Lite · Human Resource Management System
        </footer>
      </section>
    </main>
  );
}
