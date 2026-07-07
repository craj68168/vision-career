// vacancy-form.constant.ts
import {
  Building2,
  User,
  Phone,
  Mail,
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  Wallet,
  GraduationCap,
  Languages,
  Heart,
  FileText,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export const VACANCY_FORM_CONTENT = {
  hero: {
    title: {
      ja: "求人情報登録",
      en: "Post a Job Vacancy",
    },
    subtitle: {
      ja: "貴社の求人情報を登録して、優秀な人材を見つけましょう",
      en: "Register your company's job vacancies and find talented candidates",
    },
    description: {
      ja: "必要な情報を入力していただくことで、求人情報を掲載できます。全ての項目に入力後、内容を確認の上送信してください。",
      en: "Fill out the form below to post your job vacancy. After completing all fields, please review your information before submitting.",
    },
    image: "/vacancy-hero.webp",
    extendedDescription: {
      ja: "外国人材の採用をご検討中の企業様向けに、詳細な求人情報をご登録いただけます。日本語能力やビザ対応など、外国人採用に必要な項目も含まれています。",
      en: "For companies considering hiring international talent, you can register detailed job vacancies including Japanese language requirements and visa support information.",
    },
  },

  badge: {
    ja: "求人情報登録",
    en: "Job Posting",
  },

  heading: {
    ja: "求人情報を登録する",
    en: "Register Job Vacancy",
  },

  subheading: {
    ja: "以下のフォームに必要事項をご記入ください。登録後、担当者よりご連絡させていただきます。",
    en: "Please fill out the form below. After registration, our team will contact you.",
  },

  form: {
    companyInfoSection: {
      ja: "会社情報",
      en: "Company Information",
    },
    companyName: {
      label: {
        ja: "会社名",
        en: "Company Name",
      },
      placeholder: {
        ja: "例：株式会社サンプル",
        en: "e.g. Sample Co., Ltd.",
      },
      required: true,
    },
    companyNameKana: {
      label: {
        ja: "会社名フリガナ",
        en: "Company Name (Kana)",
      },
      placeholder: {
        ja: "例：カブシキガイシャサンプル",
        en: "e.g. Kabushiki Gaisha Sample",
      },
      required: false,
    },

    // Position Details Section
    positionSection: {
      ja: "求人詳細",
      en: "Position Details",
    },
    title: {
      label: {
        ja: "職種名",
        en: "Job Title",
      },
      placeholder: {
        ja: "例：ソフトウェアエンジニア",
        en: "e.g. Software Engineer",
      },
      required: true,
    },
    titleKana: {
      label: {
        ja: "職種名フリガナ",
        en: "Job Title (Kana)",
      },
      placeholder: {
        ja: "例：ソフトウェアエンジニア",
        en: "e.g. Sofutowea Enjinia",
      },
      required: false,
    },
    employmentType: {
      label: {
        ja: "雇用形態",
        en: "Employment Type",
      },
      placeholder: {
        ja: "選択してください",
        en: "Please select",
      },
      required: true,
      options: [
        {
          value: "Full time",
          label: { ja: "正社員", en: "Full-time Employee" },
        },
        {
          value: "Contract",
          label: { ja: "契約社員", en: "Contract Employee" },
        },
        {
          value: "Temporary",
          label: { ja: "派遣社員", en: "Temporary Staff" },
        },
        {
          value: "Part-time",
          label: { ja: "パート・アルバイト", en: "Part-time" },
        },
        {
          value: "Freelance/Contract",
          label: { ja: "業務委託", en: "Freelance/Contract" },
        },
        { value: "Intern", label: { ja: "インターン", en: "Intern" } },
      ],
    },
    numberOfPeople: {
      label: {
        ja: "募集人数",
        en: "Number of Openings",
      },
      placeholder: {
        ja: "例：1",
        en: "e.g. 1",
      },
      required: false,
    },

    // Job Description Section
    jobDescriptionSection: {
      ja: "仕事内容",
      en: "Job Description",
    },
    jobDescription: {
      label: {
        ja: "仕事内容",
        en: "Job Description",
      },
      placeholder: {
        ja: "具体的な業務内容をご記入ください",
        en: "Please describe the specific job responsibilities",
      },
      required: true,
    },
    responsibilities: {
      label: {
        ja: "担当業務詳細",
        en: "Detailed Responsibilities",
      },
      placeholder: {
        ja: "日常的な業務の詳細をご記入ください",
        en: "Please describe day-to-day tasks in detail",
      },
      required: false,
    },

    // Requirements Section
    requirementsSection: {
      ja: "応募要件",
      en: "Requirements",
    },
    requiredSkills: {
      label: {
        ja: "必須スキル・経験",
        en: "Required Skills & Experience",
      },
      placeholder: {
        ja: "例：JavaScript/TypeScriptでの開発経験3年以上",
        en: "e.g. 3+ years of JavaScript/TypeScript development experience",
      },
      required: false,
    },
    preferredSkills: {
      label: {
        ja: "歓迎スキル",
        en: "Preferred Skills",
      },
      placeholder: {
        ja: "例：ReactやNext.jsの実務経験",
        en: "e.g. Practical experience with React or Next.js",
      },
      required: false,
    },
    requiredEducation: {
      label: {
        ja: "学歴要件",
        en: "Education Requirements",
      },
      placeholder: {
        ja: "例：大学卒業以上 / 不問",
        en: "e.g. University degree or above / Not specified",
      },
      required: false,
    },
    requiredExperience: {
      label: {
        ja: "経験年数",
        en: "Years of Experience",
      },
      placeholder: {
        ja: "例：実務経験3年以上 / 未経験可",
        en: "e.g. 3+ years of experience / Entry level welcome",
      },
      required: false,
    },
    japaneseLevel: {
      label: {
        ja: "日本語レベル",
        en: "Japanese Language Level",
      },
      placeholder: {
        ja: "選択してください",
        en: "Please select",
      },
      required: true,
      options: [
        { value: "Native", label: { ja: "ネイティブ", en: "Native" } },
        {
          value: "N1 (Business level)",
          label: { ja: "N1（ビジネスレベル）", en: "N1 (Business level)" },
        },
        {
          value: "N2 (Daily conversation level)",
          label: {
            ja: "N2（日常会話レベル）",
            en: "N2 (Daily conversation level)",
          },
        },
        {
          value: "N3 (Basic conversation level)",
          label: {
            ja: "N3（基本会話レベル）",
            en: "N3 (Basic conversation level)",
          },
        },
        {
          value: "N4 or below (Not required)",
          label: { ja: "N4以下（不要）", en: "N4 or below (Not required)" },
        },
      ],
    },

    // Location & Work Conditions Section
    locationSection: {
      ja: "勤務地・条件",
      en: "Location & Work Conditions",
    },
    workLocation: {
      label: {
        ja: "勤務地",
        en: "Work Location",
      },
      placeholder: {
        ja: "例：東京都千代田区",
        en: "e.g. Chiyoda-ku, Tokyo",
      },
      required: true,
    },
    workLocationDetail: {
      label: {
        ja: "詳細所在地",
        en: "Detailed Location",
      },
      placeholder: {
        ja: "例：東京駅から徒歩5分",
        en: "e.g. 5-minute walk from Tokyo Station",
      },
      required: false,
    },
    remoteWork: {
      label: {
        ja: "リモートワーク",
        en: "Remote Work Policy",
      },
      placeholder: {
        ja: "選択してください",
        en: "Please select",
      },
      required: false,
      options: [
        {
          value: "Fully remote",
          label: { ja: "完全リモート可", en: "Fully remote" },
        },
        {
          value: "2-3 days in office per week",
          label: { ja: "週2-3日出社必須", en: "2-3 days in office per week" },
        },
        {
          value: "Primarily in-office (remote possible depending on situation)",
          label: {
            ja: "基本出社（状況によるリモート可）",
            en: "Primarily in-office (remote possible depending on situation)",
          },
        },
        {
          value: "No remote work",
          label: { ja: "リモート不可", en: "No remote work" },
        },
      ],
    },
    salaryMin: {
      label: {
        ja: "年収（下限）",
        en: "Annual Salary (Min)",
      },
      placeholder: {
        ja: "例：300",
        en: "e.g. 300",
      },
      required: false,
    },
    salaryMax: {
      label: {
        ja: "年収（上限）",
        en: "Annual Salary (Max)",
      },
      placeholder: {
        ja: "例：500",
        en: "e.g. 500",
      },
      required: false,
    },
    salaryNote: {
      label: {
        ja: "給与補足",
        en: "Salary Notes",
      },
      placeholder: {
        ja: "例：賞与年2回・インセンティブあり",
        en: "e.g. Bonus twice a year, incentives available",
      },
      required: false,
    },

    // Work Schedule Section
    scheduleSection: {
      ja: "勤務時間・休日",
      en: "Work Schedule & Holidays",
    },
    workHours: {
      label: {
        ja: "勤務時間",
        en: "Working Hours",
      },
      placeholder: {
        ja: "例：9:00 - 18:00",
        en: "e.g. 9:00 AM - 6:00 PM",
      },
      required: false,
    },
    breakTime: {
      label: {
        ja: "休憩時間",
        en: "Break Time",
      },
      placeholder: {
        ja: "例：12:00 - 13:00",
        en: "e.g. 12:00 PM - 1:00 PM",
      },
      required: false,
    },
    overtime: {
      label: {
        ja: "残業",
        en: "Overtime",
      },
      placeholder: {
        ja: "例：月平均20時間程度",
        en: "e.g. Approximately 20 hours/month",
      },
      required: false,
    },
    holidays: {
      label: {
        ja: "休日・休暇",
        en: "Holidays & Leave",
      },
      placeholder: {
        ja: "例：土日祝日、夏季休暇、年末年始",
        en: "e.g. Weekends, national holidays, summer vacation, New Year's holiday",
      },
      required: false,
    },

    // Benefits Section
    benefitsSection: {
      ja: "待遇・福利厚生",
      en: "Benefits & Welfare",
    },
    benefits: {
      label: {
        ja: "福利厚生",
        en: "Benefits",
      },
      options: [
        {
          value: "Full social insurance",
          label: { ja: "社会保険完備", en: "Full social insurance" },
        },
        {
          value: "Commuting allowance",
          label: { ja: "通勤手当", en: "Commuting allowance" },
        },
        {
          value: "Housing allowance",
          label: { ja: "住宅手当", en: "Housing allowance" },
        },
        {
          value: "Family allowance",
          label: { ja: "家族手当", en: "Family allowance" },
        },
        {
          value: "Certification support",
          label: { ja: "資格取得支援", en: "Certification support" },
        },
        {
          value: "Employee cafeteria",
          label: { ja: "社員食堂", en: "Employee cafeteria" },
        },
        {
          value: "On-site daycare",
          label: { ja: "保育所併設", en: "On-site daycare" },
        },
        {
          value: "Refresh vacation",
          label: { ja: "リフレッシュ休暇", en: "Refresh vacation" },
        },
      ],
    },
    insurance: {
      label: {
        ja: "社会保険",
        en: "Social Insurance",
      },
      options: [
        {
          value: "Health insurance",
          label: { ja: "健康保険", en: "Health insurance" },
        },
        {
          value: "Employees' pension insurance",
          label: { ja: "厚生年金保険", en: "Employees' pension insurance" },
        },
        {
          value: "Employment insurance",
          label: { ja: "雇用保険", en: "Employment insurance" },
        },
        {
          value: "Workers' compensation insurance",
          label: { ja: "労災保険", en: "Workers' compensation insurance" },
        },
      ],
    },
    trialPeriod: {
      label: {
        ja: "試用期間",
        en: "Trial Period",
      },
      placeholder: {
        ja: "例：3ヶ月",
        en: "e.g. 3 months",
      },
      required: false,
    },

    // Application Section
    applicationSection: {
      ja: "応募情報",
      en: "Application Information",
    },
    applicationDeadline: {
      label: {
        ja: "応募締切",
        en: "Application Deadline",
      },
      placeholder: {
        ja: "YYYY-MM-DD",
        en: "YYYY-MM-DD",
      },
      required: false,
    },
    startDate: {
      label: {
        ja: "入社時期",
        en: "Start Date",
      },
      placeholder: {
        ja: "例：即日 / 2025年4月",
        en: "e.g. Immediately / April 2025",
      },
      required: false,
    },
    selectionProcess: {
      label: {
        ja: "選考フロー",
        en: "Selection Process",
      },
      placeholder: {
        ja: "例：書類選考 → 1次面接 → 最終面接 → 内定",
        en: "e.g. Document screening → First interview → Final interview → Offer",
      },
      required: false,
    },

    // Contact Section
    contactSection: {
      ja: "担当者連絡先",
      en: "Contact Person",
    },
    contactPerson: {
      label: {
        ja: "担当者名",
        en: "Contact Person Name",
      },
      placeholder: {
        ja: "例：山田 太郎",
        en: "e.g. Taro Yamada",
      },
      required: true,
    },
    contactPersonKana: {
      label: {
        ja: "担当者名フリガナ",
        en: "Contact Person Name (Kana)",
      },
      placeholder: {
        ja: "例：ヤマダ タロウ",
        en: "e.g. Yamada Taro",
      },
      required: false,
    },
    contactEmail: {
      label: {
        ja: "メールアドレス",
        en: "Email Address",
      },
      placeholder: {
        ja: "例：example@company.co.jp",
        en: "e.g. example@company.com",
      },
      required: true,
    },

    // Form Actions
    submit: {
      ja: "求人を登録する",
      en: "Post Job Vacancy",
    },
    submitting: {
      ja: "送信中...",
      en: "Submitting...",
    },
    reset: {
      ja: "リセット",
      en: "Reset",
    },
    successMessage: {
      ja: "求人情報が正常に登録されました。担当者よりご連絡させていただきます。",
      en: "Your job vacancy has been successfully registered. Our team will contact you shortly.",
    },
    errorMessage: {
      ja: "送信に失敗しました。時間をおいて再度お試しください。",
      en: "Submission failed. Please try again later.",
    },
    privacyNote: {
      ja: "送信いただいた情報は、求人掲載および採用サポートの目的でのみ利用します。",
      en: "The information you submit will only be used for job posting and recruitment support purposes.",
    },
  },

  // Validation Messages
  validation: {
    required: {
      ja: "この項目は必須です",
      en: "This field is required",
    },
    invalidEmail: {
      ja: "有効なメールアドレスを入力してください",
      en: "Please enter a valid email address",
    },
    invalidPhone: {
      ja: "有効な電話番号を入力してください",
      en: "Please enter a valid phone number",
    },
    invalidNumber: {
      ja: "有効な数値を入力してください",
      en: "Please enter a valid number",
    },
    salaryRange: {
      ja: "下限は上限より小さい値を入力してください",
      en: "Minimum salary must be less than maximum salary",
    },
  },

  // Icons mapping
  icons: {
    companyName: Building2,
    companyNameKana: Building2,
    title: Briefcase,
    titleKana: Briefcase,
    employmentType: Briefcase,
    numberOfPeople: User,
    jobDescription: FileText,
    responsibilities: FileText,
    requiredSkills: CheckCircle,
    preferredSkills: Heart,
    requiredEducation: GraduationCap,
    requiredExperience: Clock,
    japaneseLevel: Languages,
    workLocation: MapPin,
    workLocationDetail: MapPin,
    remoteWork: MapPin,
    salaryMin: Wallet,
    salaryMax: Wallet,
    salaryNote: Wallet,
    workHours: Clock,
    breakTime: Clock,
    overtime: Clock,
    holidays: Calendar,
    benefits: Heart,
    insurance: Heart,
    trialPeriod: Calendar,
    applicationDeadline: Calendar,
    startDate: Calendar,
    selectionProcess: FileText,
    contactPerson: User,
    contactPersonKana: User,
    contactEmail: Mail,
    submit: Send,
    success: CheckCircle,
    error: AlertCircle,
  },
};
