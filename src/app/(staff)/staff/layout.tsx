import type { ReactNode } from "react";

import StaffRouteGuard from "@/components/staff/StaffRouteGuard";
import StaffShell from "@/components/staff/StaffShell";

type Props = {
  children: ReactNode;
};

export default function StaffLayout({ children }: Props) {
  return (
    <StaffRouteGuard>
      <StaffShell>{children}</StaffShell>
    </StaffRouteGuard>
  );
}
