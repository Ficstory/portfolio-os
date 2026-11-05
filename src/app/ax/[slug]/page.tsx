import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AxEditorialCase } from "@/components/ax/AxEditorialCase";
import { AxEditorialShell } from "@/components/ax/AxEditorialShell";
import { axProjects } from "@/components/ax/axEditorialContent";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return axProjects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = axProjects.find(item => item.slug === slug);
  return project ? { title: { absolute: `${project.name} | 이재호 AX 포트폴리오` }, description: project.summary } : {};
}
export default async function AxCasePage({ params }: Props) {
  const { slug } = await params;
  const project = axProjects.find(item => item.slug === slug);
  if (!project) notFound();
  return <AxEditorialShell><AxEditorialCase slug={project.slug} /></AxEditorialShell>;
}
