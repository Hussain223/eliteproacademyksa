#!/usr/bin/env node
/**
 * Removes a plain studio background from a subject photo.
 *
 * Why not a simple colour key: the studio backdrop is a smooth grey GRADIENT
 * (about 185 at the top, 220 at the bottom), so keying one colour either eats
 * the subject or leaves a band of grey behind.
 *
 * Instead this grows a region inward from the image border, accepting a
 * neighbouring pixel only when it is close to the pixel it came from. A smooth
 * gradient is followed happily; a real edge stops it. Two guards keep it off
 * the subject:
 *
 *   - saturation: the backdrop is grey, so anything colourful (a green kit,
 *     skin) is never background however smooth the transition.
 *   - luminance: dark hair and shadowed clothing fall outside the backdrop's
 *     brightness range.
 *
 * The result is eroded slightly and feathered, because a hard mask cut exactly
 * at the edge leaves a rim of leftover background — the pale halo that gives a
 * cheap cutout away on a dark hero.
 *
 * Usage: node scripts/cutout.mjs <in.png> <out.png> [--qc qc.png]
 */
import sharp from 'sharp';

const [, , INPUT, OUTPUT] = process.argv;
const qcIndex = process.argv.indexOf('--qc');
const QC = qcIndex > -1 ? process.argv[qcIndex + 1] : null;

if (!INPUT || !OUTPUT) {
  console.error('usage: node scripts/cutout.mjs <in.png> <out.png> [--qc qc.png]');
  process.exit(1);
}

const LOCAL_TOLERANCE = 6; // how different a neighbour may be and still be background
const MAX_SATURATION = 26; // above this the pixel is coloured, so it is the subject
const MIN_LUMA = 138; // below this it is too dark to be the backdrop
const MAX_LUMA = 253;
const ERODE = 2; // pixels shaved off the subject edge to kill the halo
const FEATHER = 1.1; // gaussian blur on the mask, in pixels

const src = sharp(INPUT).ensureAlpha();
const { width: W, height: H } = await src.metadata();
const rgba = await src.raw().toBuffer();

const at = (x, y) => (y * W + x) * 4;
const luma = (i) => 0.2126 * rgba[i] + 0.7152 * rgba[i + 1] + 0.0722 * rgba[i + 2];
const sat = (i) => {
  const r = rgba[i], g = rgba[i + 1], b = rgba[i + 2];
  return Math.max(r, g, b) - Math.min(r, g, b);
};
const dist = (a, b) =>
  Math.abs(rgba[a] - rgba[b]) + Math.abs(rgba[a + 1] - rgba[b + 1]) + Math.abs(rgba[a + 2] - rgba[b + 2]);

const couldBeBackground = (i) => sat(i) <= MAX_SATURATION && luma(i) >= MIN_LUMA && luma(i) <= MAX_LUMA;

/**
 * Edge map.
 *
 * Colour alone cannot separate this subject from its backdrop: the white ball
 * and boots measure luma ~196 against a backdrop of ~195, with the same
 * saturation. Any threshold that removes the grey also removes them.
 *
 * What they do have is a crisp outline. So the fill is additionally forbidden
 * from crossing a strong luminance edge — it can follow the smooth studio
 * gradient freely, but stops where a real object begins.
 */
const EDGE_STOP = 26;
const edge = new Uint8Array(W * H);
for (let y = 1; y < H - 1; y++) {
  for (let x = 1; x < W - 1; x++) {
    const gx = luma(at(x + 1, y)) - luma(at(x - 1, y));
    const gy = luma(at(x, y + 1)) - luma(at(x, y - 1));
    const m = Math.sqrt(gx * gx + gy * gy);
    edge[y * W + x] = m > EDGE_STOP ? 1 : 0;
  }
}

// Region grow inward from every border pixel.
const isBg = new Uint8Array(W * H);
const queue = new Int32Array(W * H);
let head = 0, tail = 0;

const seed = (x, y) => {
  const p = y * W + x;
  if (isBg[p]) return;
  if (!couldBeBackground(at(x, y))) return;
  isBg[p] = 1;
  queue[tail++] = p;
};
for (let x = 0; x < W; x++) { seed(x, 0); seed(x, H - 1); }
for (let y = 0; y < H; y++) { seed(0, y); seed(W - 1, y); }

while (head < tail) {
  const p = queue[head++];
  const x = p % W, y = (p / W) | 0;
  const pi = p * 4;
  const step = (nx, ny) => {
    if (nx < 0 || ny < 0 || nx >= W || ny >= H) return;
    const q = ny * W + nx;
    if (isBg[q]) return;
    const qi = q * 4;
    if (edge[q]) return; // never cross an object outline
    if (!couldBeBackground(qi)) return;
    if (dist(pi, qi) > LOCAL_TOLERANCE) return;
    isBg[q] = 1;
    queue[tail++] = q;
  };
  step(x + 1, y); step(x - 1, y); step(x, y + 1); step(x, y - 1);
};

