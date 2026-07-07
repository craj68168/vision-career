"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Users,
  Globe,
  Clock,
  Briefcase,
  MapPinIcon,
  FileText,
  Upload,
  AlertCircle,
  Edit2,
  Save,
  X,
  Loader2,
  Cake,
  Flag,
  Languages,
  BookLock,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Trash2,
  GraduationCap,
  Building2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";

// Types
type EducationRecord = {
  id?: number;
  jobseeker_id?: number;
  enrollment_date: string | null;
  graduation_date: string | null;
  school_type: string | null;
  school: string;
  major: string | null;
  created_at?: string;
  updated_at?: string;
};

type EmploymentRecord = {
  id?: number;
  jobseeker_id?: number;
  start_date: string | null;
  end_date: string | null;
  employment_type: string | null;
  company_name: string;
  created_at?: string;
  updated_at?: string;
};

type JobSeekerProfile = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  date_of_birth: string | null;
  gender: string | null;
  nationality: string | null;
  visa_type: string | null;
  visa_expiry_date: string | null;
  japanese_level: string | null;
  desired_job: string | null;
  desired_location: string | null;
  available_from: string | null;
  resume_file: string | null;
  notes: string | null;
  status: string;
  placement_status: string | null;
  created_at: string;
  updated_at: string;
};

type ProfileResponse = {
  status: string;
  message?: string;
  is_complete: boolean;
  completion_percentage: number;
  missing_fields: Array<{
    field: string;
    label: string;
  }>;
  profile: JobSeekerProfile;
  education: EducationRecord[];
  employment_history: EmploymentRecord[];
};

type FormData = {
  phone: string;
  address: string;
  date_of_birth: string;
  gender: string;
  nationality: string;
  visa_type: string;
  visa_expiry_date: string;
  japanese_level: string;
  desired_job: string;
  desired_location: string;
  available_from: string;
  notes: string;
};

// Missing field label mapping for display
const MISSING_FIELD_LABELS: Record<string, { ja: string; en: string }> = {
  phone: { ja: "電話番号", en: "Phone Number" },
  address: { ja: "住所", en: "Address" },
  nationality: { ja: "国籍", en: "Nationality" },
  visa_type: { ja: "ビザ種類", en: "Visa Type" },
  japanese_level: { ja: "日本語レベル", en: "Japanese Level" },
  desired_job: { ja: "希望職種", en: "Desired Job" },
  desired_location: { ja: "希望勤務地", en: "Desired Location" },
  available_from: { ja: "就業可能日", en: "Available From" },
  resume_file: { ja: "履歴書", en: "Resume File" },
  education: { ja: "学歴", en: "Educational Background" },
  employment_history: { ja: "職歴", en: "Employment History" },
};

// Constants
const GENDERS = {
  ja: ["男性", "女性", "その他", "回答しない"],
  en: ["Male", "Female", "Other", "Prefer not to say"],
};

const JAPANESE_LEVELS = {
  ja: [
    "ネイティブ",
    "N1 (ビジネスレベル)",
    "N2 (日常会話レベル)",
    "N3 (基本的なコミュニケーション)",
    "N4 (初級)",
    "N5 (入門)",
    "学習中",
  ],
  en: [
    "Native",
    "N1 (Business Level)",
    "N2 (Daily Conversation)",
    "N3 (Basic Communication)",
    "N4 (Elementary)",
    "N5 (Beginner)",
    "Currently Learning",
  ],
};

const VISA_TYPES = {
  ja: [
    "永住者",
    "日本人の配偶者等",
    "永住者の配偶者等",
    "定住者",
    "技術・人文知識・国際業務",
    "特定技能",
    "技能実習",
    "留学",
    "ワーキングホリデー",
    "その他",
    "就労ビザ不要",
  ],
  en: [
    "Permanent Resident",
    "Spouse of Japanese National",
    "Spouse of Permanent Resident",
    "Long-Term Resident",
    "Engineer/Humanities/International Services",
    "Specified Skilled Worker",
    "Technical Intern Training",
    "Student",
    "Working Holiday",
    "Other",
    "No Work Visa Required",
  ],
};

const NATIONALITIES = {
  ja: [
    "日本",
    "中国",
    "韓国",
    "ベトナム",
    "ネパール",
    "インドネシア",
    "フィリピン",
    "タイ",
    "ミャンマー",
    "インド",
    "アメリカ",
    "イギリス",
    "カナダ",
    "オーストラリア",
    "その他",
  ],
  en: [
    "Japan",
    "China",
    "South Korea",
    "Vietnam",
    "Nepal",
    "Indonesia",
    "Philippines",
    "Thailand",
    "Myanmar",
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Other",
  ],
};

