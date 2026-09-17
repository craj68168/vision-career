"use client";

import { useState } from "react";

import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Loader2,
  MapPin,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

import type {
  PlacementCandidateStatus,
  PlacementRequest,
  ProviderPlacementCandidate,
  ProviderPlacementCandidateDecisionStatus,
  UpdateProviderPlacementCandidateStatusPayload,
} from "./types";

// ======================================================
// PROPS
// ======================================================

type Props = {
  open: boolean;

  request: PlacementRequest | null;

  candidates: ProviderPlacementCandidate[];

  actionCandidateId: string | null;

  lang: string;

  onClose: () => void;

  onStatusChange: (
    placementCandidateId: string,
    payload: UpdateProviderPlacementCandidateStatusPayload,
  ) => void | Promise<void>;
};

// ======================================================
// NEXT ACTION
// ======================================================

const getNextAction = (
  status: PlacementCandidateStatus,
): {
  status: ProviderPlacementCandidateDecisionStatus;
  labelEn: string;
  labelJa: string;
} | null => {
  switch (status) {
    case "MATCHED":
      return {
        status: "UNDER_REVIEW",
        labelEn: "Start Review",
        labelJa: "審査開始",
      };

    case "UNDER_REVIEW":
      return {
        status: "INTERVIEW",
        labelEn: "Move to Interview",
        labelJa: "面接へ進む",
      };

    case "INTERVIEW":
      return {
        status: "SELECTED",
        labelEn: "Select Candidate",
        labelJa: "候補者を選考",
      };

    case "SELECTED":
      return {
        status: "PLACED",
        labelEn: "Mark as Placed",
        labelJa: "採用決定",
      };

    default:
      return null;
  }
};

// ======================================================
// COMPONENT
// ======================================================

