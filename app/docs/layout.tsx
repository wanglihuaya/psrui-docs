import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import {
  SidebarLanguageSelect,
  SidebarLanguageSelectText,
} from "@/components/sidebar-language-select";
import { i18n, i18nUI } from "@/lib/i18n";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <RootProvider i18n={i18nUI.provider(i18n.defaultLanguage)}>
      <DocsLayout
        tree={source.getPageTree(i18n.defaultLanguage)}
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
