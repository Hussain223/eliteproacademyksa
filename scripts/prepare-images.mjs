#!/usr/bin/env node
/**
 * Turns the originals in assets/source-images/ into the web-ready files the
 * site serves from public/images/.
 *
 * Run it with:  npm run images
 *
 * Re-runnable: it always rebuilds from the originals, so dropping a new file
 * into assets/source-images/ and running this again is the whole workflow. The
 * originals are never modified.
 *
 * Why WebP: the originals are 1.6–1.9 MB PNGs. WebP keeps transparency, which
 * the cut-out subjects need, at roughly a tenth of the size. Next.js resizes
 * these further per device at request time, so one good file per subject is
 * enough — there is no need to hand-make a set per screen width.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

const SRC = 'assets/source-images';
const OUT = 'public/images';

/**
 * cutout: the subject is lifted off its studio backdrop (see scripts/cutout.mjs).
 * photo:  kept whole, background and all — a framed photograph, not a subject.
 */
const JOBS = [
  { in: 'football-boy.png', out: 'hero-football-boy.webp', mode: 'cutout', maxHeight: 1500, quality: 90 },
  { in: 'gymnast-girl.png', out: 'gymnast-girl.webp', mode: 'cutout', maxHeight: 1000, quality: 88 },
  { in: 'karate-boy.png', out: 'karate-boy.webp', mode: 'cutout', maxHeight: 1000, quality: 88 },
  { in: 'hero-bg.png', out: 'hero-bg.webp', mode: 'photo', maxWidth: 1920, quality: 78 },
  { in: 'swimmer-boy.png', out: 'swimmer-boy.webp', mode: 'photo', maxWidth: 1000, quality: 84 },
];

const kb = (p) => (statSync(p).size / 1024).toFixed(0);
const tmp = mkdtempSync(join(tmpdir(), 'epa-img-'));
let before = 0;
let after = 0;

try {
  for (const job of JOBS) {
    const source = join(SRC, job.in);
    const target = join(OUT, job.out);
    before += statSync(source).size;

    let working = source;
    if (job.mode === 'cutout') {
      working = join(tmp, job.in);
      execFileSync('node', ['scripts/cutout.mjs', source, working], { stdio: 'pipe' });
    }

    const pipeline = sharp(working).resize({
      width: job.maxWidth,
      height: job.maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    });

    await pipeline
      .webp({ quality: job.quality, alphaQuality: 100, effort: 6 })
      .toFile(target);

    after += statSync(target).size;
    const meta = await sharp(target).metadata();
    console.log(
      `${job.in.padEnd(20)} -> ${job.out.padEnd(26)} ${String(meta.width).padStart(5)}x${String(meta.height).padEnd(5)} ` +
        `${kb(source).padStart(5)}KB -> ${kb(target).padStart(5)}KB` +
        (job.mode === 'cutout' ? '  (background removed)' : '')
    );
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

console.log(
  `\ntotal ${(before / 1024 / 1024).toFixed(1)}MB -> ${(after / 1024 / 1024).toFixed(2)}MB ` +
    `(${(100 - (after / before) * 100).toFixed(0)}% smaller)`
);
console.log('logo.svg is already a vector and is served as-is.');
