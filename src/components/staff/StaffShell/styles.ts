export const staffShellStyles = `
.staff-shell {
  --radius: 8px;
  --background: #f7f8fa;
  --card: #ffffff;
  --accent: #eef2ff;
  --border: #e2e8f0;
  --input: #e2e8f0;
  --primary: #4f46e5;
  --highlight: #4338ca;
  --warning: #b45309;
  --danger: #dc2626;
  --foreground: #020617;
  --secondary-foreground: #475569;
  --muted-foreground: #94a3b8;
  --overlay: rgba(15, 23, 42, 0.5);
  --font-display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "DM Sans", ui-sans-serif, system-ui, sans-serif;

  color-scheme: light;
  display: flex;
  min-height: 100vh;
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
}
.staff-shell *,
.staff-shell *::before,
.staff-shell *::after { border-color: var(--border); letter-spacing: 0; }
.staff-shell a { text-decoration: none; color: inherit; }
.staff-shell button { cursor: pointer; font: inherit; }
.staff-shell ::selection { background: var(--primary); color: #ffffff; }

.font-display { font-family: var(--font-display); }
.sub { color: var(--secondary-foreground); }
.tone-warning { color: var(--warning); }
.tone-positive { color: var(--highlight); }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; white-space: nowrap; border-radius: 6px; font-size: 14px; font-weight: 500; height: 36px; padding: 0 16px; border: 1px solid transparent; background: transparent; color: inherit; transition: background-color .15s, color .15s; }
.btn svg { width: 16px; height: 16px; flex-shrink: 0; pointer-events: none; }
.btn:focus-visible, .nav-link:focus-visible { outline: none; box-shadow: 0 0 0 1px var(--primary); }
.btn-icon { width: 36px; padding: 0; }
.btn-ghost:hover { background: var(--accent); }
.btn-warning { background: color-mix(in oklab, var(--warning) 10%, transparent); border-color: color-mix(in oklab, var(--warning) 40%, transparent); color: var(--warning); }
.btn-warning:hover { background: color-mix(in oklab, var(--warning) 20%, transparent); }

.nav-link { display: flex; align-items: center; gap: 8px; width: 100%; height: 36px; padding: 0 12px; border-radius: 6px; border: 1px solid transparent; font-size: 13px; color: var(--secondary-foreground); transition: background-color .15s, color .15s; }
.nav-link svg { width: 16px; height: 16px; flex-shrink: 0; }
.nav-link:hover { background: var(--accent); color: var(--foreground); }
.nav-link.active { background: color-mix(in oklab, var(--primary) 10%, transparent); border-color: color-mix(in oklab, var(--primary) 30%, transparent); color: var(--highlight); }
.nav-link.active:hover { background: color-mix(in oklab, var(--primary) 15%, transparent); }
.collapsed .nav-link { justify-content: center; padding: 0; }
.nav-link.logout { color: var(--danger); background: transparent; }
.nav-link.logout:hover { background: color-mix(in oklab, var(--danger) 8%, transparent); color: var(--danger); }

.workspace-sidebar { width: 280px; flex-shrink: 0; display: flex; flex-direction: column; background: var(--card); border-right: 1px solid var(--border); position: sticky; top: 0; height: 100dvh; transition: width .2s ease; }
.workspace-sidebar.collapsed { width: 72px; }
.sidebar-brand { height: 70px; flex-shrink: 0; display: flex; align-items: center; gap: 12px; padding: 0 24px; border-bottom: 1px solid var(--border); }
.collapsed .sidebar-brand { padding: 0 20px; }
.brand-mark { width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0; display: grid; place-items: center; background: color-mix(in oklab, var(--primary) 15%, transparent); border: 1px solid color-mix(in oklab, var(--primary) 40%, transparent); color: var(--primary); font-family: var(--font-display); font-weight: 600; }
.sidebar-nav { flex: 1; overflow-y: auto; padding: 20px 12px; }
.nav-group + .nav-group { margin-top: 28px; }
.nav-group-title { font-size: 10px; color: var(--secondary-foreground); text-transform: uppercase; padding: 0 12px 10px; }
.sidebar-profile { padding: 12px; border-top: 1px solid var(--border); }
.profile-avatar { width: 36px; height: 36px; flex-shrink: 0; border-radius: 50%; display: grid; place-items: center; background: color-mix(in oklab, var(--primary) 15%, transparent); border: 1px solid color-mix(in oklab, var(--primary) 40%, transparent); color: var(--primary); font-family: var(--font-display); font-size: 12px; font-weight: 600; }
.workspace-header { height: 70px; display: flex; align-items: center; gap: 14px; position: sticky; top: 0; z-index: 20; background: color-mix(in oklab, var(--card) 92%, transparent); backdrop-filter: blur(12px); padding: 0 32px; border-bottom: 1px solid var(--border); }
.workspace-content { padding: 24px 32px; max-width: 1600px; margin: auto; }

.lang-switch { display: inline-flex; gap: 2px; margin-left: auto; padding: 3px; border-radius: 8px; border: 1px solid var(--border); background: var(--background); }
.lang-option { display: inline-flex; align-items: center; justify-content: center; min-width: 40px; height: 28px; padding: 0 12px; border-radius: 6px; border: 1px solid transparent; font-size: 12px; font-weight: 600; color: var(--secondary-foreground); transition: background-color .15s, color .15s; }
.lang-option:hover { color: var(--foreground); }
.lang-option.active { background: color-mix(in oklab, var(--primary) 10%, transparent); border-color: color-mix(in oklab, var(--primary) 30%, transparent); color: var(--highlight); }
.lang-option:focus-visible { outline: none; box-shadow: 0 0 0 1px var(--primary); }

.welcome-section { position: relative; overflow: hidden; background: var(--card); padding: 32px; border-top: 1px solid color-mix(in oklab, var(--primary) 20%, transparent); border-bottom: 1px solid color-mix(in oklab, var(--primary) 20%, transparent); }
.welcome-grid { position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(color-mix(in oklab, var(--primary) 9%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--primary) 9%, transparent) 1px, transparent 1px); background-size: 44px 44px; animation: gridpan 22s linear infinite; mask-image: linear-gradient(90deg, var(--foreground), transparent); }
.status-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 6px; font-size: 11px; background: color-mix(in oklab, var(--primary) 10%, transparent); border: 1px solid color-mix(in oklab, var(--primary) 30%, transparent); color: var(--highlight); }
.status-dot { display: inline-block; width: 6px; height: 6px; flex-shrink: 0; border-radius: 50%; background: var(--primary); animation: blip 2.8s ease-in-out infinite; }
.mini-stat { border: 1px solid var(--input); background: var(--card); border-radius: 8px; padding: 12px 16px; min-width: 80px; }

.metric-card { box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05); padding: 20px 16px; border: 1px solid var(--input); border-radius: 8px; background: var(--card); min-width: 0; }
.metric-title { font-size: 11px; color: var(--secondary-foreground); text-transform: uppercase; line-height: 1.6; }
.metric-value { font-family: var(--font-display); font-weight: 600; font-variant-numeric: tabular-nums; font-size: 32px; line-height: 1.1; margin-top: 12px; }
.metric-note { margin-top: 10px; font-size: 12px; }
.operational-section { margin-top: 24px; padding-top: 8px; }
.operational-card { box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04); background: var(--card); padding: 16px 12px; border: 1px solid var(--input); border-radius: 8px; min-width: 0; }
.operational-card .metric-title { min-height: 36px; font-size: 10px; }
.operational-card .metric-value { font-size: 26px; margin-top: 8px; }

.security-section { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-top: 24px; padding: 20px 16px; background: var(--card); border-top: 1px solid color-mix(in oklab, var(--warning) 25%, transparent); border-bottom: 1px solid color-mix(in oklab, var(--warning) 25%, transparent); }
.workspace-footnote { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 24px; font-size: 11px; color: var(--secondary-foreground); }
.sidebar-backdrop { display: none; }

@keyframes gridpan { to { background-position: 0 -44px, -44px 0; } }
@keyframes blip { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }

@media (min-width: 1024px) {
  .only-mobile { display: none !important; }
}
@media (max-width: 1023px) {
  .only-desktop { display: none !important; }
  .workspace-sidebar { width: 250px; position: fixed; left: 0; top: 0; z-index: 40; }
  .workspace-sidebar.mobile-closed { display: none; }
  .workspace-sidebar.mobile-open { display: flex; width: 250px; }
  .sidebar-backdrop { display: block; position: fixed; inset: 0; background: var(--overlay); z-index: 30; }
  .workspace-header { padding: 0 20px; }
  .workspace-content { padding: 20px; }
  .welcome-section { padding: 24px; }
}
@media (max-width: 639px) {
  .workspace-header { gap: 8px; padding: 0 12px; }
  .workspace-content { padding: 16px 12px; }
  .welcome-section { padding: 24px 16px; }
  .security-section { align-items: flex-start; flex-direction: column; }
  .metric-card { padding: 16px 12px; }
  .workspace-footnote { flex-wrap: wrap; }
}
@media (prefers-reduced-motion: reduce) {
  .staff-shell *, .staff-shell *::before, .staff-shell *::after { animation: none !important; transition: none !important; }
}
`;
