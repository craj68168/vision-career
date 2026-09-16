import {
  Briefcase,
  Calendar,
  ClockIcon,
  DollarSign,
  FileText,
  MapPin,
  Users,
  X,
} from "lucide-react";
import { DetailItem, formatSalary, formatDate } from ".";

interface DetailsModalProps {
  setShowDetailsModal: React.Dispatch<React.SetStateAction<boolean>>;
  lang: "ja" | "en";
  selectedRequest: any;
  getStatusBadge: any;
}

export default function DetailsModal({
  setShowDetailsModal,
  lang,
  selectedRequest,
  getStatusBadge,
}: DetailsModalProps) {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowDetailsModal(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-950/70 px-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800 dark:shadow-2xl dark:shadow-slate-950/30 hide-scrollbar">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {lang === "ja" ? "採用依頼詳細" : "Placement Request Details"}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              #{selectedRequest.id} - {selectedRequest.job_title}
            </p>
          </div>
          <button
            onClick={() => setShowDetailsModal(false)}
            className="rounded-full p-2 cursor-pointer text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Status & Company Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "ステータス" : "Status"}
              </p>
              <div className="mt-2">
                {getStatusBadge(selectedRequest.request_status)}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "企業情報" : "Company Info"}
              </p>
              <div className="mt-2 space-y-1 text-sm">
                <p className="font-medium text-slate-900 dark:text-white">
                  {selectedRequest.company_name || "-"}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  {selectedRequest.company_email || "-"}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  {selectedRequest.company_phone || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-800/30">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              {lang === "ja" ? "求人詳細" : "Job Details"}
            </h4>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <DetailItem
                label={lang === "ja" ? "求人タイトル" : "Job Title"}
                value={selectedRequest.job_title}
                icon={<Briefcase className="h-4 w-4" />}
              />
              <DetailItem
                label={lang === "ja" ? "カテゴリー" : "Category"}
                value={selectedRequest.job_category?.replace(/_/g, " ") || "-"}
                icon={<FileText className="h-4 w-4" />}
              />
              <DetailItem
                label={lang === "ja" ? "雇用形態" : "Employment Type"}
                value={selectedRequest.employment_type || "-"}
                icon={<Users className="h-4 w-4" />}
              />
              <DetailItem
                label={lang === "ja" ? "募集人数" : "Number of Positions"}
                value={String(selectedRequest.number_of_positions)}
                icon={<Users className="h-4 w-4" />}
              />
              <DetailItem
                label={lang === "ja" ? "勤務地" : "Work Location"}
                value={selectedRequest.work_location || "-"}
                icon={<MapPin className="h-4 w-4" />}
              />
              <DetailItem
                label={lang === "ja" ? "日本語レベル" : "Japanese Level"}
                value={selectedRequest.japanese_level_required || "-"}
                icon={<Users className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Description & Requirements */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-800/30">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {lang === "ja" ? "仕事内容" : "Job Description"}
              </h4>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                {selectedRequest.job_description || "-"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-800/30">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {lang === "ja" ? "応募要件" : "Requirements"}
              </h4>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                {selectedRequest.requirements || "-"}
              </p>
            </div>
          </div>

          {/* Compensation & Working Conditions */}
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-800/30">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              {lang === "ja"
                ? "給与・勤務条件"
                : "Compensation & Working Conditions"}
            </h4>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <DetailItem
                label={lang === "ja" ? "給与タイプ" : "Salary Type"}
                value={selectedRequest.salary_type || "-"}
                icon={<DollarSign className="h-4 w-4" />}
              />
              <DetailItem
                label={lang === "ja" ? "給与額" : "Salary Amount"}
                value={formatSalary(
                  selectedRequest.salary_amount,
                  selectedRequest.salary_type,
                )}
                icon={<DollarSign className="h-4 w-4" />}
              />
              <DetailItem
                label={lang === "ja" ? "勤務時間" : "Working Hours"}
                value={selectedRequest.working_hours || "-"}
                icon={<ClockIcon className="h-4 w-4" />}
              />
              <DetailItem
                label={lang === "ja" ? "休日" : "Days Off"}
                value={selectedRequest.days_off || "-"}
                icon={<Calendar className="h-4 w-4" />}
              />
              <DetailItem
                label={lang === "ja" ? "開始日" : "Start Date"}
                value={selectedRequest.start_date || "-"}
                icon={<Calendar className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Admin Notes */}
          {(selectedRequest.admin_note || selectedRequest.rejection_reason) && (
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-800/30">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {lang === "ja" ? "管理者ノート" : "Admin Notes"}
              </h4>
              {selectedRequest.admin_note && (
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  {selectedRequest.admin_note}
                </p>
              )}
              {selectedRequest.rejection_reason && (
                <div className="mt-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 dark:border dark:border-rose-800">
                  <strong>
                    {lang === "ja" ? "却下理由：" : "Rejection Reason:"}
                  </strong>{" "}
                  {selectedRequest.rejection_reason}
                </div>
              )}
            </div>
          )}

          {/* Timestamps */}
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              {lang === "ja" ? "作成日：" : "Created:"}{" "}
              {formatDate(lang, selectedRequest.created_at)}
            </span>
            {selectedRequest.updated_at && (
              <span>
                {lang === "ja" ? "更新日：" : "Updated:"}{" "}
                {formatDate(lang, selectedRequest.updated_at)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
