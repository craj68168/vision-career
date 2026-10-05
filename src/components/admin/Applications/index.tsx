"use client";

import type { ComponentType } from "react";
import {
  CheckCircle2,
  Clock3,
  Eye,
  RefreshCw,
  Search,
  Send,
  UserRoundCheck,
  XCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAdminApplications } from "./hook";
import {
  formatApplicationDate,
  getApplicationStatusClass,
  getApplicationStatusLabel,
} from "./helper";
import ApplicationDetails from "./ApplicationDetails";
import RejectApplicationModal from "./RejectApplicationModal";
import type { ApplicationStatus } from "./types";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

export default function AdminApplications() {
  const { lang } = useLanguage();

  const {
    applications,
    summary,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    selectedApplication,
    rejectApplication,
    isLoading,
    isFetching,
    isDetailsLoading,
    isApproving,
    isRejecting,
    openDetails,
    closeDetails,
    openReject,
    closeReject,
    approveApplication,
    submitRejection,
    openResume,
    refetch,
  } = useAdminApplications();

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center sm:min-h-[500px]">
        <RefreshCw
          role="status"
          aria-label={lang === "ja" ? "読み込み中" : "Loading"}
          className="h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-400"
        />
      </div>
    );
  }

  const filters: Array<{
    value: "ALL" | ApplicationStatus;
    label: string;
  }> = [
    {
      value: "ALL",
      label: lang === "ja" ? "すべて" : "All",
    },
    {
      value: "PENDING_ADMIN_APPROVAL",
      label: lang === "ja" ? "承認待ち" : "Pending",
    },
    {
      value: "SENT_TO_PROVIDER",
      label: lang === "ja" ? "企業へ送信済み" : "Sent to Provider",
    },
    {
      value: "UNDER_REVIEW",
      label: lang === "ja" ? "審査中" : "Under Review",
    },
    {
      value: "INTERVIEW",
      label: lang === "ja" ? "面接" : "Interview",
    },
    {
      value: "SELECTED",
      label: lang === "ja" ? "選考通過" : "Selected",
    },
    {
      value: "HIRED",
      label: lang === "ja" ? "採用" : "Hired",
    },
    {
      value: "ADMIN_REJECTED",
      label: lang === "ja" ? "管理者却下" : "Admin Rejected",
    },
    {
      value: "REJECTED",
      label: lang === "ja" ? "企業不採用" : "Provider Rejected",
    },
  ];

  return (
    <div className="min-w-0 space-y-6">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-white sm:text-2xl">
            {lang === "ja" ? "応募管理" : "Applications"}
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {lang === "ja"
              ? "応募を確認し、企業へ送信する前に審査します。"
              : "Review applications before they are sent to Providers."}
          </p>
        </div>

        <button
          type="button"
          disabled={isFetching}
          onClick={() => void refetch()}
          className={`inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />

          {lang === "ja" ? "更新" : "Refresh"}
        </button>
      </div>

      {/* SUMMARY (clickable: each card applies a status filter) */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label={lang === "ja" ? "総応募数" : "Applications"}
          value={summary?.total || 0}
          icon={UserRoundCheck}
          isActive={statusFilter === "ALL"}
          onClick={() => setStatusFilter("ALL")}
        />

        <SummaryCard
          label={lang === "ja" ? "管理者承認待ち" : "Pending Approval"}
          value={summary?.pendingAdminApproval || 0}
          icon={Clock3}
          isActive={statusFilter === "PENDING_ADMIN_APPROVAL"}
          onClick={() => setStatusFilter("PENDING_ADMIN_APPROVAL")}
        />

        <SummaryCard
          label={lang === "ja" ? "企業へ送信済み" : "Sent to Provider"}
          value={summary?.sentToProvider || 0}
          icon={Send}
          isActive={statusFilter === "SENT_TO_PROVIDER"}
          onClick={() => setStatusFilter("SENT_TO_PROVIDER")}
        />

        <SummaryCard
          label={lang === "ja" ? "採用" : "Hired"}
          value={summary?.hired || 0}
          icon={CheckCircle2}
          isActive={statusFilter === "HIRED"}
          onClick={() => setStatusFilter("HIRED")}
        />
      </div>

      {/* FILTER */}

      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label={lang === "ja" ? "ステータス" : "Status filter"}
          >
            {filters.map((filter) => {
              const isActive = statusFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                  aria-pressed={isActive}
                  className={`h-9 cursor-pointer rounded-lg px-3 text-xs font-medium transition ${focusRing} ${
                    isActive
                      ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full xl:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label={
                lang === "ja" ? "応募を検索" : "Search applications"
              }
              placeholder={
                lang === "ja"
                  ? "応募者、求人、企業を検索..."
                  : "Search applicant, vacancy, company..."
              }
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* APPLICATIONS */}

      {applications.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-16 text-center dark:border-white/10 dark:bg-zinc-900 sm:py-20">
          <p className="text-zinc-500 dark:text-zinc-400">
            {lang === "ja" ? "応募がありません。" : "No applications found."}
          </p>

          {(statusFilter !== "ALL" || search) && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter("ALL");
                setSearch("");
              }}
              className={`mt-4 inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
            >
              {lang === "ja" ? "フィルターをクリア" : "Clear filters"}
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-5 xl:grid-cols-2">
          {applications.map((application) => {
            const pending = application.status === "PENDING_ADMIN_APPROVAL";

            return (
              <article
                key={application.applicationId}
                className="min-w-0 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {application.applicationId}
                    </p>

                    <h3 className="mt-1 truncate text-lg font-semibold text-zinc-950 dark:text-white sm:text-xl">
                      {application.candidate.name}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {application.vacancy.title}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${getApplicationStatusClass(
                      application.status,
                    )}`}
                  >
                    {getApplicationStatusLabel(application.status, lang)}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <CardField
                    label={lang === "ja" ? "企業" : "Company"}
                    value={application.vacancy.companyName}
                  />

                  <CardField
                    label={lang === "ja" ? "応募日" : "Applied"}
                    value={formatApplicationDate(application.appliedAt, lang)}
                  />

                  <CardField
                    label={lang === "ja" ? "在留資格" : "Visa"}
                    value={application.candidate.visaType}
                  />

                  <CardField
                    label={lang === "ja" ? "日本語" : "Japanese"}
                    value={application.candidate.japaneseLevel}
                  />
                </div>

                <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => openDetails(application.applicationId)}
                    className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 sm:flex-none ${focusRing}`}
                  >
                    <Eye className="h-4 w-4" />

                    {lang === "ja" ? "詳細" : "View Details"}
                  </button>

                  {pending && (
                    <>
                      <button
                        type="button"
                        onClick={() => openReject(application)}
                        className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200 px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10 sm:flex-none ${focusRing}`}
                      >
                        <XCircle className="h-4 w-4" />

                        {lang === "ja" ? "却下" : "Reject"}
                      </button>

                      <button
                        type="button"
                        disabled={isApproving}
                        onClick={() =>
                          approveApplication(application.applicationId)
                        }
                        className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none ${focusRing}`}
                      >
                        <CheckCircle2 className="h-4 w-4" />

                        {lang === "ja" ? "承認" : "Approve"}
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* DETAILS */}

      {selectedApplication && !isDetailsLoading && (
        <ApplicationDetails
          application={selectedApplication}
          isApproving={isApproving}
          onClose={closeDetails}
          onApprove={approveApplication}
          onReject={() => openReject(selectedApplication)}
          onResume={openResume}
        />
      )}

      {/* REJECT */}

      {rejectApplication && (
        <RejectApplicationModal
          application={rejectApplication}
          isRejecting={isRejecting}
          onClose={closeReject}
          onReject={submitRejection}
        />
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  isActive,
  onClick,
}: {
  label: string;
  value: number;
  icon: ComponentType<{
    className?: string;
  }>;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`min-w-0 cursor-pointer rounded-lg border bg-white p-4 text-left shadow-sm transition hover:border-emerald-500/50 hover:shadow-md dark:bg-zinc-900 sm:p-5 ${focusRing} ${
        isActive
          ? "border-emerald-500 ring-2 ring-emerald-500/20"
          : "border-zinc-200 dark:border-white/10"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
            {value}
          </p>
        </div>

        <div className="shrink-0 rounded-lg bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </button>
  );
}

function CardField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="min-w-0 rounded-lg bg-zinc-50 p-3 dark:bg-white/5">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {value || "-"}
      </p>
    </div>
  );
}