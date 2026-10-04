import { FormEvent, useEffect, useState } from 'react';
import { createBrowserRouter, Link, NavLink, Navigate, RouterProvider, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Menu, Moon, Plus, Sun, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AboutPage, ContactPage, HomePage, InsightArticlePage, InsightsPage, LegalPage, NotFoundPage, PrivacyPage, QSimulaPage, ResearchPage, SolutionsPage } from './PublicSite';

type Profile = { id: string; full_name: string; is_admin: boolean };
type Project = { id: string; user_id: string; name: string; progress: number; status: string; created_at: string; updated_at: string };

const navItems = [['/', 'Home'], ['/solutions', 'Solutions'], ['/q-simula', 'Q-Simula'], ['/research', 'Research'], ['/insights', 'Insights'], ['/about', 'About'], ['/contact', 'Contact']] as const;
const statuses = ['Calibrating', 'Running Simulations', 'Completed'];

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
  return <Link to="/" className="flex items-center gap-3" aria-label="Q7 Quantum Vision home"><img src={`${import.meta.env.BASE_URL}logo.png`} alt="" className="h-10 w-10 rounded-full object-cover" /><span className="font-display text-sm font-semibold tracking-[0.18em] text-white">Q7 <span className="text-cyan-300">QUANTUM</span><br /><span className="text-[10px] tracking-[0.32em] text-slate-400">VISION</span></span></Link>;
}

