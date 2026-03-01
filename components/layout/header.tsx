'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'
import { usePathname } from 'next/navigation'
import { LanguageToggle } from '@/components/LanguageToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useLanguage } from '@/lib/i18n/languageContext'
import { useTheme } from '@/components/ThemeProvider'
import { motion, useMotionValueEvent, useScroll, useSpring, AnimatePresence } from 'framer-motion'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [atTop, setAtTop]           = useState(true)
  const [navVisible, setNavVisible] = useState(false)

  const pathname  = usePathname()
  const { t }     = useLanguage()
  const { theme } = useTheme()
  const isDark    = theme === 'dark'

  const { scrollY, scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 18)
    setAtTop(latest < 10)

    // Hero track is 300vh tall. Nav reveals after ~half a viewport scroll
    // (= 0.18 × 300vh → roughly window.innerHeight × 0.5 in practice feels right)
    const threshold = typeof window !== 'undefined' ? window.innerHeight * 0.5 : 400
    setNavVisible(latest > threshold)
  })

  useEffect(() => { setIsMenuOpen(false) }, [pathname])

  const isHomePage    = pathname === '/'
  const shouldShowNav = !isHomePage || navVisible

  const handleClick = (href: string) => {
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const regularNav = useMemo(
    () => SITE_CONFIG.navigation.filter((item) => !item.highlight),
    []
  )

  const isHeroVisible = isHomePage && atTop && isDark

  const navTextColor  = isHeroVisible ? 'text-white'         : isDark ? 'text-slate-200'    : 'text-gray-900'
  const navTextHover  = isHeroVisible ? 'hover:text-white/80': isDark ? 'hover:text-white'  : 'hover:text-blue-600'
  const navPillBorder = isHeroVisible ? 'border-white/25'    : isDark ? 'border-slate-600/70': 'border-gray-300'
  const navHoverBg    = isHeroVisible ? 'bg-white/15'        : isDark ? 'bg-slate-700/60'   : 'bg-gray-100'

  const headerBg = scrolled
    ? isDark ? 'rgba(5,10,20,0.90)' : 'rgba(255,255,255,0.95)'
    : 'rgba(0,0,0,0)'
  const headerShadow = scrolled
    ? isDark ? '0 4px 24px rgba(0,0,0,0.5)' : '0 2px 16px rgba(0,0,0,0.09)'
    : 'none'
  const headerBorderColor = scrolled
    ? isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.09)'
    : 'rgba(0,0,0,0)'

  return (
    <AnimatePresence>
      {shouldShowNav && (
        <motion.header
          key="main-header"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 right-0 z-50 w-full"
          style={{ willChange: 'transform' }}
        >
          {/* Animated backdrop */}
          <motion.div
            className="absolute inset-0 pointer-events-none border-b"
            animate={{
              backgroundColor: headerBg,
              backdropFilter: scrolled ? 'blur(18px)' : 'blur(0px)',
              boxShadow: headerShadow,
              borderBottomColor: headerBorderColor,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />

          {/* Scroll progress bar */}
          {scrolled && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-blue-500 via-indigo-500 to-orange-400"
              style={{ scaleX }}
            />
          )}

          <div className="relative max-w-7xl mx-auto px-6">

            {/* ── Desktop ── */}
            <div
              className="hidden lg:grid grid-cols-3 items-center"
              style={{ height: scrolled ? 64 : 72, transition: 'height 0.3s ease' }}
            >
              {/* Col 1 — invisible mirror for centering */}
              <div className="flex items-center gap-2 invisible pointer-events-none">
                <ThemeToggle />
                <LanguageToggle />
                <div className="w-10" />
                <div className="h-9 w-[108px]" />
              </div>

              {/* Col 2 — pill nav */}
              <nav className="flex justify-center">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border bg-transparent transition-all duration-300 ${navPillBorder}`}>
                  {regularNav.map((item, i) => {
                    const base = `relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap group overflow-hidden ${navTextColor} ${navTextHover}`
                    const inner = (
                      <>
                        <span className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${navHoverBg}`} />
                        <span className="absolute bottom-1.5 left-4 right-4 h-[2px] rounded-full bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
                        <span className="relative z-10">{item.name}</span>
                      </>
                    )
                    if (item.href.startsWith('#')) {
                      return (
                        <motion.button
                          key={item.name}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
                          onClick={() => handleClick(item.href)}
                          className={base}
                        >
                          {inner}
                        </motion.button>
                      )
                    }
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
                      >
                        <Link href={item.href} className={base}>{inner}</Link>
                      </motion.div>
                    )
                  })}
                </div>
              </nav>

              {/* Col 3 — right actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex items-center justify-end gap-2"
              >
                <ThemeToggle />
                <LanguageToggle />
                <div className="w-10" />
                <a
                  href="https://shop.erovoutika.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-9 px-4 rounded-full bg-blue-600 hover:bg-orange-500 text-white font-semibold text-sm gap-1.5 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Shop Now
                </a>
              </motion.div>
            </div>

            {/* ── Mobile bar ── */}
            <div
              className="lg:hidden flex items-center justify-between"
              style={{ height: scrolled ? 64 : 72, transition: 'height 0.3s ease' }}
            >
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <LanguageToggle />
              </div>
              <button
                className={`p-2 rounded-full border shadow-sm transition-all ${
                  scrolled
                    ? isDark
                      ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
                      : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-100'
                    : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                }`}
                onClick={() => setIsMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {/* ── Mobile dropdown ── */}
            {isMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`lg:hidden py-4 space-y-1 border-t ${
                  isDark
                    ? 'border-slate-700/60 bg-[#050A14]/97'
                    : 'border-gray-200 bg-white/98'
                }`}
                style={{ backdropFilter: 'blur(20px)' }}
              >
                {regularNav.map((item) => {
                  const base   = 'w-full text-left flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-colors'
                  const colors = isDark
                    ? 'text-slate-200 hover:bg-slate-800 hover:text-blue-400'
                    : 'text-gray-800 hover:bg-gray-100 hover:text-blue-600'
                  if (item.href.startsWith('#')) {
                    return (
                      <button key={item.name} onClick={() => { handleClick(item.href); setIsMenuOpen(false) }} className={`${base} ${colors}`}>
                        {item.name}
                      </button>
                    )
                  }
                  return (
                    <Link key={item.name} href={item.href} className={`${base} ${colors}`} onClick={() => setIsMenuOpen(false)}>
                      {item.name}
                    </Link>
                  )
                })}
                <div className="pt-3 px-1">
                  <a
                    href="https://shop.erovoutika.ph/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full h-10 px-4 rounded-full bg-blue-600 hover:bg-orange-500 text-white font-semibold text-sm transition-colors gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Shop Now
                  </a>
                </div>
              </motion.nav>
            )}

          </div>
        </motion.header>
      )}
    </AnimatePresence>
  )
}