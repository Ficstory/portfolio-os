import type { Metadata } from "next";

import { baseUrl, ogImage, siteDescription, siteName } from "@/lib/seo";

import "./globals.css";

const metadataTitle = `${siteName} | 공공·디지털 서비스 기획 포트폴리오`;
const initialClockScript = `
(function syncInitialPortfolioClock() {
  try {
    var wallpapers = {
      dawn: "/images/wallpapers/dawn.webp",
      day: "/images/wallpapers/day.webp",
      evening: "/images/wallpapers/evening.webp",
      night: "/images/wallpapers/night.webp"
    };
    var now = new Date();

    function getTimeOfDay(hour) {
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

    function getThemeModeForTimeOfDay(timeOfDay) {
      return timeOfDay === "day" ? "light" : "dark";
    }

    var timeOfDay = getTimeOfDay(now.getHours());
    var root = document.querySelector("[data-portfolio-root]");
    var wallpaperLayer = document.querySelector("[data-wallpaper-layer]");
    var formattedTime = new Intl.DateTimeFormat("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(now);
    var formattedDate = new Intl.DateTimeFormat("ko-KR", {
      month: "long",
      day: "numeric",
      weekday: "long"
    }).format(now);

    if (root) {
      root.setAttribute("data-time-theme", timeOfDay);
      root.setAttribute("data-theme", getThemeModeForTimeOfDay(timeOfDay));
    }

    if (wallpaperLayer) {
      wallpaperLayer.style.backgroundImage = "url(" + wallpapers[timeOfDay] + ")";
    }

    document.querySelectorAll('[data-live-clock="time"]').forEach(function (node) {
      node.textContent = formattedTime;

      if (node.tagName === "TIME") {
        node.setAttribute("datetime", now.toISOString());
      }
    });

    document.querySelectorAll('[data-live-clock="date"]').forEach(function (node) {
      node.textContent = formattedDate;
    });
  } catch (error) {
  }
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: metadataTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  openGraph: {
    title: metadataTitle,
    description: siteDescription,
    url: baseUrl,
    siteName,
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Portfolio OS 공유 이미지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: metadataTitle,
    description: siteDescription,
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{ __html: initialClockScript }}
          id="initial-portfolio-clock-sync"
        />
      </body>
    </html>
  );
}
