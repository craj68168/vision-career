import type { MetadataRoute } from "next";

import { SEO_INDEXING_ENABLED, SITE_URL } from "@/lib/siteConfig";

import { getPublicVacancies } from "@/lib/publicVacancies";

// ======================================================
// SITEMAP
// ======================================================

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ====================================================
  // STAGING / LOCAL
  //
  // No sitemap entries should be advertised.
  // ====================================================

  if (!SEO_INDEXING_ENABLED) {
    return [];
  }

  // ====================================================
  // BASE PUBLIC JOB PAGES
  // ====================================================

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

  // ====================================================
  // PUBLIC VACANCIES
  // ====================================================

  try {
    const vacancies = await getPublicVacancies();

    if (!vacancies) {
      return basePages;
    }

    const vacancyPages: MetadataRoute.Sitemap = vacancies.flatMap((vacancy) => {
      const encodedVacancyId = encodeURIComponent(vacancy.vacancyId);

      const japaneseUrl = `${SITE_URL}/jobs/${encodedVacancyId}/`;

      const englishUrl = `${SITE_URL}/en/jobs/${encodedVacancyId}/`;

      const alternates = {
        languages: {
          "ja-JP": japaneseUrl,

          "en-US": englishUrl,
        },
      };

      const modifiedValue = vacancy.updatedAt || vacancy.createdAt;

      const parsedDate = modifiedValue ? new Date(modifiedValue) : null;

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
    });

    return [...basePages, ...vacancyPages];
  } catch (error) {
    console.error("SITEMAP PUBLIC VACANCY ERROR:", error);

    return basePages;
  }
}
