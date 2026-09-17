"use client";

import { FormEvent, useState } from "react";

import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

import { useStaffLoginHook } from "./hook";

export default function StaffLogin() {
  const { login, error, isPending } = useStaffLoginHook();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      return;
    }

    login({
      email: email.trim().toLowerCase(),

      password,
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* LOGO */}

        <div className="mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-950">
            Staff Login
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Sign in to your internal recruitment Staff account.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* FORM */}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}

          <label className="block">
            <span className="text-sm font-semibold text-slate-800">Email</span>

            <div className="relative mt-2">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="staff@example.com"
                className="h-12 w-full rounded-xl border border-slate-200 pl-12 pr-4 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>
          </label>

          {/* PASSWORD */}

          <label className="block">
            <span className="text-sm font-semibold text-slate-800">
              Password
            </span>

            <div className="relative mt-2">
              <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 pl-12 pr-12 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </label>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={isPending || !email.trim() || !password}
            className="h-12 w-full rounded-xl bg-slate-950 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Staff accounts are created and managed by an administrator.
        </p>
      </div>
    </main>
  );
}
