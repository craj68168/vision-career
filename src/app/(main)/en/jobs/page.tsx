import type { Metadata } from "next";
import { connection } from "next/server";

import { PublicJobList } from "@/components/public-jobs/PublicJobs";
import { getPublicVacancies } from "@/lib/publicVacancies";

export const metadata: Metadata = {
  title: "Jobs in Japan",
  description:
    "Explore current job openings in Japan with Vision Career. Compare responsibilities, locations, and employment types to find your next role.",
  alternates: {
    canonical: "/en/jobs/",
    languages: {
      "ja-JP": "/jobs/",
      "en-US": "/en/jobs/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Jobs in Japan | Vision Career",
    description: "Explore current job openings in Japan.",
    url: "/en/jobs/",
  },
};

export default async function JobsPage() {
  await connection();
  const vacancies = await getPublicVacancies();

  return <PublicJobList vacancies={vacancies} language="en" />;
}
