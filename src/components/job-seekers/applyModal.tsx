import { X, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

type MissingField = {
  field: string;
  label: string;
};

export default function ApplyModal({
  closeApplyModal,
  lang,
  selectedVacancy,
  handleApplySubmit,
  applyForm,
  handleApplyInputChange,
  submitting,
  missingFields = [],
}: {
  closeApplyModal: () => void;
  lang: string;
  selectedVacancy: any;
  handleApplySubmit: (e: React.FormEvent) => void;
  applyForm: { coverLetter: string };
  handleApplyInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  submitting: boolean;
  missingFields?: MissingField[];
}) {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) closeApplyModal();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
    >
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {lang === "ja"
                ? `${selectedVacancy.title} に応募`
                : `Apply for ${selectedVacancy.title}`}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {selectedVacancy.company_name}
            </p>
          </div>

          <button
            type="button"
            onClick={closeApplyModal}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleApplySubmit} className="space-y-6 p-6">
          {/* Show missing fields warning if any */}
          {missingFields.length > 0 && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-red-800">
                    {lang === "ja"
                      ? "プロフィールが不完全です"
                      : "Profile Incomplete"}
                  </h4>
                  <p className="mt-1 text-sm text-red-700">
                    {lang === "ja"
                      ? "応募する前に、以下の項目を入力してください："
                      : "Please complete the following fields before applying:"}
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-700">
                    {missingFields.map((field) => (
                      <li key={field.field}>{field.label}</li>
                    ))}
                  </ul>
                  <Link
                    href={
                      lang === "ja"
                        ? "/job-seekers/profile/"
                        : "/en/job-seekers/profile/"
                    }
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                  >
                    {lang === "ja" ? "プロフィールを編集" : "Edit Profile"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Job Details Summary */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              {lang === "ja" ? "求人詳細" : "Job Details"}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">
                  {lang === "ja" ? "会社名" : "Company"}
                </span>
                <span className="font-medium text-slate-900">
                  {selectedVacancy.company_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">
                  {lang === "ja" ? "雇用形態" : "Employment Type"}
                </span>
                <span className="font-medium text-slate-900">
                  {selectedVacancy.employment_type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">
                  {lang === "ja" ? "勤務地" : "Location"}
                </span>
                <span className="font-medium text-slate-900">
                  {selectedVacancy.work_location}
                </span>
              </div>
              {selectedVacancy.salary_min && selectedVacancy.salary_max && (
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    {lang === "ja" ? "給与" : "Salary"}
                  </span>
                  <span className="font-medium text-slate-900">
                    ¥{selectedVacancy.salary_min.toLocaleString()} - ¥
                    {selectedVacancy.salary_max.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Profile Notice */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
              <div>
                <h4 className="text-sm font-semibold text-blue-800">
                  {lang === "ja"
                    ? "プロフィール情報の自動送信"
                    : "Automatic Profile Submission"}
                </h4>
                <p className="mt-1 text-sm text-blue-700">
                  {lang === "ja"
                    ? "応募時には、あなたのプロフィールに登録されている以下の情報が自動的に送信されます："
                    : "The following information from your profile will be automatically submitted with your application:"}
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-blue-700">
                  <li>
                    {lang === "ja" ? "氏名・メールアドレス" : "Name & Email"}
                  </li>
                  <li>
                    {lang === "ja" ? "電話番号・住所" : "Phone & Address"}
                  </li>
                  <li>
                    {lang === "ja" ? "国籍・ビザ情報" : "Nationality & Visa"}
                  </li>
                  <li>{lang === "ja" ? "日本語レベル" : "Japanese Level"}</li>
                  <li>{lang === "ja" ? "学歴" : "Education Background"}</li>
                  <li>{lang === "ja" ? "職歴" : "Employment History"}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {lang === "ja"
                ? "自己PR・志望動機"
                : "Cover Letter / Reason for Applying"}
              <span className="ml-1 text-xs font-normal text-slate-400">
                ({lang === "ja" ? "任意" : "optional"})
              </span>
            </label>
            <textarea
              name="coverLetter"
              value={applyForm.coverLetter}
              onChange={handleApplyInputChange}
              rows={6}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
              placeholder={
                lang === "ja"
                  ? "自己紹介や志望動機をご記入ください（任意）"
                  : "Write a short introduction or cover letter (optional)"
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeApplyModal}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {lang === "ja" ? "キャンセル" : "Cancel"}
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? lang === "ja"
                  ? "送信中..."
                  : "Submitting..."
                : lang === "ja"
                  ? "応募する"
                  : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
