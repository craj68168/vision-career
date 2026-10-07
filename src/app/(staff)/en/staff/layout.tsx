import type { ReactNode } from "react";

import StaffRouteGuard from "@/components/staff/StaffRouteGuard";
import StaffPageControls from "@/components/staff/StaffPageControls";

type Props = {
  children: ReactNode;
};

export default function StaffEnglishLayout({ children }: Props) {
  return (
    <StaffRouteGuard>
      <StaffPageControls />

      {children}
    </StaffRouteGuard>
  );
}
