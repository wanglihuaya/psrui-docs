import { getLLMText, source } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  const scan = source
    .generateParams()
    .map(({ lang, slug }) => source.getPage(slug, lang))
    .filter((page): page is NonNullable<typeof page> => page != null)
    .map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join('\n\n'));
}
