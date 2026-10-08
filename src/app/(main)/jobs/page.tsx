import type { Metadata } from "next";
import { connection } from "next/server";

import { PublicJobList } from "@/components/public-jobs/PublicJobs";
import { getPublicVacancies } from "@/lib/publicVacancies";

export const metadata: Metadata = {
  title: "日本の求人一覧",
  description:
    "ビジョンキャリアで日本の公開求人を検索。仕事内容、勤務地、雇用形態を確認して、自分に合う仕事を見つけましょう。",
  alternates: {
    canonical: "/jobs/",
    languages: {
      "ja-JP": "/jobs/",
      "en-US": "/en/jobs/",
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    title: "日本の求人一覧 | Vision Career",
    description: "日本で募集中の求人情報を確認できます。",
    url: "/jobs/",
  },
};

export default async function JobsPage() {
  await connection();
  const vacancies = await getPublicVacancies();

  return <PublicJobList vacancies={vacancies} language="ja" />;
}
