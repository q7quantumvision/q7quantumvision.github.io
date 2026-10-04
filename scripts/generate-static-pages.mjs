import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = path.join(projectRoot, 'dist');
const siteUrl = 'https://www.q7quantumvision.com';
const insights = JSON.parse(await readFile(path.join(projectRoot, 'content', 'insights.json'), 'utf8'));
const insightSlugs = new Set(insights.map(item => item.slug));

if (insightSlugs.size !== insights.length) {
  throw new Error('Insight slugs must be unique.');
}

for (const item of insights) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date) || item.related.some(slug => !insightSlugs.has(slug))) {
    throw new Error(`Invalid article date or related-article slug: ${item.slug}`);
  }
}

const pages = [
  {
    path: '/',
    title: 'Engineering the Transition to the Quantum Era',
    description: 'Q7 Quantum Vision develops research-driven approaches for quantum-safe cybersecurity, emerging quantum technologies and engineering simulation.',
  },
  {
    path: '/solutions',
    title: 'Solutions',
    description: 'Outcome-led support for post-quantum readiness, cryptographic inventories, migration architecture and technical validation.',
  },
  {
    path: '/q-simula',
    title: 'Q-Simula',
    description: "Q-Simula is Q7's simulation and experimentation environment. Its PQC migration module is in development; QEC is a research direction.",
  },
  {
    path: '/research',
    title: 'Research & Innovation',
    description: "Q7's research areas include post-quantum cryptography, crypto-agility, quantum error correction, fault tolerance, simulation and benchmarking.",
  },
  {
    path: '/insights',
    title: 'Insights',
    description: 'Technical notes on discovery, architecture and validation for teams preparing for a post-quantum transition.',
  },
  ...insights.map(({ slug, title, summary, date, author, readingTime, tags, sections, related }) => ({
    path: `/insights/${slug}`,
    title,
    description: summary,
    date,
    author,
    readingTime,
    tags,
    sections,
    related,
    article: true,
  })),
  {
    path: '/about',
    title: 'About Q7',
    description: 'Q7 Quantum Vision is a DeepTech initiative at the intersection of cybersecurity, cryptography and quantum computing.',
  },
  {
    path: '/contact',
    title: 'Contact',
    description: 'Contact Q7 Quantum Vision about research collaborations, PQC migration projects, technical partnerships, incubation or Q-Simula.',
  },
  {
    path: '/privacy',
    title: 'Privacy Notice',
    description: 'Privacy information for inquiries submitted to Q7 Quantum Vision.',
  },
  {
    path: '/legal',
    title: 'Legal Notice',
    description: 'Legal and maturity information about Q7 Quantum Vision and this website.',
  },
];

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function renderFallback(page) {
  const nav = `<nav aria-label="Main navigation"><a href="/">Home</a> | <a href="/solutions/">Solutions</a> | <a href="/q-simula/">Q-Simula</a> | <a href="/research/">Research</a> | <a href="/insights/">Insights</a> | <a href="/about/">About</a> | <a href="/contact/">Contact</a></nav>`;
  let content;

  if (page.path === '/') {
    content = `<h1>Engineering the Transition to the Quantum Era</h1><p>Q7 Quantum Vision develops research-driven approaches, engineering methodologies and simulation environments for quantum-safe cybersecurity and emerging quantum technologies.</p><h2>Quantum-Safe Security</h2><p>Cryptographic discovery, inventory and CBOM, risk assessment, crypto-agility, migration architecture, planning and technical validation.</p><h2>Quantum Computing &amp; Fault Tolerance</h2><p>Research and experimentation around quantum error correction, fault-tolerant architectures, code benchmarking and simulation methods.</p><h2>Q-Simula</h2><p>Simulate. Understand. Optimize. Explore complex transitions in controlled, reproducible environments. Q-Simula is in development.</p>`;
  } else if (page.path === '/solutions') {
    content = `<h1>Solutions</h1><p>Research-driven methods to help teams understand scope, evaluate options and plan post-quantum transitions.</p><ul><li>PQC readiness and discovery</li><li>Cryptographic inventory and CBOM</li><li>Migration architecture and crypto-agility</li><li>Technical validation and simulation</li></ul>`;
  } else if (page.path === '/q-simula') {
    content = `<h1>Q-Simula</h1><p>A simulation and experimentation environment designed to transform complex scientific and engineering questions into structured, testable decision workflows.</p><h2>PQC Migration: In development</h2><p>A simulated enterprise environment for evaluating migration workflows without touching production systems.</p><ol><li>Crypto Discovery</li><li>Macro Inventory</li><li>Detailed Crypto Inventory</li><li>CBOM</li><li>Risk &amp; Prioritization</li><li>Migration Planning</li><li>Target Architecture</li><li>Cost &amp; Resources</li><li>Validation</li></ol><h2>QEC: R&amp;D</h2><p>A future research and benchmarking direction, not a finished software product.</p>`;
  } else if (page.path === '/research') {
    content = `<h1>Research &amp; Innovation</h1><p>Q7 explores post-quantum cryptography and crypto-agility, quantum error correction, fault-tolerant quantum computing, simulation and benchmarking.</p><h2>Research record</h2><p>No publications, repositories or collaborations are listed until there is a public reference to verify.</p><h2>Quantum error correction</h2><ol><li>Encode logical information across physical qubits.</li><li>Consider errors affecting operations and storage.</li><li>Measure syndrome information.</li><li>Decode and choose a correction under stated assumptions.</li></ol><p>Conceptual overview only. No benchmark or hardware result is reported.</p>`;
  } else if (page.path === '/insights') {
    content = `<h1>Insights</h1><p>Technical notes on discovery, architecture and validation for teams preparing for a post-quantum transition.</p>${insights.map(item => `<article><h2><a href="/insights/${escapeHtml(item.slug)}/">${escapeHtml(item.title)}</a></h2><p>${escapeHtml(item.summary)}</p><p>${escapeHtml(item.author)} | ${escapeHtml(item.readingTime)} | ${item.tags.map(escapeHtml).join(', ')}</p></article>`).join('')}`;
  } else if (page.article) {
    content = `<article><p><time datetime="${escapeHtml(page.date)}">${escapeHtml(page.date)}</time> | ${escapeHtml(page.author)} | ${escapeHtml(page.readingTime)}</p><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.description)}</p>${page.sections.map(section => `<section><h2>${escapeHtml(section.heading)}</h2>${section.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}${section.bullets ? `<ul>${section.bullets.map(bullet => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>` : ''}</section>`).join('')}<h2>Related reading</h2><ul>${page.related.map(slug => `<li><a href="/insights/${escapeHtml(slug)}/">${escapeHtml(insights.find(item => item.slug === slug)?.title ?? slug)}</a></li>`).join('')}</ul></article>`;
  } else if (page.path === '/about') {
    content = `<h1>From research to engineering decisions.</h1><p>Q7 Quantum Vision is a DeepTech initiative at the intersection of cybersecurity, cryptography and quantum computing. Its work focuses on post-quantum migration, quantum error correction and simulation methods.</p><h2>Founder and team</h2><h3>Quantum-safe security</h3><p>Post-quantum cryptography, migration and crypto-agility.</p><h3>Quantum computing</h3><p>Quantum error correction and fault-tolerant architectures.</p><h3>Engineering simulation</h3><p>Structured workflows for studying technical transitions.</p><p><a href="mailto:contact@q7quantumvision.com">Contact Q7</a></p>`;
  } else if (page.path === '/contact') {
    content = `<h1>Contact Q7 Quantum Vision</h1><p>For research collaborations, PQC migration projects, technical partnerships, incubation or Q-Simula discussions, email <a href="mailto:contact@q7quantumvision.com">contact@q7quantumvision.com</a>.</p>`;
  } else if (page.path === '/privacy') {
    content = `<h1>Privacy notice</h1><p>The contact form requests your name, professional email, optional organization, subject and message. Q7 uses these details to review and respond to your inquiry. Do not submit passwords, confidential client details or other sensitive information.</p><p>To ask about, correct or request removal of information submitted through the form, email <a href="mailto:contact@q7quantumvision.com">contact@q7quantumvision.com</a>.</p>`;
  } else {
    content = `<h1>Legal notice</h1><p>Q7 Quantum Vision is a DeepTech initiative under development. Website content is general information, not legal, security or engineering advice. Contact <a href="mailto:contact@q7quantumvision.com">contact@q7quantumvision.com</a> with questions.</p>`;
  }

  return `<noscript><main class="mx-auto max-w-4xl space-y-6 px-5 py-10 text-slate-100">${nav}${content}<footer><a href="/privacy/">Privacy notice</a> | <a href="/legal/">Legal notice</a></footer></main></noscript>`;
}

