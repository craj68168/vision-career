"use client";

import { X } from "lucide-react";

import type { PlacementBilling } from "./types";

type Props = {
  billing: PlacementBilling | null;

  onClose: () => void;
};

// ======================================================
// COMPONENT
// ======================================================

export default function BillingDetailsModal({ billing, onClose }: Props) {
  if (!billing) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4">
      <button type="button" className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header className="flex justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">
              Placement Billing
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {billing.invoiceNumber || billing.billingId}
            </h2>

            {billing.invoiceNumber && (
              <p className="mt-1 font-mono text-xs text-slate-400">
                Billing ID: {billing.billingId}
              </p>
            )}

            <p className="mt-2 text-sm text-slate-500">{billing.companyName}</p>
          </div>

          <button type="button" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* ================================================= */}
        {/* BODY */}
        {/* ================================================= */}

        <div className="space-y-6 p-6">
          {/* ================================================= */}
          {/* REFERENCES */}
          {/* ================================================= */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Info label="Candidate" value={billing.candidateName} />

            <Info label="Position" value={billing.jobTitle} />

            <Info label="Recruit ID" value={billing.recruitId} />

            <Info
              label="Placement Candidate"
              value={billing.placementCandidateId}
            />
          </div>

          {/* ================================================= */}
          {/* FINANCIAL */}
          {/* ================================================= */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Money label="Placement Fee" value={billing.placementFee} />

            <Money
              label={`Tax (${billing.taxRate}%)`}
              value={billing.taxAmount}
            />

            <Money label="Total" value={billing.totalAmount} />

            <Info label="Status" value={formatStatus(billing.status)} />
          </div>

          {/* ================================================= */}
          {/* PAYMENT */}
          {/* ================================================= */}

          {["paid", "partially_refunded", "refunded"].includes(
            billing.status,
          ) && (
            <div className="grid gap-4 sm:grid-cols-3">
              <Money label="Paid Amount" value={billing.paidAmount} />

              <Money label="Refunded Amount" value={billing.refundedAmount} />

              <Money label="Net Paid Amount" value={billing.netPaidAmount} />
            </div>
          )}

          {/* ================================================= */}
          {/* INVOICE INFORMATION */}
          {/* ================================================= */}

          {billing.invoiceNumber && (
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                Invoice Information
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Info label="Invoice Number" value={billing.invoiceNumber} />

                <Info label="Internal Billing ID" value={billing.billingId} />

                <Info
                  label="Issue Date"
                  value={formatJapanDate(billing.issuedAt)}
                />

                <Info
                  label="Payment Due Date"
                  value={formatJapanDate(billing.dueDate)}
                />
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* CANCELLATION */}
          {/* ================================================= */}

          {billing.cancellationReason && (
            <div className="rounded-2xl bg-red-50 p-4 text-red-700">
              <p className="font-semibold">Cancellation Reason</p>

              <p className="mt-1">{billing.cancellationReason}</p>
            </div>
          )}

          {/* ================================================= */}
          {/* REFUND HISTORY */}
          {/* ================================================= */}

          {billing.refundHistory.length > 0 && (
            <div>
              <h3 className="font-semibold">Refund History</h3>

              <div className="mt-3 space-y-3">
                {billing.refundHistory.map((refund) => (
                  <div
                    key={refund._id || refund.refundId}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-mono font-medium">
                          {refund.refundId}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {refund.reason}
                        </p>
                      </div>

                      <p className="font-bold text-red-600">
                        -¥
                        {Number(refund.amount || 0).toLocaleString()}
                      </p>
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      {formatJapanDateTime(refund.refunded_at)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* AUDIT HISTORY */}
          {/* ================================================= */}

          <div>
            <h3 className="font-semibold">Audit History</h3>

            <div className="mt-3 space-y-3">
              {billing.auditHistory.map((entry, index) => (
                <div
                  key={entry._id || `${entry.action}-${index}`}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex justify-between gap-4">
                    <p className="font-medium">
                      {formatAuditAction(entry.action)}
                    </p>

                    <p className="text-xs text-slate-400">
                      {formatJapanDateTime(entry.created_at)}
                    </p>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {formatActorType(entry.actor_type)}

                    {entry.actor_id ? ` • ${entry.actor_id}` : ""}
                  </p>

                  {entry.reason && (
                    <p className="mt-2 text-sm">{entry.reason}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
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

  value: string | null | undefined;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 break-words font-medium">{value || "-"}</p>
    </div>
  );
}

// ======================================================
// MONEY
// ======================================================

function Money({
  label,
  value,
}: {
  label: string;

  value: number;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 font-bold">¥{Number(value || 0).toLocaleString()}</p>
    </div>
  );
}

// ======================================================
// STATUS
// ======================================================

function formatStatus(value: string) {
  const labels: Record<string, string> = {
    draft: "Draft",

    issued: "Issued",

    paid: "Paid",

    partially_refunded: "Partially Refunded",

    refunded: "Refunded",

    cancelled: "Cancelled",
  };

  return labels[value] || value;
}

// ======================================================
// AUDIT ACTION
// ======================================================

function formatAuditAction(value: string) {
  const labels: Record<string, string> = {
    CREATED: "Created",

    UPDATED: "Updated",

    ISSUED: "Issued",

    MARKED_PAID: "Marked as paid",

    CANCELLED: "Cancelled",

    REFUND_PROCESSED: "Refund recorded",
  };

  return labels[value] || value;
}

// ======================================================
// ACTOR
// ======================================================

function formatActorType(value: string) {
  const labels: Record<string, string> = {
    system: "System",

    admin: "Admin",

    staff: "Staff",
  };

  return labels[value] || value;
}

// ======================================================
// JAPAN DATE
// ======================================================

function formatJapanDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",

    year: "numeric",

    month: "2-digit",

    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value || "";

  const month = parts.find((part) => part.type === "month")?.value || "";

  const day = parts.find((part) => part.type === "day")?.value || "";

  return `${year}/${month}/${day}`;
}

// ======================================================
// JAPAN DATE + TIME
// ======================================================

function formatJapanDateTime(value?: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",

    year: "numeric",

    month: "2-digit",

    day: "2-digit",

    hour: "2-digit",

    minute: "2-digit",

    second: "2-digit",

    hour12: false,
  }).format(date);
}
