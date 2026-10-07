import Link from "next/link";

import type { PublicVacancy } from "@/lib/publicVacancies";

type Language = "ja" | "en";

const copy = {
  ja: {
    eyebrow: "VISION CAREER 求人情報",
    listingTitle: "日本で新しいキャリアを見つける",
    listingDescription:
      "公開中の求人情報を確認し、仕事内容、勤務地、応募条件を比較できます。",
    openings: "公開中の求人",
    empty: "現在公開中の求人はありません。新しい求人をお待ちください。",
    unavailable:
      "求人情報を一時的に読み込めません。時間をおいて再度お試しください。",
    viewJob: "求人詳細を見る",
    back: "求人一覧へ戻る",
    company: "企業",
    location: "勤務地",
    employment: "雇用形態",
    salary: "給与",
    openingsCount: "募集人数",
    deadline: "応募期限",
    details: "仕事内容",
    responsibilities: "業務内容",
    requirements: "応募条件",
    experience: "必要な経験",
    education: "学歴",
    japanese: "日本語レベル",
    hours: "勤務時間",
    holidays: "休日・休暇",
    benefits: "福利厚生",
    insurance: "保険",
    apply: "この求人に応募する",
    signIn: "求職者アカウントでログインして応募できます。",
    jobs: "件",
    salaryUndisclosed: "詳細は求人内容をご確認ください",
    date: (value: string) => new Date(value).toLocaleDateString("ja-JP"),
  },
  en: {
    eyebrow: "VISION CAREER JOBS",
    listingTitle: "Find your next career in Japan",
    listingDescription:
      "Explore current openings and compare responsibilities, locations, and requirements.",
    openings: "Current openings",
    empty: "There are no public openings right now. Please check back soon.",
    unavailable:
      "Job listings are temporarily unavailable. Please try again later.",
    viewJob: "View job details",
    back: "Back to all jobs",
    company: "Employer",
    location: "Location",
    employment: "Employment type",
    salary: "Compensation",
    openingsCount: "Open positions",
    deadline: "Application deadline",
    details: "About the role",
    responsibilities: "Responsibilities",
    requirements: "Requirements",
    experience: "Experience",
    education: "Education",
    japanese: "Japanese level",
    hours: "Working hours",
    holidays: "Holidays",
    benefits: "Benefits",
    insurance: "Insurance",
    apply: "Apply for this job",
    signIn: "Sign in to your job seeker account to apply.",
    jobs: "jobs",
    salaryUndisclosed: "See the job description for compensation details",
    date: (value: string) => new Date(value).toLocaleDateString("en-US"),
  },
} satisfies Record<
  string,
  Record<string, string | ((value: string) => string)>
>;

function formatSalary(vacancy: PublicVacancy, language: Language) {
  if (vacancy.salaryNote) return vacancy.salaryNote;

  const formatter = new Intl.NumberFormat(
    language === "ja" ? "ja-JP" : "en-US",
    {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    },
  );

  if (vacancy.salaryMin != null && vacancy.salaryMax != null) {
    return `${formatter.format(vacancy.salaryMin)} - ${formatter.format(vacancy.salaryMax)}`;
  }

  if (vacancy.salaryMin != null) return formatter.format(vacancy.salaryMin);
  if (vacancy.salaryMax != null) return formatter.format(vacancy.salaryMax);
  return copy[language].salaryUndisclosed;
}

function JobCard({
  vacancy,
  language,
}: {
  vacancy: PublicVacancy;
  language: Language;
}) {
  const text = copy[language];
  const href = `${language === "en" ? "/en" : ""}/jobs/${encodeURIComponent(vacancy.vacancyId)}`;

  return (
    <article className="flex h-full flex-col border-b border-slate-200 py-6 first:pt-0 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-8">
      <div>
        <h2 className="text-xl font-semibold leading-snug text-slate-950">
          <Link
            className="underline decoration-transparent underline-offset-4 hover:text-emerald-800 hover:decoration-emerald-700"
            href={href}
          >
            {vacancy.title}
          </Link>
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-700">
          {vacancy.companyName}
        </p>
        <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm leading-6 text-slate-600">
          {vacancy.jobDescription}
        </p>
        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
          <div>
            <dt className="sr-only">{text.location}</dt>
            <dd>{vacancy.workLocation}</dd>
          </div>
          <div>
            <dt className="sr-only">{text.employment}</dt>
            <dd>{vacancy.employmentType}</dd>
          </div>
          <div>
            <dt className="sr-only">{text.salary}</dt>
            <dd>{formatSalary(vacancy, language)}</dd>
          </div>
        </dl>
      </div>
      <Link
        className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md border border-emerald-800 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 sm:mt-0"
        href={href}
      >
        {text.viewJob}
      </Link>
    </article>
  );
}

