import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ========== Invoices (existing, unchanged) ==========
export const getInvoices = (params) => api.get('/invoices', { params })
export const getInvoice  = (id) => api.get(`/invoices/${id}`)
export const createInvoice = (data) => api.post('/invoices', data)
export const updateStatus  = (id, status) => api.patch(`/invoices/${id}/status`, { status })
export const deleteInvoice = (id) => api.delete(`/invoices/${id}`)
export const getPdfUrl     = (id) => `/api/invoices/${id}/pdf`

// ========== Stats (existing, unchanged) ==========
export const getStats = () => api.get('/stats')

// ========== NEW: Customers ==========
export const getCustomers = () => api.get('/customers')

// ========== NEW: Products ==========
export const getProducts = () => api.get('/products')

// ========== NEW: Invoice Logs (audit trail) ==========
export const getInvoiceLogs = (invoiceId) => api.get(`/invoice_logs/${invoiceId}`)

export default api