const SCHOOL_TYPES = {
  ja: ["高校", "専門学校", "短期大学", "大学", "大学院", "その他"],
  en: [
    "High School",
    "Vocational School",
    "Junior College",
    "University",
    "Graduate School",
    "Other",
  ],
};

const EMPLOYMENT_TYPES = {
  ja: [
    "正社員",
    "契約社員",
    "派遣社員",
    "パート・アルバイト",
    "インターン",
    "その他",
  ],
  en: [
    "Full-time",
    "Contract",
    "Temporary",
    "Part-time",
    "Internship",
    "Other",
  ],
};

// Input Field Component
type InputFieldProps = {
  label: string;
  name: string;
  value: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  rows?: number;
  isEditing: boolean;
  error?: string;
  lang: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  maxLength?: number;
  autoComplete?: string;
};

const InputField = ({
  label,
  name,
  value,
  type = "text",
  placeholder,
  required = false,
  icon,
  rows,
  isEditing,
  error,
  lang,
  onChange,
  onBlur,
  maxLength,
  autoComplete = "off",
}: InputFieldProps) => {
  const Component = rows ? "textarea" : "input";
  const charCount = rows && typeof value === "string" ? value.length : 0;
  const showCharCount = rows && maxLength;

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        {icon && <span className="text-slate-400">{icon}</span>}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <Component
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={!isEditing}
          rows={rows}
          maxLength={maxLength}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
            !isEditing
              ? "cursor-not-allowed bg-slate-50 text-slate-500"
              : "hover:border-slate-300"
          } ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-slate-200"
          } ${rows ? "resize-none" : ""}`}
        />

        {showCharCount && (
          <div className="mt-1 text-right text-xs text-slate-400">
            {charCount}/{maxLength}
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="h-3 w-3" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default function JobSeekerProfilePage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [profileStatus, setProfileStatus] = useState<{
    isComplete: boolean;
    completionPercentage: number;
    missingFields: Array<{ field: string; label: string }>;
  }>({
    isComplete: false,
    completionPercentage: 0,
    missingFields: [],
  });
  const [education, setEducation] = useState<EducationRecord[]>([]);
  const [employmentHistory, setEmploymentHistory] = useState<
    EmploymentRecord[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});

  const [formData, setFormData] = useState<FormData>({
    phone: "",
    address: "",
    date_of_birth: "",
    gender: "",
    nationality: "",
    visa_type: "",
    visa_expiry_date: "",
    japanese_level: "",
    desired_job: "",
    desired_location: "",
    available_from: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("seeker-token");
      if (!token) {
        router.replace("/job-seekers-auth");
        return;
      }

      const res = await fetch(
        "https://vision-career.co.jp/get-jobseeker-profile.php",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data: ProfileResponse = await res.json();

      if (!res.ok || data.status !== "success") {
        if (res.status === 401) {
          localStorage.removeItem("seeker-token");
          router.replace("/job-seekers-auth");
        }
        throw new Error(data.message || "Failed to load profile");
      }

      // Set profile data
      setProfile(data.profile);

      // Set profile completion status
      setProfileStatus({
        isComplete: data.is_complete,
        completionPercentage: data.completion_percentage,
        missingFields: data.missing_fields,
      });

      // Set education and employment history
      setEducation(data.education || []);
      setEmploymentHistory(data.employment_history || []);

      // Populate form with existing data
      const existingData: FormData = {
        phone: data.profile.phone || "",
        address: data.profile.address || "",
        date_of_birth: data.profile.date_of_birth || "",
        gender: data.profile.gender || "",
        nationality: data.profile.nationality || "",
        visa_type: data.profile.visa_type || "",
        visa_expiry_date: data.profile.visa_expiry_date || "",
        japanese_level: data.profile.japanese_level || "",
        desired_job: data.profile.desired_job || "",
        desired_location: data.profile.desired_location || "",
        available_from: data.profile.available_from || "",
        notes: data.profile.notes || "",
      };
      setFormData(existingData);

      // Auto-enter edit mode if profile is incomplete
      if (!data.is_complete) {
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error(
        lang === "ja"
          ? "プロフィールの読み込みに失敗しました"
          : "Failed to load profile",
      );
    } finally {
      setLoading(false);
    }
  };

  // Get localized label for missing field
  const getLocalizedMissingFieldLabel = useCallback(
    (field: string, backendLabel: string): string => {
      if (MISSING_FIELD_LABELS[field]) {
        return MISSING_FIELD_LABELS[field][lang as "ja" | "en"] || backendLabel;
      }
      return backendLabel;
    },
    [lang],
  );

  const validateField = useCallback(
    (field: keyof FormData, value: string): string | undefined => {
      switch (field) {
        case "phone":
          if (value && !/^[\d\s\-+()]+$/.test(value)) {
            return lang === "ja"
              ? "有効な電話番号を入力してください"
              : "Please enter a valid phone number";
          }
          break;

        case "address":
          if (value && value.length < 5) {
            return lang === "ja"
              ? "住所は5文字以上で入力してください"
              : "Address must be at least 5 characters";
          }
          break;

        case "date_of_birth":
          if (value) {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(value)) {
              return lang === "ja"
                ? "有効な生年月日を入力してください (YYYY-MM-DD)"
                : "Please enter a valid date of birth (YYYY-MM-DD)";
            }
            const birthDate = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (
              monthDiff < 0 ||
              (monthDiff === 0 && today.getDate() < birthDate.getDate())
            ) {
              age--;
            }
            if (age < 15 || age > 100) {
              return lang === "ja"
                ? "年齢は15歳以上100歳以下である必要があります"
                : "Age must be between 15 and 100 years";
            }
          }
          break;

        case "visa_expiry_date":
          if (value) {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(value)) {
              return lang === "ja"
                ? "有効なビザ有効期限を入力してください (YYYY-MM-DD)"
                : "Please enter a valid visa expiry date (YYYY-MM-DD)";
            }
          }
          break;

        case "available_from":
          if (value) {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(value)) {
              return lang === "ja"
                ? "有効な開始可能日を入力してください (YYYY-MM-DD)"
                : "Please enter a valid available from date (YYYY-MM-DD)";
            }
          }
          break;

        case "nationality":
          if (!value) {
            return lang === "ja"
              ? "国籍を選択してください"
              : "Please select your nationality";
          }
          break;

        case "visa_type":
          if (!value) {
            return lang === "ja"
              ? "ビザ種類を選択してください"
              : "Please select your visa type";
          }
          break;

        case "japanese_level":
          if (!value) {
            return lang === "ja"
              ? "日本語レベルを選択してください"
              : "Please select your Japanese level";
          }
          break;

        case "desired_job":
          if (!value) {
            return lang === "ja"
              ? "希望職種を入力してください"
              : "Please enter your desired job";
          }
          break;

        case "desired_location":
          if (!value) {
            return lang === "ja"
              ? "希望勤務地を入力してください"
              : "Please enter your desired location";
          }
          break;
      }
      return undefined;
    },
    [lang],
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    Object.keys(formData).forEach((key) => {
      const field = key as keyof FormData;
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    // Validate education records
    let hasEducationError = false;
    education.forEach((record, index) => {
      if (!record.school || record.school.trim() === "") {
        hasEducationError = true;
        toast.error(
          lang === "ja"
            ? `学歴${index + 1}: 学校名は必須です`
            : `Education ${index + 1}: School name is required`,
        );
      }
    });

    // Validate employment records (only if they exist)
    let hasEmploymentError = false;
    employmentHistory.forEach((record, index) => {
      if (!record.company_name || record.company_name.trim() === "") {
        hasEmploymentError = true;
        toast.error(
          lang === "ja"
            ? `職歴${index + 1}: 会社名は必須です`
            : `Employment ${index + 1}: Company name is required`,
        );
      }
    });

    setErrors(newErrors);
    return (
      Object.keys(newErrors).length === 0 &&
      !hasEducationError &&
      !hasEmploymentError
    );
  }, [formData, education, employmentHistory, validateField, lang]);

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error for this field when user starts typing
      if (errors[name as keyof FormData]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      const error = validateField(name as keyof FormData, value);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [validateField],
  );

  // Education record handlers
  const addEducationRecord = () => {
    setEducation((prev) => [
      ...prev,
      {
        enrollment_date: null,
        graduation_date: null,
        school_type: null,
        school: "",
        major: null,
      },
    ]);
  };

  const removeEducationRecord = (index: number) => {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEducationRecord = (
    index: number,
    field: keyof EducationRecord,
    value: string,
  ) => {
    setEducation((prev) =>
      prev.map((record, i) =>
        i === index ? { ...record, [field]: value } : record,
      ),
    );
  };

  // Employment record handlers
  const addEmploymentRecord = () => {
    setEmploymentHistory((prev) => [
      ...prev,
      {
        start_date: null,
        end_date: null,
        employment_type: null,
        company_name: "",
      },
    ]);
  };

  const removeEmploymentRecord = (index: number) => {
    setEmploymentHistory((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEmploymentRecord = (
    index: number,
    field: keyof EmploymentRecord,
    value: string,
  ) => {
    setEmploymentHistory((prev) =>
      prev.map((record, i) =>
        i === index ? { ...record, [field]: value } : record,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => {
        acc[key as keyof FormData] = true;
        return acc;
      },
      {} as Partial<Record<keyof FormData, boolean>>,
    );
    setTouched(allTouched);

    if (!validateForm()) {
      toast.error(
        lang === "ja"
          ? "入力内容を確認してください"
          : "Please check your input",
      );
      return;
    }

    await saveProfile();
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("seeker-token");
      if (!token) {
        router.replace("/job-seekers-auth");
        return;
      }

      // Use FormData for multipart upload to match backend
      const submitFormData = new FormData();

      // Append all profile fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          submitFormData.append(key, value);
        }
      });

      // Append education records as JSON string
      submitFormData.append("education", JSON.stringify(education));

      // Append employment history as JSON string
      submitFormData.append(
        "employment_history",
        JSON.stringify(employmentHistory),
      );

      const res = await fetch(
        "https://vision-career.co.jp/complete_jobseeker_profile.php",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type for FormData - browser sets it with boundary
          },
          body: submitFormData,
        },
      );

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to update profile");
      }

      // Refresh profile to get updated completion status
      await fetchProfile();

      setIsEditing(false);
      setTouched({});

      toast.success(
        lang === "ja"
          ? "プロフィールを更新しました"
          : "Profile updated successfully",
      );
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(
        error.message ||
          (lang === "ja"
            ? "プロフィールの更新に失敗しました"
            : "Failed to update profile"),
      );
    } finally {
      setSaving(false);
    }
  };

  const getFieldError = useCallback(
    (fieldName: keyof FormData): string | undefined => {
      if (touched[fieldName] || isEditing) {
        return errors[fieldName];
      }
      return undefined;
    },
    [touched, errors, isEditing],
  );

  // Check if a field is missing according to backend
  const isFieldMissing = useCallback(
    (fieldName: string): boolean => {
      return profileStatus.missingFields.some((mf) => mf.field === fieldName);
    },
    [profileStatus.missingFields],
  );

  const SectionHeader = useCallback(
    ({
      title,
      icon,
      description,
    }: {
      title: string;
      icon: React.ReactNode;
      description?: string;
    }) => (
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
          </div>
        </div>
      </div>
    ),
    [],
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" />
          <p className="mt-4 text-sm text-slate-600">
            {lang === "ja"
              ? "プロフィールを読み込み中..."
              : "Loading profile..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <User className="h-6 w-6 text-slate-500" />
                <p className="text-sm font-medium text-slate-500">
                  {lang === "ja" ? "求職者プロフィール" : "Job Seeker Profile"}
                </p>
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {profile?.name ||
                  (lang === "ja" ? "プロフィール設定" : "Profile Setup")}
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                {lang === "ja"
                  ? "あなたの基本情報や就職希望条件を管理します。"
                  : "Manage your basic information and job preferences."}
              </p>
            </div>

            {!isEditing ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    router.push(
                      lang === "ja" ? "/job-seekers/" : "/en/job-seekers/",
                    )
                  }
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {lang === "ja" ? "戻る" : "Back to Dashboard"}
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  <Edit2 className="h-4 w-4" />
                  {lang === "ja" ? "プロフィールを編集" : "Edit Profile"}
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form to original data
                    if (profile) {
                      setFormData({
                        phone: profile.phone || "",
                        address: profile.address || "",
                        date_of_birth: profile.date_of_birth || "",
                        gender: profile.gender || "",
                        nationality: profile.nationality || "",
                        visa_type: profile.visa_type || "",
                        visa_expiry_date: profile.visa_expiry_date || "",
                        japanese_level: profile.japanese_level || "",
                        desired_job: profile.desired_job || "",
                        desired_location: profile.desired_location || "",
                        available_from: profile.available_from || "",
                        notes: profile.notes || "",
                      });
                    }
                    setTouched({});
                    setErrors({});
                    // Refetch to reset education and employment
                    fetchProfile();
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 cursor-pointer bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  {lang === "ja" ? "キャンセル" : "Cancel"}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving
                    ? lang === "ja"
                      ? "保存中..."
                      : "Saving..."
                    : lang === "ja"
                      ? "保存する"
                      : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Completion Status */}
        {!profileStatus.isComplete && (
          <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-800">
                    {lang === "ja"
                      ? "プロフィール完成度"
                      : "Profile Completion"}
                  </h3>
                  <p className="mt-1 text-sm text-blue-700">
                    {lang === "ja"
                      ? `あなたのプロフィールは ${profileStatus.completionPercentage}% 完了しています。以下の項目を入力してください:`
                      : `Your profile is ${profileStatus.completionPercentage}% complete. Please fill in the following fields:`}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profileStatus.missingFields.map((field) => (
                      <span
                        key={field.field}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700"
                      >
                        {getLocalizedMissingFieldLabel(
                          field.field,
                          field.label,
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <span className="text-lg font-bold text-blue-700">
                  {profileStatus.completionPercentage}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Success Banner for Complete Profiles */}
        {profileStatus.isComplete && !isEditing && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">
                  {lang === "ja" ? "プロフィール完了" : "Profile Complete"}
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  {lang === "ja"
                    ? "あなたのプロフィールは完了しています。採用担当者があなたの情報を確認できます。"
                    : "Your profile is complete. Recruiters can now view your information."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          {/* Basic Information Section */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title={lang === "ja" ? "基本情報" : "Basic Information"}
              icon={<User className="h-5 w-5" />}
              description={
                lang === "ja" ? "あなたの基本情報" : "Your basic information"
              }
            />

            <div className="space-y-6">
              {/* Display-only fields (from auth) */}
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      {lang === "ja" ? "氏名" : "Full Name"}
                    </label>
                    <p className="text-sm text-slate-900">
                      {profile?.name || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      {lang === "ja" ? "メールアドレス" : "Email Address"}
                    </label>
                    <p className="text-sm text-slate-900">
                      {profile?.email || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <InputField
                    label={lang === "ja" ? "電話番号" : "Phone Number"}
                    name="phone"
                    value={formData.phone}
                    type="tel"
                    placeholder={
                      lang === "ja"
                        ? "例：090-1234-5678"
                        : "e.g., +81 90-1234-5678"
                    }
                    icon={<Phone className="h-4 w-4" />}
                    isEditing={isEditing}
                    error={getFieldError("phone")}
                    lang={lang}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    autoComplete="tel"
                  />
                  {isFieldMissing("phone") && (
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {lang === "ja"
                        ? "この項目は必須です"
                        : "This field is required"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <InputField
                    label={lang === "ja" ? "住所" : "Address"}
                    name="address"
                    value={formData.address}
                    placeholder={
                      lang === "ja"
                        ? "例：東京都渋谷区神南1-1-1"
                        : "e.g., Shibuya-ku, Tokyo"
                    }
                    icon={<MapPin className="h-4 w-4" />}
                    isEditing={isEditing}
                    error={getFieldError("address")}
                    lang={lang}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    autoComplete="street-address"
                  />
                  {isFieldMissing("address") && (
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {lang === "ja"
                        ? "この項目は必須です"
                        : "This field is required"}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <InputField
                  label={lang === "ja" ? "生年月日" : "Date of Birth"}
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  type="date"
                  placeholder="YYYY-MM-DD"
                  icon={<Cake className="h-4 w-4" />}
                  isEditing={isEditing}
                  error={getFieldError("date_of_birth")}
                  lang={lang}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Users className="h-4 w-4 text-slate-400" />
                    {lang === "ja" ? "性別" : "Gender"}
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, gender: true }))
                    }
                    disabled={!isEditing}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
                      !isEditing
                        ? "cursor-not-allowed bg-slate-50 text-slate-500"
                        : "hover:border-slate-300"
                    } border-slate-200`}
                  >
                    <option value="">
                      {lang === "ja" ? "選択してください" : "Select gender"}
                    </option>
                    {(GENDERS[lang as keyof typeof GENDERS] || GENDERS.en).map(
                      (gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Flag className="h-4 w-4 text-slate-400" />
                    {lang === "ja" ? "国籍" : "Nationality"}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, nationality: true }))
                    }
                    disabled={!isEditing}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
                      !isEditing
                        ? "cursor-not-allowed bg-slate-50 text-slate-500"
                        : "hover:border-slate-300"
                    } ${
                      getFieldError("nationality") ||
                      isFieldMissing("nationality")
                        ? "border-blue-300"
                        : "border-slate-200"
                    }`}
                  >
                    <option value="">
                      {lang === "ja"
                        ? "選択してください"
                        : "Select nationality"}
                    </option>
                    {(
                      NATIONALITIES[lang as keyof typeof NATIONALITIES] ||
                      NATIONALITIES.en
                    ).map((nationality) => (
                      <option key={nationality} value={nationality}>
                        {nationality}
                      </option>
                    ))}
                  </select>
                  {getFieldError("nationality") && (
                    <p className="text-xs text-red-500">
                      {getFieldError("nationality")}
                    </p>
                  )}
                  {isFieldMissing("nationality") &&
                    !getFieldError("nationality") && (
                      <p className="text-xs text-blue-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {lang === "ja"
                          ? "この項目は必須です"
                          : "This field is required for profile completion"}
                      </p>
                    )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Languages className="h-4 w-4 text-slate-400" />
                    {lang === "ja" ? "日本語レベル" : "Japanese Level"}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="japanese_level"
                    value={formData.japanese_level}
                    onChange={handleInputChange}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, japanese_level: true }))
                    }
                    disabled={!isEditing}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
                      !isEditing
                        ? "cursor-not-allowed bg-slate-50 text-slate-500"
                        : "hover:border-slate-300"
                    } ${
                      getFieldError("japanese_level") ||
                      isFieldMissing("japanese_level")
                        ? "border-blue-300"
                        : "border-slate-200"
                    }`}
                  >
                    <option value="">
                      {lang === "ja"
                        ? "選択してください"
                        : "Select Japanese level"}
                    </option>
                    {(
                      JAPANESE_LEVELS[lang as keyof typeof JAPANESE_LEVELS] ||
                      JAPANESE_LEVELS.en
                    ).map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  {getFieldError("japanese_level") && (
                    <p className="text-xs text-red-500">
                      {getFieldError("japanese_level")}
                    </p>
                  )}
                  {isFieldMissing("japanese_level") &&
                    !getFieldError("japanese_level") && (
                      <p className="text-xs text-blue-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {lang === "ja"
                          ? "この項目は必須です"
                          : "This field is required for profile completion"}
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title={lang === "ja" ? "学歴" : "Education"}
              icon={<GraduationCap className="h-5 w-5" />}
              description={
                lang === "ja"
                  ? "あなたの学歴情報（必須）"
                  : "Your educational background (required)"
              }
            />

            {isFieldMissing("education") && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
                <AlertCircle className="h-4 w-4" />
                <p>
                  {lang === "ja"
                    ? "学歴情報は必須です。少なくとも1つの学歴を追加してください。"
                    : "Education information is required. Please add at least one education record."}
                </p>
              </div>
            )}

            <div className="space-y-6">
              {!isEditing && education.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">
                  {lang === "ja"
                    ? "学歴情報はまだ登録されていません"
                    : "No education records added yet"}
                </p>
              )}

              {education.map((record, index) => (
                <div
                  key={index}
                  className="relative rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeEducationRecord(index)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        {lang === "ja" ? "学校名" : "School Name"}
                        <span className="text-red-500">*</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={record.school}
                          onChange={(e) =>
                            updateEducationRecord(
                              index,
                              "school",
                              e.target.value,
                            )
                          }
                          placeholder={
                            lang === "ja"
                              ? "例：東京大学"
                              : "e.g., University of Tokyo"
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      ) : (
                        <p className="text-sm text-slate-900 py-3">
                          {record.school || "-"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        {lang === "ja" ? "入学日" : "Enrollment Date"}
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={record.enrollment_date || ""}
                          onChange={(e) =>
                            updateEducationRecord(
                              index,
                              "enrollment_date",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      ) : (
                        <p className="text-sm text-slate-900 py-3">
                          {record.enrollment_date || "-"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        {lang === "ja" ? "卒業日" : "Graduation Date"}
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={record.graduation_date || ""}
                          onChange={(e) =>
                            updateEducationRecord(
                              index,
                              "graduation_date",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      ) : (
                        <p className="text-sm text-slate-900 py-3">
                          {record.graduation_date || "-"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        {lang === "ja" ? "学校種別" : "School Type"}
                      </label>
                      {isEditing ? (
                        <select
                          value={record.school_type || ""}
                          onChange={(e) =>
                            updateEducationRecord(
                              index,
                              "school_type",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">
                            {lang === "ja" ? "選択してください" : "Select type"}
                          </option>
                          {(
                            SCHOOL_TYPES[lang as keyof typeof SCHOOL_TYPES] ||
                            SCHOOL_TYPES.en
                          ).map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-sm text-slate-900 py-3">
                          {record.school_type || "-"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        {lang === "ja" ? "専攻" : "Major"}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={record.major || ""}
                          onChange={(e) =>
                            updateEducationRecord(
                              index,
                              "major",
                              e.target.value,
                            )
                          }
                          placeholder={
                            lang === "ja"
                              ? "例：情報工学"
                              : "e.g., Computer Science"
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      ) : (
                        <p className="text-sm text-slate-900 py-3">
                          {record.major || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isEditing && (
                <button
                  type="button"
                  onClick={addEducationRecord}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-4 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 w-full justify-center"
                >
                  <Plus className="h-4 w-4" />
                  {lang === "ja" ? "学歴を追加" : "Add Education"}
                </button>
              )}
            </div>
          </div>

          {/* Employment History Section */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title={lang === "ja" ? "職歴" : "Employment History"}
              icon={<Building2 className="h-5 w-5" />}
              description={
                lang === "ja"
                  ? "あなたの職歴情報（任意）"
                  : "Your employment history (optional)"
              }
            />

            <div className="space-y-6">
              {!isEditing && employmentHistory.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">
                  {lang === "ja"
                    ? "職歴情報はまだ登録されていません"
                    : "No employment records added yet"}
                </p>
              )}

              {employmentHistory.map((record, index) => (
                <div
                  key={index}
                  className="relative rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeEmploymentRecord(index)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        {lang === "ja" ? "会社名" : "Company Name"}
                        <span className="text-red-500">*</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={record.company_name}
                          onChange={(e) =>
                            updateEmploymentRecord(
                              index,
                              "company_name",
                              e.target.value,
                            )
                          }
                          placeholder={
                            lang === "ja"
                              ? "例：株式会社〇〇"
                              : "e.g., ABC Corporation"
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      ) : (
                        <p className="text-sm text-slate-900 py-3">
                          {record.company_name || "-"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        {lang === "ja" ? "入社日" : "Start Date"}
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={record.start_date || ""}
                          onChange={(e) =>
                            updateEmploymentRecord(
                              index,
                              "start_date",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      ) : (
                        <p className="text-sm text-slate-900 py-3">
                          {record.start_date || "-"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        {lang === "ja" ? "退社日" : "End Date"}
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={record.end_date || ""}
                          onChange={(e) =>
                            updateEmploymentRecord(
                              index,
                              "end_date",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      ) : (
                        <p className="text-sm text-slate-900 py-3">
                          {record.end_date || "-"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        {lang === "ja" ? "雇用形態" : "Employment Type"}
                      </label>
                      {isEditing ? (
                        <select
                          value={record.employment_type || ""}
                          onChange={(e) =>
                            updateEmploymentRecord(
                              index,
                              "employment_type",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">
                            {lang === "ja" ? "選択してください" : "Select type"}
                          </option>
                          {(
                            EMPLOYMENT_TYPES[
                              lang as keyof typeof EMPLOYMENT_TYPES
                            ] || EMPLOYMENT_TYPES.en
                          ).map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-sm text-slate-900 py-3">
                          {record.employment_type || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isEditing && (
                <button
                  type="button"
                  onClick={addEmploymentRecord}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-4 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 w-full justify-center"
                >
                  <Plus className="h-4 w-4" />
                  {lang === "ja" ? "職歴を追加" : "Add Employment"}
                </button>
              )}
            </div>
          </div>

          {/* Visa Information Section */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title={lang === "ja" ? "ビザ情報" : "Visa Information"}
              icon={<BookLock className="h-5 w-5" />}
              description={
                lang === "ja"
                  ? "現在のビザステータス"
                  : "Your current visa status"
              }
            />

            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Globe className="h-4 w-4 text-slate-400" />
                    {lang === "ja" ? "ビザ種類" : "Visa Type"}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="visa_type"
                    value={formData.visa_type}
                    onChange={handleInputChange}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, visa_type: true }))
                    }
                    disabled={!isEditing}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
                      !isEditing
                        ? "cursor-not-allowed bg-slate-50 text-slate-500"
                        : "hover:border-slate-300"
                    } ${
                      getFieldError("visa_type") || isFieldMissing("visa_type")
                        ? "border-blue-300"
                        : "border-slate-200"
                    }`}
                  >
                    <option value="">
                      {lang === "ja" ? "選択してください" : "Select visa type"}
                    </option>
                    {(
                      VISA_TYPES[lang as keyof typeof VISA_TYPES] ||
                      VISA_TYPES.en
                    ).map((visa) => (
                      <option key={visa} value={visa}>
                        {visa}
                      </option>
                    ))}
                  </select>
                  {getFieldError("visa_type") && (
                    <p className="text-xs text-red-500">
                      {getFieldError("visa_type")}
                    </p>
                  )}
                  {isFieldMissing("visa_type") &&
                    !getFieldError("visa_type") && (
                      <p className="text-xs text-blue-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {lang === "ja"
                          ? "この項目は必須です"
                          : "This field is required for profile completion"}
                      </p>
                    )}
                </div>

                <InputField
                  label={lang === "ja" ? "ビザ有効期限" : "Visa Expiry Date"}
                  name="visa_expiry_date"
                  value={formData.visa_expiry_date}
                  type="date"
                  placeholder="YYYY-MM-DD"
                  icon={<Calendar className="h-4 w-4" />}
                  isEditing={isEditing}
                  error={getFieldError("visa_expiry_date")}
                  lang={lang}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
          </div>

          {/* Job Preferences Section */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title={lang === "ja" ? "就職希望" : "Job Preferences"}
              icon={<Briefcase className="h-5 w-5" />}
              description={
                lang === "ja"
                  ? "あなたの希望する職種や勤務地"
                  : "Your desired job type and location"
              }
            />

            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <InputField
                    label={lang === "ja" ? "希望職種" : "Desired Job"}
                    name="desired_job"
                    value={formData.desired_job}
                    placeholder={
                      lang === "ja"
                        ? "例：ソフトウェアエンジニア"
                        : "e.g., Software Engineer"
                    }
                    icon={<Briefcase className="h-4 w-4" />}
                    isEditing={isEditing}
                    error={getFieldError("desired_job")}
                    lang={lang}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  />
                  {isFieldMissing("desired_job") && (
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {lang === "ja"
                        ? "この項目は必須です"
                        : "This field is required for profile completion"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <InputField
                    label={lang === "ja" ? "希望勤務地" : "Desired Location"}
                    name="desired_location"
                    value={formData.desired_location}
                    placeholder={lang === "ja" ? "例：東京都" : "e.g., Tokyo"}
                    icon={<MapPinIcon className="h-4 w-4" />}
                    isEditing={isEditing}
                    error={getFieldError("desired_location")}
                    lang={lang}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  />
                  {isFieldMissing("desired_location") && (
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {lang === "ja"
                        ? "この項目は必須です"
                        : "This field is required for profile completion"}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <InputField
                  label={lang === "ja" ? "就業可能日" : "Available From"}
                  name="available_from"
                  value={formData.available_from}
                  type="date"
                  placeholder="YYYY-MM-DD"
                  icon={<Clock className="h-4 w-4" />}
                  isEditing={isEditing}
                  error={getFieldError("available_from")}
                  lang={lang}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                {isFieldMissing("available_from") && (
                  <p className="text-xs text-blue-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {lang === "ja"
                      ? "この項目は必須です"
                      : "This field is required for profile completion"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Resume Upload Section */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title={lang === "ja" ? "履歴書" : "Resume/CV"}
              icon={<FileText className="h-5 w-5" />}
              description={
                lang === "ja"
                  ? "履歴書のアップロード（必須）"
                  : "Upload your resume (required)"
              }
            />

            {isFieldMissing("resume_file") && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
                <AlertCircle className="h-4 w-4" />
                <p>
                  {lang === "ja"
                    ? "履歴書のアップロードは必須です。"
                    : "Resume upload is required for profile completion."}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {profile?.resume_file && (
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-slate-500" />
                    <span className="text-sm text-slate-700">
                      {profile.resume_file.split("/").pop()}
                    </span>
                  </div>
                  <a
                    href={`https://vision-career.co.jp${profile.resume_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {lang === "ja" ? "ダウンロード" : "Download"}
                  </a>
                </div>
              )}

              {isEditing && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const allowedTypes = [
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                      ];
                      const maxSize = 5 * 1024 * 1024;

                      if (!allowedTypes.includes(file.type)) {
                        toast.error(
                          lang === "ja"
                            ? "PDF、DOC、またはDOCXファイルのみアップロード可能です"
                            : "Only PDF, DOC, and DOCX files are allowed",
                        );
                        return;
                      }

                      if (file.size > maxSize) {
                        toast.error(
                          lang === "ja"
                            ? "ファイルサイズは5MB以下にしてください"
                            : "File size must be less than 5MB",
                        );
                        return;
                      }

                      // Upload resume separately
                      setUploadingResume(true);
                      try {
                        const token = localStorage.getItem("seeker-token");
                        if (!token) {
                          router.replace("/job-seekers-auth");
                          return;
                        }

                        const uploadFormData = new FormData();
                        uploadFormData.append("resume_file", file);

                        const res = await fetch(
                          "https://vision-career.co.jp/complete_jobseeker_profile.php",
                          {
                            method: "POST",
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                            body: uploadFormData,
                          },
                        );

                        const data = await res.json();

                        if (!res.ok || data.status !== "success") {
                          throw new Error(
                            data.message || "Failed to upload resume",
                          );
                        }

                        // Refresh profile to get updated completion status
                        await fetchProfile();
                        toast.success(
                          lang === "ja"
                            ? "履歴書をアップロードしました"
                            : "Resume uploaded successfully",
                        );
                      } catch (error: any) {
                        console.error("Error uploading resume:", error);
                        toast.error(
                          error.message ||
                            (lang === "ja"
                              ? "履歴書のアップロードに失敗しました"
                              : "Failed to upload resume"),
                        );
                      } finally {
                        setUploadingResume(false);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }
                    }}
                    disabled={uploadingResume}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-4 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 ${
                      uploadingResume ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    {uploadingResume ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {uploadingResume
                      ? lang === "ja"
                        ? "アップロード中..."
                        : "Uploading..."
                      : lang === "ja"
                        ? "新しい履歴書をアップロード"
                        : "Upload New Resume"}
                  </label>
                  <p className="mt-2 text-xs text-slate-500">
                    {lang === "ja"
                      ? "対応形式: PDF, DOC, DOCX (最大5MB)"
                      : "Supported formats: PDF, DOC, DOCX (Max 5MB)"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title={lang === "ja" ? "備考・メモ" : "Additional Notes"}
              icon={<FileText className="h-5 w-5" />}
            />

            <InputField
              label={lang === "ja" ? "その他の情報" : "Other Information"}
              name="notes"
              value={formData.notes}
              rows={4}
              placeholder={
                lang === "ja"
                  ? "その他、採用担当者に伝えたい情報があれば記載してください"
                  : "Any additional information you'd like to share with recruiters"
              }
              isEditing={isEditing}
              error={getFieldError("notes")}
              lang={lang}
              onChange={handleInputChange}
              onBlur={handleBlur}
              maxLength={500}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