export function PublicJobList({
  vacancies,
  language,
}: {
  vacancies: PublicVacancy[] | null;
  language: Language;
}) {
  const text = copy[language];

  return (
    <section className="bg-white text-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
        <header className="max-w-3xl border-l-4 border-emerald-700 pl-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">
            {text.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            {text.listingTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            {text.listingDescription}
          </p>
        </header>

        <div className="mt-10">
          <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-slate-300 pb-3">
            <h2 className="text-lg font-semibold">{text.openings}</h2>
            {vacancies && (
              <p className="text-sm text-slate-600">
                {vacancies.length} {text.jobs}
              </p>
            )}
          </div>
          {vacancies === null ? (
            <p className="py-8 text-sm leading-6 text-slate-600" role="status">
              {text.unavailable}
            </p>
          ) : vacancies.length ? (
            vacancies.map((vacancy) => (
              <JobCard
                key={vacancy.vacancyId}
                vacancy={vacancy}
                language={language}
              />
            ))
          ) : (
            <p className="py-8 text-sm leading-6 text-slate-600">
              {text.empty}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function toEmploymentType(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes("full")) return "FULL_TIME";
  if (normalized.includes("part")) return "PART_TIME";
  if (normalized.includes("contract")) return "CONTRACTOR";
  if (normalized.includes("temporary") || normalized.includes("temp"))
    return "TEMPORARY";
  if (normalized.includes("intern")) return "INTERN";
  return undefined;
}

function getJobPosting(vacancy: PublicVacancy, language: Language) {
  const datePosted = vacancy.createdAt ? new Date(vacancy.createdAt) : null;
  const deadline = vacancy.applicationDeadline
    ? new Date(vacancy.applicationDeadline)
    : null;

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    url: `https://www.vision-career.co.jp${language === "en" ? "/en" : ""}/jobs/${encodeURIComponent(vacancy.vacancyId)}/`,
    title: vacancy.title,
    description: [
      vacancy.jobDescription,
      vacancy.responsibilities,
      vacancy.requiredSkills,
    ]
      .filter(Boolean)
      .join("\n\n"),
    identifier: {
      "@type": "PropertyValue",
      name: "Vision Career",
      value: vacancy.vacancyId,
    },
    ...(datePosted && !Number.isNaN(datePosted.valueOf())
      ? { datePosted: datePosted.toISOString() }
      : {}),
    ...(deadline && !Number.isNaN(deadline.valueOf())
      ? { validThrough: deadline.toISOString() }
      : {}),
    ...(toEmploymentType(vacancy.employmentType)
      ? { employmentType: toEmploymentType(vacancy.employmentType) }
      : {}),
    hiringOrganization: {
      "@type": "Organization",
      name: vacancy.companyName,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: vacancy.workLocation,
        addressCountry: "JP",
      },
    },
    inLanguage: language === "ja" ? "ja-JP" : "en",
  };
}

function TextSection({
  title,
  content,
}: {
  title: string;
  content?: string | null;
}) {
  if (!content) return null;

  return (
    <section className="border-t border-slate-200 py-5">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">
        {content}
      </p>
    </section>
  );
}

export function PublicJobDetail({
  vacancy,
  language,
}: {
  vacancy: PublicVacancy;
  language: Language;
}) {
  const text = copy[language];
  const authHref =
    language === "en" ? "/en/job-seekers-auth" : "/job-seekers-auth";
  const details = [
    [text.location, vacancy.workLocation],
    [text.employment, vacancy.employmentType],
    [text.salary, formatSalary(vacancy, language)],
    [text.openingsCount, `${vacancy.numberOfPeople}`],
    [
      text.deadline,
      vacancy.applicationDeadline
        ? text.date(vacancy.applicationDeadline)
        : null,
    ],
    [text.japanese, vacancy.japaneseLevel],
    [text.hours, vacancy.workHours],
    [text.holidays, vacancy.holidays],
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <article className="bg-white text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(getJobPosting(vacancy, language)),
        }}
      />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
        <Link
          className="text-sm font-medium text-emerald-800 underline underline-offset-4"
          href={language === "en" ? "/en/jobs" : "/jobs"}
        >
          {text.back}
        </Link>
        <header className="mt-7 border-b border-slate-300 pb-7">
          <p className="text-sm font-medium text-emerald-800">
            {vacancy.companyName}
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
            {vacancy.title}
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            {vacancy.workLocation} · {vacancy.employmentType}
          </p>
          <Link
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900"
            href={authHref}
          >
            {text.apply}
          </Link>
          <p className="mt-2 text-xs text-slate-500">{text.signIn}</p>
        </header>

        <dl className="grid gap-x-8 gap-y-5 py-6 sm:grid-cols-2 lg:grid-cols-3">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold uppercase text-slate-500">
                {label}
              </dt>
              <dd className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-800">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <TextSection title={text.details} content={vacancy.jobDescription} />
        <TextSection
          title={text.responsibilities}
          content={vacancy.responsibilities}
        />
        <TextSection
          title={text.requirements}
          content={vacancy.requiredSkills}
        />
        <TextSection
          title={text.experience}
          content={vacancy.requiredExperience}
        />
        <TextSection
          title={text.education}
          content={vacancy.requiredEducation}
        />
        <TextSection
          title={text.benefits}
          content={vacancy.benefits?.join("、")}
        />
        <TextSection
          title={text.insurance}
          content={vacancy.insurance?.join("、")}
        />
      </div>
    </article>
  );
}
