import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface AuditRow {
  url: string;
  status: number;
  title: string;
  description: string;
  h1: string;
  canonical: string;
  robots: string;
  hreflang: string;
  contentLength: number;
  hasJsFallback: boolean;
  hasHomeFallback: boolean;
  inSitemap: boolean;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist', 'client');
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, '').split('=');
    return [key, rest.join('=') || 'true'];
  }),
);
const base = args.get('base') ?? dist;
const isHttp = /^https?:\/\//i.test(base);

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function attr(html: string, selector: RegExp): string {
  return html.match(selector)?.[1]?.trim() ?? '';
}

function fileForUrl(url: string): string {
  const parsed = new URL(url);
  const pathname = decodeURIComponent(parsed.pathname);
  if (pathname === '/' || pathname === '') return path.join(dist, 'index.html');
  if (pathname.endsWith('/')) return path.join(dist, pathname, 'index.html');
  return path.join(dist, pathname);
}

async function load(url: string): Promise<{ status: number; html: string; headers: Headers | Map<string, string> }> {
  if (isHttp) {
    const response = await fetch(url, { redirect: 'manual' });
    return { status: response.status, html: await response.text(), headers: response.headers };
  }
  const file = fileForUrl(url);
  if (!fs.existsSync(file)) return { status: 404, html: '', headers: new Map() };
  return { status: 200, html: fs.readFileSync(file, 'utf-8'), headers: new Map([['content-type', 'text/html; charset=utf-8']]) };
}

async function loadSitemap(): Promise<string[]> {
  let xml = '';
  if (isHttp) {
    const response = await fetch(`${base.replace(/\/$/, '')}/sitemap.xml`);
    xml = await response.text();
  } else {
    xml = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf-8');
  }
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) => match[1]);
}

function auditHtml(url: string, status: number, html: string, inSitemap: boolean): AuditRow {
  const text = stripTags(html);
  const hreflangs = Array.from(html.matchAll(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["'][^>]*>/gi))
    .map((match) => `${match[1]}=${match[2]}`)
    .join('|');
  return {
    url,
    status,
    title: attr(html, /<title>([\s\S]*?)<\/title>/i),
    description: attr(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i),
    h1: attr(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, '').trim(),
    canonical: attr(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i),
    robots: attr(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["'][^>]*>/i),
    hreflang: hreflangs,
    contentLength: text.length,
    hasJsFallback: /This site requires JavaScript/i.test(html),
    hasHomeFallback: /<h1[^>]*>\s*Free Online PDF Tools\s*<\/h1>/i.test(html) && !['/', '/en/', '/es/'].includes(new URL(url).pathname),
    inSitemap,
  };
}

function printRows(rows: AuditRow[]): void {
  console.log(JSON.stringify(rows, null, 2));
  const problems = rows.filter((row) =>
    row.status !== 200 ||
    !row.title ||
    !row.description ||
    !row.h1 ||
    !row.canonical ||
    /noindex/i.test(row.robots) ||
    !row.hreflang.includes('en=') ||
    !row.hreflang.includes('es=') ||
    !row.hreflang.includes('x-default=') ||
    row.contentLength < 300 ||
    row.hasJsFallback ||
    row.hasHomeFallback ||
    !row.inSitemap,
  );
  if (problems.length) {
    console.error(`SEO audit found ${problems.length} problem(s).`);
    process.exitCode = 1;
  } else {
    console.log(`SEO audit passed for ${rows.length} URL(s).`);
  }
}

async function main(): Promise<void> {
  const sitemapUrls = await loadSitemap();
  const urls = sitemapUrls.map((url) => {
    if (isHttp) return url;
    const parsed = new URL(url);
    return `https://flowtopdf.com${parsed.pathname}`;
  });
  const rows: AuditRow[] = [];
  for (const url of urls) {
    const result = await load(url);
    rows.push(auditHtml(url, result.status, result.html, sitemapUrls.includes(url)));
  }
  printRows(rows);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
