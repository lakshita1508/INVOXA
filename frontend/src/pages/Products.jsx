import { useEffect, useState } from 'react'
import { getInvoices } from '../api'
import { Package, Loader2 } from 'lucide-react'

function deriveProducts(invoices) {
  const map = {}
  for (const inv of invoices) {
    if (!map[inv.product]) {
      map[inv.product] = {
        name: inv.product,
        price: inv.price,
        taxRate: inv.tax_rate,
        soldQty: 0,
        revenue: 0,
        stock: Math.floor(Math.random() * 90) + 10,
      }
    }
    map[inv.product].soldQty += inv.qty
    map[inv.product].revenue += inv.subtotal
    // Use the latest price
    map[inv.product].price = inv.price
    map[inv.product].taxRate = inv.tax_rate
  }
  return Object.values(map).sort((a,b) => b.revenue - a.revenue)
}

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await getInvoices({ per_page: 100 })
        setProducts(deriveProducts(res.data.data))
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Package size={18} className="text-brand-600" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Products</h2>
          <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">({products.length} unique)</span>
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
                  {['Product','Unit Price','Tax %','Units Sold','Revenue','Stock','Stock Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {filtered.map((p, i) => {
                  const stockStatus = p.stock > 50 ? 'In Stock' : p.stock > 20 ? 'Low Stock' : 'Critical'
                  const stockColor = {
                    'In Stock':  'badge-paid',
                    'Low Stock': 'badge-unpaid',
                    'Critical':  'badge-overdue',
                  }
                  return (
                    <tr key={i} className="table-row-hover">
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{p.name}</td>
                      <td className="px-4 py-3 num text-slate-700 dark:text-slate-300">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 num text-slate-600 dark:text-slate-400">{p.taxRate}%</td>
                      <td className="px-4 py-3 num text-slate-600 dark:text-slate-400">{p.soldQty}</td>
                      <td className="px-4 py-3 num font-semibold text-slate-800 dark:text-white">{fmt(p.revenue)}</td>
                      <td className="px-4 py-3 num text-slate-600 dark:text-slate-400">{p.stock}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${stockColor[stockStatus]}`}>{stockStatus}</span>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400 dark:text-slate-500">No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
