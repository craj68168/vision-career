import type { MetadataRoute } from "next";
import { connection } from "next/server";

import { getPublicVacancies } from "@/lib/publicVacancies";

const SITE_URL = "https://www.vision-career.co.jp";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();

  const basePages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/jobs/`,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          "ja-JP": `${SITE_URL}/jobs/`,
          "en-US": `${SITE_URL}/en/jobs/`,
        },
      },
    },
    {
      url: `${SITE_URL}/en/jobs/`,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          "ja-JP": `${SITE_URL}/jobs/`,
          "en-US": `${SITE_URL}/en/jobs/`,
        },
      },
    },
  ];

  try {
    const vacancies = await getPublicVacancies();

    if (!vacancies) {
      return basePages;
    }

    return [
      ...basePages,
      ...vacancies.flatMap((vacancy) => {
        const japaneseUrl = `${SITE_URL}/jobs/${encodeURIComponent(vacancy.vacancyId)}/`;
        const englishUrl = `${SITE_URL}/en/jobs/${encodeURIComponent(vacancy.vacancyId)}/`;
        const alternates = {
          languages: { "ja-JP": japaneseUrl, "en-US": englishUrl },
        };
        const parsedDate = vacancy.createdAt
          ? new Date(vacancy.createdAt)
          : null;
        const lastModified =
          parsedDate && !Number.isNaN(parsedDate.valueOf())
            ? parsedDate
            : undefined;

        return [
          {
            url: japaneseUrl,
            lastModified,
            changeFrequency: "weekly" as const,
            priority: 0.8,
            alternates,
          },
          {
            url: englishUrl,
            lastModified,
            changeFrequency: "weekly" as const,
            priority: 0.8,
            alternates,
          },
        ];
      }),
    ];
  } catch {
    return basePages;
  }
}
