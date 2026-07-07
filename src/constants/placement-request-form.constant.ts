// constants/placement-request-form.constant.ts
export const PLACEMENT_REQUEST_FORM = {
  title: {
    en: "New Placement Request",
    ja: "新規採用依頼",
  },
  subheading: {
    en: "Submit a new placement request for your company",
    ja: "企業の採用依頼を提出します",
  },
  form: {
    companyInfo: {
      en: "Company Information",
      ja: "企業情報",
    },
    positionInfo: {
      en: "Position Information",
      ja: "求人情報",
    },
    requirements: {
      en: "Requirements",
      ja: "必須条件",
    },
    compensation: {
      en: "Compensation & Working Conditions",
      ja: "給与・勤務条件",
    },
    jobTitle: {
      label: { en: "Job Title", ja: "求人タイトル" },
      placeholder: {
        en: "e.g., Software Engineer",
        ja: "例：ソフトウェアエンジニア",
      },
      required: true,
    },
    jobCategory: {
      label: { en: "Job Category", ja: "職種カテゴリー" },
      placeholder: { en: "Select category", ja: "カテゴリーを選択" },
      options: [
        {
          value: "it_engineering",
          label: { en: "IT/Engineering", ja: "IT・エンジニアリング" },
        },
        {
          value: "sales_marketing",
          label: { en: "Sales/Marketing", ja: "営業・マーケティング" },
        },
        {
          value: "finance_accounting",
          label: { en: "Finance/Accounting", ja: "財務・会計" },
        },
        {
          value: "hr_admin",
          label: { en: "HR/Administration", ja: "人事・総務" },
        },
        {
          value: "medical_healthcare",
          label: { en: "Medical/Healthcare", ja: "医療・ヘルスケア" },
        },
        { value: "education", label: { en: "Education", ja: "教育" } },
        {
          value: "creative_design",
          label: { en: "Creative/Design", ja: "クリエイティブ・デザイン" },
        },
        { value: "legal", label: { en: "Legal", ja: "法務" } },
        { value: "other", label: { en: "Other", ja: "その他" } },
      ],
    },
    employmentType: {
      label: { en: "Employment Type", ja: "雇用形態" },
      placeholder: { en: "Select employment type", ja: "雇用形態を選択" },
      options: [
        { value: "permanent", label: { en: "Permanent", ja: "正社員" } },
        { value: "contract", label: { en: "Contract", ja: "契約社員" } },
        { value: "temporary", label: { en: "Temporary", ja: "派遣社員" } },
        { value: "part_time", label: { en: "Part-time", ja: "パートタイム" } },
        { value: "internship", label: { en: "Internship", ja: "インターン" } },
      ],
    },
    numberOfPositions: {
      label: { en: "Number of Positions", ja: "募集人数" },
      placeholder: { en: "Enter number", ja: "人数を入力" },
    },
    workLocation: {
      label: { en: "Work Location", ja: "勤務地" },
      placeholder: { en: "e.g., Tokyo, Japan", ja: "例：東京都" },
    },
    jobDescription: {
      label: { en: "Job Description", ja: "仕事内容" },
      placeholder: {
        en: "Describe the role and responsibilities",
        ja: "役割と責任を説明してください",
      },
    },
    jobRequirements: {
      label: { en: "Requirements", ja: "応募要件" },
      placeholder: {
        en: "List required skills and qualifications",
        ja: "必要なスキルと資格を記載",
      },
    },
    japaneseLevel: {
      label: { en: "Japanese Level Required", ja: "日本語レベル" },
      placeholder: { en: "Select Japanese level", ja: "日本語レベルを選択" },
      options: [
        { value: "native", label: { en: "Native", ja: "ネイティブ" } },
        {
          value: "business_fluent",
          label: { en: "Business Fluent", ja: "ビジネス流暢" },
        },
        {
          value: "conversational",
          label: { en: "Conversational", ja: "日常会話" },
        },
        { value: "basic", label: { en: "Basic", ja: "初級" } },
        { value: "not_required", label: { en: "Not Required", ja: "不要" } },
      ],
    },
    visaType: {
      label: { en: "Visa Type Required", ja: "必要なビザ" },
      placeholder: {
        en: "e.g., Engineer/Specialist in Humanities",
        ja: "例：技術・人文知識・国際業務",
      },
    },
    salaryType: {
      label: { en: "Salary Type", ja: "給与タイプ" },
      placeholder: { en: "Select type", ja: "タイプを選択" },
      options: [
        { value: "monthly", label: { en: "Monthly", ja: "月給" } },
        { value: "yearly", label: { en: "Yearly", ja: "年収" } },
        { value: "hourly", label: { en: "Hourly", ja: "時給" } },
        { value: "daily", label: { en: "Daily", ja: "日給" } },
      ],
    },
    salaryAmount: {
      label: { en: "Salary Amount", ja: "給与額" },
      placeholder: { en: "Enter salary amount", ja: "給与額を入力" },
    },
    workingHours: {
      label: { en: "Working Hours", ja: "勤務時間" },
      placeholder: { en: "e.g., 9:00 - 18:00", ja: "例：9:00 - 18:00" },
    },
    daysOff: {
      label: { en: "Days Off", ja: "休日" },
      placeholder: {
        en: "e.g., Weekends and public holidays",
        ja: "例：週末・祝日",
      },
    },
    startDate: {
      label: { en: "Start Date", ja: "開始日" },
      placeholder: { en: "Select start date", ja: "開始日を選択" },
    },
    submit: { en: "Submit Request", ja: "依頼を提出" },
    submitting: { en: "Submitting...", ja: "提出中..." },
    reset: { en: "Reset", ja: "リセット" },
    successMessage: {
      en: "Placement request submitted successfully!",
      ja: "採用依頼が正常に提出されました！",
    },
    errorMessage: {
      en: "Failed to submit placement request",
      ja: "採用依頼の提出に失敗しました",
    },
    privacyNote: {
      en: "All information will be handled confidentially.",
      ja: "すべての情報は機密情報として取り扱われます。",
    },
    requiredFields: {
      en: "Required fields must be filled",
      ja: "必須項目を入力してください",
    },
  },
};
