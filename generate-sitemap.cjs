const fs = require('fs');
const path = require('path');

const domain = 'https://clinidea.in';

const routes = [
  '/',
  '/about',
  '/contact',
  '/program',
  '/clinical-research-cr-pv-dm-course',
  '/clinical-research-medical-writing-course',
  '/clinical-research-pharmacovigilance-course',
  '/clinical-research-regulatory-affairs-course',
  '/clinical-research-data-management-course',
  '/clinical-research-medical-coding-course',
  '/blogs',
  '/events',
  '/placements',
];

// Generate sitemap.xml
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `
  <url>
    <loc>${domain}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

const distPath = path.join(__dirname, 'public');

if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath);
}

fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemapContent);
console.log('sitemap.xml generated successfully in public/');

// Generate robots.txt
const robotsContent = `User-agent: *
Allow: /

Disallow: /admin/
Disallow: /student/
Disallow: /login
Disallow: /register

Sitemap: ${domain}/sitemap.xml`;

fs.writeFileSync(path.join(distPath, 'robots.txt'), robotsContent);
console.log('robots.txt generated successfully in public/');
