import Link from "next/link";
import { NavIcon } from "./icons";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {description && <p className="text-slate-600 mt-1.5 text-sm md:text-base max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = "green",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: string;
  accent?: "green" | "blue" | "amber" | "violet";
}) {
  const accents = {
    green: "from-brand-green/10 to-emerald-50 text-brand-green border-brand-green/20",
    blue: "from-sky-50 to-blue-50 text-sky-700 border-sky-200",
    amber: "from-amber-50 to-orange-50 text-amber-700 border-amber-200",
    violet: "from-violet-50 to-purple-50 text-violet-700 border-violet-200",
  };

  return (
    <div className={`dash-card p-5 bg-gradient-to-br ${accents[accent]} border`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{label}</p>
          <p className="text-2xl md:text-3xl font-bold mt-1 text-slate-900">{value}</p>
          {hint && <p className="text-xs mt-1 opacity-70">{hint}</p>}
        </div>
        <div className="p-2.5 rounded-xl bg-white/80 shadow-sm">
          <NavIcon name={icon} className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export function QuickActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="dash-card group p-5 hover:border-brand-green/40 hover:shadow-md hover:shadow-brand-green/10 transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-brand-green/10 text-brand-green group-hover:bg-brand-green group-hover:text-white transition-colors">
          <NavIcon name={icon} className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900 group-hover:text-brand-green transition-colors">{title}</h3>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export function WelcomeBanner({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle: string;
  badge?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-green via-brand-green-dark to-[#024a0f] text-white p-6 md:p-8 mb-8 shadow-lg shadow-brand-green/20">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_20%,white,transparent_50%)]" />
      <div className="relative">
        {badge && (
          <span className="inline-block text-xs font-semibold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full mb-3">
            {badge}
          </span>
        )}
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        <p className="text-white/85 mt-2 max-w-xl text-sm md:text-base">{subtitle}</p>
      </div>
    </div>
  );
}

export function Panel({
  title,
  children,
  actions,
}: {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="dash-panel overflow-hidden">
      {(title || actions) && (
        <div className="px-4 md:px-5 py-3.5 border-b border-slate-200/80 bg-slate-50/80 flex items-center justify-between gap-3">
          {title && <h2 className="font-semibold text-slate-800">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}

export function BtnPrimary({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`dash-btn-primary h-10 px-4 text-sm font-medium disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function BtnSecondary({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`dash-btn-secondary h-10 px-4 text-sm font-medium disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
