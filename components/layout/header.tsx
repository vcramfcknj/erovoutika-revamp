'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'
import { usePathname } from 'next/navigation'
import { LanguageToggle } from '@/components/LanguageToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useLanguage } from '@/lib/i18n/languageContext'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'

function useIsDarkModeClass() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement

    const sync = () => setIsDark(root.classList.contains('dark'))
    sync()

    const obs = new MutationObserver(sync)
    obs.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  return isDark
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const pathname = usePathname()
  const { t } = useLanguage()
  const isDark = useIsDarkModeClass()

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 18)
  })

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false)
  }, [pathname])

  const handleClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleLogoClick = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const regularNav = useMemo(
    () => SITE_CONFIG.navigation.filter((item) => !item.highlight),
    []
  )

  const variants = useMemo(() => {
    const topBg = 'rgba(255,255,255,0)'
    const topBorder = 'rgba(0,0,0,0)'
    const topShadow = '0 0 0 rgba(0,0,0,0)'

    const scrolledBg = isDark ? 'rgba(17,24,39,0.72)' : 'rgba(255,255,255,0.82)'
    const scrolledBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
    const scrolledShadow = isDark
      ? '0 10px 30px rgba(0,0,0,0.45)'
      : '0 10px 30px rgba(0,0,0,0.10)'

    return {
      top: {
        backgroundColor: topBg,
        borderColor: topBorder,
        boxShadow: topShadow,
        backdropFilter: 'blur(0px)',
        height: 80,
      },
      scrolled: {
        backgroundColor: scrolledBg,
        borderColor: scrolledBorder,
        boxShadow: scrolledShadow,
        backdropFilter: 'blur(14px)',
        height: 72,
      },
    }
  }, [isDark])

  return (
    <motion.header
      animate={scrolled ? 'scrolled' : 'top'}
      variants={variants}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full border-b"
      style={{ willChange: 'background-color, backdrop-filter, height, box-shadow, border-color' }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between" style={{ height: '100%' }}>
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer group py-2"
            aria-label="Go to top"
          >
            <Image
              src="/erovoutika-logo.png"
              alt="Erovoutika Logo"
              width={160}
              height={50}
              className="h-16 w-auto group-hover:opacity-85 transition-opacity duration-200"
              priority
            />
            <span className="hidden xl:block text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500 dark:text-slate-400 border-l border-gray-200/70 dark:border-gray-700/70 pl-3 leading-tight">
              Robotics &<br />Automation
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-1">
              {regularNav.map((item) => {
                const base =
                  'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200'
                const colors =
                  'text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/70 dark:hover:bg-orange-950/30'

                if (item.href.startsWith('#')) {
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleClick(item.href)}
                      className={`${base} ${colors}`}
                    >
                      {item.name}
                    </button>
                  )
                }

                return (
                  <Link key={item.name} href={item.href} className={`${base} ${colors}`}>
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right */}
          <div className="hidden lg:flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <a
              href="https://shop.erovoutika.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-11 px-6 bg-blue-600 hover:bg-orange-600 text-white rounded-md shadow-md hover:shadow-lg transition-all font-medium text-sm"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Shop Now
            </a>
          </div>

          {/* Mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg transition-colors bg-white/85 dark:bg-slate-900/60 border border-gray-200/70 dark:border-gray-700/70 shadow-sm backdrop-blur hover:bg-orange-50/70 dark:hover:bg-orange-950/30 hover:text-orange-600 dark:hover:text-orange-400"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
{isMenuOpen && (
  <nav className="lg:hidden py-6 space-y-2 border-t border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-slate-900 shadow-lg">
    {regularNav.map((item) => {
      const base =
        'w-full text-left flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors'
      const colors =
        'text-gray-700 dark:text-gray-200 hover:bg-orange-50/70 dark:hover:bg-orange-950/30 hover:text-orange-600 dark:hover:text-orange-400'

      if (item.href.startsWith('#')) {
        return (
          <button
            key={item.name}
            onClick={() => {
              handleClick(item.href)
              setIsMenuOpen(false)
            }}
            className={`${base} ${colors}`}
          >
            {item.name}
          </button>
        )
      }

      return (
        <Link
          key={item.name}
          href={item.href}
          className={`${base} ${colors}`}
          onClick={() => setIsMenuOpen(false)}
        >
          {item.name}
        </Link>
      )
    })}

    <div className="pt-2">
      <LanguageToggle />
    </div>

    <a
      href="https://shop.erovoutika.ph/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center w-full h-11 px-6 bg-blue-600 hover:bg-orange-600 text-white rounded-md font-medium text-base mt-2 transition-colors"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      onClick={() => setIsMenuOpen(false)}
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      Shop Now
    </a>
  </nav>
)}
      </div>
    </motion.header>
  )
}