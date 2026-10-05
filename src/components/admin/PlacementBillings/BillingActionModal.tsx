"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

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
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm">
      <button type="button" tabIndex={-1} disabled={loading} aria-label={t("close")} className="absolute inset-0" onClick={onClose} />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="billing-action-title" onKeyDown={(event) => {
        if (event.key === "Escape" && !loading) { event.stopPropagation(); onClose(); }
        if (event.key === "Tab") {
          const items = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), textarea:not(:disabled)') ?? []);
          const first = items[0]; const last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }
      }} className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900">
        <header className="flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-5"><div className="min-w-0"><h2 id="billing-action-title" className="text-lg font-semibold text-zinc-950 dark:text-white">{title}</h2><p className="mt-1 truncate font-mono text-sm text-zinc-500 dark:text-zinc-400">{billingId}</p></div><button type="button" disabled={loading} aria-label={t("close")} onClick={onClose} className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-white/10 ${focusRing}`}><X className="h-5 w-5" /></button></header>
        <div className="p-4 sm:p-5"><p className="text-sm text-zinc-600 dark:text-zinc-300">{t(action === "issue" ? "confirmIssueDescription" : action === "paid" ? "confirmPaidDescription" : "confirmCancelDescription")}</p>
          {action === "cancel" && <label className="mt-4 block"><span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t("cancellationReason")}</span><textarea autoFocus disabled={loading} rows={4} value={reason} onChange={(event) => setReason(event.target.value)} placeholder={t("cancellationPlaceholder")} className="mt-2 w-full rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-zinc-900 dark:text-white" /></label>}
        </div>
        <footer className="flex flex-wrap justify-end gap-2 border-t border-zinc-200 px-4 py-3 dark:border-white/10 sm:px-5"><button type="button" disabled={loading} onClick={onClose} className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 sm:flex-none ${focusRing}`}>{t("cancel")}</button><button type="button" disabled={loading || (action === "cancel" && !reason.trim())} onClick={() => onConfirm(reason.trim())} className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none ${focusRing}`}>{t(loading ? "processing" : action === "issue" ? "issue" : action === "paid" ? "markPaid" : "cancelBilling")}</button></footer>
      </div>
    </div>
  );
}
