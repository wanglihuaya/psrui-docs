import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import Script from "next/script";
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
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-85D98L6MZP"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-85D98L6MZP');`}
      </Script>
    </html>
  );
}
