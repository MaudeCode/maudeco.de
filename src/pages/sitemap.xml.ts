import { getCollection } from 'astro:content'
import type { APIContext } from 'astro'

const staticPages = ['/', '/about', '/capabilities', '/projects', '/how-i-work', '/blog']

export async function GET(context: APIContext) {
  const site = context.site ?? new URL('https://maudeco.de')
  const posts = await getCollection('blog')
  const urls = [
    ...staticPages.map((path) => ({ loc: new URL(path, site).toString() })),
    ...posts.map((post) => ({
      loc: new URL(`/blog/${post.slug}/`, site).toString(),
      lastmod: new Date(post.data.date).toISOString().slice(0, 10),
    })),
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
