import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * Pin the project root to this folder.
   *
   * Without this, Next.js guesses the root by walking up the folder tree
   * looking for a package-lock.json — and if there happens to be a stray one in
   * a parent folder (a home directory, say), it finds that instead and prints a
   * warning. Pinning it removes the guesswork, so the project behaves the same
   * on every machine regardless of what else is lying around above it.
   */
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
};

export default withNextIntl(nextConfig);
