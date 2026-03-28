import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, docsRoute, getLocalizedPath, gitConfig } from './shared';

export function baseOptions(locale?: string): BaseLayoutProps {
  const githubUrl = gitConfig.repoUrl;

  return {
    nav: {
      title: appName,
      url: getLocalizedPath(docsRoute, locale),
    },
    ...(githubUrl ? { githubUrl } : {}),
  };
}
