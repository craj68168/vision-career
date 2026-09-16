import { FileText } from "lucide-react";

export default function EditModal({
  lang,
  closeEditModal,
  savingEdit,
  error,
  editFormData,
  handleEditChange,
  editingSeeker,
  updateJobSeeker,
}: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {lang === "ja" ? "求職者を編集" : "Edit Job Seeker"}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {lang === "ja"
                ? "求職者情報を更新します。"
                : "Update this job seeker's information."}
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
                  {lang === "ja" ? "名前 *" : "Name *"}
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
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
                  value={editFormData.email}
                  onChange={handleEditChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  placeholder={lang === "ja" ? "メールを入力" : "Enter email"}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "電話番号" : "Phone"}
                </label>
                <input
                  type="text"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  placeholder={
                    lang === "ja" ? "電話番号を入力" : "Enter phone number"
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "住所" : "Address"}
                </label>
                <input
                  type="text"
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  placeholder={lang === "ja" ? "住所を入力" : "Enter address"}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "生年月日" : "Date of Birth"}
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={editFormData.dateOfBirth}
                  onChange={handleEditChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "性別" : "Gender"}
                </label>
                <select
                  name="gender"
                  value={editFormData.gender}
                  onChange={handleEditChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                >
                  <option value="">
                    {lang === "ja" ? "選択してください" : "Select..."}
                  </option>
                  <option value="male">
                    {lang === "ja" ? "男性" : "Male"}
                  </option>
                  <option value="female">
                    {lang === "ja" ? "女性" : "Female"}
                  </option>
                  <option value="other">
                    {lang === "ja" ? "その他" : "Other"}
                  </option>
                  <option value="prefer_not_to_say">
                    {lang === "ja" ? "回答しない" : "Prefer not to say"}
                  </option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "国籍" : "Nationality"}
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={editFormData.nationality}
                  onChange={handleEditChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  placeholder={
                    lang === "ja" ? "国籍を入力" : "Enter nationality"
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "日本語レベル" : "Japanese Level"}
                </label>
                <select
                  name="japaneseLevel"
                  value={editFormData.japaneseLevel}
                  onChange={handleEditChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                >
                  <option value="">
                    {lang === "ja" ? "選択してください" : "Select..."}
                  </option>
                  <option value="native">
                    {lang === "ja" ? "ネイティブ" : "Native"}
                  </option>
                  <option value="fluent">
                    {lang === "ja" ? "流暢" : "Fluent"}
                  </option>
                  <option value="business">
                    {lang === "ja" ? "ビジネス" : "Business"}
                  </option>
                  <option value="conversational">
                    {lang === "ja" ? "日常会話" : "Conversational"}
                  </option>
                  <option value="beginner">
                    {lang === "ja" ? "初心者" : "Beginner"}
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Visa Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {lang === "ja" ? "ビザ情報" : "Visa Information"}
            </h4>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "ビザ種類" : "Visa Type"}
                </label>
                <input
                  type="text"
                  name="visaType"
                  value={editFormData.visaType}
                  onChange={handleEditChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  placeholder={
                    lang === "ja" ? "ビザ種類を入力" : "Enter visa type"
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "ビザ有効期限" : "Visa Expiry Date"}
                </label>
                <input
                  type="date"
                  name="visaExpiryDate"
                  value={editFormData.visaExpiryDate}
                  onChange={handleEditChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Job Preferences */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {lang === "ja" ? "希望条件" : "Job Preferences"}
            </h4>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "希望職種" : "Desired Job"}
                </label>
                <input
                  type="text"
                  name="desiredJob"
                  value={editFormData.desiredJob}
                  onChange={handleEditChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  placeholder={
                    lang === "ja" ? "希望職種を入力" : "Enter desired job"
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "希望勤務地" : "Desired Location"}
                </label>
                <input
                  type="text"
                  name="desiredLocation"
                  value={editFormData.desiredLocation}
                  onChange={handleEditChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                  placeholder={
                    lang === "ja"
                      ? "希望勤務地を入力"
                      : "Enter desired location"
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "就業可能日" : "Available From"}
                </label>
                <input
                  type="date"
                  name="availableFrom"
                  value={editFormData.availableFrom}
                  onChange={handleEditChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === "ja" ? "ステータス" : "Status"}
                </label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
                >
                  <option value="active">
                    {lang === "ja" ? "有効" : "Active"}
                  </option>
                  <option value="inactive">
                    {lang === "ja" ? "無効" : "Inactive"}
                  </option>
                  <option value="in_process">
                    {lang === "ja" ? "選考中" : "In Process"}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {lang === "ja" ? "配置ステータス" : "Placement Status"}
              </label>
              <select
                name="placementStatus"
                value={editFormData.placementStatus}
                onChange={handleEditChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
              >
                <option value="available">
                  {lang === "ja" ? "募集中" : "Available"}
                </option>
                <option value="placed">
                  {lang === "ja" ? "内定" : "Placed"}
                </option>
                <option value="unavailable">
                  {lang === "ja" ? "募集停止" : "Unavailable"}
                </option>
              </select>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {lang === "ja" ? "履歴書" : "Resume"}
            </h4>

            <div>
              {editingSeeker.resumeFile && (
                <div className="mb-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <FileText className="h-4 w-4" />
                  <span>
                    {lang === "ja" ? "現在の履歴書: " : "Current resume: "}
                    <a
                      href={`https://vision-career.co.jp${editingSeeker.resumeFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {editingSeeker.resumeFile.split("/").pop()}
                    </a>
                  </span>
                </div>
              )}

              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {lang === "ja"
                  ? "新しい履歴書をアップロード"
                  : "Upload New Resume"}
              </label>
              <input
                type="file"
                name="resumeFile"
                accept=".pdf,.doc,.docx"
                onChange={handleEditChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-200 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-300 dark:file:bg-slate-700 dark:file:text-slate-300 dark:hover:file:bg-slate-600"
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {lang === "ja"
                  ? "PDF, DOC, DOCX形式（最大5MB）"
                  : "PDF, DOC, DOCX formats (max 5MB)"}
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {lang === "ja" ? "備考" : "Notes"}
            </h4>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {lang === "ja" ? "備考" : "Notes"}
              </label>
              <textarea
                name="notes"
                value={editFormData.notes}
                onChange={handleEditChange}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800 resize-y"
                placeholder={lang === "ja" ? "備考を入力" : "Enter notes"}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {lang === "ja" ? "セキュリティ" : "Security"}
            </h4>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {lang === "ja" ? "新しいパスワード" : "New Password"}
              </label>
              <input
                type="password"
                name="password"
                value={editFormData.password}
                onChange={handleEditChange}
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
            onClick={updateJobSeeker}
            disabled={
              savingEdit ||
              !editFormData.name.trim() ||
              !editFormData.email.trim()
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
