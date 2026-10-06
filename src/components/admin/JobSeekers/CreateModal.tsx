"use client";

import {
  CheckCircle2,
  CircleAlert,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react";

import type {
  CreateEducationInput,
  CreateEmploymentHistoryInput,
  CreateSeekerPayload,
} from "./types";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950";

const fieldClass =
  "h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-zinc-900 dark:text-white";

// ======================================================
// PROPS
// ======================================================

type Props = {
  lang: string;

  isSaving: boolean;

  error: string | null;

  onClose: () => void;

  onSubmit: (payload: CreateSeekerPayload) => Promise<void>;
};

// ======================================================
// EMPTY ROWS
// ======================================================

const emptyEducation = (): CreateEducationInput => ({
  enrollment_date: "",
  graduation_date: "",
  school_type: "",
  school: "",
  major: "",
});

const emptyEmployment = (): CreateEmploymentHistoryInput => ({
  start_date: "",
  end_date: "",
  employment_type: "",
  company_name: "",
});

// ======================================================
// HELPERS
// ======================================================

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneCharactersRegex = /^[+\d\s()-]+$/;

const isValidPhone = (value: string) => {
  const normalized = value.trim();

  if (!phoneCharactersRegex.test(normalized)) {
    return false;
  }

  const digits = normalized.replace(/\D/g, "");

  return digits.length >= 7 && digits.length <= 15;
};

const cleanOptional = (value?: string | null) => {
  const normalized = String(value || "").trim();

  return normalized || null;
};

const hasEducationValue = (education: CreateEducationInput) =>
  Boolean(
    education.school.trim() ||
    education.school_type?.trim() ||
    education.major?.trim() ||
    education.enrollment_date?.trim() ||
    education.graduation_date?.trim(),
  );

const hasEmploymentValue = (employment: CreateEmploymentHistoryInput) =>
  Boolean(
    employment.company_name.trim() ||
    employment.employment_type?.trim() ||
    employment.start_date?.trim() ||
    employment.end_date?.trim(),
  );

const normalizeSkill = (value: string) => value.trim().replace(/\s+/g, " ");

const splitSkills = (value: string) =>
  value.split(",").map(normalizeSkill).filter(Boolean);

const uniqueSkills = (skills: string[]) => {
  const seen = new Set<string>();

  return skills.filter((skill) => {
    const key = skill.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });
};

// ======================================================
// COMPONENT
// ======================================================

export default function CreateModal({
  lang,
  isSaving,
  error,
  onClose,
  onSubmit,
}: Props) {
  const ja = lang === "ja";

  const [validationError, setValidationError] = useState<string | null>(null);

  const [skillInput, setSkillInput] = useState("");

  const [form, setForm] = useState<CreateSeekerPayload>({
    name: "",

    email: "",

    phone: "",

    address: "",

    current_location: "",

    date_of_birth: "",

    gender: "",

    nationality: "",

    visa_type: "",

    visa_expiry_date: "",

    japanese_level: "",

    skills: [],

    desired_job: "",

    desired_location: "",

    available_from: "",

    education: [],

    employment_history: [],

    notes: "",

    placement_status: "unplaced",
  });

  // ====================================================
  // GENERIC FIELD UPDATE
  // ====================================================

  const updateField = <K extends keyof CreateSeekerPayload>(
    field: K,
    value: CreateSeekerPayload[K],
  ) => {
    setForm((current) => ({
      ...current,

      [field]: value,
    }));

    if (validationError) {
      setValidationError(null);
    }
  };

  // ====================================================
  // SKILLS
  // ====================================================

  const addSkills = (input: string) => {
    const values = splitSkills(input);

    if (values.length === 0) {
      return;
    }

    setForm((current) => ({
      ...current,

      skills: uniqueSkills([...current.skills, ...values]),
    }));

    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setForm((current) => ({
      ...current,

      skills: current.skills.filter((item) => item !== skill),
    }));
  };

  const handleSkillKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" && event.key !== ",") {
      return;
    }

    event.preventDefault();

    addSkills(skillInput);
  };

  // ====================================================
  // EDUCATION
  // ====================================================

  const addEducation = () => {
    setForm((current) => ({
      ...current,

      education: [...current.education, emptyEducation()],
    }));
  };

  const updateEducation = (
    index: number,

    field: keyof CreateEducationInput,

    value: string,
  ) => {
    setForm((current) => ({
      ...current,

      education: current.education.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,

              [field]: value,
            }
          : item,
      ),
    }));

    setValidationError(null);
  };

  const removeEducation = (index: number) => {
    setForm((current) => ({
      ...current,

      education: current.education.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  // ====================================================
  // EMPLOYMENT
  // ====================================================

  const addEmployment = () => {
    setForm((current) => ({
      ...current,

      employment_history: [...current.employment_history, emptyEmployment()],
    }));
  };

  const updateEmployment = (
    index: number,

    field: keyof CreateEmploymentHistoryInput,

    value: string,
  ) => {
    setForm((current) => ({
      ...current,

      employment_history: current.employment_history.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,

              [field]: value,
            }
          : item,
      ),
    }));

    setValidationError(null);
  };

  const removeEmployment = (index: number) => {
    setForm((current) => ({
      ...current,

      employment_history: current.employment_history.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  // ====================================================
  // PROFILE READINESS PREVIEW
  //
  // Mirrors the required profile fields used by the
  // backend.
  //
  // Resume is intentionally incomplete here because
  // this first Admin-create form does not upload files.
  // ====================================================

  const profilePreview = useMemo(() => {
    const hasSkills = form.skills.length > 0 || Boolean(skillInput.trim());

    const hasEducation = form.education.some((item) =>
      Boolean(item.school.trim()),
    );

    const checks = [
      {
        label: ja ? "電話番号" : "Phone Number",

        complete: Boolean(form.phone.trim()),
      },

      {
        label: ja ? "住所" : "Address",

        complete: Boolean(form.address?.trim()),
      },

      {
        label: ja ? "現在地" : "Current Location",

        complete: Boolean(form.current_location?.trim()),
      },

      {
        label: ja ? "生年月日" : "Date of Birth",

        complete: Boolean(form.date_of_birth),
      },

      {
        label: ja ? "性別" : "Gender",

        complete: Boolean(form.gender?.trim()),
      },

      {
        label: ja ? "国籍" : "Nationality",

        complete: Boolean(form.nationality?.trim()),
      },

      {
        label: ja ? "在留資格" : "Visa Type",

        complete: Boolean(form.visa_type?.trim()),
      },

      {
        label: ja ? "日本語レベル" : "Japanese Level",

        complete: Boolean(form.japanese_level?.trim()),
      },

      {
        label: ja ? "スキル" : "Skills",

        complete: hasSkills,
      },

      {
        label: ja ? "希望職種" : "Desired Job",

        complete: Boolean(form.desired_job?.trim()),
      },

      {
        label: ja ? "希望勤務地" : "Desired Location",

        complete: Boolean(form.desired_location?.trim()),
      },

      {
        label: ja ? "勤務可能日" : "Available From",

        complete: Boolean(form.available_from),
      },

      {
        label: ja ? "履歴書" : "Resume File",

        complete: false,
      },

      {
        label: ja ? "学歴" : "Education",

        complete: hasEducation,
      },
    ];

    const completed = checks.filter((item) => item.complete).length;

    const percentage = Math.round((completed / checks.length) * 100);

    return {
      percentage,

      missing: checks
        .filter((item) => !item.complete)
        .map((item) => item.label),
    };
  }, [form, ja, skillInput]);

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setValidationError(null);

    // ================================================
    // REQUIRED ACCOUNT FIELDS
    // ================================================

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setValidationError(
        ja
          ? "氏名、メールアドレス、電話番号は必須です。"
          : "Name, email and phone number are required.",
      );

      return;
    }

    // ================================================
    // EMAIL
    // ================================================

    if (!emailRegex.test(form.email.trim())) {
      setValidationError(
        ja
          ? "有効なメールアドレスを入力してください。"
          : "Please enter a valid email address.",
      );

      return;
    }

    // ================================================
    // PHONE
    // ================================================

    if (!isValidPhone(form.phone)) {
      setValidationError(
        ja
          ? "有効な電話番号を入力してください。"
          : "Please enter a valid phone number.",
      );

      return;
    }

    // ================================================
    // EDUCATION VALIDATION
    // ================================================

    const educationRows = form.education.filter(hasEducationValue);

    const invalidEducation = educationRows.some((item) => !item.school.trim());

    if (invalidEducation) {
      setValidationError(
        ja
          ? "学歴を追加する場合、学校名は必須です。"
          : "School name is required for every education record.",
      );

      return;
    }

    // ================================================
    // EMPLOYMENT VALIDATION
    // ================================================

    const employmentRows = form.employment_history.filter(hasEmploymentValue);

    const invalidEmployment = employmentRows.some(
      (item) => !item.company_name.trim(),
    );

    if (invalidEmployment) {
      setValidationError(
        ja
          ? "職歴を追加する場合、会社名は必須です。"
          : "Company name is required for every employment record.",
      );

      return;
    }

    // ================================================
    // INCLUDE UNCOMMITTED SKILL INPUT
    // ================================================

    const pendingSkills = splitSkills(skillInput);

    const finalSkills = uniqueSkills([...form.skills, ...pendingSkills]);

    // ================================================
    // PAYLOAD
    // ================================================

    const payload: CreateSeekerPayload = {
      name: form.name.trim(),

      email: form.email.trim().toLowerCase(),

      phone: form.phone.trim(),

      address: cleanOptional(form.address),

      current_location: cleanOptional(form.current_location),

      date_of_birth: cleanOptional(form.date_of_birth),

      gender: cleanOptional(form.gender),

      nationality: cleanOptional(form.nationality),

      visa_type: cleanOptional(form.visa_type),

      visa_expiry_date: cleanOptional(form.visa_expiry_date),

      japanese_level: cleanOptional(form.japanese_level),

      skills: finalSkills,

      desired_job: cleanOptional(form.desired_job),

      desired_location: cleanOptional(form.desired_location),

      available_from: cleanOptional(form.available_from),

      education: educationRows.map((item) => ({
        enrollment_date: cleanOptional(item.enrollment_date),

        graduation_date: cleanOptional(item.graduation_date),

        school_type: cleanOptional(item.school_type),

        school: item.school.trim(),

        major: cleanOptional(item.major),
      })),

      employment_history: employmentRows.map((item) => ({
        start_date: cleanOptional(item.start_date),

        end_date: cleanOptional(item.end_date),

        employment_type: cleanOptional(item.employment_type),

        company_name: item.company_name.trim(),
      })),

      notes: cleanOptional(form.notes),

      placement_status: "unplaced",
    };

    await onSubmit(payload);
  };

  return (
    <ModalShell
      title={ja ? "求職者を作成" : "Create Job Seeker"}
      subtitle={
        ja
          ? "管理者から求職者アカウントとプロフィールを登録します。"
          : "Create a Job Seeker account and enter available profile information."
      }
      onClose={onClose}
      disabled={isSaving}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ================================================= */}
        {/* ERRORS */}
        {/* ================================================= */}

        {error && <ErrorBox message={error} />}

        {validationError && <ErrorBox message={validationError} />}

        {/* ================================================= */}
        {/* ACCOUNT BEHAVIOR */}
        {/* ================================================= */}

        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                {ja ? "管理者作成アカウント" : "Admin-created account"}
              </p>

              <p className="mt-1 leading-6">
                {ja
                  ? "アカウントは自動的に承認・有効化されます。管理者はパスワードを設定しません。求職者には安全なパスワード設定リンクがメールで送信されます。"
                  : "The account will be approved and activated automatically. Admin does not create the password. A secure password setup link will be emailed to the Job Seeker."}
              </p>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* ACCOUNT */}
        {/* ================================================= */}

        <Section
          title={ja ? "アカウント情報" : "Account Information"}
          description={
            ja
              ? "氏名、メール、電話番号は必須です。"
              : "Name, email and phone number are required."
          }
        >
          <Field
            label={ja ? "氏名" : "Full Name"}
            value={form.name}
            required
            onChange={(value) => updateField("name", value)}
          />

          <Field
            label={ja ? "メールアドレス" : "Email"}
            type="email"
            value={form.email}
            required
            onChange={(value) => updateField("email", value)}
          />

          <Field
            label={ja ? "電話番号" : "Phone Number"}
            type="tel"
            value={form.phone}
            placeholder="+81 90 1234 5678"
            required
            onChange={(value) => updateField("phone", value)}
          />

          <ReadOnlyField
            label={ja ? "初期アカウント状態" : "Initial Account Status"}
            value={ja ? "承認済み / 有効" : "Approved / Active"}
          />
        </Section>

        {/* ================================================= */}
        {/* BASIC INFORMATION */}
        {/* ================================================= */}

        <Section title={ja ? "基本情報" : "Personal Information"}>
          <Field
            label={ja ? "住所" : "Address"}
            value={form.address || ""}
            onChange={(value) => updateField("address", value)}
          />

          <Field
            label={ja ? "現在地" : "Current Location"}
            value={form.current_location || ""}
            onChange={(value) => updateField("current_location", value)}
          />

          <Field
            label={ja ? "生年月日" : "Date of Birth"}
            type="date"
            value={form.date_of_birth || ""}
            onChange={(value) => updateField("date_of_birth", value)}
          />

          <Field
            label={ja ? "性別" : "Gender"}
            value={form.gender || ""}
            onChange={(value) => updateField("gender", value)}
          />

          <Field
            label={ja ? "国籍" : "Nationality"}
            value={form.nationality || ""}
            onChange={(value) => updateField("nationality", value)}
          />
        </Section>

        {/* ================================================= */}
        {/* VISA */}
        {/* ================================================= */}

        <Section title={ja ? "在留資格" : "Visa Information"}>
          <Field
            label={ja ? "在留資格" : "Visa Type"}
            value={form.visa_type || ""}
            onChange={(value) => updateField("visa_type", value)}
          />

          <Field
            label={ja ? "在留期限" : "Visa Expiry Date"}
            type="date"
            value={form.visa_expiry_date || ""}
            onChange={(value) => updateField("visa_expiry_date", value)}
          />
        </Section>

        {/* ================================================= */}
        {/* LANGUAGE + SKILLS */}
        {/* ================================================= */}

        <Section title={ja ? "日本語・スキル" : "Language & Skills"}>
          <Field
            label={ja ? "日本語レベル" : "Japanese Level"}
            value={form.japanese_level || ""}
            placeholder="N1, N2, N3..."
            onChange={(value) => updateField("japanese_level", value)}
          />

          <div className="md:col-span-2">
            <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {ja ? "スキル" : "Skills"}
            </span>

            <div className="rounded-lg border border-zinc-200 bg-white p-2 dark:border-white/10 dark:bg-zinc-900">
              {form.skills.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {form.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                    >
                      {skill}

                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        aria-label={`Remove ${skill}`}
                        className="cursor-pointer rounded-full p-0.5 hover:bg-emerald-200/60 dark:hover:bg-emerald-400/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder={
                    ja
                      ? "スキルを入力して Enter"
                      : "Type a skill and press Enter"
                  }
                  className="min-w-0 flex-1 bg-transparent px-1 py-1.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white"
                />

                <button
                  type="button"
                  onClick={() => addSkills(skillInput)}
                  className={`inline-flex h-9 cursor-pointer items-center gap-1 rounded-lg border border-zinc-200 px-3 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
                >
                  <Plus className="h-3.5 w-3.5" />

                  {ja ? "追加" : "Add"}
                </button>
              </div>
            </div>

            <p className="mt-1 text-xs text-zinc-400">
              {ja
                ? "Enter またはカンマ区切りで複数追加できます。"
                : "Press Enter or use commas to add multiple skills."}
            </p>
          </div>
        </Section>

        {/* ================================================= */}
        {/* JOB PREFERENCES */}
        {/* ================================================= */}

        <Section title={ja ? "希望条件" : "Job Preferences"}>
          <Field
            label={ja ? "希望職種" : "Desired Job"}
            value={form.desired_job || ""}
            onChange={(value) => updateField("desired_job", value)}
          />

          <Field
            label={ja ? "希望勤務地" : "Desired Location"}
            value={form.desired_location || ""}
            onChange={(value) => updateField("desired_location", value)}
          />

          <Field
            label={ja ? "勤務可能日" : "Available From"}
            type="date"
            value={form.available_from || ""}
            onChange={(value) => updateField("available_from", value)}
          />

          <ReadOnlyField
            label={ja ? "初期配置状態" : "Initial Placement Status"}
            value={ja ? "未配置" : "Unplaced"}
          />
        </Section>

        {/* ================================================= */}
        {/* EDUCATION */}
        {/* ================================================= */}

        <DynamicSection
          title={ja ? "学歴" : "Education"}
          addLabel={ja ? "学歴を追加" : "Add Education"}
          onAdd={addEducation}
        >
          {form.education.length === 0 ? (
            <EmptyState
              text={
                ja
                  ? "学歴はまだ追加されていません。"
                  : "No education records added."
              }
            />
          ) : (
            form.education.map((education, index) => (
              <div
                key={index}
                className="rounded-lg border border-zinc-200 p-3 dark:border-white/10"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {ja ? `学歴 ${index + 1}` : `Education ${index + 1}`}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    aria-label={ja ? "学歴を削除" : "Remove education"}
                    className={`grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-red-500 transition hover:bg-red-50 dark:hover:bg-red-400/10 ${focusRing}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Field
                    label={ja ? "学校名" : "School"}
                    value={education.school}
                    required={hasEducationValue(education)}
                    onChange={(value) =>
                      updateEducation(index, "school", value)
                    }
                  />

                  <Field
                    label={ja ? "学校区分" : "School Type"}
                    value={education.school_type || ""}
                    placeholder="University, College..."
                    onChange={(value) =>
                      updateEducation(index, "school_type", value)
                    }
                  />

                  <Field
                    label={ja ? "専攻" : "Major"}
                    value={education.major || ""}
                    onChange={(value) => updateEducation(index, "major", value)}
                  />

                  <div />

                  <Field
                    label={ja ? "入学日" : "Enrollment Date"}
                    type="date"
                    value={education.enrollment_date || ""}
                    onChange={(value) =>
                      updateEducation(index, "enrollment_date", value)
                    }
                  />

                  <Field
                    label={ja ? "卒業日" : "Graduation Date"}
                    type="date"
                    value={education.graduation_date || ""}
                    onChange={(value) =>
                      updateEducation(index, "graduation_date", value)
                    }
                  />
                </div>
              </div>
            ))
          )}
        </DynamicSection>

        {/* ================================================= */}
        {/* EMPLOYMENT */}
        {/* ================================================= */}

        <DynamicSection
          title={ja ? "職歴" : "Employment History"}
          addLabel={ja ? "職歴を追加" : "Add Employment"}
          onAdd={addEmployment}
        >
          {form.employment_history.length === 0 ? (
            <EmptyState
              text={
                ja
                  ? "職歴はありません。新卒の場合は空欄で問題ありません。"
                  : "No employment records. This can remain empty for new graduates."
              }
            />
          ) : (
            form.employment_history.map((employment, index) => (
              <div
                key={index}
                className="rounded-lg border border-zinc-200 p-3 dark:border-white/10"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {ja ? `職歴 ${index + 1}` : `Employment ${index + 1}`}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeEmployment(index)}
                    aria-label={ja ? "職歴を削除" : "Remove employment"}
                    className={`grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-red-500 transition hover:bg-red-50 dark:hover:bg-red-400/10 ${focusRing}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Field
                    label={ja ? "会社名" : "Company Name"}
                    value={employment.company_name}
                    required={hasEmploymentValue(employment)}
                    onChange={(value) =>
                      updateEmployment(index, "company_name", value)
                    }
                  />

                  <Field
                    label={ja ? "雇用形態" : "Employment Type"}
                    value={employment.employment_type || ""}
                    placeholder="Full-time, Part-time..."
                    onChange={(value) =>
                      updateEmployment(index, "employment_type", value)
                    }
                  />

                  <Field
                    label={ja ? "開始日" : "Start Date"}
                    type="date"
                    value={employment.start_date || ""}
                    onChange={(value) =>
                      updateEmployment(index, "start_date", value)
                    }
                  />

                  <Field
                    label={ja ? "終了日" : "End Date"}
                    type="date"
                    value={employment.end_date || ""}
                    onChange={(value) =>
                      updateEmployment(index, "end_date", value)
                    }
                  />
                </div>
              </div>
            ))
          )}
        </DynamicSection>

        {/* ================================================= */}
        {/* NOTES */}
        {/* ================================================= */}

        <section className="rounded-lg border border-zinc-200 p-4 dark:border-white/10">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-zinc-950 dark:text-white">
              {ja ? "管理メモ" : "Notes"}
            </span>

            <textarea
              rows={4}
              value={form.notes || ""}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder={
                ja
                  ? "必要に応じて管理メモを入力..."
                  : "Add any relevant administrative notes..."
              }
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
            />
          </label>
        </section>

        {/* ================================================= */}
        {/* PROFILE READINESS */}
        {/* ================================================= */}

        <section className="rounded-lg border border-zinc-200 p-4 dark:border-white/10">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                {ja
                  ? "プロフィール完成度プレビュー"
                  : "Profile Completion Preview"}
              </h3>

              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {ja
                  ? "この値は入力内容に基づく目安です。保存後はバックエンドで正式に計算されます。"
                  : "This is an estimate from the current form. The backend calculates the official status after saving."}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-2xl font-semibold text-zinc-950 dark:text-white">
                {profilePreview.percentage}%
              </p>

              <p className="text-xs font-medium text-amber-600 dark:text-amber-300">
                {ja ? "配置対象外" : "Not Eligible Yet"}
              </p>
            </div>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{
                width: `${profilePreview.percentage}%`,
              }}
            />
          </div>

          {profilePreview.missing.length > 0 && (
            <div className="mt-4 rounded-lg bg-amber-50 p-3 dark:bg-amber-400/10">
              <div className="flex gap-2">
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300" />

                <div>
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-200">
                    {ja
                      ? "未入力の必須プロフィール項目"
                      : "Missing profile requirements"}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {profilePreview.missing.map((field) => (
                      <span
                        key={field}
                        className="rounded-full border border-amber-200 bg-white px-2 py-0.5 text-xs text-amber-700 dark:border-amber-400/20 dark:bg-transparent dark:text-amber-200"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="mt-3 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {ja
              ? "履歴書アップロードはこの作成画面にはまだ含まれていないため、この段階では最大でもプロフィールは完全にはなりません。アカウント作成後に履歴書を追加できます。"
              : "Resume upload is not part of this creation form yet, so the profile cannot become fully placement-eligible from this screen alone. The resume can be added after the account is created."}
          </p>
        </section>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-white/10">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 sm:flex-none ${focusRing}`}
          >
            {ja ? "キャンセル" : "Cancel"}
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className={`inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none ${focusRing}`}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}

            {ja ? "求職者を作成" : "Create Job Seeker"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ======================================================
// MODAL SHELL
// ======================================================

function ModalShell({
  title,
  subtitle,
  children,
  onClose,
  disabled,
}: {
  title: string;

  subtitle: string;

  children: ReactNode;

  onClose: () => void;

  disabled: boolean;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-seeker-title"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close"
        disabled={disabled}
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-white/10 sm:px-5">
          <div className="min-w-0">
            <h2
              id="create-seeker-title"
              className="text-lg font-semibold text-zinc-950 dark:text-white"
            >
              {title}
            </h2>

            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </p>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={onClose}
            aria-label="Close"
            className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-white/10 ${focusRing}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

// ======================================================
// SECTION
// ======================================================

function Section({
  title,
  description,
  children,
}: {
  title: string;

  description?: string;

  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 p-4 dark:border-white/10">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
          {title}
        </h3>

        {description && (
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2">{children}</div>
    </section>
  );
}

// ======================================================
// DYNAMIC SECTION
// ======================================================

function DynamicSection({
  title,
  addLabel,
  onAdd,
  children,
}: {
  title: string;

  addLabel: string;

  onAdd: () => void;

  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 p-4 dark:border-white/10">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
          {title}
        </h3>

        <button
          type="button"
          onClick={onAdd}
          className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 px-3 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
        >
          <Plus className="h-3.5 w-3.5" />

          {addLabel}
        </button>
      </div>

      <div className="space-y-3">{children}</div>
    </section>
  );
}

// ======================================================
// FIELD
// ======================================================

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;

  value: string;

  type?: string;

  placeholder?: string;

  required?: boolean;

  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}

        {required && " *"}
      </span>

      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      />
    </label>
  );
}

// ======================================================
// READ ONLY FIELD
// ======================================================

function ReadOnlyField({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </span>

      <div className="flex h-10 items-center rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm font-medium text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
        {value}
      </div>
    </div>
  );
}

// ======================================================
// EMPTY
// ======================================================

function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-5 text-center text-sm text-zinc-400 dark:border-white/10 dark:text-zinc-500">
      {text}
    </p>
  );
}

// ======================================================
// ERROR
// ======================================================

function ErrorBox({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300"
    >
      {message}
    </div>
  );
}
