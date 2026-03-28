import { notFound } from "next/navigation";
import { i18n } from "@/lib/i18n";
import { isSupportedLanguage } from "@/lib/shared";
import { getLLMText, getPageMarkdownUrl, source } from "@/lib/source";

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string; slug?: string[] }> },
) {
  const { lang, slug } = await params;

  if (!isSupportedLanguage(lang)) notFound();
  if (lang === i18n.defaultLanguage) notFound();

  const page = source.getPage(slug?.slice(0, -1), lang);
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      "Content-Type": "text/markdown",
    },
  });
}

export function generateStaticParams() {
  return source
    .generateParams()
    .filter((params) => params.lang !== i18n.defaultLanguage)
    .map(({ lang, slug }) => {
      const page = source.getPage(slug, lang);
      if (!page) {
        throw new Error(
          `Missing localized page for ${lang}:${slug?.join("/") ?? "index"}`,
        );
      }

      return {
        lang,
        slug: getPageMarkdownUrl(page).segments,
      };
    });
}