function setMeta(html, attribute, key, value) {
  const tag = new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`, 'i');
  const replacement = `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;
  if (tag.test(html)) return html.replace(tag, replacement);
  return html.replace('</head>', `  ${replacement}\n  </head>`);
}

function setCanonical(html, url) {
  const tag = /<link\s+rel="canonical"[^>]*>/i;
  const replacement = `<link rel="canonical" href="${escapeHtml(url)}" />`;
  if (tag.test(html)) return html.replace(tag, replacement);
  return html.replace('</head>', `  ${replacement}\n  </head>`);
}

const indexTemplate = await readFile(path.join(distDirectory, 'index.html'), 'utf8');

for (const page of pages) {
  const canonicalUrl = `${siteUrl}${page.path === '/' ? '/' : page.path}`;
  let html = indexTemplate.replace(/<title>[^<]*<\/title>/i, `<title>${page.title} | Q7 Quantum Vision</title>`);
  html = setMeta(html, 'name', 'description', page.description);
  html = setMeta(html, 'property', 'og:title', `${page.title} | Q7 Quantum Vision`);
  html = setMeta(html, 'property', 'og:description', page.description);
  html = setMeta(html, 'property', 'og:url', canonicalUrl);
  const socialImage = page.article ? `${siteUrl}/insights-cover.svg` : `${siteUrl}/q-simula-logo.png`;
  html = setMeta(html, 'property', 'og:image', socialImage);
  html = setMeta(html, 'property', 'og:type', page.article ? 'article' : 'website');
  html = setMeta(html, 'name', 'twitter:title', `${page.title} | Q7 Quantum Vision`);
  html = setMeta(html, 'name', 'twitter:description', page.description);
  html = setMeta(html, 'name', 'twitter:image', socialImage);
  html = setCanonical(html, canonicalUrl);
  html = html.replace('</body>', `  ${renderFallback(page)}\n  </body>`);

  if (page.article) {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: page.title,
      description: page.description,
      datePublished: page.date,
      author: { '@type': 'Organization', name: 'Q7 Quantum Vision' },
      mainEntityOfPage: canonicalUrl,
      image: socialImage,
    };
    html = html.replace('</head>', `  <script id="article-structured-data" type="application/ld+json">${JSON.stringify(structuredData)}</script>\n  </head>`);
  }

  const outputPath = page.path === '/'
    ? path.join(distDirectory, 'index.html')
    : path.join(distDirectory, ...page.path.slice(1).split('/'), 'index.html');
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);
}

