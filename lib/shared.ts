import { i18n, type SupportedLanguage } from './i18n';

export const appName = 'PSRUI Docs';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

export const gitConfig = {
  branch: 'main',
  repoUrl: undefined as string | undefined,
};

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
}

export function isSupportedLanguage(value: string | undefined): value is SupportedLanguage {
  return !!value && i18n.languages.includes(value as SupportedLanguage);
}

export function isDefaultLanguage(locale: string | undefined): boolean {
  return !locale || locale === i18n.defaultLanguage;
}

export function getLocalizedPath(basePath: string, locale?: string): string {
  if (isDefaultLanguage(locale)) return basePath;

  return `/${locale}${basePath}`;
}

export function getDocsUrl(locale?: string, slugs: string[] = []): string {
  const basePath = getLocalizedPath(docsRoute, locale);
  return slugs.length > 0 ? `${basePath}/${slugs.join('/')}` : basePath;
}

export function getGitHubFileUrl(path: string): string | undefined {
  if (!gitConfig.repoUrl) return undefined;

  return `${gitConfig.repoUrl}/blob/${gitConfig.branch}/content/docs/${path}`;
}