/**
 * Second pass: enclosed pockets of backdrop.
 *
 * The fill above only reaches background connected to the border. A gap framed
 * entirely by the subject — between a raised leg and the torso, say — is never
 * reached, and survives as a grey patch in the middle of the cutout.
 *
 * Removing every leftover backdrop-coloured region is not safe: a white karate
 * gi and white boots are also pale and unsaturated. What separates a pocket of
 * backdrop from a white garment is that the pocket is FLAT and matches the
 * background right next to it, whereas fabric has folds, shading and a
 * different brightness. So a pocket is only removed when it is small, low
 * variance, and within a few levels of the background touching it.
 */
const POCKET_MAX_AREA = 0.04 * W * H;
const POCKET_MAX_STDDEV = 9;
const POCKET_MAX_DELTA = 14;

// A reference brightness for the backdrop, taken from everything the first
// pass removed. A fully enclosed pocket has no background touching it — that
// is what "enclosed" means — so there is nothing local to compare against and
// this global figure stands in.
const bgLumas = [];
for (let p = 0; p < W * H; p += 7) if (isBg[p]) bgLumas.push(luma(p * 4));
bgLumas.sort((a, b) => a - b);
const bgMedianLuma = bgLumas.length ? bgLumas[Math.floor(bgLumas.length / 2)] : 0;

const seen = new Uint8Array(W * H);
let pocketsRemoved = 0;

for (let start = 0; start < W * H; start++) {
  if (seen[start] || isBg[start] || !couldBeBackground(start * 4)) continue;

  const comp = [];
  const stack = [start];
  seen[start] = 1;
  let touchesBorder = false;
  let sum = 0, sumSq = 0;
  const adjacentBg = [];

  while (stack.length) {
    const p = stack.pop();
    comp.push(p);
    const x = p % W, y = (p / W) | 0;
    if (x === 0 || y === 0 || x === W - 1 || y === H - 1) touchesBorder = true;
    const l = luma(p * 4);
    sum += l; sumSq += l * l;

    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const q = ny * W + nx;
      if (isBg[q]) { adjacentBg.push(luma(q * 4)); continue; }
      if (seen[q] || !couldBeBackground(q * 4)) continue;
      seen[q] = 1;
      stack.push(q);
    }
  }

  if (touchesBorder || comp.length > POCKET_MAX_AREA) continue;

  const mean = sum / comp.length;
  const stddev = Math.sqrt(Math.max(0, sumSq / comp.length - mean * mean));
  const bgMean = adjacentBg.length
    ? adjacentBg.reduce((a, b) => a + b, 0) / adjacentBg.length
    : bgMedianLuma;

  if (stddev <= POCKET_MAX_STDDEV && Math.abs(mean - bgMean) <= POCKET_MAX_DELTA) {
    for (const p of comp) isBg[p] = 1;
    pocketsRemoved++;
  }
}

const bgCount = isBg.reduce((a, b) => a + b, 0);
const removed = (bgCount / (W * H)) * 100;
if (pocketsRemoved) console.log(`  (filled ${pocketsRemoved} enclosed backdrop pocket(s))`);

// Subject mask: 255 where we keep the pixel.
const mask = Buffer.alloc(W * H);
for (let p = 0; p < W * H; p++) mask[p] = isBg[p] ? 0 : 255;

/**
 * Blur a single-channel mask and get a single channel back.
 *
 * Sharp quietly promotes a 1-channel raw buffer to 3-channel RGB after some
 * operations, which makes the returned buffer three times the expected length.
 * Indexing it as if it were 1-channel reads the wrong pixels and produces a
 * silently empty mask, so the channel count is pinned and then asserted.
 */
async function blurMask(buf, sigma) {
  const { data, info } = await sharp(buf, { raw: { width: W, height: H, channels: 1 } })
    .blur(sigma)
    .toColourspace('b-w')
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (info.channels !== 1 || data.length !== W * H) {
    throw new Error(`mask came back as ${info.channels} channel(s), ${data.length} bytes; expected 1 and ${W * H}`);
  }
  return data;
}

// Erode the subject slightly, then feather, so no rim of old background
// survives along the edge. The erode is done here in plain arithmetic rather
// than with sharp's linear(), which is what triggered the channel promotion.
let working = mask;
if (ERODE > 0) {
  const blurred = await blurMask(working, ERODE);
  working = Buffer.alloc(W * H);
  for (let p = 0; p < W * H; p++) {
    working[p] = Math.max(0, Math.min(255, blurred[p] * 3 - 2 * 255));
  }
}
const finalMask = await blurMask(working, FEATHER);

const out = Buffer.alloc(W * H * 4);
for (let p = 0; p < W * H; p++) {
  out[p * 4] = rgba[p * 4];
  out[p * 4 + 1] = rgba[p * 4 + 1];
  out[p * 4 + 2] = rgba[p * 4 + 2];
  out[p * 4 + 3] = finalMask[p];
}

await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toFile(OUTPUT);
console.log(`${INPUT}\n  -> ${OUTPUT}  (${removed.toFixed(1)}% removed as background)`);

// A quality-control render over a flat dark green: any leftover halo shows up
// against this far more clearly than against a checkerboard.
if (QC) {
  await sharp({
    create: { width: W, height: H, channels: 4, background: { r: 10, g: 36, b: 22, alpha: 1 } },
  })
    .composite([{ input: OUTPUT }])
    .png()
    .toFile(QC);
  console.log(`  -> ${QC} (check this for halos)`);
}