let notFoundHtml = indexTemplate.replace(/<title>[^<]*<\/title>/i, '<title>Page not found | Q7 Quantum Vision</title>');
notFoundHtml = setMeta(notFoundHtml, 'name', 'robots', 'noindex, nofollow');
notFoundHtml = notFoundHtml.replace('</body>', '  <noscript><main><h1>Page not found</h1><p>The requested page could not be found.</p><a href="/">Return to Q7 Quantum Vision</a></main></noscript>\n  </body>');
await writeFile(path.join(distDirectory, '404.html'), notFoundHtml);

const xmlEscape = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url><loc>${siteUrl}${page.path === '/' ? '/' : page.path}</loc></url>`).join('\n')}
</urlset>
`;
await writeFile(path.join(distDirectory, 'sitemap.xml'), sitemap);

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Q7 Quantum Vision Insights</title>
    <link>${siteUrl}/insights/</link>
    <description>Technical notes on cryptographic discovery, migration and quantum engineering.</description>
    <language>en</language>
${insights.map(item => `    <item>
      <title>${xmlEscape(item.title)}</title>
      <link>${siteUrl}/insights/${item.slug}</link>
      <guid>${siteUrl}/insights/${item.slug}</guid>
      <description>${xmlEscape(item.summary)}</description>
      <author>${xmlEscape(item.author)}</author>
      <pubDate>${new Date(`${item.date}T12:00:00Z`).toUTCString()}</pubDate>
${item.tags.map(tag => `      <category>${xmlEscape(tag)}</category>`).join('\n')}
    </item>`).join('\n')}
  </channel>
</rss>
`;
await writeFile(path.join(distDirectory, 'feed.xml'), rss);
