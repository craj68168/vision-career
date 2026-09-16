export default function EditJobProviderModal({
  lang,
  closeEditModal,
  savingEdit,
  error,
  updateProvider,
  handleEditData,
  editData,
}: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {lang === "ja" ? "プロバイダーを編集" : "Edit Provider"}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {lang === "ja"
                ? "プロバイダー情報を更新します。"
                : "Update this provider's information."}
            </p>
          </div>

          <button
            type="button"
            onClick={closeEditModal}
            disabled={savingEdit}
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

        <div className="mt-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {lang === "ja" ? "基本情報" : "Basic Information"}
            </h4>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "プロバイダー名 *" : "Provider Name *"}
                </label>
                <input
                  value={editData.name}
                  onChange={(e) => handleEditData("name", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  placeholder={
                    lang === "ja"
                      ? "プロバイダー名を入力"
                      : "Enter provider name"
                  }
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "会社名" : "Company Name"}
                </label>
                <input
                  value={editData.company_name}
                  onChange={(e) =>
                    handleEditData("company_name", e.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  placeholder={
                    lang === "ja" ? "会社名を入力" : "Enter company name"
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "メール *" : "Email *"}
                </label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => handleEditData("email", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  placeholder={lang === "ja" ? "メールを入力" : "Enter email"}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "電話番号" : "Phone"}
                </label>
                <input
                  value={editData.phone}
                  onChange={(e) => handleEditData("phone", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  placeholder={
                    lang === "ja" ? "電話番号を入力" : "Enter phone number"
                  }
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {lang === "ja" ? "住所" : "Address"}
              </label>
              <input
                value={editData.address}
                onChange={(e) => handleEditData("address", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                placeholder={lang === "ja" ? "住所を入力" : "Enter address"}
              />
            </div>
          </div>

          {/* Company Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {lang === "ja" ? "会社詳細" : "Company Details"}
            </h4>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "業界" : "Industry"}
                </label>
                <input
                  value={editData.industry}
                  onChange={(e) => handleEditData("industry", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  placeholder={lang === "ja" ? "業界を入力" : "Enter industry"}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "ウェブサイト" : "Website"}
                </label>
                <input
                  value={editData.website}
                  onChange={(e) => handleEditData("website", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  placeholder={
                    lang === "ja"
                      ? "https://example.com"
                      : "https://example.com"
                  }
                />
              </div>
            </div>
          </div>

          {/* Contact Person */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {lang === "ja" ? "担当者情報" : "Contact Person"}
            </h4>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {lang === "ja" ? "担当者名" : "Contact Person Name"}
              </label>
              <input
                value={editData.contact_person}
                onChange={(e) =>
                  handleEditData("contact_person", e.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                placeholder={
                  lang === "ja" ? "担当者名を入力" : "Enter contact person"
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "担当者電話" : "Contact Phone"}
                </label>
                <input
                  value={editData.contact_person_phone}
                  onChange={(e) =>
                    handleEditData("contact_person_phone", e.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  placeholder={
                    lang === "ja" ? "担当者電話を入力" : "Enter contact phone"
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "担当者メール" : "Contact Email"}
                </label>
                <input
                  type="email"
                  value={editData.contact_person_email}
                  onChange={(e) =>
                    handleEditData("contact_person_email", e.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  placeholder={
                    lang === "ja" ? "担当者メールを入力" : "Enter contact email"
                  }
                />
              </div>
            </div>
          </div>

          {/* Hiring Needs & Notes */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {lang === "ja" ? "採用・備考" : "Hiring & Notes"}
            </h4>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {lang === "ja" ? "採用ニーズ" : "Hiring Needs"}
              </label>
              <textarea
                value={editData.hiring_needs}
                onChange={(e) => handleEditData("hiring_needs", e.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800 resize-y"
                placeholder={
                  lang === "ja" ? "採用ニーズを入力" : "Enter hiring needs"
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {lang === "ja" ? "備考" : "Notes"}
              </label>
              <textarea
                value={editData.notes}
                onChange={(e) => handleEditData("notes", e.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800 resize-y"
                placeholder={lang === "ja" ? "備考を入力" : "Enter notes"}
              />
            </div>
          </div>

          {/* Status & Password */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {lang === "ja" ? "アカウント設定" : "Account Settings"}
            </h4>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "ステータス" : "Status"}
                </label>
                <select
                  value={editData.status}
                  onChange={(e) => handleEditData("status", e.target.value)}
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

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "パスワード" : "Password"}
                </label>
                <input
                  type="password"
                  value={editData.password}
                  onChange={(e) => handleEditData("password", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  placeholder={
                    lang === "ja"
                      ? "変更する場合のみ入力（6文字以上）"
                      : "Enter only if you want to change it (min 6 chars)"
                  }
                />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {lang === "ja"
                    ? "空欄のままにすると、現在のパスワードは変更されません。"
                    : "Leave blank to keep the current password unchanged."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={closeEditModal}
            disabled={savingEdit}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {lang === "ja" ? "キャンセル" : "Cancel"}
          </button>

          <button
            type="button"
            onClick={updateProvider}
            disabled={
              savingEdit || !editData.name.trim() || !editData.email.trim()
            }
            className="cursor-pointer rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            {savingEdit
              ? lang === "ja"
                ? "保存中..."
                : "Saving..."
              : lang === "ja"
                ? "保存"
                : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
