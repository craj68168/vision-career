"use client";

import { X } from "lucide-react";
import { useTranslations, useFormatter } from "next-intl";
import type { PlacementBilling } from "./types";

type Props = { billing: PlacementBilling | null; onClose: () => void };

export default function BillingDetailsModal({ billing, onClose }: Props) {
  const t = useTranslations("adminPlacementBillings");
  const format = useFormatter();
  if (!billing) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4">
      <button type="button" aria-label={t("close")} className="absolute inset-0" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="billing-details-title" className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <header className="flex justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">{t("placementBilling")}</p>
            <h2 id="billing-details-title" className="mt-1 text-2xl font-bold">{billing.billingId}</h2>
            <p className="mt-1 text-sm text-slate-500">{billing.companyName}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t("close")}><X className="h-5 w-5" /></button>
        </header>
        <div className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Info label={t("candidate")} value={billing.candidateName} />
            <Info label={t("position")} value={billing.jobTitle} />
            <Info label={t("recruitId")} value={billing.recruitId} />
            <Info label={t("placementCandidate")} value={billing.placementCandidateId} />
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            <Money label={t("placementFee")} value={billing.placementFee} />
            <Money label={t("taxWithRate", { rate: billing.taxRate })} value={billing.taxAmount} />
            <Money label={t("total")} value={billing.totalAmount} />
            <Info label={t("status")} value={t(`statuses.${billing.status}`)} />
          </div>
          {billing.cancellationReason && (
            <div className="rounded-2xl bg-red-50 p-4 text-red-700">
              <p className="font-semibold">{t("cancellationReason")}</p>
              <p className="mt-1">{billing.cancellationReason}</p>
            </div>
          )}
          <div>
            <h3 className="font-semibold">{t("auditHistory")}</h3>
            <div className="mt-3 space-y-3">
              {billing.auditHistory.map((entry, index) => (
                <div key={entry._id || `${entry.action}-${index}`} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex justify-between gap-4">
                    <p className="font-medium">{t(`auditActions.${entry.action}`)}</p>
                    <p className="text-xs text-slate-400">{format.dateTime(new Date(entry.created_at), { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Tokyo" })}</p>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{t(`actorTypes.${entry.actor_type}`)}{entry.actor_id ? ` • ${entry.actor_id}` : ""}</p>
                  {entry.reason && <p className="mt-2 text-sm">{entry.reason}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | null | undefined }) {
  return <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-medium capitalize">{value || "-"}</p></div>;
}

function Money({ label, value }: { label: string; value: number }) {
  const format = useFormatter();
  return <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-bold">{format.number(value, { style: "currency", currency: "JPY", maximumFractionDigits: 0 })}</p></div>;
}
