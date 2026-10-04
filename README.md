# Q7 Quantum Vision

## Local development

Install dependencies with `npm install`, then run `npm run dev`. Check changes with `npm run typecheck`, `npm run lint` and `npm run build`.

## Updating website content

Public page layouts are in `src/PublicSite.tsx`; article metadata and copy are maintained in `content/insights.json`. Navigation and route configuration are in `src/App.tsx`. Keep descriptions aligned with the actual maturity of the work, and do not add unverified team, customer or performance claims.

To publish another Insight:

1. Add its slug, title, publication date, author, summary, reading time, tags, sections and related article slugs to `content/insights.json`.
2. Use a stable lowercase slug and verify that each related slug exists in the same file.
3. Run `npm run build`. The build creates a static route, canonical and social metadata, article structured data, a sitemap entry and an RSS item.

The production build generates static route entry points, route-specific metadata, no-JavaScript content fallbacks, `404.html`, `sitemap.xml` and `feed.xml` for GitHub Pages. Page metadata is also updated by the React page component for client-side navigation.

The Q-Simula logo is stored at `public/q-simula-logo.png`; the Q7 site favicon is `public/favicon.svg`. The reusable Insights cover is `public/insights-cover.svg`.
