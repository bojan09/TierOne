// Generates public/sitemap.xml from the curriculum spine.
//
// Uses Vite's SSR module loader (not a full build) so this can import
// TypeScript + the `@` path alias directly from src/, without duplicating
// the curriculum data or requiring a separate build step. Run via
// `npm run build` (wired in as a `postbuild` step) or standalone with
// `node scripts/generate-sitemap.mjs`.

import { createServer } from 'vite';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SITE_URL = process.env.SITE_URL || 'https://tier-one-tau.vercel.app';

async function main() {
  const server = await createServer({
    root: rootDir,
    logLevel: 'error',
    server: { middlewareMode: true },
  });

  const { curriculum } = await server.ssrLoadModule('/src/content/curriculum/index.ts');
  await server.close();

  const today = new Date().toISOString().slice(0, 10);

  /** @type {{ loc: string; priority: string; changefreq: string }[]} */
  const urls = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/learn', priority: '0.9', changefreq: 'weekly' },
    { loc: '/glossary', priority: '0.5', changefreq: 'monthly' },
    { loc: '/cheatsheets', priority: '0.5', changefreq: 'monthly' },
    { loc: '/port-lookup', priority: '0.4', changefreq: 'monthly' },
    { loc: '/it-models', priority: '0.4', changefreq: 'monthly' },
  ];

  for (const course of curriculum.courses) {
    urls.push({ loc: `/learn/${course.slug}`, priority: '0.8', changefreq: 'monthly' });
  }
  for (const lesson of curriculum.lessons) {
    const course = curriculum.courses.find((c) => c.id === lesson.courseId);
    if (!course) continue;
    urls.push({ loc: `/learn/${course.slug}/${lesson.slug}`, priority: '0.6', changefreq: 'monthly' });
  }

  const body = urls
    .map(
      (u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  const outPath = path.join(rootDir, 'public', 'sitemap.xml');
  writeFileSync(outPath, xml);
  console.log(`Wrote ${urls.length} URLs to ${path.relative(rootDir, outPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
