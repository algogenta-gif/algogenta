import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Users, X, Shield } from 'lucide-react'
import { supabase } from '../../lib/supabase'

type Company = {
  id: string
  name: string
  is_active: boolean
}

type AdminUser = {
  id: string
  full_name: string
  email: string
  role: 'admin'
  company_id: string | null
  created_at: string
}

export default function SuperAdminUsers() {
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const [users, setUsers] = useState<AdminUser[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [createFullName, setCreateFullName] = useState('')
  const [createEmail, setCreateEmail] = useState('')
  const [createPassword, setCreatePassword] = useState('')
  const [createCompanyId, setCreateCompanyId] = useState<string>('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const companyById = useMemo(() => {
    const map = new Map<string, Company>()
    for (const c of companies) map.set(c.id, c)
    return map
  }, [companies])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter(u =>
      u.full_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    )
  }, [users, search])

  async function loadCompaniesAndUsers() {
    setLoading(true)
    setError(null)
    try {
      const [{ data: companiesData, error: companiesErr }, { data: usersData, error: usersErr }] =
        await Promise.all([
          supabase.from('companies').select('id,name,is_active').order('created_at', { ascending: false }),
          supabase.from('profiles').select('id,email,full_name,role,company_id,created_at').eq('role', 'admin').order('created_at', { ascending: false }),
        ])

      if (companiesErr) throw companiesErr
      if (usersErr) throw usersErr

      setCompanies((companiesData ?? []) as Company[])
      setUsers(((usersData ?? []) as unknown as AdminUser[]).filter(u => u.role === 'admin'))
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load users'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCompaniesAndUsers()
  }, [])

  function openCreate() {
    setCreateFullName('')
    setCreateEmail('')
    setCreatePassword('')
    setCreateCompanyId('')
    setCreateError(null)
    setShowCreate(true)
  }

  async function onCreateUser(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setCreateError(null)

    try {
      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession()
      if (sessionErr) throw sessionErr
      const accessToken = sessionData.session?.access_token
      if (!accessToken) throw new Error('Not authenticated')

      const { data, error: fnErr } = await supabase.functions.invoke(
        'create-admin-user',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: {
            email: createEmail.trim().toLowerCase(),
            password: createPassword,
            full_name: createFullName.trim(),
            company_id: createCompanyId ? createCompanyId : null,
          },
        }
      )
      if (fnErr) {
        // Surface Edge Function JSON error messages (e.g. { error: "..." })
        const anyErr = fnErr as unknown as { context?: { body?: unknown } }
        const body = anyErr?.context?.body
        if (body && typeof body === 'object' && 'error' in body) {
          const msg = (body as { error?: unknown }).error
          if (typeof msg === 'string' && msg.trim()) throw new Error(msg)
        }
        throw fnErr
      }
      if (!data?.id) throw new Error('Failed to create user')

      await loadCompaniesAndUsers()
      setShowCreate(false)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to create user'
      setCreateError(message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">User Management</h1>
          <p className="text-slate-400 text-sm mt-1">{users.length} admin users</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2.5">
          <Plus size={16} />
          Add User
        </button>
      </div>

      {error && (
        <div className="card border border-red-500/30 bg-red-500/10 text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-dark pl-10"
        />
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="pl-6">User</th>
                <th>Company</th>
                <th>Role</th>
                <th>Joined</th>
                <th className="pr-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filtered.map(user => (
                <tr key={user.id}>
                  <td className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-500/15 flex items-center justify-center text-purple-400 font-bold text-sm shrink-0">
                        {user.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{user.full_name}</div>
                        <div className="text-slate-500 text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-slate-300 text-sm">
                    {user.company_id ? (companyById.get(user.company_id)?.name ?? '—') : '—'}
                  </td>
                  <td>
                    <span className="flex items-center gap-1.5 badge-blue w-fit">
                      <Shield size={10} />
                      {user.role}
                    </span>
                  </td>
                  <td className="text-slate-500 text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="pr-6">
                    <span className={(user.company_id && companyById.get(user.company_id)?.is_active) ? 'badge-green' : 'badge bg-slate-500/15 text-slate-400 border border-slate-500/30'}>
                      {(user.company_id && companyById.get(user.company_id)?.is_active) ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && (
          <div className="py-16 text-center">
            <p className="text-slate-500">Loading users…</p>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center">
            <Users size={40} className="text-dark-400 mx-auto mb-3" />
            <p className="text-slate-500">No users found</p>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative w-full max-w-md glass rounded-2xl p-7 glow-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-white">Add Admin User</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-600 transition-colors">
                <X size={18} />
              </button>
            </div>
            <form className="space-y-4" onSubmit={onCreateUser}>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Smith"
                  className="input-dark"
                  value={createFullName}
                  onChange={e => setCreateFullName(e.target.value)}
                  disabled={creating}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jane@company.com"
                  className="input-dark"
                  value={createEmail}
                  onChange={e => setCreateEmail(e.target.value)}
                  disabled={creating}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Temporary Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  className="input-dark"
                  value={createPassword}
                  onChange={e => setCreatePassword(e.target.value)}
                  disabled={creating}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Assign Company</label>
                <select
                  className="input-dark bg-dark-700 appearance-none"
                  value={createCompanyId}
                  onChange={e => setCreateCompanyId(e.target.value)}
                  disabled={creating}
                >
                  <option value="">— No company —</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              {createError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                  {createError}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary flex-1 justify-center text-sm py-2.5" disabled={creating}>Cancel</button>
                <button type="submit" className="btn-primary flex-1 justify-center text-sm py-2.5" disabled={creating}>
                  {creating ? 'Creating…' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
