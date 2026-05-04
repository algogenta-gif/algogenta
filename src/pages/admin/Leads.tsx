import { useState } from 'react'
import { UserCheck, Search, Mail, Phone, TrendingUp } from 'lucide-react'
import { useMockData } from '../../hooks/useMockData'

export default function AdminLeads() {
  const { leads } = useMockData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      (l.email || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || l.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    converted: leads.filter(l => l.status === 'converted').length,
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Leads</h1>
        <p className="text-slate-400 text-sm mt-1">AI-captured leads from calls and web forms</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: 'Total Leads', v: stats.total, c: 'text-brand-400', bg: 'bg-brand-500/10' },
          { l: 'New', v: stats.new, c: 'text-slate-300', bg: 'bg-slate-500/10' },
          { l: 'Qualified', v: stats.qualified, c: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { l: 'Converted', v: stats.converted, c: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map(s => (
          <div key={s.l} className="stat-card">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center ${s.c} mb-3`}>
              <UserCheck size={18} />
            </div>
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
            placeholder="Search leads..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-dark pl-10"
          />
        </div>
        <div className="flex items-center gap-1 glass rounded-xl p-1 w-fit">
          {['all', 'new', 'qualified', 'converted'].map(s => (
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

      {/* Leads Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="pl-6">Lead</th>
                <th>Source</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th className="pr-6">Captured</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(lead => (
                <tr key={lead.id}>
                  <td className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-500/15 flex items-center justify-center text-purple-400 font-bold text-sm shrink-0">
                        {lead.name.charAt(0)}
                      </div>
                      <span className="text-white font-medium text-sm">{lead.name}</span>
                    </div>
                  </td>
                  <td><span className="badge-blue text-xs">{lead.source}</span></td>
                  <td>
                    {lead.email ? (
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <Mail size={11} />
                        {lead.email}
                      </div>
                    ) : <span className="text-slate-600">—</span>}
                  </td>
                  <td>
                    {lead.phone ? (
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                        <Phone size={11} />
                        {lead.phone}
                      </div>
                    ) : <span className="text-slate-600">—</span>}
                  </td>
                  <td>
                    <span className={`badge text-xs ${
                      lead.status === 'qualified' ? 'badge-blue' :
                      lead.status === 'converted' ? 'badge-green' :
                      'bg-slate-500/15 text-slate-400 border border-slate-500/30'
                    }`}>{lead.status}</span>
                  </td>
                  <td className="pr-6 text-slate-500 text-xs">
                    {new Date(lead.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <UserCheck size={40} className="text-dark-400 mx-auto mb-3" />
            <p className="text-slate-500">No leads found</p>
          </div>
        )}
      </div>
    </div>
  )
}
