import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const distDir = path.join(root, 'dist')

if (!fs.existsSync(distDir)) {
  console.error('[seo] dist/ not found. Run after `vite build`.')
  process.exit(1)
}

const rawSiteUrl = process.env.VITE_SITE_URL || process.env.SITE_URL || ''
const siteUrl = rawSiteUrl.replace(/\/+$/, '')

// Public routes to index. (Add more public pages here if you create them.)
const routes = ['/', '/blog', ...getBlogRoutes()]

function getBlogRoutes() {
  try {
    // Read the compiled blog file from dist is harder; read from source instead.
    const postsPath = path.join(root, 'src', 'content', 'blog', 'posts.ts')
    const src = fs.readFileSync(postsPath, 'utf8')
    const slugs = Array.from(src.matchAll(/slug:\s*'([^']+)'/g)).map(m => m[1])
    return slugs.map(s => `/blog/${s}`)
  } catch {
    return []
  }
}

function abs(u) {
  if (!siteUrl) return u
  return `${siteUrl}${u}`
}

function writeDistFile(rel, content) {
  const out = path.join(distDir, rel)
  fs.writeFileSync(out, content, 'utf8')
  console.log(`[seo] wrote ${path.relative(root, out)}`)
}

// robots.txt
writeDistFile(
  'robots.txt',
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl ? `${siteUrl}/sitemap.xml` : '/sitemap.xml'}\n`
)

// sitemap.xml
const now = new Date().toISOString()
const urlset = routes
  .map(r => {
    const loc = siteUrl ? abs(r) : r
    return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${now}</lastmod>\n  </url>`
  })
  .join('\n')

writeDistFile(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`
)

// rss.xml (basic)
writeDistFile(
  'rss.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0">\n` +
    `<channel>\n` +
    `  <title>${escapeXml('Algogenta Blog')}</title>\n` +
    `  <link>${escapeXml(siteUrl ? `${siteUrl}/blog` : '/blog')}</link>\n` +
    `  <description>${escapeXml('Algogenta Automation blog: voice AI, lead automation, and appointment booking.')}</description>\n` +
    `  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n` +
    getRssItems() +
    `</channel>\n` +
    `</rss>\n`
)

function getRssItems() {
  try {
    const postsPath = path.join(root, 'src', 'content', 'blog', 'posts.ts')
    const src = fs.readFileSync(postsPath, 'utf8')
    // Very small parser: find object blocks and extract fields.
    const slugs = Array.from(src.matchAll(/slug:\s*'([^']+)'/g)).map(m => m[1])
    const titles = Array.from(src.matchAll(/title:\s*'([^']+)'/g)).map(m => m[1])
    const descs = Array.from(src.matchAll(/description:\s*\n?\s*'([^']+)'/g)).map(m => m[1])
    const dates = Array.from(src.matchAll(/publishedAt:\s*'([^']+)'/g)).map(m => m[1])

    const n = Math.min(slugs.length, titles.length, dates.length)
    const items = []
    for (let i = 0; i < n; i++) {
      const slug = slugs[i]
      const title = titles[i]
      const description = descs[i] || ''
      const link = siteUrl ? `${siteUrl}/blog/${slug}` : `/blog/${slug}`
      items.push(
        `  <item>\n` +
          `    <title>${escapeXml(title)}</title>\n` +
          `    <link>${escapeXml(link)}</link>\n` +
          `    <guid>${escapeXml(link)}</guid>\n` +
          `    <pubDate>${new Date(dates[i]).toUTCString()}</pubDate>\n` +
          `    <description>${escapeXml(description)}</description>\n` +
          `  </item>\n`
      )
    }
    return items.join('')
  } catch {
    return ''
  }
}

function escapeXml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

