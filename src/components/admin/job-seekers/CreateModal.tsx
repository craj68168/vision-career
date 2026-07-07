export default function CreateSeekerModal({
  lang,
  closeCreateModal,
  creating,
  error,
  createFormData,
  handleCreateChange,
  createJobSeeker,
}: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {lang === "ja" ? "求職者を作成" : "Create Job Seeker"}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {lang === "ja"
                ? "新しい求職者を登録します。"
                : "Register a new job seeker."}
            </p>
          </div>

          <button
            type="button"
            onClick={closeCreateModal}
            disabled={creating}
            className="cursor-pointer rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {lang === "ja" ? "名前 *" : "Name *"}
            </label>
            <input
              type="text"
              name="name"
              value={createFormData.name}
              onChange={handleCreateChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
              placeholder={lang === "ja" ? "名前を入力" : "Enter name"}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {lang === "ja" ? "メール *" : "Email *"}
            </label>
            <input
              type="email"
              name="email"
              value={createFormData.email}
              onChange={handleCreateChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
              placeholder={lang === "ja" ? "メールを入力" : "Enter email"}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {lang === "ja" ? "パスワード *" : "Password *"}
            </label>
            <input
              type="password"
              name="password"
              value={createFormData.password}
              onChange={handleCreateChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
              placeholder={
                lang === "ja"
                  ? "パスワードを入力（8文字以上）"
                  : "Enter password (min 8 characters)"
              }
              required
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {lang === "ja"
                ? "パスワードは8文字以上で入力してください。"
                : "Password must be at least 8 characters long."}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {lang === "ja" ? "ステータス" : "Status"}
            </label>
            <select
              name="status"
              value={createFormData.status}
              onChange={handleCreateChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
            >
              <option value="active">
                {lang === "ja" ? "有効" : "Active"}
              </option>
              <option value="inactive">
                {lang === "ja" ? "無効" : "Inactive"}
              </option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={closeCreateModal}
            disabled={creating}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {lang === "ja" ? "キャンセル" : "Cancel"}
          </button>

          <button
            type="button"
            onClick={createJobSeeker}
            disabled={
              creating ||
              !createFormData.name.trim() ||
              !createFormData.email.trim() ||
              !createFormData.password.trim() ||
              createFormData.password.length < 8
            }
            className="cursor-pointer rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            {creating
              ? lang === "ja"
                ? "作成中..."
                : "Creating..."
              : lang === "ja"
                ? "作成"
                : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
