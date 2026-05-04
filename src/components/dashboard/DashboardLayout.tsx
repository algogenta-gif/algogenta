import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Zap, LayoutDashboard, Building2, Users, Phone,
  Calendar, UserCheck, LogOut, Menu, X, Bell, ChevronDown
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import clsx from 'clsx'

interface Props { role: 'super_admin' | 'admin' }

export default function DashboardLayout({ role }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const superAdminNav = [
    { label: 'Overview', icon: <LayoutDashboard size={18} />, path: '/super-admin' },
    { label: 'Companies', icon: <Building2 size={18} />, path: '/super-admin/companies' },
    { label: 'Users', icon: <Users size={18} />, path: '/super-admin/users' },
  ]

  const adminNav = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { label: 'Calls', icon: <Phone size={18} />, path: '/dashboard/calls' },
    { label: 'Appointments', icon: <Calendar size={18} />, path: '/dashboard/appointments' },
    { label: 'Leads', icon: <UserCheck size={18} />, path: '/dashboard/leads' },
  ]

  const navItems = role === 'super_admin' ? superAdminNav : adminNav

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-dark-500">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <Zap size={15} className="text-white fill-white" />
          </div>
          <span className="font-display font-bold text-white text-base">
            Automate<span className="text-brand-400">360</span>
          </span>
        </Link>
      </div>

      {/* Role badge */}
      <div className="px-5 py-3 border-b border-dark-500">
        <div className={clsx(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
          role === 'super_admin' ? 'badge-orange' : 'badge-blue'
        )}>
          <div className="w-1.5 h-1.5 rounded-full bg-current" />
          {role === 'super_admin' ? 'Super Admin' : 'Admin'}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-xs text-slate-600 uppercase tracking-wider px-4 mb-2 font-medium">
          {role === 'super_admin' ? 'Management' : 'Analytics'}
        </div>
        {navItems.map(item => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={clsx('sidebar-link', isActive && 'active')}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      <div className="px-3 py-4 border-t border-dark-500">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl glass-light mb-2">
          <div className="w-8 h-8 rounded-full bg-brand-500/30 flex items-center justify-center text-brand-400 font-bold text-sm">
            {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{profile?.full_name || 'User'}</div>
            <div className="text-xs text-slate-500 truncate">{profile?.email}</div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-dark-800 border-r border-dark-500 shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-dark-800 border-r border-dark-500 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-dark-800/80 backdrop-blur border-b border-dark-500 px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-600 transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="hidden lg:block">
            <h2 className="text-sm font-medium text-slate-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-600 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" />
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-dark-500">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-sm">
                {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:block text-sm text-slate-300 font-medium">{profile?.full_name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
