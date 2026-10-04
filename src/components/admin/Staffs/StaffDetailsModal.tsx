"use client";
import { KeyRound, Pencil, X } from "lucide-react";
import { useTranslations, useFormatter } from "next-intl";
import type { Staff } from "./types";
type Props = { staff: Staff | null; onClose: () => void; onEdit: (staff: Staff) => void; onResetPassword: (staff: Staff) => void };
export default function StaffDetailsModal({ staff, onClose, onEdit, onResetPassword }: Props) {
  const t = useTranslations("adminStaff");
  const format = useFormatter();
  const formatLastLogin = (value?: string | null) => {
    if (!value) return t("never");
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return format.dateTime(date, { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  };
  if (!staff) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/50 p-4">
      <button type="button" aria-label={t("close")} className="absolute inset-0" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={t("staffAccount")} className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div><p className="text-xs font-semibold uppercase text-indigo-600">{t("staffAccount")}</p><h2 className="mt-1 text-2xl font-bold">{staff.name}</h2><p className="mt-1 text-sm text-slate-500">{staff.staffId}</p></div>
          <button type="button" aria-label={t("close")} onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        {/* BODY */}
        <div className="space-y-6 p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Info label={t("email")} value={staff.email} />
            <Info label={t("phone")} value={staff.phone || "-"} />
            <Info label={t("status")} value={t(`statuses.${staff.status}`)} />
            <Info label={t("role")} value={t("staffRole")} />
            <Info label={t("createdBy")} value={staff.createdByAdminId} />
            <Info label={t("lastLogin")} value={formatLastLogin(staff.lastLoginAt)} />
          </div>
          <div><h3 className="font-semibold">{t("permissionsTitle")}</h3>
            {staff.permissions.length === 0 ? <p className="mt-3 text-sm text-slate-500">{t("noPermissions")}</p> : (
              <div className="mt-3 flex flex-wrap gap-2">{staff.permissions.map((permission) => <span key={permission} className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">{t(`permissions.${permission}`)}</span>)}</div>
            )}
          </div>
        </div>
        {/* FOOTER */}
        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 p-6">
          <button type="button" onClick={() => onResetPassword(staff)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5"><KeyRound className="h-4 w-4" />{t("resetPassword")}</button>
          <button type="button" onClick={() => onEdit(staff)} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 font-semibold text-white"><Pencil className="h-4 w-4" />{t("editStaff")}</button>
        </div>
      </div>
    </div>
  );
}
// INFO
function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 break-words font-semibold text-slate-950">{value}</p></div>;
}
