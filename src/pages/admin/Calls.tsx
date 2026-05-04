import { useState } from 'react'
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Search, Filter } from 'lucide-react'
import { useMockData } from '../../hooks/useMockData'

export default function AdminCalls() {
  const { calls, stats } = useMockData()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'inbound' | 'outbound'>('all')

  const filtered = calls.filter(c => {
    const matchSearch = (c.caller_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.caller_phone || '').includes(search)
    const matchType = typeFilter === 'all' || c.type === typeFilter
    return matchSearch && matchType
  })

  function formatDuration(secs: number) {
    return `${Math.floor(secs / 60)}m ${secs % 60}s`
  }

  const statCards = [
    { label: 'Total Calls', value: stats.totalCalls, icon: <Phone size={18} />, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { label: 'Inbound', value: stats.inboundCalls, icon: <PhoneIncoming size={18} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Outbound', value: stats.outboundCalls, icon: <PhoneOutgoing size={18} />, color: 'text-accent-400', bg: 'bg-accent-500/10' },
    { label: 'Missed', value: calls.filter(c => c.status === 'missed').length, icon: <PhoneMissed size={18} />, color: 'text-red-400', bg: 'bg-red-500/10' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Calls</h1>
        <p className="text-slate-400 text-sm mt-1">All inbound and outbound call activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(c => (
          <div key={c.label} className="stat-card">
            <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center ${c.color} mb-3`}>{c.icon}</div>
            <div className={`text-2xl font-display font-bold ${c.color}`}>{c.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-dark pl-10"
          />
        </div>
        <div className="flex items-center gap-1 glass rounded-xl p-1 w-fit">
          {(['all', 'inbound', 'outbound'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                typeFilter === t ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="pl-6">Caller</th>
                <th>Type</th>
                <th>Phone</th>
                <th>Duration</th>
                <th>Status</th>
                <th className="pr-6">Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(call => (
                <tr key={call.id}>
                  <td className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        call.type === 'inbound' ? 'bg-brand-500/15 text-brand-400' : 'bg-accent-500/15 text-accent-400'
                      }`}>
                        {call.type === 'inbound' ? <PhoneIncoming size={15} /> : <PhoneOutgoing size={15} />}
                      </div>
                      <span className="text-white font-medium text-sm">{call.caller_name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={call.type === 'inbound' ? 'badge-blue' : 'badge-orange'}>
                      {call.type}
                    </span>
                  </td>
                  <td className="text-slate-400 text-xs font-mono">{call.caller_phone}</td>
                  <td className="text-slate-300 text-sm">{formatDuration(call.duration)}</td>
                  <td>
                    <span className={`badge text-xs ${
                      call.status === 'completed' ? 'badge-green' :
                      call.status === 'missed' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                      'badge bg-slate-500/15 text-slate-400 border border-slate-500/30'
                    }`}>{call.status}</span>
                  </td>
                  <td className="pr-6 text-slate-500 text-xs">
                    {new Date(call.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Phone size={40} className="text-dark-400 mx-auto mb-3" />
            <p className="text-slate-500">No calls found</p>
          </div>
        )}
      </div>
    </div>
  )
}
