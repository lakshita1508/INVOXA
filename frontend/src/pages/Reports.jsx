import { useEffect, useState } from 'react'
import { getInvoices } from '../api'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts'
import { BarChart2, Loader2 } from 'lucide-react'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function buildMonthlyData(invoices) {
  const map = {}
  for (const inv of invoices) {
    const d = new Date(inv.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    const label = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
    if (!map[key]) map[key] = { key, label, revenue: 0, paid: 0, unpaid: 0, overdue: 0, count: 0 }
    map[key].revenue += inv.grand_total
    map[key].count   += 1
    map[key][inv.status] = (map[key][inv.status] || 0) + inv.grand_total
  }
  return Object.values(map).sort((a,b) => a.key.localeCompare(b.key)).slice(-12)
}

function buildTopCustomers(invoices) {
  const map = {}
  for (const inv of invoices) {
    if (!map[inv.customer]) map[inv.customer] = { name: inv.customer, total: 0, count: 0 }
    map[inv.customer].total += inv.grand_total
    map[inv.customer].count += 1
  }
  return Object.values(map).sort((a,b) => b.total - a.total).slice(0, 8)
}

const EMPLOYEES = [
  { name: 'Aryan Sharma',   invoices: 42, revenue: 180000, rating: 98 },
  { name: 'Priya Mehta',    invoices: 38, revenue: 165000, rating: 95 },
  { name: 'Rohan Gupta',    invoices: 31, revenue: 142000, rating: 91 },
  { name: 'Sneha Kapoor',   invoices: 27, revenue: 120000, rating: 88 },
  { name: 'Vikram Nair',    invoices: 24, revenue: 98000,  rating: 84 },
]

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card dark:bg-slate-800 border border-white/60 dark:border-slate-600 rounded-xl px-4 py-3 shadow-xl text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="flex justify-between gap-4">
          <span className="capitalize">{p.name}</span>
          <span className="font-bold num">{fmt(p.value)}</span>
        </p>
      ))}
    </div>
  )
}

export default function Reports() {
  const [monthly,   setMonthly]   = useState([])
  const [topCust,   setTopCust]   = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getInvoices({ per_page: 500 })
        const inv = res.data.data
        setMonthly(buildMonthlyData(inv))
        setTopCust(buildTopCustomers(inv))
      } finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={28} className="animate-spin text-brand-500" />
    </div>
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <BarChart2 size={18} className="text-brand-600" />
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Reports & Analytics</h2>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="glass-card rounded-xl shadow-sm border border-white/60 dark:border-slate-700 p-5">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Monthly Revenue</h3>
        {monthly.length === 0 ? (
          <div className="h-56 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthly} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:[&>line]:stroke-slate-700" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false}
                tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="revenue" stroke="#2563eb" strokeWidth={2.5}
                fill="url(#revGrad)" dot={{ fill: '#2563eb', r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Status Breakdown Bar Chart */}
      {monthly.length > 0 && (
        <div className="glass-card rounded-xl shadow-sm border border-white/60 dark:border-slate-700 p-5">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Revenue by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly} margin={{ top: 4, right: 16, left: 0, bottom: 0 }} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:[&>line]:stroke-slate-700" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false}
                tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="paid"    name="paid"    fill="#10b981" radius={[3,3,0,0]} />
              <Bar dataKey="unpaid"  name="unpaid"  fill="#f59e0b" radius={[3,3,0,0]} />
              <Bar dataKey="overdue" name="overdue" fill="#ef4444" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="glass-card rounded-xl shadow-sm border border-white/60 dark:border-slate-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Top Customers</h3>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {topCust.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3 px-5 py-3 table-row-hover">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 w-5">#{i+1}</span>
                <div className="h-7 w-7 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 text-xs font-bold flex-shrink-0">
                  {c.name[0]}
                </div>
                <span className="flex-1 text-sm text-slate-700 dark:text-slate-300 font-medium truncate">{c.name}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">{c.count} inv</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-white num">{fmt(c.total)}</span>
              </div>
            ))}
            {topCust.length === 0 && (
              <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-sm">No data</div>
            )}
          </div>
        </div>

        {/* Employee Performance */}
        <div className="glass-card rounded-xl shadow-sm border border-white/60 dark:border-slate-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Employee Performance</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Mock data</p>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {EMPLOYEES.map((e, i) => (
              <div key={e.name} className="flex items-center gap-3 px-5 py-3 table-row-hover">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 w-5">#{i+1}</span>
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {e.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{e.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: `${e.rating}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-400 num">{e.rating}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs num font-semibold text-slate-800 dark:text-white">{fmt(e.revenue)}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">{e.invoices} inv</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
