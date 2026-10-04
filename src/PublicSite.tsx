import { FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check, ChevronRight, ShieldCheck, Sparkles, ShieldHalf } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import insights from '../content/insights.json';

const siteUrl = 'https://www.q7quantumvision.com';
type Insight = Omit<(typeof insights)[number], 'sections' | 'related'> & {
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
  related: string[];
};
const insightArticles: Insight[] = insights;
const insightBySlug = new Map(insightArticles.map((item) => [item.slug, item]));
const insightCover = `${siteUrl}/insights-cover.svg`;
const migrationSteps = [
  'Crypto Discovery',
  'Macro Inventory',
  'Detailed Crypto Inventory',
  'CBOM',
  'Risk & Prioritization',
  'Migration Planning',
  'Target Architecture',
  'Cost & Resources',
  'Validation',
];

const capabilities = [
  {
    icon: ShieldCheck,
    title: 'PQC Readiness & Discovery',
    copy: 'Understand where vulnerable cryptography exists and establish a migration scope grounded in evidence.',
  },
  {
    icon: Sparkles,
    title: 'Crypto Inventory & CBOM',
    copy: 'Structure cryptographic assets, usages, dependencies, evidence and gaps into decision-ready inventories.',
  },
  {
    icon: ShieldHalf,
    title: 'Migration Architecture & Crypto-Agility',
    copy: 'Define target states, sequencing, replaceable cryptographic components and transition constraints.',
  },
  {
    icon: Check,
    title: 'Technical Validation & Simulation',
    copy: 'Use controlled environments to test assumptions, migration choices and operational impacts before production.',
  },
];

function Metadata({ title, description, path }: { title: string; description: string; path: string }) {
  useEffect(() => {
    const canonicalUrl = `${siteUrl}${path === '/' ? '' : path}`;
    const fullTitle = `${title} | Q7 Quantum Vision`;
    document.title = fullTitle;

    const setMeta = (selector: string, attribute: 'name' | 'property', key: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.append(element);
      }
      element.content = content;
    };

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[property="og:image"]', 'property', 'og:image', path.startsWith('/insights/') ? insightCover : `${siteUrl}/q-simula-logo.png`);
    setMeta('meta[property="og:type"]', 'property', 'og:type', path.startsWith('/insights/') ? 'article' : 'website');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', path.startsWith('/insights/') ? insightCover : `${siteUrl}/q-simula-logo.png`);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = canonicalUrl;

    document.head.querySelector('#article-structured-data')?.remove();
    const currentArticle = insightBySlug.get(path.split('/').pop() || '');
    if (currentArticle) {
      const structuredData = document.createElement('script');
      structuredData.id = 'article-structured-data';
      structuredData.type = 'application/ld+json';
      structuredData.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: currentArticle.title,
        description: currentArticle.summary,
        datePublished: currentArticle.date,
        author: { '@type': 'Organization', name: currentArticle.author },
        mainEntityOfPage: canonicalUrl,
        image: insightCover,
      });
      document.head.append(structuredData);
    }
  }, [description, path, title]);

  return null;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#1296FF]"><span className="h-px w-8 bg-[#1296FF]" />{children}</div>;
}

function Intro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <section className="mx-auto max-w-7xl px-5 pb-14 pt-40 lg:px-8"><Eyebrow>{eyebrow}</Eyebrow><h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl">{title}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">{copy}</p></section>;
}

