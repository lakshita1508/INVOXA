import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useDarkMode } from '../context/DarkModeContext'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { dark } = useDarkMode()

  return (
    <div className={dark ? 'dark-bg' : 'light-bg'}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
