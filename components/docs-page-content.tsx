import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import { getMDXComponents } from "@/components/mdx";
import { resolveDocHref } from "@/lib/resolve-doc-href.mjs";
import { getGitHubFileUrl } from "@/lib/shared";
import { getPageMarkdownUrl, source } from "@/lib/source";

type DocsPageData = NonNullable<ReturnType<typeof source.getPage>>;

export function DocsPageContent({ page }: { page: DocsPageData }) {
  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const pages = source.getPages(page.locale);

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">
        {page.data.description}
      </DocsDescription>
      <div className="flex flex-row items-center gap-2 border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={getGitHubFileUrl(page.path)}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: ({ href, ...props }) => (
              <a href={resolveDocHref(href, page, pages)} {...props} />
            ),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}
