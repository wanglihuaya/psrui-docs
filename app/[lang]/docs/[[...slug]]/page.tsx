import { DocsPageContent } from "@/components/docs-page-content";
import { i18n } from "@/lib/i18n";
import { getDocsUrl, isSupportedLanguage } from "@/lib/shared";
import { getPageImage, source } from "@/lib/source";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const { lang, slug } = await params;

  if (!isSupportedLanguage(lang)) notFound();
  if (lang === i18n.defaultLanguage) redirect(getDocsUrl(undefined, slug));

  const page = source.getPage(slug, lang);
  if (!page) notFound();

  return <DocsPageContent page={page} />;
}

export function generateStaticParams() {
  return source
    .generateParams()
    .filter((params) => params.lang !== i18n.defaultLanguage)
    .map(({ lang, slug }) => ({ lang, slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;

  if (!isSupportedLanguage(lang)) notFound();

  const page = source.getPage(slug, lang);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
