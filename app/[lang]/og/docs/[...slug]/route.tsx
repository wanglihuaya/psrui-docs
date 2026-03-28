import { i18n } from "@/lib/i18n";
import { appName, isSupportedLanguage } from "@/lib/shared";
import { getPageImage, source } from "@/lib/source";
import { ImageResponse } from "@takumi-rs/image-response";
import { generate as DefaultImage } from "fumadocs-ui/og/takumi";
import { notFound } from "next/navigation";

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string; slug: string[] }> },
) {
  const { lang, slug } = await params;

  if (!isSupportedLanguage(lang)) notFound();
  if (lang === i18n.defaultLanguage) notFound();

  const page = source.getPage(slug.slice(0, -1), lang);
  if (!page) notFound();

  return new ImageResponse(
    <DefaultImage
      title={page.data.title}
      description={page.data.description}
      site={appName}
    />,
    {
      width: 1200,
      height: 630,
      format: "webp",
    },
  );
}

export function generateStaticParams() {
  return source
    .generateParams()
    .filter((params) => params.lang !== i18n.defaultLanguage)
    .map(({ lang, slug }) => ({
      lang,
      slug: getPageImage(source.getPage(slug, lang)!).segments,
    }));
}
