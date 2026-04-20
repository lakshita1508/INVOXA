import { useState } from 'react'
import { Settings as SettingsIcon, Save, Bell, Shield, Palette, Globe } from 'lucide-react'
import { useDarkMode } from '../context/DarkModeContext'

function Section({ title, icon: Icon, children }) {
  return (
    <div className="glass-card rounded-xl shadow-sm border border-white/60 dark:border-slate-700 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <Icon size={16} className="text-brand-600" />
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
        {desc && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none
          ${checked ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-600'}`}
      >
        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
          ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}

export default function Settings() {
  const { dark, setDark } = useDarkMode()
  const [notifs, setNotifs] = useState({ email: true, overdue: true, newInvoice: false })
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <SettingsIcon size={18} className="text-brand-600" />
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Settings</h2>
      </div>

      <Section title="Appearance" icon={Palette}>
        <Toggle label="Dark Mode" desc="Switch between light and dark theme" checked={dark} onChange={setDark} />
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Currency</label>
          <select className="input-field w-40">
            <option>INR (₹)</option>
            <option>USD ($)</option>
            <option>EUR (€)</option>
          </select>
        </div>
      </Section>

      <Section title="Notifications" icon={Bell}>
        <Toggle label="Email Notifications" desc="Receive invoice updates via email" checked={notifs.email} onChange={v => setNotifs(n => ({...n, email: v}))} />
        <Toggle label="Overdue Alerts" desc="Alert when invoices become overdue" checked={notifs.overdue} onChange={v => setNotifs(n => ({...n, overdue: v}))} />
        <Toggle label="New Invoice Alert" desc="Notify when new invoices are created" checked={notifs.newInvoice} onChange={v => setNotifs(n => ({...n, newInvoice: v}))} />
      </Section>

      <Section title="Company Info" icon={Globe}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Company Name</label>
            <input className="input-field" defaultValue="InvoiceOS Inc." />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">GST Number</label>
            <input className="input-field" placeholder="27AAAAA0000A1Z5" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Address</label>
            <input className="input-field" placeholder="123 Business St, Mumbai, MH 400001" />
          </div>
        </div>
      </Section>

      <Section title="Security" icon={Shield}>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Current Password</label>
          <input type="password" className="input-field" placeholder="••••••••" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">New Password</label>
          <input type="password" className="input-field" placeholder="••••••••" />
        </div>
      </Section>

      <div className="flex justify-end">
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md transition-all duration-200
            ${saved ? 'bg-emerald-500 text-white shadow-emerald-400/25' : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25'}`}>
          <Save size={15} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
