"use client";
import useLenis from "@/hook/useLenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ClientWrapper({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  useLenis();

  const pathname = usePathname();
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
}
