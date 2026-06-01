export type TimeOfDay = "dawn" | "day" | "evening" | "night";
export type AppearanceMode = "auto" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

const WALLPAPER_BY_TIME_OF_DAY: Record<TimeOfDay, string> = {
  dawn: "/images/wallpapers/dawn.png",
  day: "/images/wallpapers/day.png",
  evening: "/images/wallpapers/evening.png",
  night: "/images/wallpapers/night.png",
};

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 4 && hour < 9) {
    return "dawn";
  }

  if (hour >= 9 && hour < 17) {
    return "day";
  }

  if (hour >= 17 && hour < 21) {
    return "evening";
  }

  return "night";
}

export function getWallpaperForTimeOfDay(timeOfDay: TimeOfDay): string {
  return WALLPAPER_BY_TIME_OF_DAY[timeOfDay];
}

export function getThemeModeForTimeOfDay(timeOfDay: TimeOfDay): ResolvedTheme {
  return timeOfDay === "day" ? "light" : "dark";
}

export function resolveAppearanceMode(
  appearanceMode: AppearanceMode,
  timeOfDay: TimeOfDay,
): ResolvedTheme {
  if (appearanceMode === "auto") {
    return getThemeModeForTimeOfDay(timeOfDay);
  }

  return appearanceMode;
}
