import {
  BadgeCheck,
  Briefcase,
  Calendar,
  FileText,
  Flag,
  Globe,
  Mail,
  MapPin,
  MapPinned,
  Phone,
  StickyNote,
  UserIcon,
} from "lucide-react";

function InfoRow({
  icon,
  label,
  value,
  multiLine = false,
  isLink = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  multiLine?: boolean;
  isLink?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-400 dark:text-slate-500">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        {typeof value === "string" ? (
          <p
            className={`text-sm text-slate-900 dark:text-white ${multiLine ? "whitespace-pre-wrap break-words" : "truncate"}`}
          >
            {value}
          </p>
        ) : (
          <div className="text-sm">{value}</div>
        )}
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

export default function ViewSeekerModal({
  closeViewModal,
  lang,
  viewingSeeker,
}: any) {
  const getPlacementStatusLabel = (
    status: string | null,
    language: string,
  ): string => {
    if (!status) return "-";

    const statusMap: Record<string, { ja: string; en: string }> = {
      in_process: { ja: "選考中", en: "In Process" },
      placed: { ja: "内定", en: "Placed" },
      rejected: { ja: "不採用", en: "Rejected" },
      withdrawn: { ja: "辞退", en: "Withdrawn" },
    };

    const mapped = statusMap[status];
    if (!mapped) return status;

    return language === "ja" ? mapped.ja : mapped.en;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(lang === "ja" ? "ja-JP" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleString(lang === "ja" ? "ja-JP" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) closeViewModal();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
    >
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {lang === "ja" ? "求職者詳細" : "Job Seeker Details"}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {lang === "ja" ? "求職者の詳細情報" : "Job seeker details"}
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
                {viewingSeeker.full_name || viewingSeeker.name || "-"}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {viewingSeeker.email || "-"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  viewingSeeker.status === "active"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {viewingSeeker.status === "active"
                  ? lang === "ja"
                    ? "有効"
                    : "Active"
                  : lang === "ja"
                    ? "無効"
                    : "Inactive"}
              </span>

              {viewingSeeker.placementStatus && (
                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {getPlacementStatusLabel(viewingSeeker.placementStatus, lang)}
                </span>
              )}
            </div>
          </div>

          {/* Two Column Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Personal Information */}
            <div className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "個人情報" : "Personal Information"}
              </h5>

              <InfoRow
                icon={<UserIcon className="h-4 w-4" />}
                label={lang === "ja" ? "氏名" : "Full Name"}
                value={viewingSeeker.full_name || viewingSeeker.name || "-"}
              />

              <InfoRow
                icon={<Mail className="h-4 w-4" />}
                label={lang === "ja" ? "メール" : "Email"}
                value={viewingSeeker.email || "-"}
              />

              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                label={lang === "ja" ? "電話番号" : "Phone"}
                value={viewingSeeker.phone || "-"}
              />

              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label={lang === "ja" ? "住所" : "Address"}
                value={viewingSeeker.address || "-"}
              />
            </div>

            {/* Personal Details */}
            <div className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "詳細情報" : "Personal Details"}
              </h5>

              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label={lang === "ja" ? "生年月日" : "Date of Birth"}
                value={formatDate(viewingSeeker.dateOfBirth)}
              />

              <InfoRow
                icon={<UserIcon className="h-4 w-4" />}
                label={lang === "ja" ? "性別" : "Gender"}
                value={viewingSeeker.gender || "-"}
              />

              <InfoRow
                icon={<Flag className="h-4 w-4" />}
                label={lang === "ja" ? "国籍" : "Nationality"}
                value={viewingSeeker.nationality || "-"}
              />
            </div>

            {/* Visa Information */}
            <div className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "ビザ情報" : "Visa Information"}
              </h5>

              <InfoRow
                icon={<BadgeCheck className="h-4 w-4" />}
                label={lang === "ja" ? "ビザ種類" : "Visa Type"}
                value={viewingSeeker.visaType || "-"}
              />

              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label={lang === "ja" ? "ビザ有効期限" : "Visa Expiry Date"}
                value={formatDate(viewingSeeker.visaExpiryDate)}
              />
            </div>

            {/* Language & Skills */}
            <div className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "言語・スキル" : "Language & Skills"}
              </h5>

              <InfoRow
                icon={<Globe className="h-4 w-4" />}
                label={lang === "ja" ? "日本語レベル" : "Japanese Level"}
                value={viewingSeeker.japaneseLevel || "-"}
              />
            </div>

            {/* Job Preferences */}
            <div className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700 md:col-span-2">
              <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "希望条件" : "Job Preferences"}
              </h5>

              <div className="grid gap-3 md:grid-cols-2">
                <InfoRow
                  icon={<Briefcase className="h-4 w-4" />}
                  label={lang === "ja" ? "希望職種" : "Desired Job"}
                  value={viewingSeeker.desiredJob || "-"}
                />

                <InfoRow
                  icon={<MapPinned className="h-4 w-4" />}
                  label={lang === "ja" ? "希望勤務地" : "Desired Location"}
                  value={viewingSeeker.desiredLocation || "-"}
                />
              </div>

              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label={lang === "ja" ? "就業可能日" : "Available From"}
                value={formatDate(viewingSeeker.availableFrom)}
              />
            </div>

            {/* Resume & Notes */}
            <div className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700 md:col-span-2">
              <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "その他" : "Other Information"}
              </h5>

              {viewingSeeker.resumeFile && (
                <InfoRow
                  icon={<FileText className="h-4 w-4" />}
                  label={lang === "ja" ? "履歴書" : "Resume"}
                  value={
                    <a
                      href={`https://vision-career.co.jp/admin_view_resume.php?token=${localStorage.getItem("admin_token")}&resume=${viewingSeeker.resumeFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {lang === "ja"
                        ? "履歴書をダウンロード"
                        : "Download Resume"}
                    </a>
                  }
                  isLink
                />
              )}

              <InfoRow
                icon={<StickyNote className="h-4 w-4" />}
                label={lang === "ja" ? "備考" : "Notes"}
                value={viewingSeeker.notes || "-"}
                multiLine
              />
            </div>
          </div>

          {/* Statistics & Timestamps */}
          <div className="grid gap-4 md:grid-cols-4">
            <StatItem
              label={lang === "ja" ? "総応募数" : "Total Applications"}
              value={String(viewingSeeker.statistics?.total_applications ?? 0)}
            />
            <StatItem
              label={lang === "ja" ? "応募済み" : "Submitted"}
              value={String(
                viewingSeeker.statistics?.total_applications_submitted ?? 0,
              )}
            />
            <StatItem
              label={lang === "ja" ? "登録日" : "Created At"}
              value={formatDateTime(viewingSeeker.created_at)}
            />
            <StatItem
              label={lang === "ja" ? "更新日" : "Updated At"}
              value={formatDateTime(viewingSeeker.updated_at)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
