import { useState } from 'react'
import { Phone, Calendar, UserCheck, TrendingUp, PhoneIncoming, PhoneOutgoing, Activity } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'
import { useMockData } from '../../hooks/useMockData'
import { useAuth } from '../../contexts/AuthContext'

type Filter = 'daily' | 'weekly' | 'monthly'

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

export default function AdminDashboard() {
  const [filter, setFilter] = useState<Filter>('weekly')
  const { profile } = useAuth()
  const { chartData, stats, calls, leads } = useMockData()

  const multiplier = filter === 'daily' ? 0.15 : filter === 'weekly' ? 1 : 4.2

  const adjustedStats = {
    totalCalls: Math.round(stats.totalCalls * multiplier),
    inboundCalls: Math.round(stats.inboundCalls * multiplier),
    outboundCalls: Math.round(stats.outboundCalls * multiplier),
    totalAppointments: Math.round(stats.totalAppointments * multiplier),
    totalLeads: Math.round(stats.totalLeads * multiplier),
  }

  const pieData = [
    { name: 'Inbound', value: adjustedStats.inboundCalls },
    { name: 'Outbound', value: adjustedStats.outboundCalls },
  ]
  const COLORS = ['#0ea5e9', '#f97316']

  const statCards = [
    { label: 'Total Calls', value: adjustedStats.totalCalls, icon: <Phone size={20} />, color: 'text-brand-400', bg: 'bg-brand-500/10', trend: '+12%' },
    { label: 'Inbound Calls', value: adjustedStats.inboundCalls, icon: <PhoneIncoming size={20} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: '+8%' },
    { label: 'Outbound Calls', value: adjustedStats.outboundCalls, icon: <PhoneOutgoing size={20} />, color: 'text-accent-400', bg: 'bg-accent-500/10', trend: '+18%' },
    { label: 'Appointments', value: adjustedStats.totalAppointments, icon: <Calendar size={20} />, color: 'text-purple-400', bg: 'bg-purple-500/10', trend: '+5%' },
    { label: 'Leads Captured', value: adjustedStats.totalLeads, icon: <UserCheck size={20} />, color: 'text-yellow-400', bg: 'bg-yellow-500/10', trend: '+22%' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back, {profile?.full_name?.split(' ')[0]}</p>
        </div>
        <div className="flex items-center gap-1 glass rounded-xl p-1 w-fit">
          {(['daily', 'weekly', 'monthly'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                filter === f
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}>
                {card.icon}
              </div>
              <span className="text-xs text-emerald-400 font-medium">{card.trend}</span>
            </div>
            <div className={`text-2xl font-display font-bold ${card.color} mb-0.5`}>{card.value}</div>
            <div className="text-xs text-slate-500">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-white flex items-center gap-2">
              <Activity size={16} className="text-brand-400" />
              Call Activity
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="dg1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" />
              <XAxis dataKey="day" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="inbound" stroke="#0ea5e9" fill="url(#dg1)" strokeWidth={2} />
              <Area type="monotone" dataKey="outbound" stroke="#f97316" fill="url(#dg2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400"><div className="w-3 h-0.5 bg-brand-400" /> Inbound</div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400"><div className="w-3 h-0.5 bg-accent-400" /> Outbound</div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-display font-semibold text-white mb-4">Call Split</h3>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={5} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-2 mt-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-slate-400">{d.name}</span>
                  </div>
                  <span className="font-semibold" style={{ color: COLORS[i] }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Appointments & Leads */}
      <div className="card">
        <h3 className="font-display font-semibold text-white mb-4">Appointments & Leads Trend</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" />
            <XAxis dataKey="day" stroke="#475569" tick={{ fontSize: 11 }} />
            <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="appointments" fill="#a855f7" radius={[4, 4, 0, 0]} />
            <Bar dataKey="leads" fill="#eab308" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400"><div className="w-3 h-3 rounded-sm bg-purple-500" /> Appointments</div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400"><div className="w-3 h-3 rounded-sm bg-yellow-500" /> Leads</div>
        </div>
      </div>

      {/* Recent leads */}
      <div className="card">
        <h3 className="font-display font-semibold text-white mb-4">Recent Leads</h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Source</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-500/15 flex items-center justify-center text-purple-400 text-xs font-bold">{lead.name.charAt(0)}</div>
                      <span className="text-white font-medium text-sm">{lead.name}</span>
                    </div>
                  </td>
                  <td><span className="badge-blue text-xs">{lead.source}</span></td>
                  <td className="text-slate-400 text-xs">{lead.email}</td>
                  <td>
                    <span className={`text-xs badge ${
                      lead.status === 'qualified' ? 'badge-blue' :
                      lead.status === 'converted' ? 'badge-green' :
                      'bg-slate-500/15 text-slate-400 border border-slate-500/30'
                    }`}>{lead.status}</span>
                  </td>
                  <td className="text-slate-500 text-xs">{new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
