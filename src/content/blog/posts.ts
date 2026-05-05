export type BlogPost = {
  slug: string
  title: string
  description: string
  publishedAt: string // YYYY-MM-DD
  tags: string[]
  hero?: string
  content: Array<
    | { kind: 'p'; text: string }
    | { kind: 'h2'; text: string }
    | { kind: 'ul'; items: string[] }
  >
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'what-is-ai-voice-automation',
    title: 'What is AI Voice Automation? (And why it matters in 2026)',
    description:
      'A practical guide to AI voice automation: what it is, where it works, where it fails, and how to deploy it safely for real business outcomes.',
    publishedAt: '2026-05-05',
    tags: ['Voice AI', 'Automation', 'Operations'],
    content: [
      { kind: 'p', text: 'AI voice automation uses speech recognition, natural language understanding, and a dialog engine to handle phone interactions without a human agent for every call.' },
      { kind: 'p', text: 'The best systems are not “chatbots on the phone.” They are tightly scoped workflows connected to your CRM, calendar, and lead routing rules—with clear fallbacks and auditability.' },
      { kind: 'h2', text: 'Where it works best' },
      { kind: 'ul', items: [
        'Inbound lead capture and qualification (name, intent, budget, timeline)',
        'Appointment booking, rescheduling, and confirmations',
        'After-hours answering with “call back tomorrow” handoff',
        'FAQ-style triage (hours, location, pricing ranges) with escalation'
      ]},
      { kind: 'h2', text: 'Where it fails (and how to avoid it)' },
      { kind: 'ul', items: [
        'Open-ended troubleshooting without knowledge grounding',
        'Complex negotiation (pricing exceptions, sensitive disputes)',
        'Any flow without an explicit “escape hatch” to a human'
      ]},
      { kind: 'p', text: 'A good starting point is a single measurable workflow (e.g., “book qualified consultations”), then expand to adjacent flows once accuracy and conversion metrics are stable.' },
    ],
  },
  {
    slug: 'ai-appointment-booking-playbook',
    title: 'AI Appointment Booking Playbook: increase show-rate and reduce no-shows',
    description:
      'How to design a booking flow that stays on-brand, captures the right details, and improves attendance with smart reminders.',
    publishedAt: '2026-05-05',
    tags: ['Appointments', 'Revenue', 'CX'],
    content: [
      { kind: 'p', text: 'Appointment booking is one of the highest-ROI automation targets because it’s structured: collect details → check availability → book → confirm → remind.' },
      { kind: 'h2', text: 'A high-converting booking flow' },
      { kind: 'ul', items: [
        'Confirm intent: what the caller wants, and whether you can help',
        'Collect only the minimum required fields to book',
        'Offer 2–3 time options (don’t ask “what works?”)',
        'Confirm: date/time, location or meeting link, and preparation steps',
        'Send reminders (24h and 2h) + easy reschedule'
      ]},
      { kind: 'h2', text: 'What to track' },
      { kind: 'ul', items: [
        'Booking completion rate (start → booked)',
        'Average time to book',
        'Reschedule rate and no-show rate',
        'Lead-to-appointment conversion by source'
      ]},
      { kind: 'p', text: 'Algogenta-style automation wins when it’s connected: calendar availability, CRM enrichment, and lead routing rules all in one loop.' },
    ],
  },
  {
    slug: 'lead-qualification-questions-that-convert',
    title: 'Lead Qualification Questions that convert (without sounding robotic)',
    description:
      'A compact question set that improves routing and close rates—plus scripts to keep the conversation natural.',
    publishedAt: '2026-05-05',
    tags: ['Leads', 'Sales', 'Scripts'],
    content: [
      { kind: 'p', text: 'Qualification is not interrogation. Your goal is to route correctly, set expectations, and protect your team’s time.' },
      { kind: 'h2', text: 'The “minimum viable qualification” set' },
      { kind: 'ul', items: [
        'What are you hoping to achieve? (outcome)',
        'When do you need this solved? (timeline)',
        'What’s your budget range? (fit)',
        'Who’s involved in the decision? (process)',
        'What have you tried already? (context)'
      ]},
      { kind: 'p', text: 'In automation, the trick is phrasing: ask one question at a time, reflect back the answer, and confirm next steps. The result is higher trust—and cleaner CRM data.' },
    ],
  },
  {
    slug: 'call-analytics-metrics-that-matter',
    title: 'Call Analytics Metrics that actually matter (and what to do with them)',
    description:
      'From talk-time to conversion rate: which call metrics drive revenue and which ones are vanity.',
    publishedAt: '2026-05-05',
    tags: ['Analytics', 'Operations', 'KPIs'],
    content: [
      { kind: 'p', text: 'Most teams track volume, but not outcomes. The right metrics are the ones that change decisions.' },
      { kind: 'h2', text: 'Core metrics' },
      { kind: 'ul', items: [
        'Qualified lead rate (calls → qualified leads)',
        'Appointment rate (calls → booked)',
        'Show rate (booked → attended)',
        'Revenue per call (or per qualified lead)',
        'Time-to-first-response (missed calls are expensive)'
      ]},
      { kind: 'p', text: 'Use these metrics to identify where the funnel leaks: is it routing, qualification, booking friction, or reminders? Then optimize one step at a time.' },
    ],
  },
  {
    slug: 'how-to-choose-a-voice-ai-vendor',
    title: 'How to choose a Voice AI vendor: a buyer’s checklist',
    description:
      'A pragmatic checklist for evaluating voice automation vendors: integrations, safety, analytics, and rollout plan.',
    publishedAt: '2026-05-05',
    tags: ['Buyer Guide', 'Voice AI', 'Security'],
    content: [
      { kind: 'p', text: 'Voice AI can move revenue quickly—but only if it’s reliable, measurable, and safe. A good vendor makes it easy to pilot, iterate, and scale.' },
      { kind: 'h2', text: 'Vendor checklist' },
      { kind: 'ul', items: [
        'Integration depth: CRM + calendar + messaging + webhooks',
        'Operational controls: hours, routing rules, handoff to humans',
        'Quality tools: transcript review, intent audits, versioning',
        'Compliance posture: data retention, access control, logging',
        'Analytics: funnel metrics, call reasons, conversion tracking'
      ]},
      { kind: 'p', text: 'If you can’t run a 2-week pilot with clear success metrics, the vendor isn’t ready for production.' },
    ],
  },
  {
    slug: 'roi-of-automation-in-small-teams',
    title: 'The ROI of automation in small teams: do more with less (without burnout)',
    description:
      'How small teams can use automation to improve response times, protect focus, and grow revenue—without hiring ahead of demand.',
    publishedAt: '2026-05-05',
    tags: ['ROI', 'Small Business', 'Productivity'],
    content: [
      { kind: 'p', text: 'Automation isn’t about replacing people—it’s about removing repeated work so your team can focus on customers and growth.' },
      { kind: 'h2', text: 'Where ROI shows up first' },
      { kind: 'ul', items: [
        'Fewer missed calls and faster lead response',
        'Higher appointment volume without extra headcount',
        'Cleaner CRM data for better follow-up',
        'Lower no-show rates with reminders and rescheduling'
      ]},
      { kind: 'p', text: 'Start with one workflow tied to revenue (booking + follow-up). Once you can measure lift, expand to qualification, FAQs, and after-hours coverage.' },
    ],
  },
]

export function getPostBySlug(slug: string) {
  return BLOG_POSTS.find(p => p.slug === slug)
}

