import "server-only";

// ======================================================
// PUBLIC VACANCY
// ======================================================

export type PublicVacancy = {
  vacancyId: string;

  companyName: string;

  title: string;

  employmentType: string;

  numberOfPeople: number;

  jobDescription: string;

  responsibilities?: string | null;

  requiredSkills?: string | null;

  preferredSkills?: string | null;

  requiredEducation?: string | null;

  requiredExperience?: string | null;

  japaneseLevel?: string | null;

  workLocation: string;

  remoteWork?: string | null;

  salaryMin?: number | null;

  salaryMax?: number | null;

  salaryNote?: string | null;

  workHours?: string | null;

  holidays?: string | null;

  benefits?: string[];

  insurance?: string[];

  applicationDeadline?: string | null;

  createdAt?: string | null;

  updatedAt?: string | null;
};

// ======================================================
// API RESPONSE
// ======================================================

type VacancyResponse = {
  status: "success" | "error";

  data?: PublicVacancy[] | PublicVacancy;

  message?: string;
};

// ======================================================
// INTERNAL API URL
//
// Server Components should preferably contact the
// backend directly rather than routing back through the
// public frontend/domain.
//
// Local:
// INTERNAL_API_URL=http://localhost:5000/api
//
// Staging/production when frontend/backend share server:
// INTERNAL_API_URL=http://127.0.0.1:5000/api
// ======================================================

const API_BASE_URL = (
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

// ======================================================
// FETCH OPTIONS
// ======================================================

const isDevelopment = process.env.NODE_ENV === "development";

const fetchOptions: RequestInit & {
  next?: {
    revalidate: number;
  };
  cache?: RequestCache;
} = isDevelopment
  ? {
      cache: "no-store",
    }
  : {
      next: {
        revalidate: 60,
      },
    };

// ======================================================
// GET PUBLIC VACANCIES
// ======================================================

export async function getPublicVacancies(): Promise<PublicVacancy[] | null> {
  try {
    const url = `${API_BASE_URL}/providers/vacancies/public`;

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`Could not load public vacancies (${response.status})`);
    }

    const result = (await response.json()) as VacancyResponse;

    if (result.status !== "success" || !Array.isArray(result.data)) {
      throw new Error("The public vacancies response was invalid");
    }

    return result.data;
  } catch (error) {
    console.error("Unable to load public vacancies:", error);

    return null;
  }
}

// ======================================================
// GET ONE PUBLIC VACANCY
// ======================================================

export async function getPublicVacancyById(
  vacancyId: string,
): Promise<PublicVacancy | null> {
  const encodedVacancyId = encodeURIComponent(vacancyId);

  const url = `${API_BASE_URL}/providers/vacancies/public/${encodedVacancyId}`;

  const response = await fetch(url, fetchOptions);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Could not load public vacancy (${response.status})`);
  }

  const result = (await response.json()) as VacancyResponse;

  if (
    result.status !== "success" ||
    !result.data ||
    Array.isArray(result.data)
  ) {
    throw new Error("The public vacancy response was invalid");
  }

  return result.data;
}

// ======================================================
// META DESCRIPTION
// ======================================================

export function getVacancyDescription(vacancy: PublicVacancy): string {
  const description = [
    vacancy.jobDescription,

    vacancy.responsibilities,

    vacancy.requiredSkills,
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (description.length <= 160) {
    return description;
  }

  return `${description.slice(0, 157).trim()}...`;
}
