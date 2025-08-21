/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true }
};

import createNextIntlPlugin from 'next-intl/plugin';
// If you need options later (e.g., custom locales behavior), pass an object:
// const withNextIntl = createNextIntlPlugin({ /* options */ });
const withNextIntl = createNextIntlPlugin(
  './i18n/request.ts'
);

export default withNextIntl(nextConfig);
