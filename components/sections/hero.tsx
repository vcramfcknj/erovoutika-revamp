'use client'

import { ArrowRight, MapPin, Calendar, Trophy } from 'lucide-react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/languageContext'
import { Syne } from 'next/font/google'
import { useEffect, useRef } from 'react'

const syne = Syne({ subsets: ['latin'], weight: ['600', '700', '800'], display: 'swap' })

// ─── Animated Circuit Canvas (unchanged from original) ────────────────────────
function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let W = 0, H = 0

    type Node = {
      x: number; y: number
      vx: number; vy: number
      r: number; pulse: number; pulseSpeed: number
    }

    const NODES: Node[] = []
    const NODE_COUNT = 55
    const MAX_DIST = 160
    const PULSE_RADIUS = 5

    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight }

    const spawnNodes = () => {
      NODES.length = 0
      for (let i = 0; i < NODE_COUNT; i++) {
        NODES.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 1.5, pulse: Math.random(),
          pulseSpeed: Math.random() * 0.008 + 0.003,
        })
      }
    }

    const isDark = () => document.documentElement.classList.contains('dark')

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const dark = isDark()
      const nodeColor  = dark ? 'rgba(96,165,250,'  : 'rgba(37,99,235,'
      const lineColor  = dark ? 'rgba(96,165,250,'  : 'rgba(37,99,235,'
      const pulseColor = dark ? 'rgba(249,115,22,'  : 'rgba(234,88,12,'

      for (const n of NODES) {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
        n.pulse = (n.pulse + n.pulseSpeed) % 1

        const glowAlpha = Math.sin(n.pulse * Math.PI) * 0.35
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r + PULSE_RADIUS * Math.sin(n.pulse * Math.PI), 0, Math.PI * 2)
        ctx.fillStyle = `${pulseColor}${glowAlpha})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `${nodeColor}0.75)`
        ctx.fill()
      }

      for (let i = 0; i < NODES.length; i++) {
        for (let j = i + 1; j < NODES.length; j++) {
          const a = NODES[i], b = NODES[j]
          const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
          if (dist > MAX_DIST) continue
          const alpha = (1 - dist / MAX_DIST) * 0.22
          const midX = a.x, midY = b.y
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(midX, midY); ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `${lineColor}${alpha})`; ctx.lineWidth = 0.8; ctx.stroke()
          ctx.beginPath(); ctx.arc(midX, midY, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `${lineColor}${alpha * 1.5})`; ctx.fill()
        }
      }
      animId = requestAnimationFrame(draw)
    }

    resize(); spawnNodes(); draw()
    const ro = new ResizeObserver(resize); ro.observe(canvas)
    const mo = new MutationObserver(() => {})
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => { cancelAnimationFrame(animId); ro.disconnect(); mo.disconnect() }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.85 }} />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] dark:opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='24' viewBox='0 0 28 24'%3E%3Cpath fill='none' stroke='%232563eb' stroke-width='0.4' d='M14 0l7 4v8l-7 4-7-4V4z'/%3E%3Cpath fill='none' stroke='%232563eb' stroke-width='0.4' d='M0 12l7 4 7-4-7-4z'/%3E%3C/svg%3E")`,
          backgroundSize: '28px 24px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.05]"
        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(37,99,235,0.1) 2px, rgba(37,99,235,0.1) 4px)' }}
      />
    </>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export function Hero() {
  const { t } = useLanguage()

  /**
   * SCROLL ARCHITECTURE
   * -------------------
   * A 300vh tall div acts as the scroll track.
   * The inner <section> is sticky so it stays viewport-locked.
   * scrollYProgress 0→1 maps to the full 300vh.
   *
   * Stage 1  [0.00 – 0.18]  Logo only, circuit canvas live
   * Stage 2  [0.18 – 0.35]  Nav slides in (driven by header.tsx reading scrollY)
   * Stage 3  [0.35 – 0.70]  Hero content assembles from all directions
   * Stage 4  [0.70 – 1.00]  Parallax exit — content floats up + fades
   */
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Gentle spring for buttery feel
  const s = useSpring(scrollYProgress, { stiffness: 55, damping: 16 })

  // ── Intro logo (center screen, stage 1-2) ─────────────────────────────────
  const introOpacity = useTransform(s, [0, 0.06, 0.32, 0.44], [0, 1, 1, 0])
  const introScale   = useTransform(s, [0, 0.06, 0.32, 0.44], [0.5, 1.05, 1, 0.85])

  // ── Badge (drops from top) ────────────────────────────────────────────────
  const badgeOpacity = useTransform(s, [0.36, 0.50], [0, 1])
  const badgeY       = useTransform(s, [0.36, 0.50], [-28, 0])

  // ── Headline (slides from left) ───────────────────────────────────────────
  const headlineOpacity = useTransform(s, [0.40, 0.56], [0, 1])
  const headlineX       = useTransform(s, [0.40, 0.56], [-50, 0])

  // ── Credibility line (fades up) ───────────────────────────────────────────
  const credOpacity = useTransform(s, [0.48, 0.60], [0, 1])
  const credY       = useTransform(s, [0.48, 0.60], [16, 0])

  // ── Card 1 (rises from below-left) ───────────────────────────────────────
  const card1Opacity = useTransform(s, [0.52, 0.64], [0, 1])
  const card1Y       = useTransform(s, [0.52, 0.64], [44, 0])
  const card1X       = useTransform(s, [0.52, 0.64], [-18, 0])

  // ── Card 2 (rises from below-right) ──────────────────────────────────────
  const card2Opacity = useTransform(s, [0.56, 0.68], [0, 1])
  const card2Y       = useTransform(s, [0.56, 0.68], [44, 0])
  const card2X       = useTransform(s, [0.56, 0.68], [18, 0])

  // ── Right logo watermark (slides from right) ──────────────────────────────
  const rightOpacity = useTransform(s, [0.42, 0.62], [0, 1])
  const rightX       = useTransform(s, [0.42, 0.62], [70, 0])

  // ── Parallax exit (stage 4) ───────────────────────────────────────────────
  const exitY       = useTransform(s, [0.70, 1], ['0%', '18%'])
  const exitOpacity = useTransform(s, [0.70, 0.88, 1], [1, 1, 0])

  // ── Scroll indicator (visible only during stage 1-2) ─────────────────────
  const indicatorOpacity = useTransform(s, [0, 0.06, 0.30, 0.42], [0, 1, 1, 0])

  // ── Ambient orb parallax ──────────────────────────────────────────────────
  const orbY = useTransform(s, [0, 1], ['0%', '12%'])

  const scrollToStage2 = () => {
    if (!containerRef.current) return
    const trackH = containerRef.current.offsetHeight
    window.scrollTo({ top: trackH * 0.22, behavior: 'smooth' })
  }

  return (
    // ── 300vh scroll track ──────────────────────────────────────────────────
    <div ref={containerRef} style={{ height: '300vh' }}>

      {/* ── Sticky viewport ────────────────────────────────────────────────── */}
      <section className="sticky top-0 h-screen flex items-center overflow-hidden bg-white dark:bg-[#050A14] transition-colors duration-500">

        {/* Circuit canvas — always visible */}
        <div className="absolute inset-0">
          <CircuitBackground />
        </div>

        {/* Ambient orbs */}
        <motion.div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ y: orbY }}>
          <div className="absolute -top-40 -left-32 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-[0.08] dark:opacity-[0.14]"
            style={{ background: 'radial-gradient(circle, #3b82f6 0%, rgba(59,130,246,0.3) 40%, transparent 70%)' }} />
          <div className="absolute -bottom-24 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-[0.07] dark:opacity-[0.12]"
            style={{ background: 'radial-gradient(circle, #f97316 0%, rgba(249,115,22,0.25) 45%, transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-[0.04] dark:opacity-[0.08]"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.35) 0%, transparent 65%)' }} />
        </motion.div>

        {/* ── STAGE 1: Intro logo — centered solo ──────────────────────────── */}
        <motion.div
          style={{ opacity: introOpacity, scale: introScale }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        >
          <div className="relative w-52 h-52 md:w-64 md:h-64 lg:w-72 lg:h-72">
            {/* Breathing rings */}
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.22, 0.05, 0.22] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-[-20%] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(249,115,22,0.12) 50%, transparent 70%)' }}
            />
            <motion.div
              animate={{ scale: [1, 1.45, 1], opacity: [0.14, 0.03, 0.14] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.55 }}
              className="absolute inset-[-30%] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 65%)' }}
            />
            {/* Logo — light / dark */}
            <img
              src="/ero1.png" alt="Erovoutika" aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain dark:hidden"
              style={{ filter: 'brightness(0.55) saturate(1.4)' }}
            />
            <img
              src="/ero1.png" alt="Erovoutika" aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain hidden dark:block"
              style={{ filter: 'brightness(1.35) saturate(0.85)' }}
            />
          </div>
        </motion.div>

        {/* ── STAGE 3: Full hero content assembles ─────────────────────────── */}
        <motion.div
          style={{ y: exitY, opacity: exitOpacity }}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-24"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-6 lg:gap-7">

              {/* Badge — drops from top */}
              <motion.div
                style={{ opacity: badgeOpacity, y: badgeY }}
                className="inline-flex self-start"
              >
                <span className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-400/40 dark:border-blue-500/35 bg-blue-500/10 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 text-xs font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(37,99,235,0.12)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500 dark:bg-orange-400 ring-2 ring-orange-400/30" />
                  </span>
                  {t.hero.badge}
                </span>
              </motion.div>

              {/* Headline — slides from left */}
              <motion.h1
                style={{
                  opacity: headlineOpacity,
                  x: headlineX,
                  fontSize: 'clamp(1.9rem, 3.8vw, 3.5rem)',
                  fontFamily: "'Barlow Condensed', sans-serif",
                }}
                className="font-black leading-[1.05] tracking-tight text-gray-900 dark:text-white"
              >
                {t.hero.title}{' '}
                <span style={{
                  background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 45%, #f97316 85%, #fb923c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {t.hero.titleHighlight}
                </span>
              </motion.h1>

              {/* Credibility — fades up */}
              <motion.p
                style={{ opacity: credOpacity, y: credY }}
                className="text-xs text-gray-400/90 dark:text-slate-500 font-mono tracking-wide uppercase border-l-2 border-blue-500/60 dark:border-blue-400/50 pl-4"
              >
                Trusted by engineers & institutions across 3 continents
              </motion.p>

              {/* Cards */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2">

                {/* ROBOcrabs — rises from below-left */}
                <motion.div
                  style={{ opacity: card1Opacity, y: card1Y, x: card1X }}
                  className="group relative rounded-xl overflow-hidden border border-blue-400/25 dark:border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover:shadow-[0_4px_32px_rgba(37,99,235,0.22)] dark:hover:shadow-[0_0_28px_rgba(59,130,246,0.15)]"
                  // inline bg so Framer doesn't see a conflict
                >
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(145deg, #0c1a3a 0%, #0f2d6b 55%, #1a3fa0 100%)' }} />
                  <div className="absolute inset-0 opacity-[0.22] group-hover:opacity-[0.35] transition-opacity duration-500"
                    style={{ backgroundImage: "url('/robocrabs.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', maskImage: 'radial-gradient(ellipse 100% 100% at 60% 40%, black 10%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 60% 40%, black 10%, transparent 80%)' }} />
                  <div className="absolute bottom-0 right-0 w-36 h-36 rounded-full blur-2xl opacity-30"
                    style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                  <div className="relative z-10 p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={`text-base font-black text-white leading-tight ${syne.className}`}>ROBOcrabs</h3>
                        <p className="text-[10px] font-mono text-blue-200/70 tracking-widest uppercase mt-0.5">by ROBOlution</p>
                      </div>
                      <span className="shrink-0 text-[7px] font-mono uppercase tracking-widest text-orange-300 bg-orange-500/20 border border-orange-400/30 px-2 py-1 rounded-full">International</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] text-blue-100/80"><MapPin className="w-3 h-3 text-orange-400 shrink-0" /><span>Dubai, United Arab Emirates</span></div>
                      <div className="flex items-center gap-1.5 text-[11px] text-blue-100/80"><Calendar className="w-3 h-3 text-orange-400 shrink-0" /><span>2026 International Finals</span></div>
                      <div className="flex items-center gap-1.5 text-[11px] text-blue-100/80"><Trophy className="w-3 h-3 text-orange-400 shrink-0" /><span>Top PH teams compete globally</span></div>
                    </div>
                    <p className="text-[11px] text-blue-100/75 leading-relaxed">The international leg of ROBOlution — Philippine champions advance to compete against the world's best robotics teams in Dubai.</p>
                    <a href="https://www.robocrabs.com/dubai-2026" target="_blank" rel="noopener noreferrer"
                      className={`mt-0.5 inline-flex items-center gap-1.5 text-xs font-bold text-orange-300 hover:text-orange-200 transition-colors group/link ${syne.className}`}>
                      Learn More <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform duration-200" />
                    </a>
                  </div>
                </motion.div>

                {/* EIRA — rises from below-right */}
                <motion.div
                  style={{ opacity: card2Opacity, y: card2Y, x: card2X }}
                  className="group relative rounded-xl overflow-hidden border border-orange-400/25 dark:border-orange-500/20 hover:border-orange-400/50 transition-all duration-300 hover:shadow-[0_4px_28px_rgba(234,88,12,0.2)] dark:hover:shadow-[0_0_24px_rgba(249,115,22,0.15)]"
                >
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 55%, #ea580c 100%)' }} />
                  <div className="absolute inset-0 opacity-[0.15] group-hover:opacity-[0.24] transition-opacity duration-500"
                    style={{ backgroundImage: "url('/eira.png')", backgroundSize: '70%', backgroundPosition: 'center right', backgroundRepeat: 'no-repeat', maskImage: 'radial-gradient(ellipse 80% 80% at 70% 50%, black 20%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 70% 50%, black 20%, transparent 75%)' }} />
                  <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-35"
                    style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
                  <div className="relative z-10 p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className={`text-lg font-black text-white ${syne.className}`}>EIRA</h3>
                      <span className="text-[7px] font-mono uppercase tracking-widest text-orange-100 bg-white/10 border border-orange-400/30 px-2 py-1 rounded-md">Certification</span>
                    </div>
                    <p className="text-sm text-orange-50/90 leading-relaxed">Online proctored exams and skill-based certifications for students, engineers, and institutions in robotics and automation.</p>
                    <a href="https://eira-erovoutika.vercel.app/" target="_blank" rel="noopener noreferrer"
                      className={`mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-orange-100 hover:text-white transition-colors group/link ${syne.className}`}>
                      Get Certified <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform duration-200" />
                    </a>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* RIGHT — Logo watermark, slides in from right */}
            <motion.div
              style={{ opacity: rightOpacity, x: rightX }}
              className="relative hidden lg:flex items-center justify-center select-none pointer-events-none"
            >
              <motion.div animate={{ scale: [1, 1.18, 1], opacity: [0.2, 0.06, 0.2] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute rounded-full"
                style={{ width: 480, height: 480, background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(37,99,235,0.1) 50%, transparent 75%)' }} />
              <motion.div animate={{ scale: [1, 1.32, 1], opacity: [0.12, 0.03, 0.12] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="absolute rounded-full"
                style={{ width: 480, height: 480, background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 65%)' }} />
              <div className="absolute w-[460px] h-[460px] rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.14) 0%, rgba(249,115,22,0.06) 55%, transparent 80%)' }} />
              <motion.div
                animate={{ opacity: [0.68, 0.88, 0.68], scale: [1, 1.04, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-[420px] h-[420px]"
              >
                <img src="/ero1.png" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-contain dark:hidden" style={{ filter: 'brightness(0.5) saturate(1.4)' }} />
                <img src="/ero1.png" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-contain hidden dark:block" style={{ filter: 'brightness(1.35) saturate(0.85)' }} />
              </motion.div>
            </motion.div>

          </div>
        </motion.div>

        {/* ── Scroll nudge indicator (stage 1 only) ────────────────────────── */}
        <motion.div
          style={{ opacity: indicatorOpacity }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-30"
          onClick={() => {
            if (!containerRef.current) return
            window.scrollTo({ top: containerRef.current.offsetHeight * 0.22, behavior: 'smooth' })
          }}
        >
          <div className="w-6 h-10 border-2 border-blue-400/40 dark:border-blue-500/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-orange-500 dark:bg-orange-400 rounded-full" />
          </div>
        </motion.div>

      </section>
    </div>
  )
}