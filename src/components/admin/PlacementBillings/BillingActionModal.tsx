"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
type Props = {
  action: "issue" | "paid" | "cancel";
  billingId: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};
export default function BillingActionModal({ action, billingId, loading, onClose, onConfirm }: Props) {
  const t = useTranslations("adminPlacementBillings");
  const [reason, setReason] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("textarea, button")?.focus();
    return () => { previous?.focus(); };
  }, []);
  const title = action === "issue" ? t("confirmIssueTitle") : action === "paid" ? t("confirmPaidTitle") : t("confirmCancelTitle");
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/50 p-4">
      <button type="button" tabIndex={-1} disabled={loading} aria-label={t("close")} className="absolute inset-0" onClick={onClose} />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="billing-action-title" onKeyDown={(event) => {
        if (event.key === "Escape" && !loading) { event.stopPropagation(); onClose(); }
        if (event.key === "Tab") {
          const items = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), textarea:not(:disabled)') ?? []);
          const first = items[0]; const last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }
      }} className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 p-6"><div><h2 id="billing-action-title" className="text-xl font-bold">{title}</h2><p className="mt-2 font-mono text-sm text-slate-500">{billingId}</p></div><button type="button" disabled={loading} aria-label={t("close")} onClick={onClose}><X className="h-5 w-5" /></button></header>
        <div className="p-6"><p className="text-sm text-slate-600">{t(action === "issue" ? "confirmIssueDescription" : action === "paid" ? "confirmPaidDescription" : "confirmCancelDescription")}</p>
          {action === "cancel" && <label className="mt-4 block"><span className="text-sm font-semibold">{t("cancellationReason")}</span><textarea autoFocus disabled={loading} rows={4} value={reason} onChange={(event) => setReason(event.target.value)} placeholder={t("cancellationPlaceholder")} className="mt-2 w-full rounded-xl border border-slate-200 p-3" /></label>}
        </div>
        <footer className="flex justify-end gap-3 border-t border-slate-200 p-6"><button type="button" disabled={loading} onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5">{t("cancel")}</button><button type="button" disabled={loading || (action === "cancel" && !reason.trim())} onClick={() => onConfirm(reason.trim())} className="rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white disabled:opacity-50">{t(loading ? "processing" : action === "issue" ? "issue" : action === "paid" ? "markPaid" : "cancelBilling")}</button></footer>
      </div>
    </div>
  );
}
