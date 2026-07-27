import type { ReactNode } from "react";

interface RolePillProps {
  children: ReactNode;
}

export function RolePill({ children }: RolePillProps) {
  return <span className="role-pill">{children}</span>;
}
