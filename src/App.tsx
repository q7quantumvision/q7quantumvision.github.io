import { FormEvent, useEffect, useState } from 'react';
import { createHashRouter, Link, NavLink, Navigate, RouterProvider, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, ChevronRight, CircleUserRound, Construction, LayoutDashboard, Lock, Menu, Moon, MoveUpRight, Plus, ShieldCheck, ShieldHalf, Sparkles, Sun, Users, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Profile = { id: string; full_name: string; is_admin: boolean };
type Project = { id: string; user_id: string; name: string; progress: number; status: string; created_at: string; updated_at: string };

const navItems = [['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/blog', 'Insights'], ['/contact', 'Contact']] as const;
const statuses = ['Calibrating', 'Running Simulations', 'Completed'];

const IMG = {
  processor: 'https://images.pexels.com/photos/30547566/pexels-photo-30547566.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  circuit1: 'https://images.pexels.com/photos/36169774/pexels-photo-36169774.jpeg?auto=compress&cs=tinysrgb&w=940&h=650',
  circuit2: 'https://images.pexels.com/photos/36169769/pexels-photo-36169769.jpeg?auto=compress&cs=tinysrgb&w=940&h=650',
  circuit3: 'https://images.pexels.com/photos/36169771/pexels-photo-36169771.jpeg?auto=compress&cs=tinysrgb&w=940&h=650',
  fibers: 'https://images.pexels.com/photos/8640331/pexels-photo-8640331.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  bluePattern: 'https://images.pexels.com/photos/12537427/pexels-photo-12537427.jpeg?auto=compress&cs=tinysrgb&w=940&h=650',
  lightTrails: 'https://images.pexels.com/photos/12060425/pexels-photo-12060425.jpeg?auto=compress&cs=tinysrgb&w=940&h=650',
  qubits: 'https://images.pexels.com/photos/25626446/pexels-photo-25626446.jpeg?auto=compress&cs=tinysrgb&w=940&h=650',
};

const sampleProjects: Project[] = [
  { id: 's1', user_id: '', name: 'Quantum Core Calibration', progress: 72, status: 'Running Simulations', created_at: '', updated_at: '' },
  { id: 's2', user_id: '', name: 'Photon Entanglement Test', progress: 45, status: 'Calibrating', created_at: '', updated_at: '' },
  { id: 's3', user_id: '', name: 'Qubit Stability Scan', progress: 100, status: 'Completed', created_at: '', updated_at: '' },
];

function useTheme() {
  const [light, setLight] = useState(() => localStorage.getItem('q7-theme') === 'light');
  useEffect(() => {
    document.documentElement.classList.toggle('light-theme', light);
    localStorage.setItem('q7-theme', light ? 'light' : 'dark');
  }, [light]);
  return [light, setLight] as const;
}

function ThemeToggle() {
  const [light, setLight] = useTheme();
  return <button onClick={() => setLight(!light)} className="theme-toggle" aria-label={`Switch to ${light ? 'dark' : 'light'} mode`} title={`Switch to ${light ? 'dark' : 'light'} mode`}><span>{light ? <Moon size={16} /> : <Sun size={16} />}</span><span className="hidden sm:inline">{light ? 'Dark' : 'Light'}</span></button>;
}

function Logo() {
  return <Link to="/" className="flex items-center gap-3"><img src={`${import.meta.env.BASE_URL}logo.png`} alt="Q7 Quantum Vision" className="h-10 w-10 rounded-full object-cover" /><span className="font-display text-sm font-semibold tracking-[0.18em] text-white">Q7 <span className="text-cyan-300">QUANTUM</span><br /><span className="text-[10px] tracking-[0.32em] text-slate-400">VISION SYSTEMS</span></span></Link>;
}

function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  useTheme();
  return <div className="min-h-screen overflow-hidden bg-[#070b12] text-slate-100"><div className="noise" /><header className="site-header fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#070b12]/80 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8"><Logo /><nav className={`${open ? 'absolute left-0 right-0 top-full flex border-b border-white/10 bg-[#070b12] p-5' : 'hidden'} site-nav order-3 flex-col gap-5 md:order-2 md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`}>{navItems.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `text-sm transition ${isActive ? 'text-cyan-300' : 'text-slate-400 hover:text-white'}`}>{label}</NavLink>)}<Link to="/portal" className="button-primary !px-4 !py-2 text-xs">Client Portal <ArrowRight size={14} /></Link></nav><div className="theme-actions order-2 flex items-center gap-3 md:order-3"><ThemeToggle /><button className="rounded-lg border border-white/10 p-2 text-slate-300 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X size={20} /> : <Menu size={20} />}</button></div></div></header><main>{children}</main><footer className="border-t border-white/10 bg-[#060910]"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 text-sm text-slate-500 md:flex-row md:items-center md:justify-between lg:px-8"><Logo /><span>&copy; 2026 Q7 Quantum Vision. Advancing what is possible.</span><div className="flex items-center gap-5"><Link to="/contact" className="hover:text-cyan-300">Connect</Link><Link to="/portal" className="hover:text-cyan-300">Portal</Link><Link to="/admin/dashboard" className="inline-flex items-center gap-1.5 hover:text-cyan-300"><ShieldHalf size={14} /> Admin</Link></div></div></footer></div>;
}

