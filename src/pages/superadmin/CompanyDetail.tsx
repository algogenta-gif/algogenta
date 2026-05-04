import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Phone, Calendar, UserCheck, TrendingUp, PhoneIncoming, PhoneOutgoing } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useMockCompanies, useMockData } from '../../hooks/useMockData'

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

export default function SuperAdminCompanyDetail() {
  const { id } = useParams()
  const companies = useMockCompanies()
  const company = companies.find(c => c.id === id) || companies[0]
  const { chartData, calls, appointments, leads } = useMockData(id)

  const pieData = [
    { name: 'Inbound', value: company.totalCalls * 0.6 },
    { name: 'Outbound', value: company.totalCalls * 0.4 },
  ]
  const COLORS = ['#0ea5e9', '#f97316']

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <Link to="/super-admin/companies" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm mb-4 transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Companies
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/15 flex items-center justify-center text-brand-400 font-bold text-2xl border border-brand-500/20">
            {company.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-white">{company.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-slate-400 text-sm">{company.owner_name}</span>
              <span className="badge-blue text-xs">{company.company_type}</span>
              <span className={company.is_active ? 'badge-green text-xs' : 'badge text-xs bg-slate-500/15 text-slate-400 border border-slate-500/30'}>
                {company.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Calls', value: company.totalCalls, icon: <Phone size={18} />, color: 'text-brand-400', bg: 'bg-brand-500/10' },
          { label: 'Inbound', value: Math.round(company.totalCalls * 0.6), icon: <PhoneIncoming size={18} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Outbound', value: Math.round(company.totalCalls * 0.4), icon: <PhoneOutgoing size={18} />, color: 'text-accent-400', bg: 'bg-accent-500/10' },
          { label: 'Appointments', value: company.totalAppointments, icon: <Calendar size={18} />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Total Leads', value: company.totalLeads, icon: <UserCheck size={18} />, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center ${s.color} mb-3`}>{s.icon}</div>
            <div className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h3 className="font-display font-semibold text-white mb-4">Activity (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" />
              <XAxis dataKey="day" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="inbound" stroke="#0ea5e9" fill="url(#cg1)" strokeWidth={2} />
              <Area type="monotone" dataKey="appointments" stroke="#a855f7" fill="url(#cg2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card flex flex-col">
          <h3 className="font-display font-semibold text-white mb-4">Call Distribution</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-6">
              {pieData.map((d, i) => (
                <div key={d.name} className="text-center">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 justify-center mb-0.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                    {d.name}
                  </div>
                  <div className="font-display font-bold text-lg" style={{ color: COLORS[i] }}>{Math.round(d.value)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-display font-semibold text-white mb-4">Recent Calls</h3>
          <div className="space-y-2">
            {calls.slice(0, 5).map(call => (
              <div key={call.id} className="flex items-center justify-between py-2.5 border-b border-dark-600/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${call.type === 'inbound' ? 'bg-brand-500/15 text-brand-400' : 'bg-accent-500/15 text-accent-400'}`}>
                    {call.type === 'inbound' ? <PhoneIncoming size={14} /> : <PhoneOutgoing size={14} />}
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">{call.caller_name}</div>
                    <div className="text-xs text-slate-500">{call.caller_phone}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">{Math.floor(call.duration / 60)}m {call.duration % 60}s</div>
                  <div className="text-xs text-slate-600">{new Date(call.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-display font-semibold text-white mb-4">Recent Leads</h3>
          <div className="space-y-2">
            {leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center justify-between py-2.5 border-b border-dark-600/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/15 flex items-center justify-center text-purple-400 font-bold text-sm">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">{lead.name}</div>
                    <div className="text-xs text-slate-500">{lead.source}</div>
                  </div>
                </div>
                <span className={`badge text-xs ${
                  lead.status === 'qualified' ? 'badge-blue' :
                  lead.status === 'converted' ? 'badge-green' :
                  'badge bg-slate-500/15 text-slate-400 border border-slate-500/30'
                }`}>
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
