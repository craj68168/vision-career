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
      title: "求人が見つかりません",
      robots: { index: false, follow: false },
    };
  }

  const pathname = `/jobs/${encodeURIComponent(vacancy.vacancyId)}/`;
  const alternatePath = `/en${pathname}`;
  const description = getVacancyDescription(vacancy);

  return {
    title: `${vacancy.title} - ${vacancy.companyName}`,
    description,
    alternates: {
      canonical: pathname,
      languages: {
        "ja-JP": pathname,
        "en-US": alternatePath,
      },
    },
    openGraph: {
      type: "website",
      locale: "ja_JP",
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

  return <PublicJobDetail vacancy={vacancy} language="ja" />;
}
