import AuthenticationProvider from "@/components/staff-training/AuthenticationProvider";
import TrainingTopicsClient from "@/components/staff-training/topics";

interface TopicPageProps {
  params: Promise<{
    id: string;
  }>;
}

type CategoryIdsResponse = {
  success: boolean;
  data: {
    id: string;
  }[];
};

export const generateStaticParams = async () => {
  try {
    const res = await fetch(
      "https://vision-career.co.jp/public-training-category-ids.php",
      {
        cache: "no-store",
      },
    );

    const data: CategoryIdsResponse = await res.json();

    if (!res.ok || !data.success) {
      return [];
    }

    return data.data.map((category) => ({
      id: category.id,
    }));
  } catch {
    return [];
  }
};

export default async function TopicPage({ params }: TopicPageProps) {
  const { id } = await params;

  return (
    <AuthenticationProvider>
      <TrainingTopicsClient categoryId={id} />
    </AuthenticationProvider>
  );
}
