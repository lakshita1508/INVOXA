import { useEffect, useState } from 'react'
import { getStats, getInvoices, getPdfUrl } from '../api'
import { Plus, Download, TrendingUp, TrendingDown, Clock, DollarSign, FileText, Loader2 } from 'lucide-react'
import InvoiceModal from '../components/InvoiceModal'

function StatCard({ label, value, sub, icon: Icon, color, trend }) {
  return (
    <div className="glass-card rounded-xl p-5 shadow-sm border border-white/60 dark:border-slate-700 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-800 dark:text-white num">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    paid:    'badge-paid',
    unpaid:  'badge-unpaid',
    overdue: 'badge-overdue',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[status] || ''}`}>
      {status}
    </span>
  )
}

export default function Dashboard() {
  const [stats,    setStats]    = useState(null)
  const [invoices, setInvoices] = useState([])
  const [modal,    setModal]    = useState(false)
  const [loading,  setLoading]  = useState(true)

  async function load() {
    try {
      const [s, inv] = await Promise.all([
        getStats(),
        getInvoices({ per_page: 4, page: 1 }),
      ])
      setStats(s.data)
      setInvoices(inv.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={28} className="animate-spin text-brand-500" />
    </div>
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Overview</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Your financial snapshot</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => alert('Export feature coming soon!')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700 transition-all">
            <Download size={15} /> Export
          </button>
          <button onClick={() => setModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-md shadow-brand-500/25 transition-all">
            <Plus size={15} /> New Invoice
          </button>
        </div>
      </div>

      {/* Stats grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Revenue"  value={fmt(stats.revenue)} sub={`${stats.total} invoices`}         icon={DollarSign}   color="bg-brand-600" />
          <StatCard label="Paid"           value={fmt(stats.paid)}    sub={`${stats.paid_count} invoices`}    icon={TrendingUp}   color="bg-emerald-500" />
          <StatCard label="Unpaid"         value={fmt(stats.unpaid)}  sub={`${stats.unpaid_count} invoices`}  icon={Clock}        color="bg-amber-500" />
          <StatCard label="Overdue"        value={fmt(stats.overdue)} sub={`${stats.overdue_count} invoices`} icon={TrendingDown} color="bg-red-500" />
        </div>
      )}

      {/* Recent invoices */}
      <div className="glass-card rounded-xl shadow-sm border border-white/60 dark:border-slate-700">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-brand-600" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Recent Invoices</h3>
          </div>
          <a href="/invoices" className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline">View all →</a>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-700/60">
          {invoices.length === 0 && (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">No invoices yet</div>
          )}
          {invoices.map(inv => (
            <div key={inv.id} className="flex items-center gap-4 px-5 py-3.5 table-row-hover">
              <div className="h-9 w-9 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 text-xs font-bold num flex-shrink-0">
                #{String(inv.id).padStart(3,'0')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{inv.customer}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{inv.product}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800 dark:text-white num">{fmt(inv.grand_total)}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{inv.created_at?.slice(0,10)}</p>
              </div>
              <StatusBadge status={inv.status} />
              <a href={getPdfUrl(inv.id)} target="_blank" rel="noreferrer"
                className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                <Download size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {modal && <InvoiceModal onClose={() => setModal(false)} onCreated={load} />}
    </div>
  )
}
