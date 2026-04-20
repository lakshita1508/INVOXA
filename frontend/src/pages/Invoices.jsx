import { useEffect, useState, useCallback } from 'react'
import { getInvoices, updateStatus, deleteInvoice, getPdfUrl } from '../api'
import { Plus, Search, Download, Trash2, ChevronLeft, ChevronRight, Loader2, Filter } from 'lucide-react'
import InvoiceModal from '../components/InvoiceModal'

const STATUS_OPTIONS = ['all', 'paid', 'unpaid', 'overdue']

function StatusBadge({ status }) {
  const map = { paid: 'badge-paid', unpaid: 'badge-unpaid', overdue: 'badge-overdue' }
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[status]||''}`}>{status}</span>
}

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

export default function Invoices() {
  const [data,      setData]    = useState({ data: [], total: 0, total_pages: 1, page: 1 })
  const [page,      setPage]    = useState(1)
  const [search,    setSearch]  = useState('')
  const [status,    setStatus]  = useState('all')
  const [modal,     setModal]   = useState(false)
  const [loading,   setLoading] = useState(true)
  const [deleting,  setDeleting]= useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getInvoices({ page, per_page: 10, search, status })
      setData(res.data)
    } finally { setLoading(false) }
  }, [page, search, status])

  useEffect(() => { load() }, [load])

  // Debounce search
  const [rawSearch, setRawSearch] = useState('')
  useEffect(() => {
    const t = setTimeout(() => { setSearch(rawSearch); setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [rawSearch])

  async function handleStatus(id, newStatus) {
    await updateStatus(id, newStatus)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this invoice?')) return
    setDeleting(id)
    try { await deleteInvoice(id); load() } finally { setDeleting(null) }
  }

  const pageTotal = data.data.reduce((s, inv) => s + inv.grand_total, 0)

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="pl-8 pr-3 py-2 w-48 sm:w-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              placeholder="Search invoices…"
              value={rawSearch}
              onChange={e => setRawSearch(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              className="pl-8 pr-8 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none cursor-pointer transition-all"
              value={status}
              onChange={e => { setStatus(e.target.value); setPage(1) }}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-md shadow-brand-500/25 transition-all whitespace-nowrap">
          <Plus size={15} /> New Invoice
        </button>
      </div>

      {/* Table card */}
      <div className="glass-card rounded-xl shadow-sm border border-white/60 dark:border-slate-700 overflow-hidden">
        {/* Page total */}
        {data.data.length > 0 && (
          <div className="px-5 py-2.5 bg-brand-50/60 dark:bg-brand-900/20 border-b border-brand-100 dark:border-brand-900/30 flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{data.data.length}</span> of <span className="font-semibold text-slate-700 dark:text-slate-200">{data.total}</span> invoices
            </p>
            <p className="text-xs font-semibold text-brand-700 dark:text-brand-400 num">
              Page total: {fmt(pageTotal)}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-brand-500" />
          </div>
        ) : data.data.length === 0 ? (
          <div className="py-16 text-center text-slate-400 dark:text-slate-500 text-sm">No invoices found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  {['Invoice','Customer','Product','Qty','Subtotal','Tax','Total','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {data.data.map(inv => (
                  <tr key={inv.id} className="table-row-hover">
                    <td className="px-4 py-3 font-mono text-xs text-brand-600 dark:text-brand-400 font-semibold">
                      #{String(inv.id).padStart(4,'0')}
                    </td>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-medium max-w-[130px] truncate">{inv.customer}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 max-w-[120px] truncate">{inv.product}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 num">{inv.qty}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 num whitespace-nowrap">₹{inv.subtotal.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 num">{inv.tax_rate}%</td>
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white num whitespace-nowrap">₹{inv.grand_total.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <select
                        value={inv.status}
                        onChange={e => handleStatus(inv.id, e.target.value)}
                        className={`text-[11px] font-semibold rounded-full px-2 py-0.5 border-0 cursor-pointer outline-none
                          ${inv.status === 'paid'    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : ''}
                          ${inv.status === 'unpaid'  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : ''}
                          ${inv.status === 'overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' : ''}
                        `}
                      >
                        <option value="paid">paid</option>
                        <option value="unpaid">unpaid</option>
                        <option value="overdue">overdue</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <a href={getPdfUrl(inv.id)} target="_blank" rel="noreferrer"
                          className="p-1.5 rounded-md hover:bg-brand-50 dark:hover:bg-brand-900/20 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors" title="Download PDF">
                          <Download size={14} />
                        </a>
                        <button
                          onClick={() => handleDelete(inv.id)}
                          disabled={deleting === inv.id}
                          className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors" title="Delete">
                          {deleting === inv.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data.total_pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Page {data.page} of {data.total_pages}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-40 transition-colors">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, data.total_pages) }, (_, i) => {
                const p = i + 1
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors
                      ${page === p ? 'bg-brand-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    {p}
                  </button>
                )
              })}
              <button onClick={() => setPage(p => Math.min(data.total_pages, p+1))} disabled={page === data.total_pages}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-40 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {modal && <InvoiceModal onClose={() => setModal(false)} onCreated={load} />}
    </div>
  )
}