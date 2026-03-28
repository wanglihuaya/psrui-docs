import path from "node:path/posix";

function isIndexPage(page) {
  return path.basename(page.path).startsWith("index.");
}

function splitHref(href) {
  const [pathWithQuery, hash = ""] = href.split("#", 2);
  const [pathname, query = ""] = pathWithQuery.split("?", 2);

  return { hash, pathname, query };
}

function joinHref(pathname, query, hash) {
  let href = pathname;

  if (query) href += `?${query}`;
  if (hash) href += `#${hash}`;

  return href;
}

export function resolveDocHref(href, page, pages) {
  if (!href) return href;
  if (!href.startsWith("./") && !href.startsWith("../")) return href;

  const { hash, pathname, query } = splitHref(href);
  const baseSegments = isIndexPage(page) ? page.slugs : page.slugs.slice(0, -1);
  const resolvedSlug = path
    .normalize(path.join("/", ...baseSegments, pathname))
    .replace(/^\/+/, "");

  const target = pages.find(
    (candidate) =>
      candidate.locale === page.locale &&
      candidate.slugs.join("/") === resolvedSlug,
  );

  if (!target) return href;

  return joinHref(target.url, query, hash);
}
