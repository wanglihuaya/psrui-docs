import type { Metadata } from "next";
import { RootProvider } from "fumadocs-ui/provider/next";
import { appName, getSiteUrl } from "@/lib/shared";
import "./global.css";
import "katex/dist/katex.min.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description:
    "Bilingual PSRUI documentation for pulsar data processing workflows and the surrounding toolchain.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
