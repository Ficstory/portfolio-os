"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { projects as sourceProjects } from "@/data/projects";
import {
  getTrackProjects,
  resolvePortfolioTrack,
  type PortfolioTrack,
  type PortfolioTrackId,
} from "@/lib/portfolioTrack";
import type { Profile } from "@/data/profile";
import type { Project } from "@/types/portfolio";

type PortfolioTrackContextValue = {
  track: PortfolioTrack;
  profile: Profile;
  projects: Project[];
};

const PortfolioTrackContext =
  createContext<PortfolioTrackContextValue | null>(null);

type PortfolioTrackProviderProps = {
  children: ReactNode;
  trackId?: PortfolioTrackId;
};

export function PortfolioTrackProvider({
  children,
  trackId,
}: PortfolioTrackProviderProps) {
  const value = useMemo(() => {
    const track = resolvePortfolioTrack(trackId);

    return {
      track,
      profile: track.profile,
      projects: getTrackProjects(sourceProjects, track.id),
    };
  }, [trackId]);

  return (
    <PortfolioTrackContext.Provider value={value}>
      {children}
    </PortfolioTrackContext.Provider>
  );
}

export function usePortfolioTrack() {
  const context = useContext(PortfolioTrackContext);

  if (!context) {
    throw new Error(
      "usePortfolioTrack must be used inside PortfolioTrackProvider.",
    );
  }

  return context;
}
