import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

type Body = {
  kind?: 'inquiry' | 'contact'
  name: string
  email: string
  phone_number?: string
  notes?: string
  plan_interest?: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })
}

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    if (req.method !== 'POST') {
      return json(405, { error: 'Method not allowed' })
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'Algogenta <onboarding@resend.dev>'
    const TO_EMAIL = Deno.env.get('TO_EMAIL') || 'algogenta@gmail.com'

    if (!RESEND_API_KEY) {
      return json(500, { error: 'Missing RESEND_API_KEY' })
    }

    let body: Body
    try {
      body = await req.json()
    } catch {
      return json(400, { error: 'Invalid JSON' })
    }

    const name = body.name?.trim()
    const email = body.email?.trim()
    const phone = body.phone_number?.trim() || ''
    const notes = body.notes?.trim() || ''
    const plan_interest = body.plan_interest?.trim() || ''
    const kind = body.kind || 'inquiry'

    if (!name || !email) {
      return json(400, { error: 'Missing required fields' })
    }

    const subject =
      kind === 'contact'
        ? `New Contact Us message — ${name}`
        : `New Inquiry — ${name}${plan_interest ? ` (${plan_interest})` : ''}`

    const html = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
        <h2 style="margin: 0 0 12px;">${escapeHtml(subject)}</h2>
        <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p style="margin: 0 0 8px;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
        ${plan_interest ? `<p style="margin: 0 0 8px;"><strong>Plan interest:</strong> ${escapeHtml(plan_interest)}</p>` : ''}
        ${notes ? `<p style="margin: 16px 0 8px;"><strong>Message:</strong></p><pre style="margin: 0; padding: 12px; background: #0b1220; color: #e2e8f0; border-radius: 10px; white-space: pre-wrap;">${escapeHtml(notes)}</pre>` : ''}
      </div>
    `.trim()

    const resendResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        subject,
        html,
        reply_to: email,
      }),
    })

    const resendBody = await resendResp.json().catch(() => null)

    if (!resendResp.ok) {
      return json(500, { error: 'Failed to send email', details: resendBody })
    }

    return json(200, { ok: true, id: (resendBody as { id?: string } | null)?.id ?? null })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return json(500, { error: 'Unhandled error', message })
  }
})

