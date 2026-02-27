import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Mail, Phone, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative bg-gray-900 dark:bg-[#030712] text-gray-300 overflow-hidden">
      {/* SVG Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-100 dark:opacity-60"
        style={{
          backgroundImage: 'url(/patterns/footer-pattern.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Dark mode top border accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 dark:via-blue-400/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand & Description */}
          <div className="space-y-6">
            <Image
              src="/footer_logo.png"
              alt="Erovoutika Logo"
              width={160}
              height={50}
              className="h-20 w-auto brightness-0 invert dark:brightness-100 dark:invert-0 dark:opacity-90"
            />
            <p className="text-sm text-gray-400 dark:text-slate-500 leading-relaxed">
              Leading provider of robotics and automation solutions, specializing in custom automation systems for businesses globally.
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              <a href="https://facebook.com/erovoutika" target="_blank" rel="noopener noreferrer"
                className="p-2.5 bg-gray-800 dark:bg-slate-800/80 hover:bg-orange-600 dark:hover:bg-orange-600 border border-gray-700/50 dark:border-slate-700/50 hover:border-orange-500 rounded-full transition-all duration-200">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://twitter.com/erovoutika" target="_blank" rel="noopener noreferrer"
                className="p-2.5 bg-gray-800 dark:bg-slate-800/80 hover:bg-orange-600 dark:hover:bg-orange-600 border border-gray-700/50 dark:border-slate-700/50 hover:border-orange-500 rounded-full transition-all duration-200">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com/company/erovoutika" target="_blank" rel="noopener noreferrer"
                className="p-2.5 bg-gray-800 dark:bg-slate-800/80 hover:bg-orange-600 dark:hover:bg-orange-600 border border-gray-700/50 dark:border-slate-700/50 hover:border-orange-500 rounded-full transition-all duration-200">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/erovoutika" target="_blank" rel="noopener noreferrer"
                className="p-2.5 bg-gray-800 dark:bg-slate-800/80 hover:bg-orange-600 dark:hover:bg-orange-600 border border-gray-700/50 dark:border-slate-700/50 hover:border-orange-500 rounded-full transition-all duration-200">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white dark:text-slate-100 text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '#about', label: 'About Us' },
                { href: '#', label: 'Products' },
                { href: '/eira', label: 'EIRA' },
                { href: '/robolution', label: 'Robolution' },
                { href: '#contact', label: 'Contact' },
              ].map(({ href, label }) => (
                <Link key={label} href={href}
                  className="text-sm text-gray-400 dark:text-slate-500 hover:text-white dark:hover:text-slate-200 transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-white dark:text-slate-100 text-lg font-semibold">Our Services</h3>
            <nav className="flex flex-col space-y-3">
              {[
                'Training & Certification',
                'Automation Solutions',
                'Robotics',
                'Research & Development',
                'Cybersecurity',
              ].map((label) => (
                <Link key={label} href="#services"
                  className="text-sm text-gray-400 dark:text-slate-500 hover:text-white dark:hover:text-slate-200 transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white dark:text-slate-100 text-lg font-semibold">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-white dark:text-slate-200">PARC HOUSE II, Unit 703</p>
                  <p className="text-gray-400 dark:text-slate-500">Epifanio de los Santos Avenue</p>
                  <p className="text-gray-400 dark:text-slate-500">Makati City, 1212 Metro Manila</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0" />
                <a href="mailto:info@erovoutika.ph"
                  className="text-sm text-gray-400 dark:text-slate-500 hover:text-white dark:hover:text-slate-200 transition-colors">
                  info@erovoutika.ph
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0" />
                <a href="tel:+639061497307"
                  className="text-sm text-gray-400 dark:text-slate-500 hover:text-white dark:hover:text-slate-200 transition-colors">
                  +63 906 149 7307
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 dark:border-slate-800/80">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-slate-600">
              &copy; {new Date().getFullYear()} Erovoutika. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-gray-500 dark:text-slate-600 hover:text-white dark:hover:text-slate-300 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-700 dark:text-slate-700">|</span>
              <Link href="#" className="text-gray-500 dark:text-slate-600 hover:text-white dark:hover:text-slate-300 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}