function SectionEyebrow({ children }: { children: React.ReactNode }) { return <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300"><span className="h-px w-8 bg-cyan-300" />{children}</div>; }
function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) { return <section className="mx-auto max-w-7xl px-5 pb-16 pt-40 lg:px-8"><SectionEyebrow>{eyebrow}</SectionEyebrow><h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl">{title}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">{copy}</p></section>; }

function Home() {
  const landingServices = [
    { icon: ShieldCheck, title: 'Error Correction', copy: 'Quantum error correction codes that protect fragile qubit states from decoherence and noise.', img: IMG.circuit1 },
    { icon: Sparkles, title: 'Visualization', copy: 'Interactive dashboards that make quantum states and circuit behavior visible and intuitive.', img: IMG.bluePattern },
    { icon: ShieldHalf, title: 'Security', copy: 'Post-quantum cryptography and quantum key distribution to secure data against future threats.', img: IMG.circuit2 },
  ];
  return <Layout>
    <section className="relative mx-auto flex min-h-[760px] max-w-7xl items-center px-5 pb-20 pt-40 lg:px-8">
      <div className="hero-orbit" />
      <div className="relative z-10 grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-3xl">
          <SectionEyebrow>Quantum systems. Human outcomes.</SectionEyebrow>
          <h1 className="font-display text-6xl font-semibold leading-[0.96] tracking-tight text-white md:text-8xl">See the future<br /><span className="text-gradient">before it arrives.</span></h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">Q7 Quantum Vision turns complex systems into clear, actionable intelligence, helping leaders navigate uncertainty with precision.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/contact" className="button-primary">Explore a partnership <ArrowRight size={17} /></Link>
            <Link to="/services" className="button-secondary">Our capabilities <ChevronRight size={17} /></Link>
          </div>
          <div className="mt-16 grid max-w-xl grid-cols-3 gap-5 border-t border-white/10 pt-6">
            <div><div className="font-display text-2xl text-white">99.8<span className="text-cyan-300">%</span></div><div className="mt-1 text-xs text-slate-500">Signal clarity</div></div>
            <div><div className="font-display text-2xl text-white">3.2<span className="text-cyan-300">x</span></div><div className="mt-1 text-xs text-slate-500">Faster decisions</div></div>
            <div><div className="font-display text-2xl text-white">24<span className="text-cyan-300">/7</span></div><div className="mt-1 text-xs text-slate-500">Live monitoring</div></div>
          </div>
        </div>
        <div className="relative hidden lg:block">
          <div className="overflow-hidden rounded-2xl border border-cyan-300/20 shadow-[0_0_60px_-15px] shadow-cyan-500/30">
            <img src={IMG.processor} alt="Futuristic quantum processor with glowing elements" className="h-[440px] w-full object-cover" />
          </div>
          <div className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-xl border border-white/10 bg-[#0d1420]/90 px-5 py-4 backdrop-blur-md">
            <div className="pulse-dot" />
            <span className="text-sm text-slate-300">Live quantum processing</span>
          </div>
        </div>
      </div>
    </section>
    <section className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-2 lg:px-8">
        <div>
          <SectionEyebrow>The Q7 perspective</SectionEyebrow>
          <h2 className="font-display text-4xl font-semibold text-white md:text-5xl">Complexity is not the enemy. <span className="text-slate-500">Unclear thinking is.</span></h2>
          <div className="mt-8 space-y-6 text-slate-400">
            <p className="text-lg leading-8">We build quantum-inspired intelligence systems for organizations operating at the edge of what is known. Our work brings order to noisy environments, so your next move is always grounded in signal.</p>
            <Link to="/about" className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-white">Meet the team <ArrowRight size={16} /></Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <img src={IMG.fibers} alt="Glowing optical fibers representing quantum communication" className="h-full min-h-[300px] w-full object-cover" />
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <SectionEyebrow>Core capabilities</SectionEyebrow>
      <h2 className="mb-10 max-w-2xl font-display text-4xl font-semibold text-white md:text-5xl">Three pillars of quantum engineering.</h2>
      <div className="grid gap-5 md:grid-cols-3">
        {landingServices.map(({ icon: Icon, title, copy, img }, i) => (
          <article key={title} className="card group flex flex-col overflow-hidden !p-0">
            <div className="relative h-44 overflow-hidden">
              <img src={img} alt={`${title} quantum technology`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1420] to-transparent" />
              <div className="absolute left-5 top-5 icon-box"><Icon size={20} /></div>
            </div>
            <div className="flex flex-1 flex-col p-7">
              <span className="font-display text-sm text-slate-600">0{i + 1}</span>
              <h3 className="mt-2 font-display text-2xl font-medium text-white">{title}</h3>
              <p className="mt-3 leading-7 text-slate-400">{copy}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.03] p-8 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <h3 className="font-display text-2xl text-white">Ready to go deeper?</h3>
          <p className="mt-2 text-slate-400">Join our interactive quantum workshop and build hands-on experience.</p>
        </div>
        <Link to="/workshop" className="button-primary whitespace-nowrap">Go to Workshop <ArrowRight size={17} /></Link>
      </div>
    </section>
  </Layout>;
}

function About() { return <Layout><PageIntro eyebrow="About Q7" title="A new lens for a changing world." copy="We are a collective of strategists, scientists, and systems thinkers building the intelligence layer for what comes next." /><section className="mx-auto grid max-w-7xl gap-16 px-5 pb-24 lg:grid-cols-[1fr_1.2fr] lg:px-8"><div className="overflow-hidden rounded-2xl border border-cyan-300/20"><img src={IMG.circuit1} alt="Close-up of quantum circuit board with microchips" className="h-full min-h-[380px] w-full object-cover" /></div><div className="space-y-6 text-slate-400"><p className="text-2xl leading-10 text-white">The most important breakthroughs happen when we learn to see connections others miss.</p><p className="leading-8">Q7 Quantum Vision exists to make that kind of clarity accessible. We blend advanced modeling, behavioral insight, and a deep respect for the human context behind every decision.</p><p className="leading-8">Our approach is deliberately independent. We ask better questions, stay curious longer, and translate complexity into momentum your team can feel.</p><Link to="/contact" className="button-secondary inline-flex">Start a conversation <ArrowRight size={16} /></Link></div></section><section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8"><div className="grid gap-5 md:grid-cols-3"><div className="overflow-hidden rounded-2xl border border-white/10"><img src={IMG.qubits} alt="Visual representation of qubits and quantum bits" className="h-56 w-full object-cover" /></div><div className="overflow-hidden rounded-2xl border border-white/10"><img src={IMG.lightTrails} alt="Blue light trails representing data flow" className="h-56 w-full object-cover" /></div><div className="overflow-hidden rounded-2xl border border-white/10"><img src={IMG.circuit3} alt="Circuit board components in detail" className="h-56 w-full object-cover" /></div></div></section></Layout>; }

function Services() { const services = [{ icon: ShieldCheck, title: 'Error Correction', copy: 'Quantum error correction codes that protect fragile qubit states from decoherence and noise.', img: IMG.circuit1 }, { icon: Sparkles, title: 'Visualization', copy: 'Interactive dashboards that make quantum states and circuit behavior visible and intuitive.', img: IMG.bluePattern }, { icon: ShieldHalf, title: 'Security', copy: 'Post-quantum cryptography and quantum key distribution to secure data against future threats.', img: IMG.circuit2 }]; return <Layout><PageIntro eyebrow="Capabilities" title="Intelligence for the moments that matter." copy="From first signal to final decision, we help ambitious organizations operate with a clearer view of what is possible." /><section className="mx-auto grid max-w-7xl gap-5 px-5 pb-28 md:grid-cols-3 lg:px-8">{services.map(({ icon: Icon, title, copy, img }, i) => <article key={title} className="card flex min-h-[420px] flex-col !p-0 overflow-hidden"><div className="relative h-48 overflow-hidden"><img src={img} alt={`${title} quantum technology`} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#0d1420] to-transparent" /><div className="absolute left-5 top-5 icon-box"><Icon size={21} /></div></div><div className="flex flex-1 flex-col p-7"><span className="font-display text-sm text-slate-600">0{i + 1}</span><h2 className="mt-2 font-display text-3xl text-white">{title}</h2><p className="mt-4 leading-7 text-slate-400">{copy}</p><Link to="/contact" className="mt-auto inline-flex items-center gap-2 pt-7 text-sm text-cyan-300">Learn more <ArrowRight size={16} /></Link></div></article>)}</section></Layout>; }

function Blog() { const posts = [{ tag: 'Field Notes', title: 'Why the best strategy starts with better observation', date: 'May 12, 2026' }, { tag: 'Perspective', title: 'The hidden cost of operating on outdated assumptions', date: 'April 28, 2026' }, { tag: 'Signals', title: 'Three ways to make uncertainty useful', date: 'April 04, 2026' }]; return <Layout><PageIntro eyebrow="Q7 / Insights" title="Notes from the edge." copy="Ideas, observations, and practical frameworks for leaders building what comes next." /><section className="mx-auto max-w-7xl px-5 pb-28 lg:px-8"><div className="grid gap-5 md:grid-cols-3">{posts.map((post, i) => <article key={post.title} className={`card group ${i === 0 ? 'md:col-span-2 md:min-h-[300px]' : ''}`}><div className="flex justify-between text-xs uppercase tracking-[0.2em] text-cyan-300"><span>{post.tag}</span><MoveUpRight size={16} className="text-slate-500 transition group-hover:text-cyan-300" /></div><div className="mt-24"><h2 className="max-w-lg font-display text-2xl leading-tight text-white">{post.title}</h2><p className="mt-4 text-sm text-slate-500">{post.date}</p></div></article>)}</div></section></Layout>; }

function Contact() { const [sent, setSent] = useState(false); const [error, setError] = useState(''); const [loading, setLoading] = useState(false); async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); setLoading(true); setError(''); const form = new FormData(e.currentTarget); const { error: submitError } = await supabase.from('contact_submissions').insert({ name: form.get('name'), email: form.get('email'), company: form.get('company'), message: form.get('message') }); setLoading(false); if (submitError) { setError('We could not send your message. Please try again.'); return; } setSent(true); } return <Layout><PageIntro eyebrow="Connect" title="Let us see what is possible." copy="Tell us what you are working toward. We will bring the right questions to the table." /><section className="mx-auto grid max-w-7xl gap-14 px-5 pb-28 lg:grid-cols-[0.7fr_1.3fr] lg:px-8"><div className="space-y-8"><div><div className="text-xs uppercase tracking-[0.2em] text-slate-500">New business</div><a href="mailto:hello@q7quantum.com" className="mt-2 block text-lg text-white hover:text-cyan-300">hello@q7quantum.com</a></div><div><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Based in</div><div className="mt-2 text-lg text-white">New York, London, Everywhere</div></div><div className="border-l border-cyan-300/50 pl-5 text-sm leading-7 text-slate-400">We typically respond within two business days with a thoughtful next step.</div></div>{sent ? <div className="card flex min-h-[360px] flex-col items-center justify-center text-center"><div className="icon-box"><Check size={23} /></div><h2 className="mt-6 font-display text-3xl text-white">Message received.</h2><p className="mt-3 max-w-sm leading-7 text-slate-400">Thanks for reaching out. A member of our team will be in touch shortly.</p></div> : <form onSubmit={submit} className="card space-y-5"><div className="grid gap-5 md:grid-cols-2"><Field label="Name" name="name" required /><Field label="Email" name="email" type="email" required /></div><Field label="Company" name="company" /><label className="block"><span className="label">What are you exploring?</span><textarea name="message" required rows={5} className="input resize-none" placeholder="Tell us a little about the challenge or opportunity..." /></label>{error && <p className="text-sm text-red-300">{error}</p>}<button className="button-primary w-full justify-center" disabled={loading}>{loading ? 'Sending...' : 'Send inquiry'} <ArrowRight size={17} /></button></form>}</section></Layout>; }
function Field({ label, name, type = 'text', required = false }: { label: string; name: string; type?: string; required?: boolean }) { return <label className="block"><span className="label">{label}</span><input className="input" name={name} type={type} required={required} /></label>; }

function Auth({ mode }: { mode: 'login' | 'signup' }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') ?? '').trim().toLowerCase();
    const password = String(form.get('password') ?? '');
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { full_name: form.get('name') } } });

    setLoading(false);
    if (result.error) {
      const message = result.error.message.toLowerCase();
      if (message.includes('invalid login credentials')) {
        setError('That email or password is incorrect. Create the account first, or reset the password in Supabase.');
      } else if (message.includes('email not confirmed')) {
        setError('Confirm your email address before signing in.');
      } else {
        setError(result.error.message);
      }
      return;
    }
    if (mode === 'signup') {
      if (result.data.session) {
        navigate('/dashboard');
      } else {
        setError('Account created. Check your Supabase Auth email-confirmation setting before signing in.');
      }
      return;
    }

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', result.data.user?.id).maybeSingle();
    navigate(profile?.is_admin ? '/admin/dashboard' : '/dashboard');
  }

  return <div className="flex min-h-screen items-center justify-center bg-[#070b12] px-5 py-16"><div className="w-full max-w-md"><div className="mb-10 flex justify-center"><Logo /></div><div className="card"><div className="mb-8"><SectionEyebrow>{mode === 'login' ? 'Secure access' : 'Join Q7'}</SectionEyebrow><h1 className="font-display text-4xl text-white">{mode === 'login' ? 'Welcome back.' : 'Enter the future.'}</h1><p className="mt-3 text-sm leading-6 text-slate-400">{mode === 'login' ? 'Access your Quantum Integration delivery tracker.' : 'Create your client account to follow your delivery.'}</p></div><form onSubmit={submit} className="space-y-5">{mode === 'signup' && <Field label="Full name" name="name" required />}<Field label="Email" name="email" type="email" required /><label className="block"><span className="label">Password</span><input className="input" name="password" type="password" minLength={6} required /></label>{error && <p className="text-sm leading-6 text-cyan-300">{error}</p>}<button className="button-primary w-full justify-center" disabled={loading}>{loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={16} /></button></form><div className="mt-7 border-t border-white/10 pt-6 text-center text-sm text-slate-500">{mode === 'login' ? 'Need an account?' : 'Already have an account?'} <Link className="text-cyan-300 hover:text-white" to={mode === 'login' ? '/signup' : '/login'}>{mode === 'login' ? 'Sign up' : 'Sign in'}</Link></div></div><Link to="/" className="mt-6 flex justify-center text-sm text-slate-500 hover:text-white">Return to main site</Link></div></div>;
}

type ProtectedState = { checking: boolean; hasSession: boolean; allowed: boolean };

function Protected({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const [state, setState] = useState<ProtectedState>({ checking: true, hasSession: false, allowed: false });
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { if (active) setState({ checking: false, hasSession: false, allowed: false }); return; }
      if (!admin) { if (active) setState({ checking: false, hasSession: true, allowed: true }); return; }
      const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', data.session.user.id).maybeSingle();
      if (active) setState({ checking: false, hasSession: true, allowed: profile?.is_admin === true });
    });
    return () => { active = false; };
  }, [admin]);
  if (state.checking) return <div className="flex min-h-screen items-center justify-center bg-[#070b12] text-sm text-slate-400">Verifying access...</div>;
  if (!state.hasSession) return <Navigate to="/login" replace />;
  if (!state.allowed) return <AccessDenied />;
  return <>{children}</>;
}