function StepList({ steps, lifecycle = false }: { steps: string[]; lifecycle?: boolean }) {
  return <ol className={`grid gap-3 ${lifecycle ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-9' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>{steps.map((step, index) => <li key={step} className={`${lifecycle ? 'min-h-24 flex-col items-start gap-3 p-3 lg:min-h-36' : 'min-h-20 items-center gap-4 p-4'} flex rounded-lg border border-white/10 bg-white/[0.03]`}><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#1296FF]/50 text-sm font-semibold text-[#1296FF]">{String(index + 1).padStart(2, '0')}</span><span className={`${lifecycle ? 'text-xs leading-5 lg:text-[11px]' : 'text-sm'} font-medium text-slate-200`}>{step}</span></li>)}</ol>;
}

function EnterpriseCryptoMap() {
  const systems = [
    { x: 24, y: 42, label: 'Applications' },
    { x: 315, y: 20, label: 'APIs' },
    { x: 665, y: 42, label: 'TLS endpoints' },
    { x: 822, y: 183, label: 'PKI / certificates' },
    { x: 665, y: 324, label: 'HSM / KMS' },
    { x: 315, y: 346, label: 'Databases' },
    { x: 24, y: 324, label: 'Third-party services' },
    { x: 24, y: 183, label: 'Evidence sources' },
  ];
  return <>
    <svg className="hidden h-auto w-full md:block" viewBox="0 0 1040 430" role="img" aria-labelledby="enterprise-map-title enterprise-map-description">
      <title id="enterprise-map-title">Conceptual map of cryptography in a simulated enterprise</title>
      <desc id="enterprise-map-description">Applications, APIs, TLS endpoints, certificates, key management, databases, third parties and evidence connect to a central cryptographic inventory.</desc>
      <g fill="none" stroke="#1296ff" strokeOpacity=".6" strokeWidth="2">
        {systems.map(({ x, y, label }) => {
          const fromX = x < 400 ? x + 180 : x > 650 ? x : x + 90;
          const fromY = y < 80 ? y + 52 : y > 310 ? y : y + 26;
          return <path key={label} d={`M ${fromX} ${fromY} L 520 216`} />;
        })}
      </g>
      <g fill="#0b1421" stroke="#c8d0db" strokeOpacity=".45">
        {systems.map(({ x, y, label }) => <rect key={label} x={x} y={y} width="180" height="52" rx="8" />)}
        <rect x="400" y="168" width="240" height="96" rx="12" fill="#081b52" stroke="#1296ff" strokeWidth="2" />
      </g>
      <g fill="#ffffff" fontFamily="Inter, Segoe UI, Arial, sans-serif" fontSize="15" fontWeight="500" textAnchor="middle">
        {systems.map(({ x, y, label }) => <text key={label} x={x + 90} y={y + 32}>{label}</text>)}
        <text x="520" y="207" fontSize="17" fontWeight="600">Cryptographic</text>
        <text x="520" y="232" fontSize="17" fontWeight="600">inventory &amp; CBOM</text>
      </g>
    </svg>
    <div className="grid grid-cols-2 gap-2 md:hidden">
      <div className="col-span-2 rounded-lg border border-[#1296FF]/40 bg-[#081B52] p-4 text-center text-sm font-semibold text-white">Cryptographic inventory &amp; CBOM</div>
      {systems.map(({ label }) => <div key={label} className="rounded-lg border border-white/15 bg-white/[0.03] p-3 text-center text-xs font-medium text-slate-200">{label}</div>)}
    </div>
  </>;
}

export function HomePage() {
  return <>
    <Metadata title="Engineering the Transition to the Quantum Era" description="Q7 Quantum Vision develops research-driven approaches for quantum-safe cybersecurity, emerging quantum technologies and engineering simulation." path="/" />
    <section className="relative px-5 pb-20 pt-40 lg:px-8">
      <div className="hero-orbit" />
      <div className="relative z-10 mx-auto grid min-h-[520px] max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-3xl">
          <Eyebrow>Research-driven DeepTech initiative</Eyebrow>
          <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-7xl">Engineering the Transition to the <span className="text-[#1296FF]">Quantum Era</span></h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">Q7 Quantum Vision develops research-driven approaches, engineering methodologies and simulation environments for quantum-safe cybersecurity and emerging quantum technologies.</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/q-simula" className="button-primary">Explore Q-Simula <ArrowRight size={17} /></Link>
            <Link to="/contact" className="button-secondary">Contact Us <ChevronRight size={17} /></Link>
          </div>
          <p className="mt-8 text-sm text-slate-400">An initiative in development across security, research and simulation.</p>
        </div>
        <div className="mx-auto flex min-h-64 w-full max-w-lg items-center justify-center gap-5" aria-label="Q7 Quantum Vision logo and brand mark">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" className="h-32 w-32 rounded-full object-cover sm:h-40 sm:w-40" />
          <span className="font-display text-xl font-semibold tracking-[0.18em] text-white sm:text-2xl">Q7 <span className="text-cyan-300">QUANTUM</span><br /><span className="text-[0.72rem] tracking-[0.32em] text-slate-400 sm:text-sm">VISION</span></span>
        </div>
      </div>
    </section>
    <section className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <Eyebrow>Two connected pillars</Eyebrow>
        <div className="grid gap-6 md:grid-cols-2">
          <article className="card">
            <h2 className="font-display text-3xl font-semibold text-white">Quantum-Safe Security</h2>
            <p className="mt-4 leading-7 text-slate-300">Support organizations preparing for post-quantum migration through cryptographic discovery, inventory and CBOM, risk assessment, crypto-agility, migration architecture, planning and technical validation.</p>
            <div className="mt-6"><StepList steps={['Discover', 'Inventory', 'Assess', 'Prioritize', 'Migrate', 'Validate']} /></div>
            <Link to="/solutions" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-[#1296FF] hover:text-white">Explore solutions <ArrowRight size={16} /></Link>
          </article>
          <article className="card">
            <h2 className="font-display text-3xl font-semibold text-white">Quantum Computing &amp; Fault Tolerance</h2>
            <p className="mt-4 leading-7 text-slate-300">Research and experimentation around quantum error correction, fault-tolerant architectures, code benchmarking and simulation methods for evaluating quantum systems.</p>
            <span className="mt-6 inline-flex rounded-full border border-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-slate-300">Research &amp; development</span>
            <Link to="/research" className="mt-7 flex w-fit items-center gap-2 text-sm font-medium text-[#1296FF] hover:text-white">Explore research <ArrowRight size={16} /></Link>
          </article>
        </div>
      </div>
    </section>
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <div className="rounded-2xl bg-white p-5"><img src="/q-simula-logo.png" alt="Q-Simula logo and the tagline Simulate. Understand. Optimize." className="mx-auto h-auto max-h-64 w-full object-contain" loading="lazy" /></div>
      <div><Eyebrow>Q7's simulation environment</Eyebrow><h2 className="font-display text-4xl font-semibold text-white md:text-5xl">Simulate. Understand. Optimize.</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Explore complex technology transitions in controlled, reproducible environments before they reach operational systems. Q-Simula is in development as a simulation and experimentation environment.</p><Link to="/q-simula" className="button-primary mt-7">Discover Q-Simula <ArrowRight size={16} /></Link></div>
    </section>
  </>;
}

export function SolutionsPage() {
  return <>
    <Metadata title="Solutions" description="Outcome-led support for post-quantum readiness, cryptographic inventories, migration architecture and technical validation." path="/solutions" />
    <Intro eyebrow="Solutions / What we do" title="Make the next cryptographic transition an engineering decision." copy="Q7 is developing research-driven methodologies and controlled environments to help teams understand scope, evaluate options and plan post-quantum transitions." />
    <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
      <div className="grid gap-5 md:grid-cols-2">{capabilities.map(({ icon: Icon, title, copy }, index) => <article key={title} className="card"><div className="icon-box"><Icon size={21} /></div><div className="mt-7 text-xs uppercase tracking-[0.2em] text-slate-500">0{index + 1}</div><h2 className="mt-2 font-display text-2xl font-semibold text-white">{title}</h2><p className="mt-4 leading-7 text-slate-300">{copy}</p></article>)}</div>
      <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-9"><Eyebrow>Migration strategy</Eyebrow><h2 className="mb-7 font-display text-3xl font-semibold text-white">Plan the transition in stages</h2><div className="grid gap-3 md:grid-cols-3">{[['Legacy', 'Document current cryptography, dependencies and operational constraints'], ['Hybrid transition', 'Assess coexistence, interoperability and sequencing options'], ['PQC target state', 'Specify target architecture and validation criteria']].map(([name, copy]) => <div key={name} className="rounded-lg border border-white/10 bg-[#0b1421] p-5"><h3 className="font-display text-xl text-white">{name}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p></div>)}</div></div>
      <div className="mt-12 rounded-2xl border border-white/10 p-6 sm:p-9">
        <Eyebrow>Crypto-agility architecture</Eyebrow>
        <h2 className="mb-7 font-display text-3xl font-semibold text-white">Separate application needs from replaceable implementations</h2>
        <div className="grid items-stretch gap-3 text-center md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center">
          {['Applications and protocols', 'Stable cryptographic interface', 'Replaceable provider', 'Algorithm and configuration'].map((label, index) => <div key={label} className="contents">
            <div className="rounded-lg border border-white/15 bg-white/[0.03] p-4 text-sm font-medium text-slate-200">{label}</div>
            {index < 3 && <ArrowRight className="mx-auto rotate-90 text-[#1296FF] md:rotate-0" size={18} aria-hidden="true" />}
          </div>)}
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-400">Conceptual architecture only. Actual boundaries, providers and validation requirements depend on each system.</p>
      </div>
    </section>
  </>;
}

export function QSimulaPage() {
  return <>
    <Metadata title="Q-Simula" description="Q-Simula is Q7's simulation and experimentation environment. Its PQC migration module is in development; QEC is a research direction." path="/q-simula" />
    <Intro eyebrow="Q-Simula / Simulation environment" title="Turn complex engineering questions into testable workflows." copy="Q-Simula is a simulation and experimentation environment designed to transform complex scientific and engineering questions into structured, testable decision workflows." />
    <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
      <div className="grid items-center gap-10 rounded-3xl border border-white/10 bg-[#0a1424] p-6 sm:p-10 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-xl bg-white p-3"><img src="/q-simula-logo.png" alt="Q-Simula: Simulate. Understand. Optimize." className="h-auto w-full" /></div>
        <div><span className="rounded-full border border-[#1296FF]/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#1296FF]">Platform family</span><h2 className="mt-5 font-display text-3xl font-semibold text-white">One environment. Distinct research and engineering modules.</h2><p className="mt-4 leading-7 text-slate-300">Q-Simula is the umbrella platform. PQC Migration is its first concrete module and is in development. QEC remains a research and benchmarking direction.</p></div>
      </div>
    </section>
    <section className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex flex-wrap items-center gap-3"><Eyebrow>Q-Simula / PQC Migration</Eyebrow><span className="mb-5 rounded-full border border-amber-300/30 px-3 py-1 text-xs font-medium text-amber-200">In development</span></div>
        <h2 className="mb-5 font-display text-3xl font-semibold text-white md:text-4xl">Explore the migration lifecycle without touching production.</h2>
        <p className="mb-8 max-w-3xl leading-7 text-slate-300">A realistic simulated enterprise environment for learning, testing and evaluating the post-quantum migration lifecycle. This is a controlled simulation concept, not a live production assessment.</p>
        <StepList steps={migrationSteps} lifecycle />
        <div className="mt-12 rounded-2xl border border-white/10 bg-[#08111f] p-6 sm:p-8">
          <Eyebrow>Conceptual simulated enterprise</Eyebrow>
          <h3 className="mb-6 font-display text-2xl font-semibold text-white">Cryptography appears across systems and evidence</h3>
          <figure><EnterpriseCryptoMap /><figcaption className="sr-only">Illustrative connections between common enterprise systems and a cryptographic inventory.</figcaption></figure>
          <p className="mt-5 text-xs leading-5 text-slate-400">Illustrative categories only. This diagram does not represent a client environment or measured result.</p>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="card border-l-4 border-l-[#1296FF]"><Eyebrow>Q-Simula / QEC</Eyebrow><h2 className="font-display text-3xl font-semibold text-white">Quantum error correction: R&amp;D</h2><p className="mt-4 max-w-3xl leading-7 text-slate-300">A future research and benchmarking environment for quantum error-correcting codes and fault-tolerant architectures. This remains a research direction, not a finished software product.</p><Link to="/research" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#1296FF] hover:text-white">Research areas <ArrowRight size={16} /></Link></div>
    </section>
  </>;
}

export function ResearchPage() {
  const areas = ['Post-Quantum Cryptography & Crypto-Agility', 'Quantum Error Correction', 'Fault-Tolerant Quantum Computing', 'Simulation & Benchmarking'];
  const outputs = [
    ['Publications & preprints', 'Peer-reviewed work and preprints, when publicly available.'],
    ['Technical notes', 'Explanations of methods and engineering considerations.'],
    ['Open-source work', 'Repositories and tools with a public source and licence.'],
    ['Collaborations', 'Publicly confirmed research and technical collaborations.'],
  ];
  return <>
    <Metadata title="Research & Innovation" description="Q7's research areas include post-quantum cryptography, crypto-agility, quantum error correction, fault tolerance, simulation and benchmarking." path="/research" />
    <Intro eyebrow="Research & innovation" title="Research translated into engineering questions." copy="Q7 explores the intersection of cybersecurity, cryptography and quantum computing. Research activity and commercial capabilities are distinct; only public or approved material belongs here." />
    <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 lg:grid-cols-2 lg:px-8">
      <div><Eyebrow>Research areas</Eyebrow><ul className="space-y-3">{areas.map((area, index) => <li key={area} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5"><span className="font-display text-sm text-[#1296FF]">0{index + 1}</span><span className="font-medium text-white">{area}</span></li>)}</ul></div>
      <div><Eyebrow>Research record</Eyebrow><h2 className="font-display text-3xl font-semibold text-white">Public work and collaboration</h2><p className="mt-4 leading-7 text-slate-300">The public record is limited to material with an approved source. No publications, repositories or collaborations are listed until there is a public reference to verify.</p><ul className="mt-7 space-y-3">{outputs.map(([title, description]) => <li key={title} className="rounded-lg border border-white/10 px-4 py-4"><h3 className="font-medium text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p></li>)}</ul></div>
    </section>
    <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-9">
        <Eyebrow>Quantum error correction</Eyebrow>
        <h2 className="font-display text-3xl font-semibold text-white">From encoded information to a correction decision</h2>
        <ol className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[['01', 'Encode', 'Logical information is represented across physical qubits.'], ['02', 'Noise', 'Physical operations and storage are subject to errors.'], ['03', 'Measure syndrome', 'Measurements provide information used to identify error patterns.'], ['04', 'Decode and correct', 'A decoder selects a correction under the stated code and noise model.']].map(([number, title, copy]) => <li key={number} className="rounded-lg border border-white/10 bg-white/[0.03] p-5"><span className="text-xs font-semibold tracking-[0.16em] text-[#1296FF]">{number}</span><h3 className="mt-3 font-display text-xl font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p></li>)}</ol>
        <p className="mt-5 text-xs leading-5 text-slate-400">Conceptual overview only. This illustration reports no benchmark or hardware result.</p>
      </div>
    </section>
  </>;
}

export function InsightsPage() {
  return <>
    <Metadata title="Insights" description="Q7 insights on cryptographic discovery, inventories, CBOM and practical post-quantum migration." path="/insights" />
    <Intro eyebrow="Insights" title="Post-quantum migration, explained." copy="Technical notes on discovery, architecture and validation for teams preparing for a cryptographic transition." />
    <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{insightArticles.map((item) => <article key={item.slug} className="card flex flex-col">
        <img src="/insights-cover.svg" alt="Q7 Insights editorial cover artwork in navy and blue" className="mb-6 aspect-[16/7] w-full rounded-lg border border-white/10 object-cover" loading="lazy" />
        <div className="flex flex-wrap gap-2">{item.tags.map(tag => <span key={tag} className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300">{tag}</span>)}</div>
        <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{item.readingTime} <span aria-hidden="true">/</span> {item.author}</p>
        <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-white"><Link className="hover:text-[#1296FF]" to={`/insights/${item.slug}`}>{item.title}</Link></h2>
        <p className="mt-4 flex-1 leading-7 text-slate-300">{item.summary}</p>
        <Link to={`/insights/${item.slug}`} className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#1296FF] hover:underline">Read article <ArrowRight size={16} /></Link>
      </article>)}</div>
    </section>
  </>;
}

export function InsightArticlePage() {
  const { slug } = useParams();
  const article = insightBySlug.get(slug || '');
  if (!article) return <NotFoundPage />;
  const articlePath = `/insights/${article.slug}`;
  return <>
    <Metadata title={article.title} description={article.summary} path={articlePath} />
    <article className="mx-auto max-w-4xl px-5 pb-24 pt-40 lg:px-8">
      <Link to="/insights" className="mb-10 inline-flex items-center gap-2 text-sm text-[#1296FF] hover:text-white"><ChevronRight className="rotate-180" size={16} /> All insights</Link>
      <img src="/insights-cover.svg" alt="Q7 Insights editorial cover artwork in navy and blue" className="mb-8 aspect-[16/7] w-full rounded-xl border border-white/10 object-cover" fetchPriority="high" />
      <div className="flex flex-wrap gap-2">{article.tags.map(tag => <span key={tag} className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300">{tag}</span>)}</div>
      <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-white md:text-6xl">{article.title}</h1>
      <p className="mt-6 text-lg leading-8 text-slate-300">{article.summary}</p>
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-b border-white/10 pb-7 text-sm text-slate-400"><time dateTime={article.date}>{new Date(`${article.date}T12:00:00`).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</time><span>{article.author}</span><span>{article.readingTime}</span></div>
      <div className="mt-10 max-w-none space-y-6 text-slate-300">
        {article.sections.map(section => <section key={section.heading} className="space-y-4"><h2 className="pt-3 font-display text-2xl font-semibold text-white">{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph} className="leading-8">{paragraph}</p>)}{section.bullets && <ul className="list-inside list-disc space-y-2">{section.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}
      </div>
      <section className="mt-14 border-t border-white/10 pt-8"><Eyebrow>Related reading</Eyebrow><ul className="grid gap-3 sm:grid-cols-2">{article.related.map(relatedSlug => {
        const related = insightBySlug.get(relatedSlug);
        return related ? <li key={related.slug}><Link to={`/insights/${related.slug}`} className="block rounded-lg border border-white/10 p-4 text-sm font-medium text-white hover:border-[#1296FF]/50 hover:text-[#1296FF]">{related.title}</Link></li> : null;
      })}</ul></section>
    </article>
  </>;
}

export function AboutPage() {
  return <>
    <Metadata title="About Q7" description="Q7 Quantum Vision is a DeepTech initiative at the intersection of cybersecurity, cryptography and quantum computing." path="/about" />
    <Intro eyebrow="About Q7" title="From research to engineering decisions." copy="Q7 Quantum Vision is a DeepTech initiative at the intersection of cybersecurity, cryptography and quantum computing. Its objective is to transform scientific knowledge into practical methodologies, simulation environments and engineering tools for organizations preparing for the quantum era." />
    <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
      <div className="space-y-6 text-slate-300"><h2 className="font-display text-3xl font-semibold text-white">Research translated into engineering work.</h2><p className="leading-8">Q7 focuses on quantum-safe cybersecurity, cryptography and quantum computing. Its work includes research into post-quantum migration and quantum error correction, alongside the development of simulation methods and engineering workflows.</p><p className="leading-8">The project is at an early stage. Q-Simula's PQC Migration module is in development; quantum error correction remains a research direction.</p><Link to="/contact" className="button-secondary inline-flex">Contact Q7 <ArrowRight size={16} /></Link></div>
      <aside className="card"><Eyebrow>Founder &amp; team</Eyebrow><h2 className="font-display text-2xl font-semibold text-white">Research and engineering focus</h2><dl className="mt-5 space-y-4"><div><dt className="text-sm font-semibold text-white">Quantum-safe security</dt><dd className="mt-1 text-sm leading-6 text-slate-300">Post-quantum cryptography, migration and crypto-agility.</dd></div><div><dt className="text-sm font-semibold text-white">Quantum computing</dt><dd className="mt-1 text-sm leading-6 text-slate-300">Quantum error correction and fault-tolerant architectures.</dd></div><div><dt className="text-sm font-semibold text-white">Engineering simulation</dt><dd className="mt-1 text-sm leading-6 text-slate-300">Structured workflows for studying technical transitions.</dd></div></dl><a href="mailto:contact@q7quantumvision.com" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1296FF] hover:underline">Contact Q7 <ArrowRight size={15} /></a></aside>
    </section>
  </>;
}

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const form = event.currentTarget;
    const values = new FormData(form);
    if (String(values.get('website') ?? '').trim()) {
      setError('We could not process your message. Please try again.');
      setLoading(false);
      return;
    }
    const subject = String(values.get('subject') ?? '').trim();
    const message = String(values.get('message') ?? '').trim();
    try {
      const { error: submitError } = await supabase.from('contact_submissions').insert({
        name: String(values.get('name') ?? '').trim(),
        email: String(values.get('email') ?? '').trim(),
        company: String(values.get('company') ?? '').trim() || null,
        message: `Subject: ${subject}\nPrivacy notice acknowledged: yes\n\n${message}`,
      });
      if (submitError) throw submitError;
      setSent(true);
      form.reset();
    } catch (submitError) {
      console.error('Contact form submission failed', submitError);
      setError('We could not send your message. Please try again or email contact@q7quantumvision.com.');
    } finally {
      setLoading(false);
    }
  }

  return <>
    <Metadata title="Contact" description="Contact Q7 Quantum Vision about research collaborations, PQC migration projects, technical partnerships, incubation or Q-Simula." path="/contact" />
    <Intro eyebrow="Contact Q7" title="Bring us the question you are working through." copy="For research collaborations, PQC migration projects, technical partnerships, incubation or Q-Simula discussions, get in touch." />
    <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-24 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
      <div className="space-y-7"><div><div className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</div><a href="mailto:contact@q7quantumvision.com" className="mt-2 block text-lg text-white hover:text-[#1296FF]">contact@q7quantumvision.com</a></div><p className="border-l border-[#1296FF]/60 pl-5 text-sm leading-7 text-slate-300">Please do not include passwords, confidential client information or other sensitive data in your message.</p></div>
      {sent ? <div role="status" className="card flex min-h-[360px] flex-col items-center justify-center text-center"><div className="icon-box"><Check size={23} /></div><h2 className="mt-6 font-display text-3xl text-white">Message received.</h2><p className="mt-3 max-w-sm leading-7 text-slate-300">Thank you for contacting Q7 Quantum Vision.</p></div> : <form onSubmit={submit} className="card space-y-5">
        <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="contact-website">Leave this field empty</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" /></div>
        <div className="grid gap-5 md:grid-cols-2"><label className="block"><span className="label">Name</span><input className="input" name="name" autoComplete="name" required /></label><label className="block"><span className="label">Professional email</span><input className="input" name="email" type="email" autoComplete="email" required /></label></div>
        <div className="grid gap-5 md:grid-cols-2"><label className="block"><span className="label">Organization (optional)</span><input className="input" name="company" autoComplete="organization" /></label><label className="block"><span className="label">Subject</span><input className="input" name="subject" required /></label></div>
        <label className="block"><span className="label">Message</span><textarea name="message" required minLength={10} rows={5} className="input resize-y" /></label>
        <label className="flex items-start gap-3 text-sm leading-6 text-slate-300"><input className="mt-1 accent-[#1296FF]" type="checkbox" required /><span>I understand my details will be used to respond to this inquiry. See the <Link to="/privacy" className="text-[#1296FF] underline">privacy notice</Link>.</span></label>
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <button className="button-primary w-full justify-center" disabled={loading}>{loading ? 'Sending...' : 'Send inquiry'} <ArrowRight size={17} /></button>
      </form>}
    </section>
  </>;
}

export function PrivacyPage() {
  return <>
    <Metadata title="Privacy Notice" description="Privacy information for inquiries submitted to Q7 Quantum Vision." path="/privacy" />
    <Intro eyebrow="Privacy notice" title="Information submitted through this website." copy="This notice describes the information collected when you use the Q7 Quantum Vision contact form." />
    <section className="mx-auto max-w-3xl space-y-6 px-5 pb-24 leading-8 text-slate-300 lg:px-8"><p>The contact form requests your name, professional email, an optional organization, a subject and a message. Q7 uses these details to review and respond to your inquiry. Do not submit passwords, confidential client details or other sensitive information.</p><p>To ask about, correct or request removal of information submitted through the form, email <a className="text-[#1296FF] underline" href="mailto:contact@q7quantumvision.com">contact@q7quantumvision.com</a>.</p></section>
  </>;
}

export function LegalPage() {
  return <>
    <Metadata title="Legal Notice" description="Legal and maturity information about Q7 Quantum Vision and this website." path="/legal" />
    <Intro eyebrow="Legal notice" title="About this website." copy="Q7 Quantum Vision is a DeepTech initiative under development." />
    <section className="mx-auto max-w-3xl space-y-6 px-5 pb-24 leading-8 text-slate-300 lg:px-8"><p>This website describes research areas, development directions and intended workflows. Descriptions of Q-Simula and related modules reflect their stated development or research status and are not claims of general availability, certification, measured performance or suitability for a particular deployment.</p><p>Website content is provided for general information and is not legal, security or engineering advice. Verify technical and regulatory decisions against your own requirements and appropriate primary sources.</p><p>For questions about this website, contact <a className="text-[#1296FF] underline" href="mailto:contact@q7quantumvision.com">contact@q7quantumvision.com</a>.</p></section>
  </>;
}

export function NotFoundPage() {
  return <>
    <Metadata title="Page not found" description="The page you requested could not be found." path="/404" />
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-5 pt-28 text-center"><Eyebrow>404 / Page not found</Eyebrow><h1 className="font-display text-5xl font-semibold text-white md:text-7xl">This page is not here.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">The address may have changed. Return to the homepage or explore Q7's current work.</p><Link to="/" className="button-primary mt-8">Back to home <ArrowRight size={16} /></Link></section>
  </>;
}
