import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { createInvoice } from '../api'

const defaultForm = { name: '', product: '', price: '', qty: '', tax: '' }

export default function InvoiceModal({ onClose, onCreated }) {
  const [form, setForm]     = useState(defaultForm)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors([])
    setLoading(true)
    try {
      await createInvoice({
        name:    form.name,
        product: form.product,
        price:   parseFloat(form.price),
        qty:     parseInt(form.qty),
        tax:     parseFloat(form.tax || 0),
      })
      onCreated()
      onClose()
    } catch (err) {
      const errs = err.response?.data?.errors || [err.response?.data?.error || 'Something went wrong']
      setErrors(errs)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop animate-fade-in px-4">
      <div className="glass-card dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md animate-slide-up border border-white/60 dark:border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-base font-semibold text-slate-800 dark:text-white">New Invoice</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Fill in the details below</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mx-6 mt-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3">
            {errors.map((e, i) => (
              <p key={i} className="text-xs text-red-600 dark:text-red-400">{e}</p>
            ))}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Field label="Customer Name" name="name"    type="text"   placeholder="e.g. Acme Corp"     value={form.name}    onChange={handleChange} required />
            <Field label="Product"       name="product" type="text"   placeholder="e.g. Web Design"    value={form.product} onChange={handleChange} required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price (₹)"   name="price"   type="number" placeholder="0.00" step="0.01" min="0" value={form.price} onChange={handleChange} required />
              <Field label="Quantity"    name="qty"     type="number" placeholder="1"    min="1"           value={form.qty}   onChange={handleChange} required />
            </div>
            <Field label="Tax (%)"       name="tax"     type="number" placeholder="0"    step="0.01" min="0" max="100" value={form.tax} onChange={handleChange} />
          </div>

          {/* Preview */}
          {form.price && form.qty && (
            <div className="rounded-lg bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/50 p-3">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>Subtotal</span>
                <span className="num">₹{(parseFloat(form.price||0) * parseInt(form.qty||0)).toFixed(2)}</span>
              </div>
              {form.tax > 0 && (
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mt-1">
                  <span>Tax ({form.tax}%)</span>
                  <span className="num">₹{((parseFloat(form.price||0) * parseInt(form.qty||0)) * parseFloat(form.tax||0) / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold text-brand-700 dark:text-brand-400 mt-2 pt-2 border-t border-brand-100 dark:border-brand-800/50">
                <span>Total</span>
                <span className="num">₹{((parseFloat(form.price||0) * parseInt(form.qty||0)) * (1 + parseFloat(form.tax||0)/100)).toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-md shadow-brand-500/25 transition-all duration-150 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={15} className="animate-spin" /> Creating…</> : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, name, value, onChange, ...rest }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">{label}</label>
      <input name={name} value={value} onChange={onChange} className="input-field" {...rest} />
    </div>
  )
}