function AccessDenied() {
  const navigate = useNavigate();
  return <div className="flex min-h-screen flex-col items-center justify-center bg-[#070b12] px-5 text-center">
    <div className="icon-box mb-6"><Lock size={28} /></div>
    <h1 className="font-display text-4xl text-white">Access restricted</h1>
    <p className="mt-4 max-w-sm leading-7 text-slate-400">Your account does not have administrator privileges. This area is reserved for Q7 system administrators.</p>
    <div className="mt-8 flex gap-4">
      <button onClick={() => navigate('/dashboard')} className="button-secondary">Go to client dashboard</button>
      <button onClick={() => navigate('/')} className="button-primary">Back to site</button>
    </div>
  </div>;
}

function PortalShell({ children, admin }: { children: React.ReactNode; admin: boolean }) { const navigate = useNavigate(); async function logout() { await supabase.auth.signOut(); navigate('/login'); } return <div className="min-h-screen bg-[#070b12] text-slate-100"><header className="border-b border-white/10 bg-[#070b12]/90"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8"><Logo /><div className="flex items-center gap-4"><span className="hidden text-xs uppercase tracking-[0.18em] text-slate-500 sm:block">{admin ? 'Admin console' : 'Client portal'}</span><button onClick={logout} className="button-secondary !px-3 !py-2 text-xs">Log out</button></div></div></header>{children}</div>; }

function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { supabase.from('projects').select('*').order('updated_at', { ascending: false }).then(({ data }) => { setProjects(data ?? []); setLoading(false); }); }, []);
  const display = projects.length > 0 ? projects : sampleProjects;
  return <PortalShell admin={false}>
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <SectionEyebrow>Quantum Integration</SectionEyebrow>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><h1 className="font-display text-4xl text-white md:text-5xl">Your delivery, in view.</h1><p className="mt-3 text-slate-400">A live look at the work moving your vision forward.</p></div>
      </div>
      {loading ? <div className="mt-14 text-slate-500">Loading your projects...</div> : <div className="mt-12 grid gap-5">{display.map(project => <div className="card" key={project.id}><div className="flex flex-col justify-between gap-4 md:flex-row md:items-center"><div><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Active integration</div><h2 className="mt-2 font-display text-2xl text-white">{project.name}</h2></div><div className="flex items-center gap-2 text-sm text-cyan-300"><span className="pulse-dot" />{project.status}</div></div><div className="mt-8"><div className="mb-3 flex justify-between text-xs text-slate-500"><span>Progress</span><span className="text-white">{project.progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all" style={{ width: `${project.progress}%` }} /></div></div></div>)}</div>}
    </div>
  </PortalShell>;
}

function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Profile[]>([]);
  const [form, setForm] = useState({ name: '', user_id: '', progress: 0, status: statuses[0] });
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    const [{ data: projectData }, { data: clientData }] = await Promise.all([
      supabase.from('projects').select('*').order('updated_at', { ascending: false }),
      supabase.from('profiles').select('*').order('full_name'),
    ]);
    setProjects(projectData ?? []);
    setClients(clientData ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('projects').insert({ name: form.name, user_id: form.user_id, progress: Number(form.progress), status: form.status });
    if (error) { setMessage('Could not create project.'); return; }
    setForm({ name: '', user_id: '', progress: 0, status: statuses[0] });
    setShowForm(false);
    setMessage('Project created successfully.');
    load();
  }
  async function update(id: string, values: Partial<Project>) {
    const { error } = await supabase.from('projects').update(values).eq('id', id);
    setMessage(error ? 'Could not save that update.' : 'Project updated.');
    if (!error) load();
  }

  const clientName = (uid: string) => clients.find(c => c.id === uid)?.full_name || uid.slice(0, 8);
  const totalProjects = projects.length;
  const completed = projects.filter(p => p.status === 'Completed').length;
  const active = projects.filter(p => p.status !== 'Completed').length;

  return <PortalShell admin>
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400"><span className="h-px w-8 bg-amber-400" />Administrator</div>
          <h1 className="font-display text-4xl text-white md:text-5xl">Project Control Center</h1>
          <p className="mt-3 text-slate-400">Full read and write control over every client integration.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="button-primary whitespace-nowrap"><Plus size={17} /> Create New Project</button>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5"><div className="text-xs uppercase tracking-wider text-slate-500">Total Projects</div><div className="mt-2 font-display text-3xl text-white">{totalProjects}</div></div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5"><div className="text-xs uppercase tracking-wider text-slate-500">Active</div><div className="mt-2 font-display text-3xl text-cyan-300">{active}</div></div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5"><div className="text-xs uppercase tracking-wider text-slate-500">Completed</div><div className="mt-2 font-display text-3xl text-emerald-400">{completed}</div></div>
      </div>

      {showForm && (
        <form onSubmit={create} className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/[0.03] p-7">
          <h2 className="mb-5 font-display text-2xl text-white">Assign New Project</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Project name" name="project-name" required />
            <label className="block"><span className="label">Assign to client</span><select className="input" required value={form.user_id} onChange={e => setForm({ ...form, user_id: e.target.value })}><option value="">Select a client</option>{clients.filter(c => !c.is_admin).map(c => <option key={c.id} value={c.id}>{c.full_name || c.id.slice(0, 8)}</option>)}</select></label>
            <label className="block"><span className="label">Starting progress (%)</span><input className="input" type="number" min="0" max="100" value={form.progress} onChange={e => setForm({ ...form, progress: Number(e.target.value) })} /></label>
            <label className="block"><span className="label">Status</span><select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{statuses.map(s => <option key={s}>{s}</option>)}</select></label>
          </div>
          <div className="mt-6 flex gap-3">
            <button className="button-primary"><Plus size={16} /> Create project</button>
            <button type="button" onClick={() => setShowForm(false)} className="button-secondary">Cancel</button>
          </div>
        </form>
      )}

      {message && <div className="mt-6 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.05] px-4 py-3 text-sm text-cyan-300">{message}</div>}

      {loading ? <div className="mt-10 text-slate-500">Loading all projects...</div> : (
        <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4">Project</th>
                <th className="px-5 py-4">Client</th>
                <th className="px-5 py-4">Progress</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id} className="border-b border-white/5 transition hover:bg-white/[0.02]">
                  <td className="px-5 py-5"><span className="font-display text-base text-white">{project.name}</span></td>
                  <td className="px-5 py-5 text-sm text-slate-400">{clientName(project.user_id)}</td>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <input aria-label={`${project.name} progress`} className="w-32 accent-cyan-400" type="range" min="0" max="100" value={project.progress} onChange={e => update(project.id, { progress: Number(e.target.value) })} />
                      <span className="w-10 text-sm text-white">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-5">
                    <select aria-label={`${project.name} status`} className="input !w-44 !py-2 text-sm" value={project.status} onChange={e => update(project.id, { status: e.target.value })}>
                      {statuses.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && <tr><td colSpan={4} className="px-5 py-12 text-center text-slate-500">No projects yet. Create one to get started.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </PortalShell>;
}

function Workshop() { return <Layout><section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-5 pt-40 text-center lg:px-8"><div className="icon-box mb-8 !h-20 !w-20"><Construction size={36} /></div><SectionEyebrow>Coming soon</SectionEyebrow><h1 className="font-display text-5xl font-semibold text-white md:text-7xl">Under Construction</h1><p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">Our interactive quantum workshop is being built. Check back soon for hands-on modules, live simulations, and guided experiments.</p><div className="mt-10 flex gap-4"><Link to="/" className="button-secondary">Back to home <ChevronRight size={16} /></Link><Link to="/contact" className="button-primary">Notify me <ArrowRight size={16} /></Link></div></section></Layout>; }

const router = createHashRouter([
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/services', element: <Services /> },
  { path: '/blog', element: <Blog /> },
  { path: '/contact', element: <Contact /> },
  { path: '/workshop', element: <Workshop /> },
  { path: '/login', element: <Auth mode="login" /> },
  { path: '/signup', element: <Auth mode="signup" /> },
  { path: '/dashboard', element: <Protected><Dashboard /></Protected> },
  { path: '/admin/dashboard', element: <Protected admin><AdminDashboard /></Protected> },
  { path: '/admin', element: <Navigate to="/admin/dashboard" replace /> },
  { path: '/portal', element: <Navigate to="/dashboard" replace /> },
]);

export default function App() { return <RouterProvider router={router} />; }
