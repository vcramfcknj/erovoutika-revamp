'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, ShoppingCart, GraduationCap, Bot, UserCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { LanguageToggle } from '@/components/LanguageToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useLanguage } from '@/lib/i18n/languageContext'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const getIcon = (iconType?: string) => {
    if (iconType === 'graduation') return <GraduationCap className="w-4 h-4 mr-1.5" />
    if (iconType === 'bot') return <Bot className="w-4 h-4 mr-1.5" />
    return null
  }

  const handleClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const regularNav = SITE_CONFIG.navigation.filter(item => !item.highlight)
  const highlightedNav = SITE_CONFIG.navigation.filter(item => item.highlight)

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-200">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <button onClick={handleLogoClick} className="flex items-center cursor-pointer">
            <Image
              src="/erovoutika-logo.png"
              alt="Erovoutika Logo"
              width={160}
              height={50}
              className="h-20 w-auto dark:brightness-0 dark:invert"
              priority
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-1">
              {regularNav.map((item) => {
                if (item.href.startsWith('#')) {
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleClick(item.href)}
                      className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded-lg transition-all duration-200"
                    >
                      {item.name}
                    </button>
                  )
                } else {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded-lg transition-all duration-200"
                    >
                      {item.name}
                    </Link>
                  )
                }
              })}
            </nav>

            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />

            <nav className="flex items-center gap-1">
              {highlightedNav.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative px-5 py-2 text-sm font-medium transition-all duration-200 rounded-lg text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-orange-50 hover:to-orange-100 hover:text-orange-600 dark:from-blue-950/40 dark:to-purple-950/40 dark:text-blue-400 dark:hover:from-orange-950/40 dark:hover:to-orange-900/40 dark:hover:text-orange-400"
                >
                  <span className="flex items-center">
                    {getIcon(item.icon)}
                    {item.name}
                  </span>
                </a>
              ))}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <LanguageToggle />
            {/* Theme toggle — sits right next to language toggle */}
            <ThemeToggle />

            <a
              href="https://shop.erovoutika.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-11 px-6 bg-blue-600 hover:bg-orange-600 text-white rounded-full shadow-md hover:shadow-lg transition-all font-medium text-sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Shop Now
            </a>

            {!isLoggedIn && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-gray-300 dark:border-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all"
              >
                <Link href="/login">
                  <UserCircle className="w-5 h-5 mr-2" />
                  Login
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile: theme toggle + menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden py-6 space-y-2 border-t border-gray-100 dark:border-gray-800">
            {SITE_CONFIG.navigation.map((item) => {
              const isHighlighted = item.highlight

              if (item.href.startsWith('#')) {
                return (
                  <button
                    key={item.name}
                    onClick={() => { handleClick(item.href); setIsMenuOpen(false) }}
                    className={`w-full text-left flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      isHighlighted
                        ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 hover:from-orange-50 hover:to-orange-100 hover:text-orange-600'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-600 dark:hover:text-orange-400'
                    }`}
                  >
                    {getIcon(item.icon)}
                    {item.name}
                  </button>
                )
              } else {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      isHighlighted
                        ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 hover:from-orange-50 hover:to-orange-100 hover:text-orange-600'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-600 dark:hover:text-orange-400'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {getIcon(item.icon)}
                    {item.name}
                  </a>
                )
              }
            })}

            <div className="pt-4">
              <LanguageToggle />
            </div>

            <a
              href="https://shop.erovoutika.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full h-11 px-6 bg-blue-600 hover:bg-orange-600 text-white rounded-lg font-medium text-base mt-4 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Shop Now
            </a>

            {!isLoggedIn && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400"
              >
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <UserCircle className="w-4 h-4 mr-2" />
                  Admin Login
                </Link>
              </Button>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}