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
};

type VacancyResponse = {
  status: "success" | "error";
  data?: PublicVacancy[] | PublicVacancy;
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const fetchOptions = {
  next: { revalidate: 300 },
};

export async function getPublicVacancies(): Promise<PublicVacancy[] | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/providers/vacancies/public`,
      fetchOptions,
    );

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

export async function getPublicVacancyById(
  vacancyId: string,
): Promise<PublicVacancy | null> {
  const response = await fetch(
    `${API_BASE_URL}/providers/vacancies/public/${encodeURIComponent(vacancyId)}`,
    fetchOptions,
  );

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

export function getVacancyDescription(vacancy: PublicVacancy): string {
  return [
    vacancy.jobDescription,
    vacancy.responsibilities,
    vacancy.requiredSkills,
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .slice(0, 160);
}
