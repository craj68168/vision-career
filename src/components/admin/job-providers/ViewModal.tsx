import {
  Briefcase,
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  StickyNote,
  User,
} from "lucide-react";

function InfoRow({
  icon,
  label,
  value,
  multiLine = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  multiLine?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-400 dark:text-slate-500">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p
          className={`text-sm text-slate-900 dark:text-white ${multiLine ? "whitespace-pre-wrap break-words" : "truncate"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-700/50">
      <p className="text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}

export default function ViewProviderDetailsModal({
  lang,
  closeViewModal,
  viewingProvider,
}: any) {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeViewModal();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
    >
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {lang === "ja" ? "企業詳細" : "Company Details"}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {lang === "ja"
                ? "クライアント企業の詳細情報"
                : "Client company details"}
            </p>
          </div>

          <button
            type="button"
            onClick={closeViewModal}
            className="cursor-pointer rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Header with Status Badge */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/50">
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                {viewingProvider.name || "-"}
              </h4>
              {viewingProvider.company_name && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {viewingProvider.company_name}
                </p>
              )}
            </div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                viewingProvider.status === "active"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {viewingProvider.status === "active"
                ? lang === "ja"
                  ? "有効"
                  : "Active"
                : lang === "ja"
                  ? "無効"
                  : "Inactive"}
            </span>
          </div>

          {/* Two Column Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Basic Information */}
            <div className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "基本情報" : "Basic Information"}
              </h5>

              <InfoRow
                icon={<User className="h-4 w-4" />}
                label={lang === "ja" ? "プロバイダー名" : "Provider Name"}
                value={viewingProvider.name || "-"}
              />

              <InfoRow
                icon={<Building2 className="h-4 w-4" />}
                label={lang === "ja" ? "会社名" : "Company Name"}
                value={viewingProvider.company_name || "-"}
              />

              <InfoRow
                icon={<Mail className="h-4 w-4" />}
                label={lang === "ja" ? "メール" : "Email"}
                value={viewingProvider.email || "-"}
              />

              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                label={lang === "ja" ? "電話番号" : "Phone"}
                value={viewingProvider.phone || "-"}
              />
            </div>

            {/* Contact Person */}
            <div className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "担当者情報" : "Contact Person"}
              </h5>

              <InfoRow
                icon={<User className="h-4 w-4" />}
                label={lang === "ja" ? "担当者名" : "Contact Person"}
                value={viewingProvider.contactPerson || "-"}
              />

              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                label={lang === "ja" ? "電話番号" : "Phone"}
                value={viewingProvider.contactPersonPhone || "-"}
              />

              <InfoRow
                icon={<Mail className="h-4 w-4" />}
                label={lang === "ja" ? "メール" : "Email"}
                value={viewingProvider.contactPersonEmail || "-"}
              />
            </div>

            {/* Location & Web */}
            <div className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "所在地・ウェブ" : "Location & Web"}
              </h5>

              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label={lang === "ja" ? "住所" : "Address"}
                value={viewingProvider.address || "-"}
              />

              <InfoRow
                icon={<Globe className="h-4 w-4" />}
                label={lang === "ja" ? "ウェブサイト" : "Website"}
                value={viewingProvider.website || "-"}
              />
            </div>

            {/* Hiring & Notes */}
            <div className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "採用・備考" : "Hiring & Notes"}
              </h5>

              <InfoRow
                icon={<Briefcase className="h-4 w-4" />}
                label={lang === "ja" ? "採用ニーズ" : "Hiring Needs"}
                value={viewingProvider.hiringNeeds || "-"}
                multiLine
              />

              <InfoRow
                icon={<StickyNote className="h-4 w-4" />}
                label={lang === "ja" ? "備考" : "Notes"}
                value={viewingProvider.notes || "-"}
                multiLine
              />
            </div>
          </div>

          {/* Statistics Section */}
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <h5 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {lang === "ja" ? "統計情報" : "Statistics"}
            </h5>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <StatItem
                label={lang === "ja" ? "総求人数" : "Total Vacancies"}
                value={String(viewingProvider.statistics?.total_vacancies ?? 0)}
              />
              <StatItem
                label={lang === "ja" ? "総応募数" : "Total Applications"}
                value={String(
                  viewingProvider.statistics?.total_applications_received ?? 0,
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
