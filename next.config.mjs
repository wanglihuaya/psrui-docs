import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  serverExternalPackages: ['@takumi-rs/image-response'],
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
};

export default withMDX(config);
