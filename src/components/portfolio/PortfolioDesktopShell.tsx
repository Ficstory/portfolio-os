"use client";

import { DesktopShell } from "@/components/desktop/DesktopShell";
import { PortfolioTrackProvider } from "@/components/portfolio/PortfolioTrackProvider";
import type { ResolvedTheme } from "@/lib/timeTheme";

type PortfolioDesktopShellProps = {
  isVisible?: boolean;
  now: Date;
  resolvedTheme: ResolvedTheme;
};

export function PortfolioDesktopShell({
  isVisible = true,
  now,
  resolvedTheme,
}: PortfolioDesktopShellProps) {
  return (
    <PortfolioTrackProvider trackId="default">
      <DesktopShell isVisible={isVisible} now={now} resolvedTheme={resolvedTheme} />
    </PortfolioTrackProvider>
  );
}
