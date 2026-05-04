import { Building2, Users, Phone, Calendar, UserCheck, TrendingUp, ArrowUpRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useMockCompanies, useMockData } from '../../hooks/useMockData'
import { Link } from 'react-router-dom'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl p-3 border border-brand-500/20 text-xs">
        <p className="text-slate-400 mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-300 capitalize">{p.name}: <span className="text-white font-semibold">{p.value}</span></span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function SuperAdminDashboard() {
  const companies = useMockCompanies()
  const { chartData } = useMockData()

  const totalStats = {
    companies: companies.length,
    activeCo: companies.filter(c => c.is_active).length,
    totalCalls: companies.reduce((s, c) => s + c.totalCalls, 0),
    totalAppointments: companies.reduce((s, c) => s + c.totalAppointments, 0),
    totalLeads: companies.reduce((s, c) => s + c.totalLeads, 0),
  }

  const statCards = [
    { label: 'Total Companies', value: totalStats.companies, sub: `${totalStats.activeCo} active`, icon: <Building2 size={20} />, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { label: 'Total Calls', value: totalStats.totalCalls, sub: 'All time', icon: <Phone size={20} />, color: 'text-accent-400', bg: 'bg-accent-500/10' },
    { label: 'Appointments', value: totalStats.totalAppointments, sub: 'All time', icon: <Calendar size={20} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Leads', value: totalStats.totalLeads, sub: 'Captured', icon: <UserCheck size={20} />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-white">System Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Monitor all companies and platform metrics</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}>
                {card.icon}
              </div>
              <TrendingUp size={14} className="text-emerald-400 opacity-60" />
            </div>
            <div className={`text-2xl font-display font-bold ${card.color} mb-0.5`}>{card.value}</div>
            <div className="text-xs text-slate-500">{card.label}</div>
            <div className="text-xs text-slate-600 mt-0.5">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
            <Phone size={16} className="text-brand-400" />
            Calls (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="inboundGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outboundGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" />
              <XAxis dataKey="day" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="inbound" stroke="#0ea5e9" fill="url(#inboundGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="outbound" stroke="#f97316" fill="url(#outboundGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400"><div className="w-3 h-0.5 bg-brand-400" /> Inbound</div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400"><div className="w-3 h-0.5 bg-accent-400" /> Outbound</div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-emerald-400" />
            Appointments & Leads
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" />
              <XAxis dataKey="day" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="appointments" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="leads" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400"><div className="w-3 h-3 rounded-sm bg-emerald-500" /> Appointments</div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400"><div className="w-3 h-3 rounded-sm bg-purple-500" /> Leads</div>
          </div>
        </div>
      </div>

      {/* Recent companies */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold text-white">Company Performance</h3>
          <Link to="/super-admin/companies" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
            View all <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Type</th>
                <th>Calls</th>
                <th>Appointments</th>
                <th>Leads</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(co => (
                <tr key={co.id} className="cursor-pointer" onClick={() => {}}>
                  <td>
                    <div>
                      <div className="text-white font-medium text-sm">{co.name}</div>
                      <div className="text-slate-500 text-xs">{co.owner_name}</div>
                    </div>
                  </td>
                  <td><span className="badge-blue">{co.company_type}</span></td>
                  <td className="font-mono text-brand-400">{co.totalCalls}</td>
                  <td className="font-mono text-emerald-400">{co.totalAppointments}</td>
                  <td className="font-mono text-purple-400">{co.totalLeads}</td>
                  <td>
                    <span className={co.is_active ? 'badge-green' : 'badge bg-slate-500/15 text-slate-400 border border-slate-500/30'}>
                      {co.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
