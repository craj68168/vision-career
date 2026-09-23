"use client";

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
      <div className="flex min-h-[500px] items-center justify-center">
        <RefreshCw className="h-10 w-10 animate-spin text-indigo-600" />
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
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            {lang === "ja" ? "応募管理" : "Applications"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {lang === "ja"
              ? "応募を確認し、企業へ送信する前に審査します。"
              : "Review applications before they are sent to Providers."}
          </p>
        </div>

        <button
          type="button"
          disabled={isFetching}
          onClick={() => void refetch()}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />

          {lang === "ja" ? "更新" : "Refresh"}
        </button>
      </div>

      {/* SUMMARY */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label={lang === "ja" ? "総応募数" : "Applications"}
          value={summary?.total || 0}
          icon={UserRoundCheck}
        />

        <SummaryCard
          label={lang === "ja" ? "管理者承認待ち" : "Pending Approval"}
          value={summary?.pendingAdminApproval || 0}
          icon={Clock3}
        />

        <SummaryCard
          label={lang === "ja" ? "企業へ送信済み" : "Sent to Provider"}
          value={summary?.sentToProvider || 0}
          icon={Send}
        />

        <SummaryCard
          label={lang === "ja" ? "採用" : "Hired"}
          value={summary?.hired || 0}
          icon={CheckCircle2}
        />
      </div>

      {/* FILTER */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatusFilter(filter.value)}
                className={`cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  statusFilter === filter.value
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="relative w-full xl:max-w-sm">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                lang === "ja"
                  ? "応募者、求人、企業を検索..."
                  : "Search applicant, vacancy, company..."
              }
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-400"
            />
          </div>
        </div>
      </div>

      {/* APPLICATIONS */}

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center">
          <p className="text-slate-500">
            {lang === "ja" ? "応募がありません。" : "No applications found."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {applications.map((application) => {
            const pending = application.status === "PENDING_ADMIN_APPROVAL";

            return (
              <article
                key={application.applicationId}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-indigo-500">
                      {application.applicationId}
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-950">
                      {application.candidate.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {application.vacancy.title}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getApplicationStatusClass(
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

                <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => openDetails(application.applicationId)}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Eye className="h-4 w-4" />

                    {lang === "ja" ? "詳細" : "View Details"}
                  </button>

                  {pending && (
                    <>
                      <button
                        type="button"
                        onClick={() => openReject(application)}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
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
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
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
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{
    className?: string;
  }>;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>

        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function CardField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-900">{value || "-"}</p>
    </div>
  );
}
