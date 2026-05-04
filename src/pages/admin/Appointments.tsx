import { useState } from 'react'
import { Calendar, Search, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useMockData } from '../../hooks/useMockData'

export default function AdminAppointments() {
  const { appointments } = useMockData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = appointments.filter(a => {
    const matchSearch = a.client_name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Appointments</h1>
        <p className="text-slate-400 text-sm mt-1">AI-scheduled appointments and bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: 'Total', v: stats.total, c: 'text-brand-400', bg: 'bg-brand-500/10', icon: <Calendar size={18} /> },
          { l: 'Confirmed', v: stats.confirmed, c: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: <CheckCircle size={18} /> },
          { l: 'Pending', v: stats.pending, c: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: <Clock size={18} /> },
          { l: 'Completed', v: stats.completed, c: 'text-purple-400', bg: 'bg-purple-500/10', icon: <CheckCircle size={18} /> },
        ].map(s => (
          <div key={s.l} className="stat-card">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center ${s.c} mb-3`}>{s.icon}</div>
            <div className={`text-2xl font-display font-bold ${s.c}`}>{s.v}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by client name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-dark pl-10"
          />
        </div>
        <div className="flex items-center gap-1 glass rounded-xl p-1 w-fit">
          {['all', 'confirmed', 'pending', 'completed'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
                statusFilter === s ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(appt => {
          const isUpcoming = new Date(appt.scheduled_at) > new Date()
          return (
            <div key={appt.id} className="card hover:border-brand-500/25 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400 font-bold">
                    {appt.client_name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{appt.client_name}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{isUpcoming ? 'Upcoming' : 'Past'}</div>
                  </div>
                </div>
                <span className={`badge text-xs ${
                  appt.status === 'confirmed' ? 'badge-green' :
                  appt.status === 'pending' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' :
                  'badge-blue'
                }`}>{appt.status}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={13} className="text-slate-500" />
                  <span className="text-slate-300">{new Date(appt.scheduled_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={13} className="text-slate-500" />
                  <span className="text-slate-300">{new Date(appt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card py-16 text-center">
          <Calendar size={40} className="text-dark-400 mx-auto mb-3" />
          <p className="text-slate-500">No appointments found</p>
        </div>
      )}
    </div>
  )
}
