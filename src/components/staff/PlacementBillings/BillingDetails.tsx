"use client";

import { X } from "lucide-react";

import {
  formatBillingDate,
  formatBillingDateTime,
  formatMoney,
  getBillingStatusClass,
  getBillingStatusLabel,
} from "./helper";

import type { PlacementBilling } from "./types";

type Props = {
  billing: PlacementBilling | undefined;

  loading: boolean;

  onClose: () => void;
};

export default function BillingDetails({ billing, loading, onClose }: Props) {
  if (loading) {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/50">
        <div className="rounded-2xl bg-white px-8 py-6 shadow-xl">
          Loading billing...
        </div>
      </div>
    );
  }

  if (!billing) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button type="button" className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">
              Placement Billing
            </p>

            <h2 className="mt-1 text-2xl font-bold">{billing.billingId}</h2>

            <p className="mt-1 text-sm text-slate-500">{billing.companyName}</p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getBillingStatusClass(
                billing.status,
              )}`}
            >
              {getBillingStatusLabel(billing.status)}
            </span>

            <button type="button" onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="space-y-7 p-6">
          <section>
            <h3 className="mb-4 font-bold">Placement</h3>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Info label="Candidate" value={billing.candidateName} />

              <Info label="Position" value={billing.jobTitle} />

              <Info label="Recruit ID" value={billing.recruitId} />

              <Info label="Candidate ID" value={billing.placementCandidateId} />

              <Info label="Provider ID" value={billing.providerId} />

              <Info
                label="Placement Date"
                value={formatBillingDate(billing.placementDate)}
              />
            </div>
          </section>

          <section>
            <h3 className="mb-4 font-bold">Billing</h3>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Money label="Placement Fee" value={billing.placementFee} />

              <Money
                label={`Tax (${billing.taxRate}%)`}
                value={billing.taxAmount}
              />

              <Money label="Total Amount" value={billing.totalAmount} />

              <Info
                label="Due Date"
                value={formatBillingDate(billing.dueDate)}
              />
            </div>
          </section>

          <section>
            <h3 className="mb-4 font-bold">Payment</h3>

            <div className="grid gap-3 sm:grid-cols-3">
              <Money label="Paid" value={billing.paidAmount} />

              <Money label="Refunded" value={billing.refundedAmount} />

              <Money label="Net Paid" value={billing.netPaidAmount} />
            </div>
          </section>

          {billing.notes && (
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Billing Notes
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm">
                {billing.notes}
              </p>
            </section>
          )}

          {billing.cancellationReason && (
            <section className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <p className="font-semibold">Cancellation Reason</p>

              <p className="mt-1 text-sm">{billing.cancellationReason}</p>
            </section>
          )}

          {/* REFUNDS */}

          <section>
            <h3 className="font-bold">Refund History</h3>

            {billing.refundHistory.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">
                No refunds recorded.
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {billing.refundHistory.map((refund, index) => (
                  <div
                    key={refund._id || `${refund.refundId}-${index}`}
                    className="rounded-xl border border-red-100 bg-red-50/50 p-4"
                  >
                    <div className="flex flex-wrap justify-between gap-3">
                      <div>
                        <p className="font-semibold">{refund.refundId}</p>

                        <p className="mt-1 text-sm text-slate-500">
                          {refund.actor_type}
                          {" • "}
                          {refund.actor_id}
                        </p>
                      </div>

                      <p className="font-bold text-red-600">
                        {formatMoney(refund.amount)}
                      </p>
                    </div>

                    <p className="mt-3 text-sm">{refund.reason}</p>

                    <p className="mt-2 text-xs text-slate-400">
                      {formatBillingDateTime(refund.refunded_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* AUDIT */}

          <section>
            <h3 className="font-bold">Audit History</h3>

            <div className="mt-3 space-y-3">
              {billing.auditHistory.map((entry, index) => (
                <div
                  key={entry._id || `${entry.action}-${index}`}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap justify-between gap-3">
                    <p className="font-semibold">{entry.action}</p>

                    <p className="text-xs text-slate-400">
                      {formatBillingDateTime(entry.created_at)}
                    </p>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {entry.actor_type}

                    {entry.actor_id ? ` • ${entry.actor_id}` : ""}
                  </p>

                  {entry.reason && (
                    <p className="mt-2 text-sm">{entry.reason}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

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

      <p className="mt-1 font-bold">{formatMoney(value)}</p>
    </div>
  );
}
