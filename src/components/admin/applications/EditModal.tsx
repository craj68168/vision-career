import { Loader2, Save, X } from "lucide-react";

export default function ApplicationEditModal({
  lang,
  isSaving,
  setEditingApplication,
  editingApplication,
  editError,
  editForm,
  handleSaveEdit,
  handleEditChange,
}: any) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={() => !isSaving && setEditingApplication(null)}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {lang === "ja" ? "応募を編集" : "Edit Application"}
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {editingApplication.full_name}
            </h3>
          </div>
          <button
            onClick={() => !isSaving && setEditingApplication(null)}
            disabled={isSaving}
            className="rounded-full p-2 cursor-pointer text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-80px)] overflow-y-auto px-6 py-6">
          {editError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {editError}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {lang === "ja" ? "氏名" : "Full Name"}
              </label>
              <input
                type="text"
                name="full_name"
                value={editForm.full_name}
                onChange={handleEditChange}
                disabled={isSaving}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {lang === "ja" ? "メールアドレス" : "Email"}
              </label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                disabled={isSaving}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {lang === "ja" ? "電話番号" : "Phone"}
              </label>
              <input
                type="text"
                name="phone"
                value={editForm.phone}
                onChange={handleEditChange}
                disabled={isSaving}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {lang === "ja" ? "現在地" : "Current Location"}
              </label>
              <input
                type="text"
                name="current_location"
                value={editForm.current_location}
                onChange={handleEditChange}
                disabled={isSaving}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {lang === "ja" ? "ステータス" : "Status"}
              </label>
              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                disabled={isSaving}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800 disabled:opacity-50"
              >
                <option value="pending">
                  {lang === "ja" ? "保留中" : "Pending"}
                </option>
                <option value="reviewed">
                  {lang === "ja" ? "審査中" : "Reviewed"}
                </option>
                <option value="shortlisted">
                  {lang === "ja" ? "選考中" : "Shortlisted"}
                </option>
                <option value="rejected">
                  {lang === "ja" ? "不合格" : "Rejected"}
                </option>
                <option value="hired">
                  {lang === "ja" ? "採用" : "Hired"}
                </option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              onClick={() => setEditingApplication(null)}
              disabled={isSaving}
              className="rounded-xl border cursor-pointer border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50"
            >
              {lang === "ja" ? "キャンセル" : "Cancel"}
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="rounded-xl cursor-pointer bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {lang === "ja" ? "保存中..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {lang === "ja" ? "保存" : "Save"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
