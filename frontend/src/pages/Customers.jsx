import { useEffect, useState } from 'react'
import { getInvoices } from '../api'
import { Users, Loader2 } from 'lucide-react'

function deriveCustomers(invoices) {
  const map = {}
  for (const inv of invoices) {
    if (!map[inv.customer]) {
      map[inv.customer] = {
        name: inv.customer,
        totalSpend: 0,
        invoiceCount: 0,
        lastDate: null,
      }
    }
    map[inv.customer].totalSpend   += inv.grand_total
    map[inv.customer].invoiceCount += 1
    const d = new Date(inv.created_at)
    if (!map[inv.customer].lastDate || d > map[inv.customer].lastDate) {
      map[inv.customer].lastDate = d
    }
  }

  return Object.values(map).map((c, i) => {
    const tag   = c.totalSpend > 20000 ? 'VIP' : c.totalSpend > 5000 ? 'Regular' : 'New'
    const daysSince = c.lastDate ? Math.floor((Date.now() - c.lastDate) / 86400000) : 9999
    const status = daysSince < 30 ? 'Active' : 'Inactive'
    const id = `C${String(i + 1).padStart(3, '0')}`
    const email = `${c.name.toLowerCase().replace(/\s+/g, '.')
      .replace(/[^a-z0-9.]/g, '')}@example.com`
    return { ...c, tag, status, id, email, phone: 'N/A', lastDate: c.lastDate?.toISOString().slice(0,10) }
  }).sort((a,b) => b.totalSpend - a.totalSpend)
}

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await getInvoices({ per_page: 100 })
        setCustomers(deriveCustomers(res.data.data))
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  )

  const tagColor = {
    VIP:     'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
    Regular: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400',
    New:     'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-brand-600" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Customers</h2>
          <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">({customers.length} total)</span>
        </div>
        <input className="input-field w-48 sm:w-64" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="glass-card rounded-xl shadow-sm border border-white/60 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-brand-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  {['ID','Name','Email','Phone','Invoices','Total Spend','Last Active','Tag','Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {filtered.map(c => (
                  <tr key={c.id} className="table-row-hover">
                    <td className="px-4 py-3 text-xs font-mono text-brand-600 dark:text-brand-400 font-semibold">{c.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{c.name}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs max-w-[180px] truncate">{c.email}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{c.phone}</td>
                    <td className="px-4 py-3 num text-slate-600 dark:text-slate-300">{c.invoiceCount}</td>
                    <td className="px-4 py-3 num font-semibold text-slate-800 dark:text-white whitespace-nowrap">{fmt(c.totalSpend)}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">{c.lastDate || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${tagColor[c.tag]}`}>{c.tag}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full
                        ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-12 text-center text-slate-400 dark:text-slate-500">No customers found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