function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  useTheme();
  return (
    <div className="min-h-screen overflow-hidden bg-[#070b12] text-slate-100">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900"
        href="#main-content"
      >
        Skip to content
      </a>
      <header className="site-header fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#070b12]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Logo />
          <nav
            id="site-navigation"
            aria-label="Main navigation"
            className={`${open ? 'absolute left-0 right-0 top-full flex border-b border-white/10 bg-[#070b12] p-5' : 'hidden'} site-nav order-3 max-h-[calc(100vh-5rem)] flex-col gap-5 overflow-y-auto xl:order-2 xl:static xl:flex xl:max-h-none xl:flex-row xl:items-center xl:overflow-visible xl:border-0 xl:bg-transparent xl:p-0`}
          >
            {navItems.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `text-sm transition ${isActive ? 'text-cyan-300' : 'text-slate-400 hover:text-white'}`}
              >
                {label}
              </NavLink>
            ))}
            <Link to="/portal" className="button-primary !px-4 !py-2 text-xs">
              Client Portal <ArrowRight size={14} />
            </Link>
          </nav>
          <div className="theme-actions order-2 flex items-center gap-3 xl:order-3">
            <ThemeToggle />
            <button
              className="rounded-lg border border-white/10 p-2 text-slate-300 xl:hidden"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={open}
              aria-controls="site-navigation"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>
      <main id="main-content">{children}</main>
      <footer className="border-t border-white/10 bg-[#060910]">
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <Logo />
            <p className="max-w-md text-sm leading-6 text-slate-400">
              Research-driven approaches to quantum-safe security, quantum computing R&amp;D and engineering simulation.
            </p>
            <a href="mailto:contact@q7quantumvision.com" className="text-sm text-slate-300 hover:text-cyan-300">
              contact@q7quantumvision.com
            </a>
          </div>
          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
            <span>&copy; {new Date().getFullYear()} Q7 Quantum Vision. Research and development in progress.</span>
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2">
              {navItems.slice(1).map(([to, label]) => (
                <Link key={to} to={to} className="hover:text-white">{label}</Link>
              ))}
              <Link to="/privacy" className="hover:text-white">Privacy</Link>
              <Link to="/legal" className="hover:text-white">Legal notice</Link>
              <a href="/feed.xml" className="hover:text-white">RSS</a>
              <Link to="/portal" className="hover:text-white">Client Portal</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) { return <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300"><span className="h-px w-8 bg-cyan-300" />{children}</div>; }
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
        setError(mode === 'signup' ? 'We could not create that account. Check the details and try again.' : 'We could not sign you in. Check the details and try again.');
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

  return <div className="flex min-h-screen items-center justify-center bg-[#070b12] px-5 py-16"><div className="w-full max-w-md"><div className="mb-10 flex justify-center"><Logo /></div><div className="card"><div className="mb-8"><SectionEyebrow>{mode === 'login' ? 'Secure access' : 'Join Q7'}</SectionEyebrow><h1 className="font-display text-4xl text-white">{mode === 'login' ? 'Welcome back.' : 'Enter the future.'}</h1><p className="mt-3 text-sm leading-6 text-slate-400">{mode === 'login' ? 'Access your Quantum Integration delivery tracker.' : 'Create your client account to follow your delivery.'}</p></div><form onSubmit={submit} className="space-y-5">{mode === 'signup' && <Field label="Full name" name="name" required />}<Field label="Email" name="email" type="email" required /><label className="block"><span className="label">Password</span><input className="input" name="password" type="password" minLength={12} required /></label>{error && <p className="text-sm leading-6 text-cyan-300">{error}</p>}<button className="button-primary w-full justify-center" disabled={loading}>{loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={16} /></button></form><div className="mt-7 border-t border-white/10 pt-6 text-center text-sm text-slate-500">{mode === 'login' ? 'Need an account?' : 'Already have an account?'} <Link className="text-cyan-300 hover:text-white" to={mode === 'login' ? '/signup' : '/login'}>{mode === 'login' ? 'Sign up' : 'Sign in'}</Link></div></div><Link to="/" className="mt-6 flex justify-center text-sm text-slate-500 hover:text-white">Return to main site</Link></div></div>;
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
  const [error, setError] = useState('');
  useEffect(() => {
    supabase.from('projects').select('*').order('updated_at', { ascending: false }).then(({ data, error: loadError }) => {
      if (loadError) {
        setError('Project updates could not be loaded. Please refresh or contact support.');
      } else {
        setProjects(data ?? []);
      }
      setLoading(false);
    });
  }, []);
  return <PortalShell admin={false}>
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <SectionEyebrow>Quantum Integration</SectionEyebrow>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><h1 className="font-display text-4xl text-white md:text-5xl">Project updates</h1><p className="mt-3 text-slate-400">Current updates associated with your account.</p></div>
      </div>
      {loading ? <p className="mt-14 text-slate-500">Loading project updates...</p> : error ? <p role="alert" className="mt-10 text-sm text-red-300">{error}</p> : projects.length ? <div className="mt-12 grid gap-5">{projects.map(project => <div className="card" key={project.id}><div className="flex flex-col justify-between gap-4 md:flex-row md:items-center"><div><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Project</div><h2 className="mt-2 font-display text-2xl text-white">{project.name}</h2></div><div className="flex items-center gap-2 text-sm text-cyan-300"><span className="pulse-dot" />{project.status}</div></div><div className="mt-8"><div className="mb-3 flex justify-between text-xs text-slate-500"><span>Progress</span><span className="text-white">{project.progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all" style={{ width: `${project.progress}%` }} /></div></div></div>)}</div> : <p className="mt-12 rounded-lg border border-white/10 p-6 text-sm text-slate-400">There are no project updates for this account.</p>}
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

const router = createBrowserRouter([
  { path: '/', element: <Layout><HomePage /></Layout> },
  { path: '/solutions', element: <Layout><SolutionsPage /></Layout> },
  { path: '/services', element: <Navigate to="/solutions" replace /> },
  { path: '/q-simula', element: <Layout><QSimulaPage /></Layout> },
  { path: '/research', element: <Layout><ResearchPage /></Layout> },
  { path: '/insights', element: <Layout><InsightsPage /></Layout> },
  { path: '/insights/:slug', element: <Layout><InsightArticlePage /></Layout> },
  { path: '/blog', element: <Navigate to="/insights" replace /> },
  { path: '/about', element: <Layout><AboutPage /></Layout> },
  { path: '/contact', element: <Layout><ContactPage /></Layout> },
  { path: '/privacy', element: <Layout><PrivacyPage /></Layout> },
  { path: '/legal', element: <Layout><LegalPage /></Layout> },
  { path: '/workshop', element: <Navigate to="/q-simula" replace /> },
  { path: '/login', element: <Auth mode="login" /> },
  { path: '/signup', element: <Auth mode="signup" /> },
  { path: '/dashboard', element: <Protected><Dashboard /></Protected> },
  { path: '/admin/dashboard', element: <Protected admin><AdminDashboard /></Protected> },
  { path: '/admin', element: <Navigate to="/admin/dashboard" replace /> },
  { path: '/portal', element: <Navigate to="/dashboard" replace /> },
  { path: '*', element: <Layout><NotFoundPage /></Layout> },
]);

export default function App() { return <RouterProvider router={router} />; }
