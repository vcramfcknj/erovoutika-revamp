'use client'

import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/languageContext'

export function Hero() {
  const { t } = useLanguage()

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-[#050A14] transition-colors duration-500">

      {/* ── Circuit-board SVG background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full text-gray-900 dark:text-white"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {/* Base grid */}
            <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.045" />
            </pattern>

            {/* Circuit traces pattern — larger tile with nodes and traces */}
            <pattern id="hero-circuit" width="240" height="240" patternUnits="userSpaceOnUse">
              {/* Horizontal traces */}
              <line x1="0"   y1="60"  x2="80"  y2="60"  stroke="currentColor" strokeWidth="1"   strokeOpacity="0.07" />
              <line x1="100" y1="60"  x2="180" y2="60"  stroke="currentColor" strokeWidth="1"   strokeOpacity="0.07" />
              <line x1="0"   y1="180" x2="60"  y2="180" stroke="currentColor" strokeWidth="1"   strokeOpacity="0.05" />
              <line x1="100" y1="180" x2="240" y2="180" stroke="currentColor" strokeWidth="1"   strokeOpacity="0.05" />
              <line x1="140" y1="120" x2="240" y2="120" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.06" />

              {/* Vertical traces */}
              <line x1="60"  y1="0"   x2="60"  y2="40"  stroke="currentColor" strokeWidth="1"   strokeOpacity="0.07" />
              <line x1="60"  y1="80"  x2="60"  y2="160" stroke="currentColor" strokeWidth="1"   strokeOpacity="0.07" />
              <line x1="60"  y1="200" x2="60"  y2="240" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.05" />
              <line x1="180" y1="0"   x2="180" y2="60"  stroke="currentColor" strokeWidth="1"   strokeOpacity="0.06" />
              <line x1="180" y1="100" x2="180" y2="240" stroke="currentColor" strokeWidth="1"   strokeOpacity="0.06" />
              <line x1="120" y1="0"   x2="120" y2="40"  stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.05" />
              <line x1="120" y1="80"  x2="120" y2="120" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.05" />

              {/* Diagonal short traces */}
              <line x1="60"  y1="60"  x2="100" y2="60"  stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.06" />
              <line x1="180" y1="60"  x2="240" y2="60"  stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.05" />

              {/* Corner brackets / L-joints */}
              <path d="M 80 40 L 80 60 L 100 60"  fill="none" stroke="currentColor" strokeWidth="1"   strokeOpacity="0.08" strokeLinecap="round" />
              <path d="M 160 180 L 180 180 L 180 200" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.07" strokeLinecap="round" />
              <path d="M 120 80 L 120 120 L 140 120"  fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.06" strokeLinecap="round" />

              {/* Solder-pad nodes (circles) */}
              <circle cx="60"  cy="60"  r="3" fill="none" stroke="currentColor" strokeWidth="1"   strokeOpacity="0.10" />
              <circle cx="180" cy="60"  r="3" fill="none" stroke="currentColor" strokeWidth="1"   strokeOpacity="0.09" />
              <circle cx="60"  cy="180" r="3" fill="none" stroke="currentColor" strokeWidth="1"   strokeOpacity="0.08" />
              <circle cx="180" cy="180" r="3" fill="none" stroke="currentColor" strokeWidth="1"   strokeOpacity="0.08" />
              <circle cx="120" cy="120" r="2.5" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.07" />
              <circle cx="60"  cy="60"  r="1.2" fill="currentColor" fillOpacity="0.07" />
              <circle cx="180" cy="60"  r="1.2" fill="currentColor" fillOpacity="0.06" />
              <circle cx="60"  cy="180" r="1.2" fill="currentColor" fillOpacity="0.05" />
              <circle cx="180" cy="180" r="1.2" fill="currentColor" fillOpacity="0.05" />
              <circle cx="120" cy="120" r="1"   fill="currentColor" fillOpacity="0.06" />

              {/* Small IC-chip rectangle */}
              <rect x="152" y="92"  width="28" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.07" />
              {/* Chip pins */}
              <line x1="156" y1="92"  x2="156" y2="88"  stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.07" />
              <line x1="162" y1="92"  x2="162" y2="88"  stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.07" />
              <line x1="168" y1="92"  x2="168" y2="88"  stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.07" />
              <line x1="156" y1="110" x2="156" y2="114" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.07" />
              <line x1="162" y1="110" x2="162" y2="114" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.07" />
              <line x1="168" y1="110" x2="168" y2="114" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.07" />

              {/* Resistor symbol */}
              <rect x="26" y="56" width="20" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.07" />

              {/* Via holes (tiny double rings) */}
              <circle cx="100" cy="180" r="4"   fill="none" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.06" />
              <circle cx="100" cy="180" r="2"   fill="none" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.06" />
              <circle cx="240" cy="120" r="3.5" fill="none" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.05" />
              <circle cx="240" cy="120" r="1.8" fill="none" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.05" />
            </pattern>

            {/* Radial fade mask — content area stays clear */}
            <radialGradient id="hero-fade" cx="50%" cy="50%" r="70%">
              <stop offset="0%"   stopColor="white" stopOpacity="0" />
              <stop offset="55%"  stopColor="white" stopOpacity="0.5" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </radialGradient>
            <mask id="hero-mask">
              <rect width="100%" height="100%" fill="url(#hero-fade)" />
            </mask>
          </defs>

          {/* Base grid layer */}
          <rect width="100%" height="100%" fill="url(#hero-grid)" />

          {/* Circuit layer — masked to edges so it doesn't compete with text */}
          <rect width="100%" height="100%" fill="url(#hero-circuit)" mask="url(#hero-mask)" />
        </svg>
      </div>

      {/* ── Ambient orb glows ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-32 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-[0.06] dark:opacity-[0.14]"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-24 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-[0.05] dark:opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
        />
      </div>

      {/* ── 2-column layout ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-25">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT — Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="flex flex-col gap-7"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex self-start"
            >
              <span className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-300/50 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 text-xs font-mono tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                {t.hero.badge}
              </span>
            </motion.div>

            {/* Headline */}
            <h1
              className="font-black leading-[1.05] tracking-tight text-gray-900 dark:text-white"
              style={{ fontSize: 'clamp(1.9rem, 3.8vw, 3.5rem)', fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
            >
              {t.hero.title}{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #2563eb 0%, #6366f1 55%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {t.hero.titleHighlight}
              </span>
            </h1>

            {/* Credibility line */}
            <p className="text-xs text-gray-400/90 dark:text-slate-500 font-mono tracking-wide uppercase border-l border-blue-500/70 pl-4">
              Trusted by engineers & institutions across 3 continents
            </p>

            {/* ── Platform cards ── */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">

              {/* ROBOlution — blue palette, robolution.png fading bg */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.55 }}
                className="group relative rounded-xl overflow-hidden border border-blue-300/40 dark:border-blue-500/20 hover:border-blue-500/70 dark:hover:border-blue-400/50 transition-all duration-300 hover:shadow-[0_4px_24px_rgba(37,99,235,0.18)]"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)' }}
              >
                {/* Fading logo background */}
                <div
                  className="absolute inset-0 opacity-[0.18] group-hover:opacity-[0.26] transition-opacity duration-500"
                  style={{
                    backgroundImage: "url('/robolution.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    maskImage: 'radial-gradient(ellipse 90% 90% at 60% 50%, black 20%, transparent 75%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 60% 50%, black 20%, transparent 75%)',
                  }}
                />
                {/* Orange accent glow */}
                <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-30"
                  style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />

                <div className="relative z-10 p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                      ROBOlution
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-orange-300 bg-orange-500/20 border border-orange-400/30 px-2 py-1 rounded-full">
                      5th Edition
                    </span>
                  </div>
                  <p className="text-sm text-blue-100/80 leading-relaxed">
                    The Philippines' premier robotics competition — regional legs nationwide, with top teams competing internationally in Europe.
                  </p>
                  <a
                    href="https://robolution.erovoutika.ph/home"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center text-sm font-bold text-orange-300 hover:text-orange-200 transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Join ROBOlution
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                </div>
              </motion.div>

              {/* EIRA — orange palette, eira.png fading bg */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.55 }}
                className="group relative rounded-xl overflow-hidden border border-orange-300/40 dark:border-orange-500/20 hover:border-orange-500/70 dark:hover:border-orange-400/50 transition-all duration-300 hover:shadow-[0_4px_24px_rgba(234,88,12,0.18)]"
                style={{ background: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 55%, #ea580c 100%)' }}
              >
                {/* Fading logo background */}
                <div
                  className="absolute inset-0 opacity-[0.15] group-hover:opacity-[0.24] transition-opacity duration-500"
                  style={{
                    backgroundImage: "url('/eira.png')",
                    backgroundSize: '70%',
                    backgroundPosition: 'center right',
                    backgroundRepeat: 'no-repeat',
                    maskImage: 'radial-gradient(ellipse 80% 80% at 70% 50%, black 20%, transparent 75%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 70% 50%, black 20%, transparent 75%)',
                  }}
                />
                {/* Blue accent glow */}
                <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-30"
                  style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />

                <div className="relative z-10 p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                      EIRA
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-orange-100 bg-white/10 border border-white/20 px-2 py-1 rounded-full">
                      Certification
                    </span>
                  </div>
                  <p className="text-sm text-orange-100/80 leading-relaxed">
                    Online proctored exams and skill-based certifications for students, engineers, and institutions in robotics and automation.
                  </p>
                  <a
                    href="https://eira-erovoutika.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center text-sm font-bold text-white hover:text-orange-100 transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Get Certified
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* RIGHT — logo watermark, unchanged */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
            className="relative hidden lg:flex items-center justify-center select-none pointer-events-none"
          >
            <div
              className="absolute w-[460px] h-[460px] rounded-full blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(59,130,246,0.16) 0%, rgba(99,102,241,0.08) 55%, transparent 80%)',
              }}
            />
            <motion.div
              animate={{ opacity: [0.68, 0.85, 0.68] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-[420px] h-[420px]"
            >
              <img
                src="/ero1.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-contain dark:hidden"
                style={{ filter: 'brightness(0.5) saturate(1.4)' }}
              />
              <img
                src="/ero1.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-contain hidden dark:block"
                style={{ filter: 'brightness(1.35) saturate(0.85)' }}
              />
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
        onClick={() => scrollToSection('#about')}
      >
        <div className="w-6 h-10 border-2 border-gray-400/30 dark:border-white/20 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}