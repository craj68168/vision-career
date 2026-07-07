"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  User,
  Mail,
  FileText,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Edit2,
  Save,
  X,
  Loader2,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import axiosInstance from "@/services/axiosInstance";
import toast from "react-hot-toast";

type CompanyProfile = {
  id: number;
  name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  website: string | null;
  industry: string | null;
  contact_person: string | null;
  contact_person_phone: string | null;
  contact_person_email: string | null;
  hiring_needs: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

type FormData = {
  company_name: string;
  phone: string;
  address: string;
  website: string;
  industry: string;
  contact_person: string;
  contact_person_phone: string;
  contact_person_email: string;
  hiring_needs: string;
  notes: string;
};

type ProfileResponse = {
  status: string;
  message: string;
  is_complete: boolean;
  completion_percentage: number;
  missing_fields: Array<{
    field: string;
    label: string;
  }>;
  profile: CompanyProfile;
};

const INDUSTRIES = {
  ja: [
    "IT・情報通信",
    "製造業",
    "小売・卸売",
    "サービス業",
    "金融・保険",
    "建設・不動産",
    "医療・福祉",
    "教育",
    "運輸・物流",
    " hospitality・観光",
    "その他",
  ],
  en: [
    "IT & Telecommunications",
    "Manufacturing",
    "Retail & Wholesale",
    "Services",
    "Finance & Insurance",
    "Construction & Real Estate",
    "Healthcare & Welfare",
    "Education",
    "Transportation & Logistics",
    "Hospitality & Tourism",
    "Other",
  ],
};

type InputFieldProps = {
  label: string;
  name: keyof FormData;
  value: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  rows?: number;
  isEditing: boolean;
  isLocked?: boolean;
  tooltip?: string;
  error?: string;
  lang: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  disabled?: boolean;
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
  isLocked = false,
  tooltip,
  error,
  lang,
  onChange,
  onBlur,
  disabled = false,
  maxLength,
  autoComplete = "off",
}: InputFieldProps) => {
  const Component = rows ? "textarea" : "input";
  const isDisabled = !isEditing || isLocked || disabled;

  // Character count for textarea
  const charCount = rows && typeof value === "string" ? value.length : 0;
  const showCharCount = rows && maxLength;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          {icon && <span className="text-slate-400">{icon}</span>}
          {label}
          {required && <span className="text-red-500">*</span>}
          {isLocked && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
              <ShieldCheck className="h-3 w-3" />
              Locked
            </span>
          )}
        </label>

        {tooltip && !isDisabled && (
          <div className="group relative">
            <div className="cursor-help text-slate-400 hover:text-slate-600">
              <AlertCircle className="h-4 w-4" />
            </div>
            <div className="absolute right-0 top-6 z-10 hidden w-64 rounded-lg bg-slate-800 p-2 text-xs text-white group-hover:block">
              {tooltip}
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <Component
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={isDisabled}
          rows={rows}
          maxLength={maxLength}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
            isDisabled
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

export default function CompanyProfilePage() {
  const { lang } = useLanguage();
  const router = useRouter();

  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [profileStatus, setProfileStatus] = useState<{
    isComplete: boolean;
    completionPercentage: number;
    missingFields: Array<{ field: string; label: string }>;
  }>({
    isComplete: false,
    completionPercentage: 0,
    missingFields: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingData, setPendingData] = useState<FormData | null>(null);
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});

  const [formData, setFormData] = useState<FormData>({
    company_name: "",
    phone: "",
    address: "",
    website: "",
    industry: "",
    contact_person: "",
    contact_person_phone: "",
    contact_person_email: "",
    hiring_needs: "",
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
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/auth");
        return;
      }

      const res = await fetch(
        "https://vision-career.co.jp/get-client-company-profile.php",
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
          localStorage.removeItem("token");
          router.replace("/auth");
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

      // Populate form with existing data
      const existingData: FormData = {
        company_name: data.profile.company_name || "",
        phone: data.profile.phone || "",
        address: data.profile.address || "",
        website: data.profile.website || "",
        industry: data.profile.industry || "",
        contact_person: data.profile.contact_person || "",
        contact_person_phone: data.profile.contact_person_phone || "",
        contact_person_email: data.profile.contact_person_email || "",
        hiring_needs: data.profile.hiring_needs || "",
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

  const validateField = useCallback(
    (field: keyof FormData, value: string): string | undefined => {
      switch (field) {
        case "company_name":
          if (!value.trim()) {
            return lang === "ja"
              ? "会社名は必須です"
              : "Company name is required";
          }
          if (value.length < 2) {
            return lang === "ja"
              ? "会社名は2文字以上で入力してください"
              : "Company name must be at least 2 characters";
          }
          if (value.length > 100) {
            return lang === "ja"
              ? "会社名は100文字以内で入力してください"
              : "Company name must be less than 100 characters";
          }
          break;

        case "phone":
          if (!value) {
            return lang === "ja"
              ? "電話番号は必須です"
              : "Phone number is required";
          }
          if (!/^[\d\s\-+()]+$/.test(value)) {
            return lang === "ja"
              ? "有効な電話番号を入力してください"
              : "Please enter a valid phone number";
          }
          break;

        case "address":
          if (!value) {
            return lang === "ja" ? "住所は必須です" : "Address is required";
          }
          if (value.length < 5) {
            return lang === "ja"
              ? "住所は5文字以上で入力してください"
              : "Address must be at least 5 characters";
          }
          break;

        case "industry":
          if (!value) {
            return lang === "ja"
              ? "業種を選択してください"
              : "Please select an industry";
          }
          break;

        case "contact_person":
          if (!value) {
            return lang === "ja"
              ? "担当者名は必須です"
              : "Contact person name is required";
          }
          if (value.length < 2) {
            return lang === "ja"
              ? "担当者名は2文字以上で入力してください"
              : "Contact person name must be at least 2 characters";
          }
          break;

        case "contact_person_phone":
          if (!value) {
            return lang === "ja"
              ? "担当者電話番号は必須です"
              : "Contact person phone is required";
          }
          if (!/^[\d\s\-+()]+$/.test(value)) {
            return lang === "ja"
              ? "有効な電話番号を入力してください"
              : "Please enter a valid phone number";
          }
          break;

        case "contact_person_email":
          if (!value) {
            return lang === "ja"
              ? "担当者メールアドレスは必須です"
              : "Contact person email is required";
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return lang === "ja"
              ? "有効なメールアドレスを入力してください"
              : "Please enter a valid email address";
          }
          break;

        case "website":
          if (
            value &&
            !/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(
              value,
            )
          ) {
            return lang === "ja"
              ? "有効なURLを入力してください（https://を含めてください）"
              : "Please enter a valid URL (include https://)";
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

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

    // Check if company_name is being changed from null/empty to a value
    const isFirstTimeCompanyName =
      !profile?.company_name && formData.company_name;

    if (isFirstTimeCompanyName) {
      // Show warning modal before saving
      setPendingData({ ...formData });
      setShowWarningModal(true);
      return;
    }

    await saveProfile();
  };

  const saveProfile = async () => {
    const dataToSave = pendingData || formData;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/auth");
        return;
      }

      const res = await fetch(
        "https://vision-career.co.jp/complete_company_profile.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSave),
        },
      );

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to update profile");
      }

      setProfile(data.profile);

      // Refresh profile status
      await fetchProfile();

      setIsEditing(false);
      setShowWarningModal(false);
      setPendingData(null);
      setTouched({});

      toast.success(
        lang === "ja"
          ? "会社情報を更新しました"
          : "Company profile updated successfully",
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

  const isFieldLocked = useCallback(
    (fieldName: keyof FormData): boolean => {
      // Company name cannot be changed after it's been set
      if (fieldName === "company_name" && profile?.company_name) {
        return true;
      }
      return false;
    },
    [profile?.company_name],
  );

  const getFieldTooltip = useCallback(
    (fieldName: keyof FormData): string => {
      if (fieldName === "company_name" && profile?.company_name) {
        return lang === "ja"
          ? "会社名は一度設定すると変更できません"
          : "Company name cannot be changed once set";
      }
      if (fieldName === "contact_person_email") {
        return lang === "ja"
          ? "求人に関する問い合わせ先のメールアドレス"
          : "Email address for job-related inquiries";
      }
      return "";
    },
    [profile?.company_name, lang],
  );

  const getFieldError = useCallback(
    (fieldName: keyof FormData): string | undefined => {
      if (touched[fieldName] || isEditing) {
        return errors[fieldName];
      }
      return undefined;
    },
    [touched, errors, isEditing],
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
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-slate-500" />
                  <p className="text-sm font-medium text-slate-500">
                    {lang === "ja" ? "会社プロフィール" : "Company Profile"}
                  </p>
                </div>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {profile?.company_name ||
                    (lang === "ja" ? "会社情報の設定" : "Setup Company Info")}
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  {lang === "ja"
                    ? "会社の基本情報を管理します。一部の情報は設定後に変更できません。"
                    : "Manage your company information. Some fields cannot be changed after being set."}
                </p>
              </div>

              {!isEditing ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push(lang === "ja" ? "/" : "/en/")}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {lang === "ja" ? "戻る" : "Back to Dashboard"}
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center cursor-pointer gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
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
                          company_name: profile.company_name || "",
                          phone: profile.phone || "",
                          address: profile.address || "",
                          website: profile.website || "",
                          industry: profile.industry || "",
                          contact_person: profile.contact_person || "",
                          contact_person_phone:
                            profile.contact_person_phone || "",
                          contact_person_email:
                            profile.contact_person_email || "",
                          hiring_needs: profile.hiring_needs || "",
                          notes: profile.notes || "",
                        });
                      }
                      setTouched({});
                      setErrors({});
                    }}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <X className="h-4 w-4" />
                    {lang === "ja" ? "キャンセル" : "Cancel"}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="inline-flex items-center cursor-pointer gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
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
                          {field.label}
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
                      ? "あなたの会社プロフィールは完了しています。求職者があなたの会社情報を確認できます。"
                      : "Your company profile is complete. Job seekers can now view your company information."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Warning Banner for Missing Company Name (Special Case) */}
          {!profile?.company_name && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
                <div>
                  <h3 className="font-semibold text-amber-800">
                    {lang === "ja"
                      ? "会社名が未設定です"
                      : "Company name not set"}
                  </h3>
                  <p className="mt-1 text-sm text-amber-700">
                    {lang === "ja"
                      ? "会社名は一度設定すると変更できません。正確に入力してください。"
                      : "The company name cannot be changed once set. Please enter it accurately."}
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
                icon={<Building2 className="h-5 w-5" />}
                description={
                  lang === "ja"
                    ? "会社の基本情報（特に会社名は後で変更できません）"
                    : "Basic company information (company name cannot be changed later)"
                }
              />

              <div className="space-y-6">
                <InputField
                  label={lang === "ja" ? "会社名" : "Company Name"}
                  name="company_name"
                  value={formData.company_name}
                  placeholder={
                    lang === "ja"
                      ? "例：株式会社ビジョンキャリア"
                      : "e.g., Vision Career Inc."
                  }
                  required
                  icon={<Building2 className="h-4 w-4" />}
                  isEditing={isEditing}
                  isLocked={isFieldLocked("company_name")}
                  tooltip={getFieldTooltip("company_name")}
                  error={getFieldError("company_name")}
                  lang={lang}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  maxLength={100}
                  autoComplete="organization"
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <InputField
                    label={lang === "ja" ? "電話番号" : "Phone Number"}
                    name="phone"
                    value={formData.phone}
                    type="tel"
                    placeholder={
                      lang === "ja"
                        ? "例：03-1234-5678"
                        : "e.g., +81 3-1234-5678"
                    }
                    icon={<Phone className="h-4 w-4" />}
                    isEditing={isEditing}
                    isLocked={isFieldLocked("phone")}
                    tooltip={getFieldTooltip("phone")}
                    error={getFieldError("phone")}
                    lang={lang}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    autoComplete="tel"
                    required
                  />

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Briefcase className="h-4 w-4 text-slate-400" />
                      {lang === "ja" ? "業種" : "Industry"}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      onBlur={() =>
                        setTouched((prev) => ({ ...prev, industry: true }))
                      }
                      disabled={!isEditing}
                      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
                        !isEditing
                          ? "cursor-not-allowed bg-slate-50 text-slate-500"
                          : "hover:border-slate-300"
                      } ${
                        getFieldError("industry")
                          ? "border-red-300"
                          : "border-slate-200"
                      }`}
                    >
                      <option value="">
                        {lang === "ja" ? "選択してください" : "Select industry"}
                      </option>
                      {(
                        INDUSTRIES[lang as keyof typeof INDUSTRIES] ||
                        INDUSTRIES.en
                      ).map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                    {getFieldError("industry") && (
                      <p className="text-xs text-red-500">
                        {getFieldError("industry")}
                      </p>
                    )}
                  </div>
                </div>

                <InputField
                  label={lang === "ja" ? "所在地" : "Address"}
                  name="address"
                  value={formData.address}
                  placeholder={
                    lang === "ja"
                      ? "例：東京都渋谷区神南1-1-1"
                      : "e.g., Shibuya-ku, Tokyo"
                  }
                  icon={<MapPin className="h-4 w-4" />}
                  isEditing={isEditing}
                  isLocked={isFieldLocked("address")}
                  tooltip={getFieldTooltip("address")}
                  error={getFieldError("address")}
                  lang={lang}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  autoComplete="street-address"
                  required
                />

                <InputField
                  label={lang === "ja" ? "ウェブサイト" : "Website"}
                  name="website"
                  value={formData.website}
                  type="url"
                  placeholder="https://example.com"
                  icon={<Globe className="h-4 w-4" />}
                  isEditing={isEditing}
                  isLocked={isFieldLocked("website")}
                  tooltip={getFieldTooltip("website")}
                  error={getFieldError("website")}
                  lang={lang}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  autoComplete="url"
                />
              </div>
            </div>

            {/* Contact Person Section */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                title={lang === "ja" ? "担当者情報" : "Contact Person"}
                icon={<User className="h-5 w-5" />}
                description={
                  lang === "ja"
                    ? "求人に関する問い合わせ先情報"
                    : "Contact information for job-related inquiries"
                }
              />

              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <InputField
                    label={lang === "ja" ? "担当者名" : "Contact Person Name"}
                    name="contact_person"
                    value={formData.contact_person}
                    placeholder={
                      lang === "ja" ? "例：山田 太郎" : "e.g., Taro Yamada"
                    }
                    icon={<User className="h-4 w-4" />}
                    isEditing={isEditing}
                    isLocked={isFieldLocked("contact_person")}
                    tooltip={getFieldTooltip("contact_person")}
                    error={getFieldError("contact_person")}
                    lang={lang}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    autoComplete="name"
                    required
                  />

                  <InputField
                    label={
                      lang === "ja" ? "担当者電話番号" : "Contact Person Phone"
                    }
                    name="contact_person_phone"
                    value={formData.contact_person_phone}
                    type="tel"
                    placeholder={
                      lang === "ja"
                        ? "例：090-1234-5678"
                        : "e.g., 090-1234-5678"
                    }
                    icon={<Phone className="h-4 w-4" />}
                    isEditing={isEditing}
                    isLocked={isFieldLocked("contact_person_phone")}
                    tooltip={getFieldTooltip("contact_person_phone")}
                    error={getFieldError("contact_person_phone")}
                    lang={lang}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    autoComplete="tel"
                    required
                  />
                </div>

                <InputField
                  label={
                    lang === "ja"
                      ? "担当者メールアドレス"
                      : "Contact Person Email"
                  }
                  name="contact_person_email"
                  value={formData.contact_person_email}
                  type="email"
                  placeholder="contact@example.com"
                  icon={<Mail className="h-4 w-4" />}
                  isEditing={isEditing}
                  isLocked={isFieldLocked("contact_person_email")}
                  tooltip={getFieldTooltip("contact_person_email")}
                  error={getFieldError("contact_person_email")}
                  lang={lang}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                title={lang === "ja" ? "追加情報" : "Additional Information"}
                icon={<FileText className="h-5 w-5" />}
              />

              <div className="space-y-6">
                <InputField
                  label={lang === "ja" ? "採用ニーズ" : "Hiring Needs"}
                  name="hiring_needs"
                  value={formData.hiring_needs}
                  rows={3}
                  placeholder={
                    lang === "ja"
                      ? "現在募集しているポジションや今後の採用計画など"
                      : "Current positions you're hiring for or future hiring plans"
                  }
                  isEditing={isEditing}
                  isLocked={isFieldLocked("hiring_needs")}
                  tooltip={getFieldTooltip("hiring_needs")}
                  error={getFieldError("hiring_needs")}
                  lang={lang}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  maxLength={500}
                />

                <InputField
                  label={lang === "ja" ? "備考・メモ" : "Notes"}
                  name="notes"
                  value={formData.notes}
                  rows={3}
                  placeholder={
                    lang === "ja"
                      ? "その他、共有したい情報があれば記載してください"
                      : "Any additional information you'd like to share"
                  }
                  isEditing={isEditing}
                  isLocked={isFieldLocked("notes")}
                  tooltip={getFieldTooltip("notes")}
                  error={getFieldError("notes")}
                  lang={lang}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  maxLength={1000}
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Warning Modal for First-time Company Name Setup */}
      {showWarningModal && pendingData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={() => setShowWarningModal(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-amber-100 p-2">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {lang === "ja"
                    ? "重要：確認事項"
                    : "Important: Confirmation Required"}
                </h3>
              </div>

              <div className="mt-4 space-y-4">
                <p className="text-sm text-slate-700">
                  {lang === "ja"
                    ? "以下の会社名で設定してもよろしいですか？"
                    : "Are you sure you want to set the company name as:"}
                </p>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
                  <p className="text-lg font-bold text-slate-900">
                    {pendingData.company_name}
                  </p>
                </div>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-red-600" />
                    <div className="text-xs text-red-700">
                      {lang === "ja"
                        ? "⚠️ 会社名は一度設定すると変更できません。正確に入力されていることをご確認ください。"
                        : "⚠️ The company name cannot be changed once set. Please ensure it is entered correctly."}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600">
                  {lang === "ja"
                    ? "設定後も他の情報（電話番号、住所など）は変更可能です。"
                    : "Other information (phone, address, etc.) can still be changed after setup."}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowWarningModal(false);
                    setPendingData(null);
                  }}
                  className="flex-1 rounded-xl cursor-pointer border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  {lang === "ja" ? "キャンセル" : "Cancel"}
                </button>
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="flex-1 rounded-xl cursor-pointer bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                  ) : lang === "ja" ? (
                    "確定して保存"
                  ) : (
                    "Confirm & Save"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
