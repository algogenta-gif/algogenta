import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

type Body = {
  email: string
  password: string
  full_name: string
  company_id?: string | null
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return json(405, { error: 'Method not allowed' })
  }

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
  const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SERVICE_ROLE_KEY) {
    return json(500, { error: 'Missing Supabase env vars' })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    console.log('401: missing authorization header')
    return json(401, { error: 'Missing Authorization header' })
  }

  const bearer = authHeader.startsWith('Bearer ') ? authHeader : `Bearer ${authHeader}`
  const token = bearer.slice('Bearer '.length).trim()
  if (!token) {
    console.log('401: empty bearer token')
    return json(401, { error: 'Missing Authorization header' })
  }

  // Caller client (user verification)
  const callerClient = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          Authorization: bearer,
        },
      },
    }
  )
  // Pass the JWT explicitly instead of relying on forwarded headers.
  const { data: userData, error: userErr } = await callerClient.auth.getUser(token)

  if (userErr || !userData?.user) {
    console.log('401: invalid session', { message: userErr?.message })
    return json(401, { error: 'Invalid session' })
  }

  const callerId = userData.user.id

  const { data: callerProfile, error: profileErr } = await callerClient
    .from('profiles')
    .select('role')
    .eq('id', callerId)
    .single()

  if (profileErr || callerProfile?.role !== 'super_admin') {
    return json(403, { error: 'Not authorized' })
  }

  let body: Body
  try {
    body = await req.json()
  } catch {
    return json(400, { error: 'Invalid JSON' })
  }

  const email = body.email?.trim().toLowerCase()
  const password = body.password
  const full_name = body.full_name?.trim()
  const company_id = body.company_id ?? null

  if (!email || !password || !full_name) {
    return json(400, { error: 'Missing required fields' })
  }

  if (password.length < 8) {
    return json(400, { error: 'Password must be at least 8 characters' })
  }

  // Admin client
  const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  const { data: createdUser, error: createErr } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

  if (createErr || !createdUser?.user) {
    console.log('400: auth.admin.createUser failed', { message: createErr?.message })
    return json(400, { error: createErr?.message || 'User creation failed' })
  }

  const userId = createdUser.user.id

  const { error: insertErr } = await adminClient
    .from('profiles')
    .upsert(
      {
        id: userId,
        email,
        full_name,
        role: 'admin',
        company_id,
      },
      { onConflict: 'id' }
    )

  if (insertErr) {
    console.log('400: profiles insert failed', { message: insertErr.message })
    await adminClient.auth.admin.deleteUser(userId)
    return json(400, { error: insertErr.message })
  }

  return json(200, {
    id: userId,
    email,
    full_name,
    role: 'admin',
  })
})