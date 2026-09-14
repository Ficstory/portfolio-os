import { NextRequest, NextResponse } from "next/server";
import { selectedProjects } from "./components/pm-improved/content";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/PM" || pathname.startsWith("/PM/")) {
    const slug = pathname.slice(4).replace(/\/$/, "");
    // Validate before filesystem lookup: Windows can otherwise serve an SSG
    // file for a differently cased slug even with dynamicParams disabled.
    if (slug && !selectedProjects.some((project) => project.slug === slug)) {
      return new NextResponse("Not Found", { status: 404 });
    }
    const destination = request.nextUrl.clone();
    destination.pathname = `/pm-improved${pathname.slice(3)}`;
    return NextResponse.rewrite(destination);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/PM/:path*"],
};
