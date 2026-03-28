import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import { notFound } from "next/navigation";
import {
  SidebarLanguageSelect,
  SidebarLanguageSelectText,
} from "@/components/sidebar-language-select";
import { i18n, i18nUI } from "@/lib/i18n";
import { baseOptions } from "@/lib/layout.shared";
import { isSupportedLanguage } from "@/lib/shared";
import { source } from "@/lib/source";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isSupportedLanguage(lang)) notFound();

  return (
    <RootProvider i18n={i18nUI.provider(lang)}>
      <DocsLayout
        tree={source.getPageTree(lang)}
        slots={{
          languageSelect: {
            root: SidebarLanguageSelect,
            text: SidebarLanguageSelectText,
          },
        }}
        {...baseOptions("docs")}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}

export function generateStaticParams() {
  return i18n.languages
    .filter((lang) => lang !== i18n.defaultLanguage)
    .map((lang) => ({ lang }));
}
