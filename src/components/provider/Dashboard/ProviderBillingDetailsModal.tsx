"use client";

import {
  CalendarDays,
  CircleDollarSign,
  FileText,
  ReceiptText,
  RotateCcw,
  X,
} from "lucide-react";

import type {
  ProviderPlacementBilling,
  ProviderPlacementBillingStatus,
} from "./types";

type Props = {
  billing: ProviderPlacementBilling | null;

  lang: string;

  onClose: () => void;
};

export default function ProviderBillingDetailsModal({
  billing,
  lang,
  onClose,
}: Props) {
  if (!billing) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              {lang === "ja" ? "採用請求書" : "Placement Invoice"}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {billing.billingId}
            </h2>

            <p className="mt-1 text-sm text-slate-500">{billing.companyName}</p>
          </div>

          <div className="flex items-center gap-3">
            <BillingStatusBadge status={billing.status} />

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Info
              label={lang === "ja" ? "候補者" : "Candidate"}
              value={billing.candidateName}
            />

            <Info
              label={lang === "ja" ? "職種" : "Position"}
              value={billing.jobTitle}
            />

            <Info
              label={lang === "ja" ? "採用日" : "Placement Date"}
              value={formatDate(billing.placementDate)}
            />

            <Info
              label={lang === "ja" ? "支払期限" : "Due Date"}
              value={formatDate(billing.dueDate)}
            />
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2">
              <ReceiptText className="h-5 w-5 text-indigo-600" />

              <h3 className="font-bold text-slate-950">
                {lang === "ja" ? "請求明細" : "Invoice Summary"}
              </h3>
            </div>

            <MoneyRow
              label={lang === "ja" ? "紹介手数料" : "Placement Fee"}
              value={billing.placementFee}
            />

            <MoneyRow
              label={`${lang === "ja" ? "税" : "Tax"} (${billing.taxRate}%)`}
              value={billing.taxAmount}
            />

            <div className="my-4 border-t border-slate-200" />

            <MoneyRow
              label={lang === "ja" ? "合計" : "Total"}
              value={billing.totalAmount}
              strong
            />

            {billing.status === "issued" && (
              <MoneyRow
                label={lang === "ja" ? "未払額" : "Amount Due"}
                value={billing.amountDue}
                strong
              />
            )}

            {["paid", "partially_refunded", "refunded"].includes(
              billing.status,
            ) && (
              <>
                <MoneyRow
                  label={lang === "ja" ? "支払額" : "Paid"}
                  value={billing.paidAmount}
                />

                <MoneyRow
                  label={lang === "ja" ? "返金額" : "Refunded"}
                  value={billing.refundedAmount}
                />

                <MoneyRow
                  label={lang === "ja" ? "純支払額" : "Net Paid"}
                  value={billing.netPaidAmount}
                  strong
                />
              </>
            )}
          </div>

          {billing.status === "issued" && (
            <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <CircleDollarSign className="mt-0.5 h-5 w-5 text-blue-600" />

                <div>
                  <p className="font-semibold text-blue-900">
                    {lang === "ja" ? "お支払い待ち" : "Payment Pending"}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-blue-700">
                    {lang === "ja"
                      ? "現在は管理者が支払いを確認して請求状態を更新します。オンライン決済は次の段階で追加します。"
                      : "For now, payment is confirmed manually by Admin. Online payment will be added in the next phase."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {billing.notes && (
            <div className="mt-6 rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <FileText className="h-4 w-4" />

                {lang === "ja" ? "備考" : "Notes"}
              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {billing.notes}
              </p>
            </div>
          )}

          {billing.status === "cancelled" && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="font-semibold text-red-800">
                {lang === "ja" ? "請求キャンセル" : "Invoice Cancelled"}
              </p>

              <p className="mt-2 text-sm text-red-700">
                {billing.cancellationReason || "-"}
              </p>
            </div>
          )}

          {billing.refundHistory.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-slate-500" />

                <h3 className="font-bold text-slate-950">
                  {lang === "ja" ? "返金履歴" : "Refund History"}
                </h3>
              </div>

              <div className="space-y-3">
                {billing.refundHistory.map((refund) => (
                  <div
                    key={refund.refundId}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {refund.refundId}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {refund.reason}
                        </p>
                      </div>

                      <p className="font-bold text-red-600">
                        -{formatMoney(refund.amount)}
                      </p>
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                      {formatDate(refund.refundedAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3">
            <Info
              label={lang === "ja" ? "採用依頼ID" : "Placement Request"}
              value={billing.recruitId}
            />

            <Info
              label={lang === "ja" ? "候補者配置ID" : "Placement Candidate"}
              value={billing.placementCandidateId}
            />

            <Info
              label={lang === "ja" ? "発行日" : "Issued At"}
              value={formatDate(billing.issuedAt)}
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {lang === "ja" ? "閉じる" : "Close"}
          </button>
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

  value?: string | null;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}

function MoneyRow({
  label,
  value,
  strong = false,
}: {
  label: string;

  value: number;

  strong?: boolean;
}) {
  return (
    <div className="mt-3 flex items-center justify-between gap-4">
      <span
        className={
          strong ? "font-semibold text-slate-950" : "text-sm text-slate-600"
        }
      >
        {label}
      </span>

      <span
        className={
          strong
            ? "text-lg font-bold text-slate-950"
            : "text-sm font-semibold text-slate-900"
        }
      >
        {formatMoney(value)}
      </span>
    </div>
  );
}

function BillingStatusBadge({
  status,
}: {
  status: ProviderPlacementBillingStatus;
}) {
  const classes: Record<ProviderPlacementBillingStatus, string> = {
    issued: "bg-blue-50 text-blue-700",

    paid: "bg-emerald-50 text-emerald-700",

    partially_refunded: "bg-amber-50 text-amber-700",

    refunded: "bg-violet-50 text-violet-700",

    cancelled: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${classes[status]}`}
    >
      {formatStatus(status)}
    </span>
  );
}

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatMoney(value: number) {
  return `¥${Number(value || 0).toLocaleString()}`;
}

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",

    month: "short",

    day: "numeric",
  }).format(date);
}
