import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Public pages
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/public/LoginPage'
import BlogListPage from './pages/public/BlogListPage'
import BlogPostPage from './pages/public/BlogPostPage'

// Dashboard pages
import SuperAdminDashboard from './pages/superadmin/Dashboard'
import SuperAdminCompanies from './pages/superadmin/Companies'
import SuperAdminCompanyDetail from './pages/superadmin/CompanyDetail'
import SuperAdminUsers from './pages/superadmin/Users'

import AdminDashboard from './pages/admin/Dashboard'
import AdminCalls from './pages/admin/Calls'
import AdminAppointments from './pages/admin/Appointments'
import AdminLeads from './pages/admin/Leads'

import DashboardLayout from './components/dashboard/DashboardLayout'

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { profile, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
        <p className="text-slate-400 font-body">Loading...</p>
      </div>
    </div>
  )

  if (!profile) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to={profile.role === 'super_admin' ? '/super-admin' : '/dashboard'} replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  const { profile, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
    </div>
  )

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/blog" element={<BlogListPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/login" element={profile ? <Navigate to={profile.role === 'super_admin' ? '/super-admin' : '/dashboard'} /> : <LoginPage />} />

      {/* Super Admin */}
      <Route path="/super-admin" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <DashboardLayout role="super_admin" />
        </ProtectedRoute>
      }>
        <Route index element={<SuperAdminDashboard />} />
        <Route path="companies" element={<SuperAdminCompanies />} />
        <Route path="companies/:id" element={<SuperAdminCompanyDetail />} />
        <Route path="users" element={<SuperAdminUsers />} />
      </Route>

      {/* Admin */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout role="admin" />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="calls" element={<AdminCalls />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="leads" element={<AdminLeads />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
