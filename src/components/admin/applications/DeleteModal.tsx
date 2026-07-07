import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

export default function ApplicationDeleteModal({
  isDeleting,
  setDeletingApplication,
  lang,
  deleteError,
  deletingApplication,
  handleDelete,
}: any) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={() => !isDeleting && setDeletingApplication(null)}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-500 dark:text-rose-400">
              {lang === "ja" ? "応募を削除" : "Delete Application"}
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {lang === "ja" ? "削除の確認" : "Confirm Deletion"}
            </h3>
          </div>
          <button
            onClick={() => !isDeleting && setDeletingApplication(null)}
            disabled={isDeleting}
            className="rounded-full p-2 text-slate-500 cursor-pointer transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          {deleteError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {deleteError}
            </div>
          )}

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
              <AlertTriangle className="h-8 w-8 text-rose-600 dark:text-rose-400" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {lang === "ja"
                ? "次の応募を削除してもよろしいですか？この操作は元に戻せません。"
                : "Are you sure you want to delete this application? This action cannot be undone."}
            </p>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                {deletingApplication.full_name}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {deletingApplication.email}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "応募ID: " : "Application ID: "}
                {deletingApplication.application_id}
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              onClick={() => setDeletingApplication(null)}
              disabled={isDeleting}
              className="rounded-xl border border-slate-200 cursor-pointer px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50"
            >
              {lang === "ja" ? "キャンセル" : "Cancel"}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl bg-rose-600 px-4 py-2 cursor-pointer text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {lang === "ja" ? "削除中..." : "Deleting..."}
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  {lang === "ja" ? "削除" : "Delete"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
