import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { selectedProjects } from "@/components/pm-improved/content";
import { PmAekkimCase } from "@/components/pm-improved/PmAekkimCase";
import { PmPlayPickCase } from "@/components/pm-improved/PmPlayPickCase";
import { PmSupportingCase } from "@/components/pm-improved/PmSupportingCase";
import { baseUrl } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return selectedProjects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = selectedProjects.find((item) => item.slug === slug);
  if (!project) return {};

  const title = `${project.name} — ${project.serviceType} | 이재호 PM 포트폴리오`;
  const description = `${project.headline}. ${project.subtitle} ${project.role} 담당.`;
  const url = new URL(`/PM/${slug}/`, baseUrl).toString();

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      images: [],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [],
    },
  };
}

export default async function PmProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = selectedProjects.find((item) => item.slug === slug);
  if (!project) notFound();

  if (slug === "aekkim") return <PmAekkimCase />;
  if (slug === "play-pick") return <PmPlayPickCase project={project} />;
  return <PmSupportingCase project={project} />;
}
