import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred } from 'fumadocs-core/negotiation';
import { i18n } from '@/lib/i18n';
import { docsContentRoute, docsRoute, getLocalizedPath, isSupportedLanguage } from '@/lib/shared';

function stripDefaultLocale(pathname: string) {
  const prefix = `/${i18n.defaultLanguage}`;

  if (pathname === prefix) return '/';
  if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length) || '/';

  return null;
}

function parseDocsPath(pathname: string) {
  if (pathname === docsRoute || pathname.startsWith(`${docsRoute}/`)) {
    return {
      locale: i18n.defaultLanguage,
      path: pathname.slice(docsRoute.length).replace(/^\/+/, '').replace(/\.mdx$/, ''),
    };
  }

  const match = pathname.match(/^\/([^/]+)\/docs(?:\/(.*))?$/);
  if (!match) return null;

  const [, locale, path = ''] = match;
  if (!isSupportedLanguage(locale)) return null;

  return {
    locale,
    path: path.replace(/\.mdx$/, ''),
  };
}

function buildMarkdownPath(locale: string, path: string) {
  const contentPath = getLocalizedPath(docsContentRoute, locale);
  return path.length > 0 ? `${contentPath}/${path}/content.md` : `${contentPath}/content.md`;
}

export default function proxy(request: NextRequest) {
  const strippedPath = stripDefaultLocale(request.nextUrl.pathname);
  if (strippedPath) {
    const nextUrl = new URL(request.nextUrl);
    nextUrl.pathname = strippedPath;
    return NextResponse.redirect(nextUrl);
  }

  const docsPath = parseDocsPath(request.nextUrl.pathname);
  const wantsMarkdown =
    request.nextUrl.pathname.endsWith('.mdx') || isMarkdownPreferred(request);

  if (docsPath && wantsMarkdown) {
    const nextUrl = new URL(request.nextUrl);
    nextUrl.pathname = buildMarkdownPath(docsPath.locale, docsPath.path);
    return NextResponse.rewrite(nextUrl);
  }

  return NextResponse.next();
}
