import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { selectedProjects } from "@/components/tracks/pm/editorial/content";
import { PmAekkimCase } from "@/components/tracks/pm/editorial/PmAekkimCase";
import { PmSupportingCase } from "@/components/tracks/pm/editorial/PmSupportingCase";
import { baseUrl } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return selectedProjects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = selectedProjects.find((item) => item.slug === slug);
  if (!project) return {};
  const title = `${project.name} | 이재호 PM 포트폴리오`;
  return { title: { absolute: title }, description: project.summary, alternates: { canonical: new URL(`/pm/${slug}/`, baseUrl).toString() }, openGraph: { title, description: project.summary, type: "article", url: new URL(`/pm/${slug}/`, baseUrl).toString(), images: [] }, twitter: { card: "summary", title, description: project.summary, images: [] } };
}
export default async function PmProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = selectedProjects.find((item) => item.slug === slug);
  if (!project) notFound();
  return slug === "aekkim" ? <PmAekkimCase /> : <PmSupportingCase project={project} />;
}
