"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ArrowLeft } from "lucide-react";

// ======================================================
// STAFF PAGE CONTROLS
//
// Shared by both:
// /staff/*
// /en/staff/*
//
// Responsibilities:
//
// 1. JA / EN language switch
// 2. Preserve current Staff page when language changes
// 3. Show Back to Dashboard on child Staff pages
// ======================================================

export default function StaffPageControls() {
  const pathname = usePathname();

  const isEnglish = pathname.startsWith("/en/");

  // ====================================================
  // NORMALIZED PATH
  //
  // English:
  // /en/staff/vacancies
  //
  // Japanese:
  // /staff/vacancies
  // ====================================================

  const pathWithoutLocale = isEnglish
    ? pathname.replace(/^\/en/, "")
    : pathname;

  // ====================================================
  // LANGUAGE URLS
  // ====================================================

  const japaneseHref = pathWithoutLocale || "/staff";

  const englishHref = `/en${pathWithoutLocale || "/staff"}`;

  // ====================================================
  // DASHBOARD
  // ====================================================

  const dashboardHref = isEnglish ? "/en/staff" : "/staff";

  const normalizedPath = pathname.replace(/\/+$/, "");

  const normalizedDashboardPath = dashboardHref.replace(/\/+$/, "");

  const isDashboard = normalizedPath === normalizedDashboardPath;

  // ====================================================
  // TEXT
  // ====================================================

  const backLabel = isEnglish ? "Back to Dashboard" : "ダッシュボードに戻る";

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-4 px-6 py-2">
        {/* LEFT */}

        <div>
          {!isDashboard ? (
            <Link
              href={dashboardHref}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <ArrowLeft className="h-4 w-4" />

              {backLabel}
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* LANGUAGE SWITCH */}

        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          <Link
            href={japaneseHref}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              !isEnglish
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            JA
          </Link>

          <Link
            href={englishHref}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              isEnglish
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            EN
          </Link>
        </div>
      </div>
    </div>
  );
}
