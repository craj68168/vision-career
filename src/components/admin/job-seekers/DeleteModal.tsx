import { Trash2 } from "lucide-react";

export default function DeleteSeekerModal({
  lang,
  deletingSeeker,
  closeDeleteModal,
  deleting,
  deleteJobSeeker,
}: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <Trash2 className="h-6 w-6" />
        </div>

        <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          {lang === "ja" ? "求職者を削除" : "Delete Job Seeker"}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {lang === "ja"
            ? "この求職者を削除してもよろしいですか？この操作は元に戻せません。"
            : "Are you sure you want to delete this job seeker? This action cannot be undone."}
        </p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/50">
          <p className="font-semibold text-slate-900 dark:text-white">
            {deletingSeeker.full_name || deletingSeeker.name || "-"}
          </p>
          <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
            {deletingSeeker.email || "-"}
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={closeDeleteModal}
            disabled={deleting}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {lang === "ja" ? "キャンセル" : "Cancel"}
          </button>

          <button
            type="button"
            onClick={deleteJobSeeker}
            disabled={deleting}
            className="cursor-pointer rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-500 dark:hover:bg-red-600"
          >
            {deleting
              ? lang === "ja"
                ? "削除中..."
                : "Deleting..."
              : lang === "ja"
                ? "削除"
                : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
