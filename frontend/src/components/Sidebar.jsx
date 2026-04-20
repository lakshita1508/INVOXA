import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Users, Package,
  BarChart2, Activity, Settings, User, X, Zap
} from 'lucide-react'

const nav = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/invoices',  icon: FileText,        label: 'Invoices' },
  { to: '/customers', icon: Users,           label: 'Customers' },
  { to: '/products',  icon: Package,         label: 'Products' },
  { to: '/reports',   icon: BarChart2,       label: 'Reports' },
  { to: '/activity',  icon: Activity,        label: 'Activity' },
]
const bottom = [
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/profile',  icon: User,     label: 'Profile' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        sidebar-glass dark:bg-slate-800 border-r border-white/60 dark:border-slate-700
        fixed inset-y-0 left-0 z-30 w-64 flex flex-col transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100 dark:border-slate-700">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shadow-lg shadow-brand-500/30">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">
            Invoice<span className="text-brand-600">OS</span>
          </span>
          <button onClick={onClose} className="ml-auto lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Main Menu
          </p>
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-slate-700 hover:text-brand-700 dark:hover:text-white'
                }
              `}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-700 space-y-0.5">
          {bottom.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-slate-700 hover:text-brand-700 dark:hover:text-white'
                }
              `}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  )
}
