import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicJobDetail } from "@/components/public-jobs/PublicJobs";
import {
  getPublicVacancyById,
  getVacancyDescription,
} from "@/lib/publicVacancies";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ vacancyId: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { vacancyId } = await params;
  const vacancy = await getPublicVacancyById(vacancyId);

  if (!vacancy) {
    return {
      title: "Job not found",
      robots: { index: false, follow: false },
    };
  }

  const pathname = `/en/jobs/${encodeURIComponent(vacancy.vacancyId)}/`;
  const alternatePath = pathname.replace(/^\/en/, "");
  const description = getVacancyDescription(vacancy);

  return {
    title: `${vacancy.title} - ${vacancy.companyName}`,
    description,
    alternates: {
      canonical: pathname,
      languages: {
        "ja-JP": alternatePath,
        "en-US": pathname,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      title: `${vacancy.title} | Vision Career`,
      description,
      url: pathname,
    },
    twitter: {
      card: "summary",
      title: `${vacancy.title} | Vision Career`,
      description,
    },
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { vacancyId } = await params;
  const vacancy = await getPublicVacancyById(vacancyId);

  if (!vacancy) notFound();

  return <PublicJobDetail vacancy={vacancy} language="en" />;
}
