"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type HardNavigationLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function HardNavigationLink({ href, ...props }: HardNavigationLinkProps) {
  const pathname = usePathname();

  if (pathname === "/kantei/pay") {
    return <a href={href} {...props} />;
  }

  return <Link href={href} {...props} />;
}
