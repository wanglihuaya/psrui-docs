import { defineI18n } from "fumadocs-core/i18n";
import { defineI18nUI } from "fumadocs-ui/i18n";

export const i18n = defineI18n({
  defaultLanguage: "zh",
  languages: ["zh", "en"],
  hideLocale: "default-locale",
});

export type SupportedLanguage = (typeof i18n.languages)[number];

export const i18nUI = defineI18nUI(i18n, {
  zh: {
    displayName: "中文",
    search: "搜索文档",
    searchNoResult: "未找到结果",
    toc: "本页目录",
    tocNoHeadings: "本页暂无标题",
    lastUpdate: "最后更新于",
    chooseLanguage: "切换语言",
    nextPage: "下一页",
    previousPage: "上一页",
    chooseTheme: "切换主题",
    editOnGithub: "查看源文件",
  },
  en: {
    displayName: "English",
  },
});
