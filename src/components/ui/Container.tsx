import type { ReactNode } from "react";

/** Shared horizontal rhythm: wide shell on desktop, minimal gutters on phones / tablets */
const shell =
  "relative mx-auto w-full max-w-[min(100%,90rem)] px-3 sm:px-5 md:px-7 lg:px-9 xl:px-10 2xl:px-12";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${shell} ${className}`}>{children}</div>;
}
