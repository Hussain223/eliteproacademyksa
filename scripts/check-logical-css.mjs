#!/usr/bin/env node
/**
 * Fails the build if a direction-specific CSS property or Tailwind class is used.
 *
 * WHY THIS EXISTS
 * The platform must work identically in English (left-to-right) and Arabic
 * (right-to-left). `margin-left` is frozen to the left on both. Its logical
 * twin `margin-inline-start` means "the side the text starts on", so it flips
 * by itself when the page direction flips.
 *
 * Getting this right once per component is easy. Remembering it on every
 * component for the life of the project is not — so the build remembers
 * instead of us. This is the bilingual non-negotiable in CLAUDE.md, made
 * mechanical.
 *
 * Escape hatch: put `logical-css-ok` in a comment on the same line. Use it for
 * the rare thing that genuinely must not mirror, and say why.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const ROOT = process.cwd();
const SCAN_DIRS = ['src'];
const SCAN_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css']);
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'out', 'dist']);
const OPT_OUT = 'logical-css-ok';

/** Each rule: what to look for, and what to use instead. */
const RULES = [
  // --- raw CSS properties ---
  { re: /margin-left\s*:/g, use: 'margin-inline-start' },
  { re: /margin-right\s*:/g, use: 'margin-inline-end' },
  { re: /padding-left\s*:/g, use: 'padding-inline-start' },
  { re: /padding-right\s*:/g, use: 'padding-inline-end' },
  { re: /border-left\s*:/g, use: 'border-inline-start' },
  { re: /border-right\s*:/g, use: 'border-inline-end' },
  { re: /text-align\s*:\s*left/g, use: 'text-align: start' },
  { re: /text-align\s*:\s*right/g, use: 'text-align: end' },
  { re: /(?<![-\w])left\s*:/g, use: 'inset-inline-start' },
  { re: /(?<![-\w])right\s*:/g, use: 'inset-inline-end' },

  // --- Tailwind utility classes ---
  // The trailing (?=[-\s"'`]) / \b guards stop false hits on names that merely
  // begin with the same letters, e.g. `rounded-lg` or `border-light`.
  { re: /\bml-(?=[\d[]|px|auto|full)/g, use: 'ms-* (margin-inline-start)' },
  { re: /\bmr-(?=[\d[]|px|auto|full)/g, use: 'me-* (margin-inline-end)' },
  { re: /\bpl-(?=[\d[]|px|auto|full)/g, use: 'ps-* (padding-inline-start)' },
  { re: /\bpr-(?=[\d[]|px|auto|full)/g, use: 'pe-* (padding-inline-end)' },
  { re: /\bborder-l\b/g, use: 'border-s-*' },
  { re: /\bborder-r\b/g, use: 'border-e-*' },
  { re: /\brounded-l\b/g, use: 'rounded-s-*' },
  { re: /\brounded-r\b/g, use: 'rounded-e-*' },
  { re: /\btext-left\b/g, use: 'text-start' },
  { re: /\btext-right\b/g, use: 'text-end' },
  { re: /\bfloat-left\b/g, use: 'float-start' },
  { re: /\bfloat-right\b/g, use: 'float-end' },
  { re: /\bleft-(?=[\d[]|px|full|auto)/g, use: 'start-*' },
  { re: /\bright-(?=[\d[]|px|full|auto)/g, use: 'end-*' },
];

function walk(dir, found = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return found;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, found);
    } else if (SCAN_EXTENSIONS.has(extname(entry))) {
      found.push(full);
    }
  }
  return found;
}

const problems = [];

for (const dir of SCAN_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, index) => {
      if (line.includes(OPT_OUT)) return;
      for (const rule of RULES) {
        rule.re.lastIndex = 0;
        const match = rule.re.exec(line);
        if (match) {
          problems.push({
            file: relative(ROOT, file),
            line: index + 1,
            found: match[0].trim(),
            use: rule.use,
            text: line.trim(),
          });
        }
      }
    });
  }
}

if (problems.length === 0) {
  console.log('RTL check passed — no direction-specific CSS found.');
  process.exit(0);
}

console.error(
  `\nRTL check failed: ${problems.length} direction-specific ` +
    `${problems.length === 1 ? 'value' : 'values'} found.\n\n` +
    'These are pinned to one side, so the layout would break in Arabic.\n' +
    'Swap each for its logical equivalent, which flips automatically.\n'
);

for (const p of problems) {
  console.error(`  ${p.file}:${p.line}`);
  console.error(`    found:  ${p.found}`);
  console.error(`    use:    ${p.use}`);
  console.error(`    line:   ${p.text.slice(0, 100)}`);
  console.error('');
}

console.error(
  'If something genuinely must not mirror (a brand mark, a chart axis),\n' +
    `add a comment containing "${OPT_OUT}" on that line and explain why.\n`
);

process.exit(1);
