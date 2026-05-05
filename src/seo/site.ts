export const SITE = {
  name: 'Algogenta',
  tagline: 'AI Automation for Calls & Appointments',
  // Set this in your hosting environment (recommended).
  // Example: https://algogenta.com
  url: import.meta.env.VITE_SITE_URL || '',
  defaultTitle: 'Algogenta — AI Call Answering & Appointment Booking',
  defaultDescription:
    'Algogenta is an AI call answering and AI appointment booking platform that uses voice agents to qualify leads, route calls, and schedule appointments—built for insurance, medical billing, and home services teams.',
  // Optional: set if you have one (e.g. "@algogenta")
  twitterHandle: import.meta.env.VITE_TWITTER_HANDLE || '',
  // Optional: use a full URL (recommended) or a root-relative path that exists in /public
  defaultOgImage: import.meta.env.VITE_OG_IMAGE_URL || '/og.png',
}

export function absoluteUrl(pathOrUrl: string) {
  if (!pathOrUrl) return ''
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  if (!SITE.url) return pathOrUrl
  const base = SITE.url.replace(/\/+$/, '')
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${base}${path}`
}

