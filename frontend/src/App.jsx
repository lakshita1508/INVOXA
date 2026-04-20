import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard  from './pages/Dashboard'
import Invoices   from './pages/Invoices'
import Customers  from './pages/Customers'
import Products   from './pages/Products'
import Reports    from './pages/Reports'
import Activity   from './pages/Activity'
import Settings   from './pages/Settings'
import Profile    from './pages/Profile'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index         element={<Dashboard />} />
        <Route path="invoices"  element={<Invoices />} />
        <Route path="customers" element={<Customers />} />
        <Route path="products"  element={<Products />} />
        <Route path="reports"   element={<Reports />} />
        <Route path="activity"  element={<Activity />} />
        <Route path="settings"  element={<Settings />} />
        <Route path="profile"   element={<Profile />} />
      </Route>
    </Routes>
  )
}
