"use client";

import Link from "next/link";
import { Globe, PanelLeftClose, PanelLeftOpen } from "lucide-react";

type StaffHeaderProps = {
  collapsed: boolean;
  isEnglish: boolean;
  japaneseHref: string;
  englishHref: string;
  onToggleCollapsed: () => void;
  onOpenMobile: () => void;
};

const iconButton =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40";

const langOption = (active: boolean) =>
  `inline-flex h-8 min-w-[42px] items-center justify-center rounded-full px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 sm:h-7 ${
    active
      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
      : "text-slate-500 hover:text-slate-900"
  }`;

export default function StaffHeader({
  collapsed,
  isEnglish,
  japaneseHref,
  englishHref,
  onToggleCollapsed,
  onOpenMobile,
}: StaffHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-[70px] items-center gap-3 border-b border-slate-200 bg-white/80 px-3 backdrop-blur-md sm:px-5 lg:px-8">
      {/* ================================================= */}
      {/* SIDEBAR TOGGLES */}
      {/* ================================================= */}

      <button
        type="button"
        className={`${iconButton} hidden lg:inline-flex`}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={onToggleCollapsed}
      >
        {collapsed ? (
          <PanelLeftOpen className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </button>

      <button
        type="button"
        className={`${iconButton} lg:hidden`}
        aria-label="Open navigation"
        onClick={onOpenMobile}
      >
        <PanelLeftOpen className="h-4 w-4" />
      </button>

      <span aria-hidden="true" className="hidden h-6 w-px bg-slate-200 sm:block" />

      {/* ================================================= */}
      {/* TITLE */}
      {/* ================================================= */}

      <div className="flex min-w-0 items-center gap-2.5">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>

        <span className="truncate text-xs font-semibold uppercase tracking-wider text-slate-600">
          Staff console
        </span>
      </div>

      {/* ================================================= */}
      {/* LANGUAGE SWITCH */}
      {/* ================================================= */}

      <div
        role="group"
        aria-label="Language"
        className="ml-auto inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1"
      >
        <Globe
          aria-hidden="true"
          className="ml-1.5 mr-0.5 hidden h-3.5 w-3.5 text-slate-400 sm:block"
        />

        <Link
          href={japaneseHref}
          lang="ja"
          hrefLang="ja"
          aria-current={!isEnglish ? "true" : undefined}
          className={langOption(!isEnglish)}
        >
          JA
        </Link>

        <Link
          href={englishHref}
          lang="en"
          hrefLang="en"
          aria-current={isEnglish ? "true" : undefined}
          className={langOption(isEnglish)}
        >
          EN
        </Link>
      </div>
    </header>
  );
}