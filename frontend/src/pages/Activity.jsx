import { Activity as ActivityIcon, Clock, FileText, RefreshCw } from 'lucide-react'

const MOCK_ACTIVITY = [
  { id: 1, type: 'created',  text: 'Invoice #0042 created for Acme Corp',      time: '2 min ago',   icon: FileText,   color: 'text-brand-600 bg-brand-50 dark:bg-brand-900/30' },
  { id: 2, type: 'paid',     text: 'Invoice #0038 marked as paid',              time: '15 min ago',  icon: RefreshCw,  color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
  { id: 3, type: 'overdue',  text: 'Invoice #0031 is now overdue',              time: '1 hr ago',    icon: Clock,      color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
  { id: 4, type: 'created',  text: 'Invoice #0041 created for TechVision Ltd',  time: '3 hrs ago',   icon: FileText,   color: 'text-brand-600 bg-brand-50 dark:bg-brand-900/30' },
  { id: 5, type: 'paid',     text: 'Invoice #0029 marked as paid',              time: '5 hrs ago',   icon: RefreshCw,  color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
  { id: 6, type: 'created',  text: 'Invoice #0040 created for GlobalSoft',      time: '1 day ago',   icon: FileText,   color: 'text-brand-600 bg-brand-50 dark:bg-brand-900/30' },
  { id: 7, type: 'overdue',  text: 'Invoice #0027 is now overdue',              time: '2 days ago',  icon: Clock,      color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
  { id: 8, type: 'paid',     text: 'Invoice #0025 marked as paid',              time: '3 days ago',  icon: RefreshCw,  color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
]

export default function Activity() {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <ActivityIcon size={18} className="text-brand-600" />
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Activity Feed</h2>
      </div>
      <div className="glass-card rounded-xl shadow-sm border border-white/60 dark:border-slate-700 overflow-hidden">
        <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
          {MOCK_ACTIVITY.map((item, i) => (
            <div key={item.id} className="flex items-start gap-4 px-5 py-4 animate-slide-up table-row-hover"
              style={{ animationDelay: `${i * 50}ms` }}>
              <div className={`p-2 rounded-lg flex-shrink-0 ${item.color}`}>
                <item.icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-300">{item.text}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
