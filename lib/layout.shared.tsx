import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, docsRoute, getLocalizedPath } from './shared';

export function baseOptions(locale?: string): BaseLayoutProps {
  return {
    nav: {
      title: appName,
      url: getLocalizedPath(docsRoute, locale),
    },
  };
}
