import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Eye, Building2, X, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface CreateCompanyForm {
  companyName: string
  ownerName: string
  email: string
  password: string
  companyType: string
}

type CompanyRow = {
  id: string
  name: string
  owner_name: string
  company_type: string
  created_at: string
  is_active: boolean
}

export default function SuperAdminCompanies() {
  const [companies, setCompanies] = useState<CompanyRow[]>([])
  const [adminEmailByCompanyId, setAdminEmailByCompanyId] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<CreateCompanyForm>({
    companyName: '', ownerName: '', email: '', password: '', companyType: ''
  })
  const [creating, setCreating] = useState(false)
  const [success, setSuccess] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return companies
    return companies.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.owner_name.toLowerCase().includes(q)
    )
  }, [companies, search])

  async function loadCompanies() {
    setLoading(true)
    setError(null)
    try {
      const [{ data: companiesData, error: companiesErr }, { data: adminsData, error: adminsErr }] =
        await Promise.all([
          supabase
            .from('companies')
            .select('id,name,owner_name,company_type,created_at,is_active')
            .order('created_at', { ascending: false }),
          supabase
            .from('profiles')
            .select('email,company_id')
            .eq('role', 'admin')
            .not('company_id', 'is', null),
        ])

      if (companiesErr) throw companiesErr
      if (adminsErr) throw adminsErr

      const emailMap: Record<string, string> = {}
      for (const row of (adminsData ?? []) as Array<{ email: string; company_id: string | null }>) {
        if (!row.company_id) continue
        if (!emailMap[row.company_id]) emailMap[row.company_id] = row.email
      }

      setCompanies((companiesData ?? []) as CompanyRow[])
      setAdminEmailByCompanyId(emailMap)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load companies'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCompanies()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setCreateError(null)

    try {
      const payload = {
        name: form.companyName.trim(),
        owner_name: form.ownerName.trim(),
        company_type: form.companyType,
        is_active: true,
      }

      const { error: insertErr } = await supabase.from('companies').insert(payload)
      if (insertErr) throw insertErr

      await loadCompanies()

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setShowCreate(false)
        setForm({ companyName: '', ownerName: '', email: '', password: '', companyType: '' })
      }, 2000)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to create company'
      setCreateError(message)
    } finally {
      setCreating(false)
    }
  }

  const companyTypes = ['Technology', 'Healthcare', 'Finance', 'Real Estate', 'Education', 'Retail', 'Sales', 'Import/Export', 'Other']

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Companies</h1>
          <p className="text-slate-400 text-sm mt-1">{companies.length} registered companies</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary text-sm py-2.5"
        >
          <Plus size={16} />
          Create Company
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-dark pl-10"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="pl-6">Company</th>
                <th>Type</th>
                <th>Owner</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Status</th>
                <th className="pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filtered.map(co => (
                <tr key={co.id}>
                  <td className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400 font-bold text-sm shrink-0">
                        {co.name.charAt(0)}
                      </div>
                      <span className="text-white font-medium">{co.name}</span>
                    </div>
                  </td>
                  <td><span className="badge-blue">{co.company_type}</span></td>
                  <td className="text-slate-300">{co.owner_name}</td>
                  <td className="text-slate-400 text-xs font-mono">{adminEmailByCompanyId[co.id] ?? '—'}</td>
                  <td className="text-slate-500 text-xs">{new Date(co.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={co.is_active ? 'badge-green' : 'badge bg-slate-500/15 text-slate-400 border border-slate-500/30'}>
                      {co.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="pr-6">
                    <Link
                      to={`/super-admin/companies/${co.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-brand-400 hover:bg-brand-500/10 transition-colors border border-brand-500/20 hover:border-brand-500/40"
                    >
                      <Eye size={12} />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="py-16 text-center">
            <p className="text-slate-500">Loading companies…</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center">
            <Building2 size={40} className="text-dark-400 mx-auto mb-3" />
            <p className="text-slate-500">No companies found</p>
          </div>
        )}
      </div>

      {error && (
        <div className="card border border-red-500/30 bg-red-500/10 text-red-200 text-sm flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Create Company Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative w-full max-w-lg glass rounded-2xl p-7 glow-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-white">Create New Company</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            {success ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
                <h3 className="font-display text-white font-bold text-lg mb-1">Company Created!</h3>
                <p className="text-slate-400 text-sm">Company has been added to the database.</p>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Company Name</label>
                  <input type="text" required value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} placeholder="Acme Corp" className="input-dark" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Owner Name</label>
                  <input type="text" required value={form.ownerName} onChange={e => setForm({ ...form, ownerName: e.target.value })} placeholder="John Smith" className="input-dark" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Email Address</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="admin@company.com" className="input-dark" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Initial Password</label>
                  <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min. 8 characters" className="input-dark" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Company Type</label>
                  <select value={form.companyType} onChange={e => setForm({ ...form, companyType: e.target.value })} required className="input-dark bg-dark-700 appearance-none cursor-pointer">
                    <option value="">Select type...</option>
                    {companyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {createError && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200 flex items-start gap-2">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{createError}</span>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary flex-1 justify-center text-sm py-2.5">Cancel</button>
                  <button type="submit" disabled={creating} className="btn-primary flex-1 justify-center text-sm py-2.5 disabled:opacity-60">
                    {creating ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Creating...</> : 'Create Company'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
