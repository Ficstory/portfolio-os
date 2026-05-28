import { BookOpenText, Code2, ExternalLink, Mail } from "lucide-react";

import { externalLinkSlots } from "@/data/navigation";
import { externalLinks } from "@/data/links";
import type { ExternalLinkType } from "@/types/portfolio";

const linkDescriptions: Record<ExternalLinkType, string> = {
  github: "코드와 프로젝트 작업 기록",
  blog: "개발 기록과 회고",
  email: "직접 연락",
};

const icons = {
  github: Code2,
  blog: BookOpenText,
  email: Mail,
} satisfies Record<ExternalLinkType, typeof Code2>;

function isUsableHref(href: string | undefined) {
  return Boolean(href && href !== "mailto:");
}

export function ContactWindow() {
  return (
    <section className="space-y-5" aria-labelledby="contact-window-heading">
      <div className="space-y-2">
        <h3
          id="contact-window-heading"
          className="text-xl font-bold text-slate-950 dark:text-white"
        >
          Contact
        </h3>
        <p className="max-w-2xl text-sm leading-6 text-muted">
          서버 저장형 연락처 폼 대신 외부 프로필과 이메일 링크만 제공합니다.
        </p>
      </div>

      <div className="grid gap-3">
        {externalLinkSlots.map((slot) => {
          const Icon = icons[slot.type];
          const href = externalLinks[slot.type];
          const hasHref = isUsableHref(href);
          const isExternal = href?.startsWith("http") ?? false;

          return (
            <article
              className="flex items-center gap-4 rounded-lg border border-slate-200/80 bg-white/56 p-4 dark:border-white/12 dark:bg-slate-950/28"
              key={slot.type}
            >
              <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#dcebff] text-slate-800 dark:bg-white/10 dark:text-slate-100">
                <Icon aria-hidden="true" size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-950 dark:text-white">
                  {slot.label}
                </h4>
                <p className="mt-1 text-sm text-muted">
                  {linkDescriptions[slot.type]}
                </p>
              </div>

              {hasHref ? (
                <a
                  className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-slate-200/80 bg-white/70 px-3 py-2 text-sm font-bold text-slate-800 transition hover:bg-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4f8fd9] dark:border-white/12 dark:bg-white/8 dark:text-slate-100 dark:hover:bg-white/14"
                  href={href}
                  rel={isExternal ? "noreferrer" : undefined}
                  target={isExternal ? "_blank" : undefined}
                >
                  열기
                  {isExternal ? <ExternalLink aria-hidden="true" size={15} /> : null}
                </a>
              ) : (
                <span className="shrink-0 rounded-md border border-slate-200/80 px-3 py-2 text-sm font-bold text-muted dark:border-white/12">
                  업데이트 예정
                </span>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
