import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Zap, Phone, Calendar, Users, ArrowRight, Check,
  MessageSquare, BarChart3, Shield, Globe, Sparkles,
  ChevronRight, Star, Twitter, Linkedin, Github
} from 'lucide-react'
import Navbar from '../../components/public/Navbar'
import { supabase } from '../../lib/supabase'
import logo from '../../assets/algogenta-logo.png'

export default function LandingPage() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('')
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone_number: '', notes: '' })
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false)
  const [inquirySubmitted, setInquirySubmitted] = useState(false)

  async function handleInquirySubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmittingInquiry(true)
    
    try {
      const { error } = await supabase
        .from('inquiry_form')
        .insert([
          { 
            name: inquiryForm.name, 
            email: inquiryForm.email, 
            phone_number: inquiryForm.phone_number, 
            notes: inquiryForm.notes,
            plan_interest: selectedPlan
          }
        ])

      if (error) throw error

      setInquirySubmitted(true)
      setInquiryForm({ name: '', email: '', phone_number: '', notes: '' })
      setTimeout(() => {
        setIsModalOpen(false)
        setInquirySubmitted(false)
      }, 3000)
    } catch (error) {
      console.error('Error submitting inquiry:', error)
      alert('There was an error submitting your form. Please try again.')
    } finally {
      setIsSubmittingInquiry(false)
    }
  }

  function handleContact(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setContactForm({ name: '', email: '', message: '' })
  }

  const plans = [
    {
      name: 'Basic',
      price: '$199',
      period: '/month',
      description: 'Perfect for small businesses getting started with AI automation',
      features: [
        '500 AI calls/month',
        '100 appointments/month',
        'Basic analytics dashboard',
        'Email support',
        'CRM integration',
        '1 AI voice agent',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$399',
      period: '/month',
      description: 'For growing teams that need advanced automation capabilities',
      features: [
        '5,000 AI calls/month',
        'Unlimited appointments',
        'Advanced analytics & reports',
        'Priority 24/7 support',
        'All CRM integrations',
        '5 AI voice agents',
        'Custom call scripts',
        'Lead scoring AI',
      ],
      cta: 'Get Started',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations with custom automation requirements',
      features: [
        'Unlimited AI calls',
        'Unlimited appointments',
        'Custom analytics & BI',
        'Dedicated success manager',
        'Custom integrations via API',
        'Unlimited AI voice agents',
        'White-label options',
        'SLA guarantee',
        'On-premise deployment',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ]

  const features = [
    { icon: <Phone size={22} />, title: 'AI Voice Calls', desc: 'Handle inbound and outbound calls 24/7 with natural-sounding AI voice agents that never sleep.' },
    { icon: <Calendar size={22} />, title: 'Smart Scheduling', desc: 'Automatically book, reschedule, and confirm appointments without any human intervention.' },
    { icon: <Users size={22} />, title: 'Lead Capture', desc: 'Qualify and capture leads from every call, converting conversations into business opportunities.' },
    { icon: <BarChart3 size={22} />, title: 'Deep Analytics', desc: 'Real-time dashboards tracking every call, appointment, and lead with actionable insights.' },
    { icon: <MessageSquare size={22} />, title: 'Smart Routing', desc: 'Intelligently route calls to the right department or escalate to human agents when needed.' },
    { icon: <Shield size={22} />, title: 'Enterprise Security', desc: 'Bank-grade encryption, SOC 2 compliant, GDPR ready. Your data is always protected.' },
  ]

  const stats = [
    { value: '98%', label: 'Call Answer Rate' },
    { value: '4.2x', label: 'More Appointments' },
    { value: '60%', label: 'Cost Reduction' },
    { value: '24/7', label: 'Always Online' },
  ]

  return (
    <div className="min-h-screen bg-dark-900 grid-bg overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="orb-1 top-20 -left-40 opacity-60" />
        <div className="orb-2 bottom-20 right-0 opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light border border-brand-500/20 text-brand-400 text-sm font-medium mb-8 fade-in">
            <Sparkles size={14} />
            <span>Powered by Advanced AI Voice Technology</span>
          </div>

          <h1 className="section-title text-5xl md:text-7xl mb-6 fade-in delay-100 leading-[1.1]">
            <span className="text-white">AI Automation for</span>
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-brand-300 to-accent-400 bg-clip-text text-transparent">
              Calls & Appointments
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 fade-in delay-200 font-body leading-relaxed">
            Automate inbound/outbound calls, capture leads, and book appointments using intelligent AI voice agents. Scale your business without scaling your team.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in delay-300">
            <a href="#contact" className="btn-primary text-base">
              Get Started Free
              <ArrowRight size={18} />
            </a>
            <a href="#pricing" className="btn-secondary text-base">
              View Pricing
            </a>
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 fade-in delay-400">
            {stats.map(s => (
              <div key={s.label} className="glass rounded-xl p-5">
                <div className="text-3xl font-display font-bold text-brand-400 mb-1">{s.value}</div>
                <div className="text-sm text-slate-500 font-body">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-brand-400 text-sm font-medium mb-4">
              <Zap size={14} />
              <span>PLATFORM CAPABILITIES</span>
            </div>
            <h2 className="section-title text-4xl text-white mb-4">Everything you need to automate</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              One platform to handle all your communication automation needs from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className="card group hover:border-brand-500/30 hover:glow-border transition-all duration-300 cursor-default" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-11 h-11 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400 mb-4 group-hover:bg-brand-500/25 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 relative">
        <div className="orb-1 -right-40 top-0 opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-brand-400 text-sm font-medium mb-4">
              <Star size={14} />
              <span>PRICING PLANS</span>
            </div>
            <h2 className="section-title text-4xl text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Choose the plan that fits your business. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${plan.highlighted
                  ? 'bg-gradient-to-b from-brand-600/20 to-brand-800/10 border-2 border-brand-500/60 shadow-2xl shadow-brand-500/10'
                  : 'glass border border-dark-400 hover:border-brand-500/30'
                  }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-500 rounded-full text-xs font-bold text-white uppercase tracking-wide">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-display font-bold text-xl text-white mb-2">{plan.name}</h3>
                  <div className="flex items-end gap-1 mb-3">
                    <span className={`text-4xl font-display font-bold ${plan.highlighted ? 'text-brand-400' : 'text-white'}`}>
                      {plan.price}
                    </span>
                    <span className="text-slate-500 mb-1">{plan.period}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check size={16} className={`mt-0.5 shrink-0 ${plan.highlighted ? 'text-brand-400' : 'text-emerald-400'}`} />
                      <span className="text-slate-300">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    if (plan.name !== 'Enterprise') {
                      setSelectedPlan(plan.name)
                      setIsModalOpen(true)
                      setInquirySubmitted(false)
                    } else {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 block ${plan.highlighted
                    ? 'bg-brand-500 hover:bg-brand-400 text-white shadow-lg shadow-brand-500/25'
                    : 'border border-dark-400 hover:border-brand-500/50 text-slate-300 hover:text-white hover:bg-brand-500/10'
                    }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-brand-400 text-sm font-medium mb-4">
                <Globe size={14} />
                <span>ABOUT US</span>
              </div>
              <h2 className="section-title text-4xl text-white mb-6">We're building the future of business communication</h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Algogenta was founded in 2023 with a single mission: eliminate the bottleneck of human availability in business communications. We believe every business deserves enterprise-level AI automation.
              </p>
              <p className="text-slate-400 leading-relaxed mb-8">
                Our AI voice agents have handled over 2 million calls, booked 500,000 appointments, and generated $50M+ in pipeline for our clients. We're not just a tool — we're your 24/7 digital workforce.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { v: '2M+', l: 'Calls Handled' },
                  { v: '500K', l: 'Appointments' },
                  { v: '1,200+', l: 'Happy Clients' },
                ].map(s => (
                  <div key={s.l} className="glass rounded-xl p-4 text-center">
                    <div className="text-2xl font-display font-bold text-brand-400">{s.v}</div>
                    <div className="text-xs text-slate-500 mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="glass rounded-2xl p-8 glow-border animate-float">
                <div className="space-y-4">
                  {[
                    { label: 'AI Calls Processed', value: '94%', color: 'bg-brand-500' },
                    { label: 'Lead Conversion Rate', value: '67%', color: 'bg-accent-500' },
                    { label: 'Customer Satisfaction', value: '98%', color: 'bg-emerald-500' },
                    { label: 'Automation Accuracy', value: '99.7%', color: 'bg-purple-500' },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="text-white font-semibold">{item.value}</span>
                      </div>
                      <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: item.value }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-brand-500/10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 relative">
        <div className="orb-2 left-0 bottom-0 opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <div className="inline-flex items-center gap-2 text-brand-400 text-sm font-medium mb-4">
                <MessageSquare size={14} />
                <span>CONTACT US</span>
              </div>
              <h2 className="section-title text-4xl text-white mb-6">Let's talk automation</h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Ready to transform your business communication? Our team will walk you through a personalized demo and help you get started.
              </p>
              <div className="space-y-4">
                {[
                  { icon: '📧', label: 'Email', value: 'admin@algogenta.com' },
                  { icon: '📞', label: 'Phone', value: '+1 (705) 910-8964' },
                  { icon: '🌍', label: 'Location', value: 'Soan Garden islamabad, Pakistan' },
                ].map(c => (
                  <div key={c.label} className="flex items-center gap-4">
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide">{c.label}</div>
                      <div className="text-slate-300 font-medium">{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 text-3xl mb-4">✓</div>
                  <h3 className="font-display font-bold text-white text-xl mb-2">Message Sent!</h3>
                  <p className="text-slate-400">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContact} className="space-y-5">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="John Smith"
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="john@company.com"
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Tell us about your business and automation needs..."
                      className="input-dark resize-none"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center">
                    Send Message
                    <ChevronRight size={18} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-14 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                <img
                  src={logo}
                  alt="Algogenta"
                  className="w-full h-full object-contain p-1.5 drop-shadow-[0_8px_18px_rgba(56,189,248,0.18)] brightness-105 contrast-105"
                />
              </div>
              <span className="font-display font-bold text-white">
                Algogenta
              </span>
            </div>
            <p className="text-slate-500 text-sm">© 2024 Algogenta. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <button key={i} className="text-slate-500 hover:text-brand-400 transition-colors">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Inquiry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm fade-in">
          <div className="glass w-full max-w-md rounded-2xl p-6 relative border border-brand-500/30">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
            
            <h3 className="text-2xl font-display font-bold text-white mb-2">
              {selectedPlan === 'Basic' ? 'Start Free Trial' : 'Get Started'}
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Fill out the form below and we'll get you set up with the {selectedPlan} plan.
            </p>

            {inquirySubmitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 text-3xl mb-4">✓</div>
                <h4 className="font-display font-bold text-white text-xl mb-2">Request Received!</h4>
                <p className="text-slate-400">We'll be in touch with you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={inquiryForm.name}
                    onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    className="input-dark w-full"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={inquiryForm.email}
                    onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    className="input-dark w-full"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={inquiryForm.phone_number}
                    onChange={e => setInquiryForm({ ...inquiryForm, phone_number: e.target.value })}
                    className="input-dark w-full"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Notes</label>
                  <textarea
                    rows={3}
                    value={inquiryForm.notes}
                    onChange={e => setInquiryForm({ ...inquiryForm, notes: e.target.value })}
                    className="input-dark w-full resize-none"
                    placeholder="Any specific requirements?"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmittingInquiry}
                  className="btn-primary w-full justify-center mt-2"
                >
                  {isSubmittingInquiry ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
