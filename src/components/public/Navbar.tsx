import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { label: 'Home', href: '/#home' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'About Us', href: '/#about' },
    { label: 'Contact Us', href: '/#contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass border-b border-brand-500/10 shadow-lg shadow-brand-900/20' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center group-hover:bg-brand-400 transition-colors">
              <Zap size={16} className="text-white fill-white" />
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">
              Automate<span className="text-brand-400">360</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Login
            </Link>
            <a
              href="#contact"
              className="btn-primary text-sm py-2 px-5"
            >
              Get Started
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-dark-500">
          <div className="px-4 py-4 space-y-1">
            {links.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-dark-500 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                Login
              </Link>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="btn-primary text-sm justify-center">
                Get Started
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
