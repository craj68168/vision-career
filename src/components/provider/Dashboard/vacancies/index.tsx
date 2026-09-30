"use client";

import {
  Ban,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  FilePen,
  Inbox,
  MapPin,
  MessageSquare,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { useVacancies } from "./hook";
import PostVacancyModal from "./PostVacancyModal";
import VacancyDetailsModal from "./VacancyDetailsModal";
import DeleteVacancyModal from "./DeleteVacancyModal";
import type { Vacancy } from "./types";

type Props = {
  lang: string;
  refreshVersion: number;
  createSignal: number;
  onDataChanged: () => void | Promise<void>;
  /** Pass `false` when the parent header already has Refresh / Post vacancy. */
  showToolbarActions?: boolean;
};

const normalizeStatus = (status: unknown) => String(status ?? "").toLowerCase();

const canEditVacancy = (status: string) =>
  ["draft", "pending_review", "approved", "rejected", "published"].includes(
    status,
  );

const canDeleteVacancy = (status: string) =>
  ["draft", "pending_review", "approved", "rejected"].includes(status);

const canCloseVacancy = (status: string) => status === "published";

// Shared tokens: keep in sync with provider-dashboard.tsx
const PANEL = "rounded-[14px] bg-white/70 ring-1 ring-black/5";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-800/50 focus-visible:ring-offset-1";

const BTN = `inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-[12px] text-sm font-medium transition-colors ${FOCUS}`;

const railFor = (status: string) => {
  if (status === "published" || status === "approved") return "bg-emerald-600";
  if (status === "pending_review") return "bg-amber-600";
  if (status === "rejected") return "bg-red-700";
  return "bg-slate-400";
};

const labelToneFor = (status: string) => {
  if (status === "published" || status === "approved")
    return "text-emerald-700";
  if (status === "pending_review") return "text-amber-700";
  if (status === "rejected") return "text-red-700";
  return "text-slate-500";
};

export default function Vacancies({
  lang,
  refreshVersion,
  createSignal,
  onDataChanged,
  showToolbarActions = true,
}: Props) {
  const t = useTranslations("provider.vacancies.list");

  const {
    loading,
    refreshing,
    search,
    setSearch,
    filteredVacancies,
    postVacancyOpen,
    openPostVacancy,
    closePostVacancy,
    handleVacancyCreated,
    viewVacancy,
    openVacancyView,
    closeVacancyView,
    editVacancy,
    openVacancyEdit,
    closeVacancyEdit,
    handleVacancyUpdated,
    deleteVacancyTarget,
    openVacancyDelete,
    closeVacancyDelete,
    handleVacancyDeleted,
    handleCloseVacancy,
    refresh,
  } = useVacancies({
    lang,
    refreshVersion,
    createSignal,
    onDataChanged,
  });

  const confirmAndClose = (vacancy: Vacancy) => {
    if (window.confirm(t("closeConfirm"))) {
      void handleCloseVacancy(vacancy);
    }
  };

  return (
    <>
      <section className="mt-8 text-[#1b1c21]">
        {/* Search & actions */}
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            className={`flex w-full items-center gap-2 px-3 py-2 lg:max-w-md ${PANEL} focus-within:ring-2 focus-within:ring-teal-800/40`}
          >
            <Search
              className="h-4 w-4 shrink-0 text-slate-500"
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
              className="w-full bg-transparent text-sm placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          {showToolbarActions && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={refreshing}
                onClick={() => void refresh()}
                className={`${BTN} px-3 hover:bg-white disabled:opacity-60 ${PANEL}`}
              >
                <RefreshCw
                  className={`h-4 w-4 shrink-0 text-slate-500 ${refreshing ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                {t("refresh")}
              </button>

              <button
                type="button"
                onClick={openPostVacancy}
                className={`${BTN} bg-teal-800 px-3.5 text-white ring-1 ring-teal-800 hover:bg-teal-700`}
              >
                <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
                {t("postVacancy")}
              </button>
            </div>
          )}
        </div>

        {/* List */}
        {loading ? (
          <div
            role="status"
            className={`${PANEL} py-16 text-center text-sm text-slate-500`}
          >
            {t("loading")}
          </div>
        ) : filteredVacancies.length === 0 ? (
          <EmptyState
            title={t("emptyTitle")}
            description={t("emptyDescription")}
          />
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {filteredVacancies.map((vacancy) => {
              const status = normalizeStatus(vacancy.status);
              const hasSalary =
                vacancy.salaryMin != null || vacancy.salaryMax != null;

              return (
                <article
                  key={vacancy.vacancyId}
                  className={`group relative flex w-full flex-col overflow-hidden p-5 pl-6 transition-all hover:bg-white/90 hover:ring-black/10 md:w-[calc(50%-0.5rem)] xl:w-[calc((100%-2rem)/3)] ${PANEL}`}
                >
                  {/* Status rail (decorative; status is also shown as text) */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-0 left-0 w-1.5 ${railFor(status)}`}
                  />

                  {/* Status + ID */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <StatusLabel value={status} />
                    <span className="font-mono text-xs tabular-nums text-slate-500">
                      {vacancy.vacancyId}
                    </span>
                  </div>

                  {/* Title block (title opens details) */}
                  <h3 className="mt-2 text-lg font-semibold leading-snug">
                    <button
                      type="button"
                      onClick={() => openVacancyView(vacancy)}
                      className={`-mx-1 rounded px-1 text-left break-words transition-colors hover:text-teal-800 ${FOCUS}`}
                    >
                      {vacancy.title}
                    </button>
                  </h3>

                  {vacancy.titleKana && (
                    <p className="mt-0.5 break-words text-sm text-slate-500">
                      {vacancy.titleKana}
                    </p>
                  )}

                  <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Building2
                      className="h-4 w-4 shrink-0 text-slate-500"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 break-words">
                      {vacancy.companyName}
                    </span>
                  </p>

                  {/* Key facts: salary + openings */}
                  <div className="mt-4 grid grid-cols-[1fr_auto] items-end gap-4 border-y border-black/5 py-3">
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">
                        {t("annualSalary")} · {t("salaryUnit")}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-xl font-medium tabular-nums">
                        {hasSalary
                          ? formatSalaryRange(
                              vacancy.salaryMin,
                              vacancy.salaryMax,
                              lang,
                            )
                          : "-"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 pb-0.5 text-sm text-slate-600">
                      <Users
                        className="h-4 w-4 shrink-0 text-slate-500"
                        aria-hidden="true"
                      />
                      {t("openings", { count: vacancy.numberOfPeople })}
                    </div>
                  </div>

                  {/* Tags: employment type + location */}
                  <ul className="mt-3 flex flex-wrap gap-2">
                    <li>
                      <Tag icon={<Briefcase />} text={vacancy.employmentType} />
                    </li>
                    <li className="min-w-0">
                      <Tag icon={<MapPin />} text={vacancy.workLocation} />
                    </li>
                  </ul>

                  {/* Rejection reason */}
                  {status === "rejected" && vacancy.rejectionReason && (
                    <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 ring-1 ring-red-100">
                      <MessageSquare
                        className="mt-0.5 h-4 w-4 shrink-0 text-red-700"
                        aria-hidden="true"
                      />
                      <p className="text-sm">
                        <span className="font-medium text-red-700">
                          {t("rejectionReason")}:{" "}
                        </span>
                        {vacancy.rejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Footer: status hint + actions (pinned to card bottom) */}
                  <div className="mt-auto pt-5">
                    <div className="mb-3">
                      <Footnote status={status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openVacancyView(vacancy)}
                        className={`${BTN} bg-teal-800 px-3 text-white ring-1 ring-teal-800 hover:bg-teal-700`}
                      >
                        <Eye className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {t("view")}
                      </button>

                      {canEditVacancy(status) && (
                        <button
                          type="button"
                          onClick={() => openVacancyEdit(vacancy)}
                          className={`${BTN} bg-white/80 pl-2 pr-3 ring-1 ring-black/10 hover:bg-white`}
                        >
                          <Pencil
                            className="h-4 w-4 shrink-0"
                            aria-hidden="true"
                          />
                          {t("edit")}
                        </button>
                      )}

                      {canCloseVacancy(status) && (
                        <button
                          type="button"
                          onClick={() => confirmAndClose(vacancy)}
                          className={`${BTN} bg-white/80 pl-2 pr-3 text-amber-700 ring-1 ring-amber-200 hover:bg-white`}
                        >
                          <XCircle
                            className="h-4 w-4 shrink-0"
                            aria-hidden="true"
                          />
                          {t("closeVacancy")}
                        </button>
                      )}

                      {canDeleteVacancy(status) && (
                        <button
                          type="button"
                          aria-label={t("delete")}
                          title={t("delete")}
                          onClick={() => openVacancyDelete(vacancy)}
                          className={`${BTN} ml-auto w-8 text-slate-500 hover:bg-red-50 hover:text-red-700`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Modals */}
      <PostVacancyModal
        key="create-vacancy"
        open={postVacancyOpen}
        mode="create"
        onClose={closePostVacancy}
        onSuccess={handleVacancyCreated}
        lang={lang}
      />

      <VacancyDetailsModal
        open={Boolean(viewVacancy)}
        vacancy={viewVacancy}
        onClose={closeVacancyView}
        onEdit={openVacancyEdit}
        lang={lang}
      />

      <PostVacancyModal
        key={editVacancy ? `edit-${editVacancy.vacancyId}` : "edit-none"}
        open={Boolean(editVacancy)}
        mode="edit"
        vacancy={editVacancy}
        onClose={closeVacancyEdit}
        onSuccess={handleVacancyUpdated}
        lang={lang}
      />

      <DeleteVacancyModal
        open={Boolean(deleteVacancyTarget)}
        vacancy={deleteVacancyTarget}
        onClose={closeVacancyDelete}
        onSuccess={handleVacancyDeleted}
        lang={lang}
      />
    </>
  );
}

function formatNumber(value: number, lang: string) {
  return new Intl.NumberFormat(lang === "ja" ? "ja-JP" : "en-US").format(value);
}

/** "min ~ max", or a single value when only one side is set. */
function formatSalaryRange(
  min: number | null | undefined,
  max: number | null | undefined,
  lang = "en",
) {
  const hasMin = min !== null && min !== undefined;
  const hasMax = max !== null && max !== undefined;

  if (hasMin && hasMax) {
    return min === max
      ? formatNumber(min, lang)
      : `${formatNumber(min, lang)} ~ ${formatNumber(max, lang)}`;
  }
  if (hasMin) return `${formatNumber(min, lang)} ~`;
  if (hasMax) return `~ ${formatNumber(max as number, lang)}`;
  return "-";
}

function Tag({
  icon,
  text,
}: {
  icon: React.ReactElement;
  text?: string | null;
}) {
  if (!text) return null;

  return (
    <span className="inline-flex max-w-full items-start gap-1.5 rounded-[10px] bg-teal-800/5 px-2.5 py-1 text-sm text-teal-900 ring-1 ring-teal-800/10">
      <span
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-teal-800/70 [&>svg]:h-3.5 [&>svg]:w-3.5"
      >
        {icon}
      </span>
      <span className="min-w-0 break-words">{text}</span>
    </span>
  );
}

function Footnote({ status }: { status: string }) {
  const t = useTranslations("provider.vacancies.list");

  let Icon = FilePen;
  let text = t("notYetPublished");

  if (status === "published") {
    Icon = Users;
    text = t("acceptingApplicants");
  } else if (status === "approved") {
    Icon = CheckCircle2;
    text = t("approvedNotLive");
  } else if (status === "pending_review") {
    Icon = Clock;
    text = t("awaitingReview");
  } else if (status === "rejected" || status === "closed") {
    Icon = Ban;
    text = t("notAcceptingApplicants");
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500">
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {text}
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className={`${PANEL} px-6 py-14 text-center`}>
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-teal-800/5 ring-1 ring-teal-800/10">
        <Inbox
          className="h-5 w-5 shrink-0 text-teal-800/70"
          aria-hidden="true"
        />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

function StatusLabel({ value }: { value: string }) {
  const t = useTranslations("provider.vacancies.list.statuses");
  const key = value === "pending_review" ? "pendingReview" : value;

  return (
    <span
      className={`text-xs font-medium uppercase tracking-[0.15em] ${labelToneFor(value)}`}
    >
      {t(key)}
    </span>
  );
}