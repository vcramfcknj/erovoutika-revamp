import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Mail, Phone, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative bg-gray-900 text-gray-300 overflow-hidden">
      {/* SVG Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: 'url(/patterns/footer-pattern.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

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
              className="h-20 w-auto brightness-0 invert"
            />
            <p className="text-sm text-gray-400 leading-relaxed">
              Leading provider of robotics and automation solutions, specializing in custom automation systems for businesses globally.
            </p>
            {/* Social Media */}
<div className="flex gap-4">
  <a href="https://facebook.com/erovoutika" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-800 hover:bg-orange-600 rounded-full transition-colors group">
    <Facebook className="w-5 h-5" />
  </a>
  <a href="https://twitter.com/erovoutika" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-800 hover:bg-orange-600 rounded-full transition-colors group">
    <Twitter className="w-5 h-5" />
  </a>
  <a href="https://linkedin.com/company/erovoutika" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-800 hover:bg-orange-600 rounded-full transition-colors group">
    <Linkedin className="w-5 h-5" />
  </a>
  <a href="https://instagram.com/erovoutika" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-800 hover:bg-orange-600 rounded-full transition-colors group">
    <Instagram className="w-5 h-5" />
  </a>
</div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-sm hover:text-white transition-colors">
                Home
              </Link>
              <Link href="#about" className="text-sm hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="#" className="text-sm hover:text-white transition-colors">
                Products
              </Link>
              <Link href="/eira" className="text-sm hover:text-white transition-colors">
                EIRA
              </Link>
              <Link href="/robolution" className="text-sm hover:text-white transition-colors">
                Robolution
              </Link>
              <Link href="#contact" className="text-sm hover:text-white transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Our Services</h3>
            <nav className="flex flex-col space-y-3">
              <Link href="#services" className="text-sm hover:text-white transition-colors">
                Training & Certification
              </Link>
              <Link href="#services" className="text-sm hover:text-white transition-colors">
                Automation Solutions
              </Link>
              <Link href="#services" className="text-sm hover:text-white transition-colors">
                Robotics
              </Link>
              <Link href="#services" className="text-sm hover:text-white transition-colors">
                Research & Development
              </Link>
              <Link href="#services" className="text-sm hover:text-white transition-colors">
                Cybersecurity
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-white">PARC HOUSE II, Unit 703</p>
                  <p className="text-gray-400">Epifanio de los Santos Avenue</p>
                  <p className="text-gray-400">Makati City, 1212 Metro Manila</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <a href="mailto:info@erovoutika.ph" className="text-sm hover:text-white transition-colors">
                  info@erovoutika.ph
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <a href="tel:+639061497307" className="text-sm hover:text-white transition-colors">
                  +63 906 149 7307
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Erovoutika. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-600">|</Link>
              <Link href="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}