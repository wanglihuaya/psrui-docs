import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appName } from "./shared";

type BaseOptionsMode = "home" | "docs";

export function baseOptions(_mode: BaseOptionsMode = "docs"): BaseLayoutProps {
  return {
    nav: {
      title: appName,
      url: "/",
    },
    links: undefined,
    themeSwitch: {
      enabled: true,
    },
  };
}
