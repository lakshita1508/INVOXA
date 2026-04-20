import { useState } from 'react'
import { User, Mail, Phone, MapPin, Briefcase, Edit2, Save, Camera } from 'lucide-react'

export default function Profile() {
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({
    name:     'Labhanshi',
    role:     'Finance Manager',
    email:    'labhanshi@invoiceos.com',
    phone:    '+91 98765 43210',
    location: 'New Delhi, India',
    company:  'InvoiceOS Inc.',
    bio:      'Experienced finance professional managing invoicing and accounts for InvoiceOS. Passionate about clean financial systems and modern tooling.',
  })

  function handleChange(e) {
    setProfile(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  function handleSave() {
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const stats = [
    { label: 'Invoices Created', value: '284' },
    { label: 'Total Revenue',    value: '₹18.4L' },
    { label: 'Customers',        value: '47' },
    { label: 'This Month',       value: '₹2.1L' },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header card */}
      <div className="glass-card rounded-xl shadow-sm border border-white/60 dark:border-slate-700 p-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-brand-500/30">
              L
            </div>
            <button className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-full bg-white dark:bg-slate-700 border-2 border-white dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 shadow-md transition-colors">
              <Camera size={12} />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{profile.name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{profile.role}</p>
                <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400">
                  Admin
                </span>
              </div>
              <button
                onClick={() => editing ? handleSave() : setEditing(true)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all
                  ${editing
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-400/25'
                    : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/25'}`}
              >
                {editing ? <><Save size={13} /> Save</> : <><Edit2 size={13} /> Edit</>}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-lg font-bold text-slate-800 dark:text-white num">{s.value}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Details card */}
      <div className="glass-card rounded-xl shadow-sm border border-white/60 dark:border-slate-700 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <User size={15} className="text-brand-600" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Personal Information</h3>
        </div>

        <div className="p-5 space-y-4">
          {editing ? (
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Full Name',   name: 'name',     icon: User },
                { label: 'Email',       name: 'email',    icon: Mail },
                { label: 'Phone',       name: 'phone',    icon: Phone },
                { label: 'Location',    name: 'location', icon: MapPin },
                { label: 'Company',     name: 'company',  icon: Briefcase },
              ].map(({ label, name, icon: Icon }) => (
                <div key={name}>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Icon size={11} /> {label}
                  </label>
                  <input name={name} value={profile[name]} onChange={handleChange} className="input-field" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Bio</label>
                <textarea name="bio" value={profile.bio} onChange={handleChange} rows={3}
                  className="input-field resize-none" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { icon: Mail,      label: 'Email',    value: profile.email },
                { icon: Phone,     label: 'Phone',    value: profile.phone },
                { icon: MapPin,    label: 'Location', value: profile.location },
                { icon: Briefcase, label: 'Company',  value: profile.company },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 flex-shrink-0">
                    <Icon size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{label}</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{value}</p>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-50 dark:border-slate-700">
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Bio</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{profile.bio}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/30 animate-slide-up">
          ✓ Profile updated
        </div>
      )}
    </div>
  )
}
