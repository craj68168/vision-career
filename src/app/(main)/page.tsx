import type { Metadata } from "next";

import ClientPage from "@/components/client-page/body";

export const metadata: Metadata = {
  title: "Provider Dashboard",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ClientPage />;
}
