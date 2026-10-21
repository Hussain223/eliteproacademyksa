/**
 * Builds a single self-contained HTML file from the running landing page.
 * Both languages are embedded with a working toggle, all CSS and fonts are
 * inlined, and no JavaScript from Next.js is carried over.
 *
 * This exists only because there is no Vercel deployment yet. Once the site is
 * deployed, this script is redundant — the real URL replaces it.
 */
import { writeFileSync } from 'node:fs';

const ORIGIN = 'http://localhost:3000';
const IDS = ['top', 'programmes', 'approach', 'contact'];

const get = async (p) => {
  const r = await fetch(ORIGIN + p);
  if (!r.ok) throw new Error(`${p} -> ${r.status}`);
  return r.text();
};

async function inlineCss(html) {
  const hrefs = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => m[1]);
  let css = '';
  const bases = [];
  for (const href of hrefs) {
    css += (await get(href)) + '\n';
    bases.push(href);
  }

  // Font URLs in the emitted CSS are RELATIVE to the stylesheet
  // (../media/x.woff2), not absolute, so resolve them against its path before
  // fetching. Inlining them means the shared file needs no network at all.
  const refs = [...new Set([...css.matchAll(/url\(([^)'"]+?\.woff2)\)/g)].map((m) => m[1]))];
  let count = 0;
  for (const ref of refs) {
    const abs = new URL(ref, ORIGIN + bases[0]).pathname;
    const res = await fetch(ORIGIN + abs);
    if (!res.ok) {
      console.log(`  WARNING could not fetch font ${abs} (${res.status})`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    css = css.replaceAll(ref, `data:font/woff2;base64,${buf.toString('base64')}`);
    count++;
  }
  if (count === 0) throw new Error('no fonts inlined — the page would lose Rubik');
  console.log(`  inlined ${hrefs.length} stylesheet(s), ${count} font file(s)`);
  return css;
}

function extract(html, prefix) {
  const htmlTag = html.match(/<html[^>]*>/)[0];
  const cls = (htmlTag.match(/class="([^"]*)"/) || [, ''])[1];
  const dir = (htmlTag.match(/dir="([^"]*)"/) || [, 'ltr'])[1];
  const lang = (htmlTag.match(/lang="([^"]*)"/) || [, 'en'])[1];

  let body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
  body = body.replace(/<script[\s\S]*?<\/script>/g, '');
  body = body.replace(/<template[\s\S]*?<\/template>/g, '');
  // Namespace in-page anchors so the two copies don't collide on duplicate ids.
  for (const id of IDS) {
    body = body.replaceAll(`id="${id}"`, `id="${prefix}-${id}"`);
    body = body.replaceAll(`href="#${id}"`, `href="#${prefix}-${id}"`);
  }
  return { cls, dir, lang, body };
}

/**
 * Inline every <img> as a data URI.
 *
 * Next.js serves images through /_next/image, which only exists while the
 * server is running — in a standalone file every photograph would be a broken
 * icon. Each one is fetched once, cached across the two locales (they use the
 * same files), and embedded.
 *
 * srcset is dropped deliberately. It lists the same picture at a dozen widths;
 * keeping it would embed each one and bloat the file for no benefit, since a
 * shared preview does not need per-device resolution switching.
 */
const imageCache = new Map();

async function inlineImages(body) {
  const tags = body.match(/<img\b[^>]*>/g) || [];
  let inlined = 0;

  for (const tag of tags) {
    // Prefer the largest candidate in srcset; fall back to src.
    // Case-insensitive on purpose: React serialises these as srcSet and
    // sizes with capitals. A case-sensitive strip leaves srcSet in place,
    // and the browser honours it over the src we just inlined — so every
    // photograph silently goes back to requesting the dev server.
    const srcset = (tag.match(/\ssrcset="([^"]*)"/i) || [])[1];
    const src = (tag.match(/\ssrc="([^"]*)"/i) || [])[1];
    const candidate = srcset
      ? srcset.split(',').map((s) => s.trim().split(/\s+/)[0]).pop()
      : src;
    if (!candidate || candidate.startsWith('data:')) continue;

    const url = candidate.replace(/&amp;/g, '&');
    if (!imageCache.has(url)) {
      // Ask for WebP explicitly. With no Accept header /_next/image falls
      // back to JPEG, which has no transparency — every cutout athlete then
      // arrives on a solid black rectangle.
      const res = await fetch(ORIGIN + url, { headers: { Accept: 'image/webp,*/*' } });
      if (!res.ok) {
        console.log(`  WARNING image ${url.slice(0, 60)} -> ${res.status}`);
        continue;
      }
      const type = res.headers.get('content-type') || 'image/webp';
      const buf = Buffer.from(await res.arrayBuffer());
      imageCache.set(url, `data:${type};base64,${buf.toString('base64')}`);
    }

    const replaced = tag
      .replace(/\ssrcset="[^"]*"/gi, '')
      .replace(/\ssizes="[^"]*"/gi, '')
      .replace(/\ssrc="[^"]*"/i, ` src="${imageCache.get(url)}"`);
    body = body.replace(tag, replaced);
    inlined++;
  }

  console.log(`  inlined ${inlined} image(s)`);
  return body;
}

console.log('building snapshot...');
const [enHtml, arHtml] = await Promise.all([get('/en'), get('/ar')]);
const css = await inlineCss(enHtml);
const en = extract(enHtml, 'en');
const ar = extract(arHtml, 'ar');
en.body = await inlineImages(en.body);
ar.body = await inlineImages(ar.body);

/* On the real site next/font puts --font-rubik on <html>, so --font-sans
   (which is declared at :root and references it) resolves. In this snapshot
   the font class sits on a wrapper div instead, leaving --font-sans
   unresolvable at :root — font-family then computes to nothing and the page
   silently falls back to a system face. Lifting the variable to :root
   restores exactly what the live page does. */
const rubikVar = (css.match(/--font-rubik:\s*([^;}]+)/) || [])[1];
if (!rubikVar) throw new Error('could not find --font-rubik in the emitted CSS');

const page = `<title>Elite Pro Academy</title>
<style>
${css}
:root{--font-rubik:${rubikVar.trim()}}
/* next/font defines --font-rubik on a class that normally sits on <html>.
   Here that class is on the wrapper, so the font must be applied there too —
   otherwise body resolves --font-rubik as undefined and silently falls back
   to a system face, losing the approved typeface entirely. */
.snap-locale{font-family:var(--font-sans);background:var(--color-bg);color:var(--color-ink-800)}
.snap-locale[hidden]{display:none!important}
</style>

<div class="snap-locale ${en.cls}" data-locale="en" dir="${en.dir}" lang="${en.lang}">${en.body}</div>
<div class="snap-locale ${ar.cls}" data-locale="ar" dir="${ar.dir}" lang="${ar.lang}" hidden>${ar.body}</div>

<script>
/* The real site switches language by navigating to /en or /ar. This snapshot
   has no server, so the same links swap which copy is shown instead. */
(function () {
  var panes = document.querySelectorAll('.snap-locale');
  function show(loc) {
    panes.forEach(function (p) { p.hidden = p.dataset.locale !== loc; });
    document.documentElement.setAttribute('lang', loc);
    document.documentElement.setAttribute('dir', loc === 'ar' ? 'rtl' : 'ltr');
    try { localStorage.setItem('epa-locale', loc); } catch (e) {}
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var m = href.match(/^\\/?(en|ar)$/);
    if (m) { e.preventDefault(); show(m[1]); }
  });
  var saved = null;
  try { saved = localStorage.getItem('epa-locale'); } catch (e) {}
  show(saved === 'ar' ? 'ar' : 'en');
})();
</script>
`;

/* Escape every non-ASCII character as a numeric entity. The Arabic content is
   the whole point of this page, and a file served or opened with the wrong
   assumed encoding renders it as mojibake. Entities make the file correct
   under any encoding, which matters because we do not control how this gets
   opened or forwarded. The base64 font payloads are ASCII and unaffected. */
const safe = page.replace(/[\u0080-￿]/g, (c) => `&#${c.codePointAt(0)};`);

writeFileSync('/home/user/eliteproacademyksa/mockups/landing-page-preview.html', safe, 'utf8');
console.log(`  wrote landing-page-preview.html (${(safe.length / 1024).toFixed(0)} KB)`);
