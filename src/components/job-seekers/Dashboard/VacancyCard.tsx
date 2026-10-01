import { ArrowRight, CalendarDays, CircleCheck, Lock, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Vacancy } from "./types";
import {
  badgeNeutral,
  badgePrimary,
  card,
  formatDate,
  formatSalary,
  wrap,
} from "./shared";

export default function VacancyCard({
  vacancy,
  lang,
  canApply,
  onApply,
}: {
  vacancy: Vacancy;
  lang: string;
  canApply: boolean;
  onApply: (vacancy: Vacancy) => void;
}) {
  const t = useTranslations("jobSeeker.dashboard");
  const initial = (vacancy.title || "?").trim().charAt(0).toUpperCase();

  return (
    <article
      className={`${card} group flex h-full flex-col transition-shadow duration-200 hover:shadow-md`}
    >
      {/* Header: identity + title */}
      <header className="flex items-start gap-3">
        <span
          aria-hidden
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-emerald-600 text-lg font-semibold text-white"
        >
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <h3
            className={`line-clamp-2 text-base font-semibold leading-snug text-slate-900 sm:text-[17px] ${wrap}`}
          >
            {vacancy.title}
          </h3>
          {vacancy.titleKana && (
            <p className={`mt-0.5 truncate text-xs text-slate-500 ${wrap}`}>
              {vacancy.titleKana}
            </p>
          )}
        </div>
      </header>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className={badgePrimary}>{vacancy.employmentType}</span>
        {vacancy.japaneseLevel && (
          <span className={badgeNeutral}>{vacancy.japaneseLevel}</span>
        )}
        {vacancy.remoteWork && (
          <span className={badgeNeutral}>{vacancy.remoteWork}</span>
        )}
      </div>

      {/* Salary: the one thing job seekers scan for first */}
      <div className="mt-4 rounded-lg bg-emerald-50/70 px-3.5 py-3 ring-1 ring-inset ring-emerald-100">
        <p className="text-xs font-medium text-emerald-800/80">{t("salary")}</p>
        <p className="mt-0.5 text-lg font-semibold leading-tight tracking-tight text-emerald-900 tabular-nums">
          {formatSalary(vacancy.salaryMin, vacancy.salaryMax, t("salaryUnit"))}
        </p>
      </div>

      {/* Description */}
      <p
        className={`mt-4 line-clamp-3 text-sm leading-6 text-slate-600 ${wrap}`}
      >
        {vacancy.jobDescription}
      </p>

      {/* Meta: openings + posted date */}
      <dl className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Users aria-hidden className="h-4 w-4 text-slate-400" />
          <dt className="sr-only">{t("openings")}</dt>
          <dd>
            <span className="font-medium text-slate-700 tabular-nums">
              {vacancy.numberOfPeople}
            </span>{" "}
            {t("openings")}
          </dd>
        </div>
        {vacancy.createdAt && (
          <div className="flex items-center gap-1.5">
            <CalendarDays aria-hidden className="h-4 w-4 text-slate-400" />
            <dt className="sr-only">{t("posted")}</dt>
            <dd>
              {t("posted")} {formatDate(vacancy.createdAt, lang)}
            </dd>
          </div>
        )}
      </dl>

      {/* Footer: status + action */}
      <footer className="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-4 mt-5 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={`flex items-center gap-1.5 text-xs ${
            canApply ? "text-emerald-700" : "text-slate-500"
          }`}
        >
          {canApply ? (
            <CircleCheck aria-hidden className="h-4 w-4 shrink-0" />
          ) : (
            <Lock aria-hidden className="h-4 w-4 shrink-0" />
          )}
          <span>{canApply ? t("canApply") : t("completeProfileBeforeApply")}</span>
        </p>
        <button
          type="button"
          disabled={!canApply}
          onClick={() => onApply(vacancy)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none sm:w-auto"
        >
          {t("applyNow")}
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </footer>
    </article>
  );
}