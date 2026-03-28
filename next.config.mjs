import { createMDX } from 'fumadocs-mdx/next';

import('@opennextjs/cloudflare').then((mod) =>
  mod.initOpenNextCloudflareForDev(),
);

const withMDX = createMDX();
const defaultLanguage = 'zh';
const markdownAcceptPattern = '.*(?:text/plain|text/markdown|text/x-markdown).*';

/** @type {import('next').NextConfig} */
const config = {
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  serverExternalPackages: ['@takumi-rs/image-response'],
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: `/${defaultLanguage}`,
        destination: '/',
        permanent: true,
      },
      {
        source: `/${defaultLanguage}/:path*`,
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const markdownHeader = [
      {
        type: 'header',
        key: 'accept',
        value: markdownAcceptPattern,
      },
    ];

    return {
      beforeFiles: [
        {
          source: '/docs',
          has: markdownHeader,
          destination: '/llms.mdx/docs/content.md',
        },
        {
          source: '/docs/:slug*',
          has: markdownHeader,
          destination: '/llms.mdx/docs/:slug*/content.md',
        },
        {
          source: '/:lang/docs',
          has: markdownHeader,
          destination: '/:lang/llms.mdx/docs/content.md',
        },
        {
          source: '/:lang/docs/:slug*',
          has: markdownHeader,
          destination: '/:lang/llms.mdx/docs/:slug*/content.md',
        },
      ],
    };
  },
};

export default withMDX(config);
