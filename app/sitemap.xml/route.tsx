export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${process.env.NEXT_PUBLIC_SITE_URL}</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${process.env.NEXT_PUBLIC_SITE_URL}/pricing</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${process.env.NEXT_PUBLIC_SITE_URL}/download</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${process.env.NEXT_PUBLIC_SITE_URL}/login</loc>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${process.env.NEXT_PUBLIC_SITE_URL}/support</loc>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${process.env.NEXT_PUBLIC_SITE_URL}/legal/privacy</loc>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${process.env.NEXT_PUBLIC_SITE_URL}/legal/terms</loc>
    <priority>0.4</priority>
  </url>
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}