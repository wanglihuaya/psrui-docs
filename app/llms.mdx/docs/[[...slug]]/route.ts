import { notFound } from "next/navigation";
import { i18n } from "@/lib/i18n";
import { getLLMText, getPageMarkdownUrl, source } from "@/lib/source";

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: RouteContext<"/llms.mdx/docs/[[...slug]]">,
) {
  const { slug } = await params;
  const page = source.getPage(slug?.slice(0, -1), i18n.defaultLanguage);
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
    .filter((params) => params.lang === i18n.defaultLanguage)
    .map(({ slug }) => {
      const page = source.getPage(slug, i18n.defaultLanguage);
      if (!page) {
        throw new Error(`Missing page for slug: ${slug?.join("/") ?? "index"}`);
      }

      return {
        slug: getPageMarkdownUrl(page).segments,
      };
    });
}
