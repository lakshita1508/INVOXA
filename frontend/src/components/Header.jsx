import { Menu, Sun, Moon, Bell } from 'lucide-react'
import { useDarkMode } from '../context/DarkModeContext'
import { useLocation } from 'react-router-dom'

const titles = {
  '/':           'Dashboard',
  '/invoices':   'Invoices',
  '/customers':  'Customers',
  '/products':   'Products',
  '/reports':    'Reports',
  '/activity':   'Activity',
  '/settings':   'Settings',
  '/profile':    'Profile',
}

export default function Header({ onMenuClick }) {
  const { dark, setDark } = useDarkMode()
  const location = useLocation()
  const title = titles[location.pathname] || 'InvoiceOS'

  return (
    <header className="
      sticky top-0 z-10 flex items-center gap-4 px-4 sm:px-6 h-14
      glass-card dark:bg-slate-800/95 border-b border-white/60 dark:border-slate-700
      backdrop-blur-xl
    ">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
      >
        <Menu size={20} />
      </button>

      <h1 className="text-base font-semibold text-slate-800 dark:text-white flex-1">
        {title}
      </h1>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-brand-600" />
        </button>

        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title="Toggle dark mode"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-brand-500/25">
          L
        </div>
      </div>
    </header>
  )
}