export default function PlacementCandidatesModal({
  open,
  request,
  candidates,
  actionCandidateId,
  lang,
  onClose,
  onStatusChange,
}: Props) {
  const [rejectingCandidateId, setRejectingCandidateId] = useState<
    string | null
  >(null);

  const [rejectionReason, setRejectionReason] = useState("");

  if (!open || !request) {
    return null;
  }

  const closeReject = () => {
    setRejectingCandidateId(null);
    setRejectionReason("");
  };

  const rejectCandidate = async () => {
    if (!rejectingCandidateId || !rejectionReason.trim()) {
      return;
    }

    await onStatusChange(rejectingCandidateId, {
      status: "REJECTED",
      rejectionReason: rejectionReason.trim(),
    });

    closeReject();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0"
      />

      <div className="relative z-10 flex h-full w-full flex-col overflow-hidden bg-white sm:max-h-[94vh] sm:max-w-6xl sm:rounded-3xl sm:shadow-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              {lang === "ja" ? "紹介候補者" : "Matched Candidates"}
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              {request.job_title}
            </h2>

            <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
              <span>{request.recruitId}</span>

              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />

                {request.work_location || "-"}
              </span>

              <span>
                {lang === "ja" ? "募集人数" : "Positions"}:{" "}
                {request.number_of_positions}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* ================================================= */}
        {/* SUMMARY */}
        {/* ================================================= */}

        <div className="grid gap-4 border-b border-slate-200 bg-slate-50/70 p-6 sm:grid-cols-3">
          <SummaryCard
            label={lang === "ja" ? "募集人数" : "Positions Required"}
            value={request.number_of_positions}
          />

          <SummaryCard
            label={lang === "ja" ? "紹介候補者" : "Candidates Received"}
            value={candidates.length}
          />

          <SummaryCard
            label={lang === "ja" ? "採用決定" : "Placed"}
            value={
              candidates.filter((candidate) => candidate.status === "PLACED")
                .length
            }
          />
        </div>

        {/* ================================================= */}
        {/* CANDIDATES */}
        {/* ================================================= */}

        <div className="flex-1 overflow-y-auto p-6">
          {candidates.length === 0 ? (
            <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-slate-300">
              <div className="max-w-md text-center">
                <BriefcaseBusiness className="mx-auto h-9 w-9 text-slate-300" />

                <h3 className="mt-4 font-semibold text-slate-900">
                  {lang === "ja"
                    ? "候補者はまだ紹介されていません"
                    : "No candidates matched yet"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {lang === "ja"
                    ? "管理者が候補者を紹介すると、ここに表示されます。"
                    : "Candidates matched by Admin will appear here."}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {candidates.map((item) => {
                const nextAction = getNextAction(item.status);

                const isBusy = actionCandidateId === item.placementCandidateId;

                const canReject = [
                  "MATCHED",
                  "UNDER_REVIEW",
                  "INTERVIEW",
                  "SELECTED",
                ].includes(item.status);

                return (
                  <article
                    key={item.placementCandidateId}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    {/* TOP */}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                          <UserRound className="h-5 w-5" />
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-slate-950">
                            {item.candidate.name}
                          </h3>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {item.placementCandidateId}
                          </p>
                        </div>
                      </div>

                      <CandidateStatusBadge status={item.status} />
                    </div>

                    {/* PROFILE */}

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <Info
                        label={lang === "ja" ? "国籍" : "Nationality"}
                        value={item.candidate.nationality}
                      />

                      <Info
                        label={lang === "ja" ? "日本語" : "Japanese"}
                        value={item.candidate.japanese_level}
                      />

                      <Info
                        label={lang === "ja" ? "在留資格" : "Visa"}
                        value={item.candidate.visa_type}
                      />

                      <Info
                        label={lang === "ja" ? "現在地" : "Current Location"}
                        value={item.candidate.current_location}
                      />

                      <Info
                        label={lang === "ja" ? "希望職種" : "Desired Job"}
                        value={item.candidate.desired_job}
                      />

                      <Info
                        label={
                          lang === "ja" ? "希望勤務地" : "Desired Location"
                        }
                        value={item.candidate.desired_location}
                      />

                      <Info
                        label={lang === "ja" ? "ビザ有効期限" : "Visa Expiry"}
                        value={formatDate(item.candidate.visa_expiry_date)}
                      />

                      <Info
                        label={lang === "ja" ? "紹介日" : "Matched"}
                        value={formatDate(item.matchedAt)}
                      />
                    </div>

                    {/* SKILLS */}

                    {item.candidate.skills.length > 0 && (
                      <div className="mt-5">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {lang === "ja" ? "スキル" : "Skills"}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {item.candidate.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* EDUCATION */}

                    {item.candidate.education.length > 0 && (
                      <details className="mt-5 rounded-xl border border-slate-200">
                        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">
                          {lang === "ja" ? "学歴" : "Education"} (
                          {item.candidate.education.length})
                        </summary>

                        <div className="space-y-3 border-t border-slate-200 p-4">
                          {item.candidate.education.map((education, index) => (
                            <div
                              key={`${education.school ?? "school"}-${index}`}
                              className="rounded-xl bg-slate-50 p-3"
                            >
                              <p className="font-medium text-slate-900">
                                {education.school || "-"}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                {[education.school_type, education.major]
                                  .filter(Boolean)
                                  .join(" • ") || "-"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}

                    {/* EMPLOYMENT */}

                    {item.candidate.employment_history.length > 0 && (
                      <details className="mt-3 rounded-xl border border-slate-200">
                        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">
                          {lang === "ja" ? "職歴" : "Employment History"} (
                          {item.candidate.employment_history.length})
                        </summary>

                        <div className="space-y-3 border-t border-slate-200 p-4">
                          {item.candidate.employment_history.map(
                            (employment, index) => (
                              <div
                                key={`${employment.company_name ?? "company"}-${index}`}
                                className="rounded-xl bg-slate-50 p-3"
                              >
                                <p className="font-medium text-slate-900">
                                  {employment.company_name || "-"}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                  {employment.employment_type || "-"}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </details>
                    )}

                    {/* REJECTION */}

                    {item.status === "REJECTED" && item.rejectionReason && (
                      <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-semibold text-red-700">
                          {lang === "ja" ? "却下理由" : "Rejection Reason"}
                        </p>

                        <p className="mt-1 whitespace-pre-wrap text-sm text-red-700">
                          {item.rejectionReason}
                        </p>
                      </div>
                    )}

                    {/* STATUS DATES */}

                    <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-400">
                      {item.providerReviewedAt && (
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Review: {formatDate(item.providerReviewedAt)}
                        </span>
                      )}

                      {item.interviewAt && (
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Interview: {formatDate(item.interviewAt)}
                        </span>
                      )}

                      {item.selectedAt && (
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Selected: {formatDate(item.selectedAt)}
                        </span>
                      )}

                      {item.placedAt && (
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Placed: {formatDate(item.placedAt)}
                        </span>
                      )}
                    </div>

                    {/* ACTIONS */}

                    {(nextAction || canReject) && (
                      <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                        {nextAction && (
                          <button
                            type="button"
                            disabled={Boolean(actionCandidateId)}
                            onClick={() =>
                              void onStatusChange(item.placementCandidateId, {
                                status: nextAction.status,
                              })
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isBusy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}

                            {lang === "ja"
                              ? nextAction.labelJa
                              : nextAction.labelEn}
                          </button>
                        )}

                        {canReject && (
                          <button
                            type="button"
                            disabled={Boolean(actionCandidateId)}
                            onClick={() => {
                              setRejectingCandidateId(
                                item.placementCandidateId,
                              );

                              setRejectionReason("");
                            }}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 disabled:opacity-50"
                          >
                            <XCircle className="h-4 w-4" />

                            {lang === "ja"
                              ? "候補者を却下"
                              : "Reject Candidate"}
                          </button>
                        )}
                      </div>
                    )}

                    {/* REJECTION FORM */}

                    {rejectingCandidateId === item.placementCandidateId && (
                      <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
                        <label className="text-sm font-semibold text-red-700">
                          {lang === "ja" ? "却下理由" : "Rejection Reason"}
                        </label>

                        <textarea
                          rows={3}
                          value={rejectionReason}
                          onChange={(event) =>
                            setRejectionReason(event.target.value)
                          }
                          placeholder={
                            lang === "ja"
                              ? "却下理由を入力してください..."
                              : "Enter the reason for rejecting this candidate..."
                          }
                          className="mt-2 w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-sm outline-none focus:border-red-400"
                        />

                        <div className="mt-3 flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={closeReject}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                          >
                            {lang === "ja" ? "キャンセル" : "Cancel"}
                          </button>

                          <button
                            type="button"
                            disabled={!rejectionReason.trim() || isBusy}
                            onClick={() => void rejectCandidate()}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                          >
                            {isBusy && (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            )}

                            {lang === "ja" ? "却下する" : "Confirm Reject"}
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ======================================================
// STATUS BADGE
// ======================================================

function CandidateStatusBadge({
  status,
}: {
  status: PlacementCandidateStatus;
}) {
  let classes = "bg-slate-100 text-slate-700";

  switch (status) {
    case "MATCHED":
      classes = "bg-indigo-50 text-indigo-700";
      break;

    case "UNDER_REVIEW":
      classes = "bg-amber-50 text-amber-700";
      break;

    case "INTERVIEW":
      classes = "bg-blue-50 text-blue-700";
      break;

    case "SELECTED":
      classes = "bg-violet-50 text-violet-700";
      break;

    case "PLACED":
      classes = "bg-emerald-50 text-emerald-700";
      break;

    case "REJECTED":
      classes = "bg-red-50 text-red-700";
      break;
  }

  return (
    <span
      className={`h-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

// ======================================================
// INFO
// ======================================================

function Info({
  label,
  value,
}: {
  label: string;

  value?: string | number | null;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-400">{label}</p>

      <p className="mt-1 text-sm font-medium text-slate-900">
        {value === null || value === undefined || value === ""
          ? "-"
          : String(value)}
      </p>
    </div>
  );
}

// ======================================================
// SUMMARY CARD
// ======================================================

function SummaryCard({
  label,
  value,
}: {
  label: string;

  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

// ======================================================
// DATE
// ======================================================

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
}
