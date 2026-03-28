import { docs } from "collections/server";
import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { i18n } from "./i18n";
import {
  docsRoute,
  docsContentRoute,
  docsImageRoute,
  getLocalizedPath,
  getSiteUrl,
} from "./shared";

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  i18n,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.webp"];
  const locale = page.locale ?? i18n.defaultLanguage;
  const path = `${getLocalizedPath(docsImageRoute, locale)}/${segments.join("/")}`;

  return {
    segments,
    url: new URL(path, `${getSiteUrl()}/`).toString(),
  };
}

export function getPageMarkdownUrl(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "content.md"];
  const locale = page.locale ?? i18n.defaultLanguage;

  return {
    segments,
    url: `${getLocalizedPath(docsContentRoute, locale)}/${segments.join("/")}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title} (${page.url})

${processed}`;
}
