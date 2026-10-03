import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/**
 * Code-quality rules. Runs on every pull request via .github/workflows/ci.yml.
 *
 * The Arabic/RTL rule is NOT enforced here — it lives in
 * scripts/check-logical-css.mjs, because it checks Tailwind class names and raw
 * CSS, which ESLint does not read. Both run in CI.
 */
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
];

export default eslintConfig;
