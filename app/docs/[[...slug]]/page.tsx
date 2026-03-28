import { DocsPageContent } from '@/components/docs-page-content';
import { i18n } from '@/lib/i18n';
import { getPageImage, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug, i18n.defaultLanguage);
  if (!page) notFound();

  return <DocsPageContent page={page} />;
}

export async function generateStaticParams() {
  return source
    .generateParams()
    .filter((params) => params.lang === i18n.defaultLanguage)
    .map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug, i18n.defaultLanguage);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
