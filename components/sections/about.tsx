'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/lib/i18n/languageContext'
import { Barlow_Condensed } from 'next/font/google'
import { Target, ArrowRight, GraduationCap, BookOpen, Cpu, Wrench, Building2, FlaskConical, Rocket, Eye, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700'], display: 'swap' })

// ─── Photos ───────────────────────────────────────────────────────────────────
const PHOTOS = [
  { src: '/images/about-1.jpg', alt: 'Robotics workshop' },
  { src: '/images/about-2.jpg', alt: 'Engineering team' },
  { src: '/images/about-3.jpg', alt: 'Automation project' },
]

// ─── Spotlight row component ──────────────────────────────────────────────────
function SpotlightRow({ row, index }: { row: { num: string; icon: React.ElementType; label: string; desc: string; color: string; border: string; bg: string }; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { margin: '-30% 0px -30% 0px' })
  const Icon = row.icon
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className={`
        group relative flex items-center gap-0
        border-b border-gray-200 dark:border-slate-800
        transition-all duration-500 ease-out
        ${isInView ? 'bg-white dark:bg-slate-900/60' : 'bg-transparent'}
      `}
    >
      {/* Active left border indicator */}
      <div
        className={`
          absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full transition-all duration-500
          ${isInView ? `${row.bg} opacity-100` : 'opacity-0 bg-transparent'}
        `}
      />

      <div className={`w-full flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 py-7 px-8 md:px-10 ${isEven ? '' : 'md:flex-row-reverse'}`}>

        {/* ── Large display label ── */}
        <div className={`flex-1 flex items-center gap-5 ${isEven ? '' : 'md:justify-end md:text-right'}`}>
          <span
            className={`
              hidden md:block font-mono text-sm font-bold tracking-[0.2em] transition-colors duration-500
              ${isInView ? row.color : 'text-gray-300 dark:text-slate-700'}
            `}
          >
            {row.num}
          </span>

          <h3
            className={`
              font-black tracking-tight leading-none transition-colors duration-500 select-none
              text-4xl md:text-6xl lg:text-7xl
              ${barlowCondensed.className}
              ${isInView ? 'text-gray-900 dark:text-white' : 'text-gray-200 dark:text-slate-800'}
            `}
          >
            {row.label}
          </h3>
        </div>

        {/* ── Vertical rule (desktop) ── */}
        <div
          className={`
            hidden md:block mx-10 lg:mx-16 self-stretch w-px transition-all duration-500
            ${isInView ? 'bg-gray-200 dark:bg-slate-700' : 'bg-transparent'}
          `}
        />

        {/* ── Description side ── */}
        <div className={`flex-1 flex items-center gap-4 ${isEven ? '' : 'md:justify-end'}`}>
          <div
            className={`
              shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500
              ${isInView ? `${row.bg} shadow-md` : 'bg-gray-100 dark:bg-slate-800'}
            `}
          >
            <Icon
              className={`w-4 h-4 transition-colors duration-500 ${isInView ? 'text-white' : 'text-gray-400 dark:text-slate-600'}`}
            />
          </div>

          <p
            className={`
              text-sm leading-relaxed max-w-xs transition-colors duration-500
              ${isInView ? 'text-gray-600 dark:text-slate-400' : 'text-gray-300 dark:text-slate-700'}
            `}
          >
            {row.desc}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function About() {
  const { t } = useLanguage()

  const SERVE_ROWS = [
    {
      num: '01',
      icon: GraduationCap,
      label: t.about.studentsLabel,
      desc: t.about.studentsDesc,
      color: 'text-blue-500',
      border: 'border-blue-500',
      bg: 'bg-blue-500',
    },
    {
      num: '02',
      icon: BookOpen,
      label: t.about.educatorsLabel,
      desc: t.about.educatorsDesc,
      color: 'text-orange-500',
      border: 'border-orange-500',
      bg: 'bg-orange-500',
    },
    {
      num: '03',
      icon: Cpu,
      label: t.about.hobbyistsLabel,
      desc: t.about.hobbyistsDesc,
      color: 'text-violet-500',
      border: 'border-violet-500',
      bg: 'bg-violet-500',
    },
    {
      num: '04',
      icon: Wrench,
      label: t.about.engineersLabel,
      desc: t.about.engineersDesc,
      color: 'text-emerald-500',
      border: 'border-emerald-500',
      bg: 'bg-emerald-500',
    },
    {
      num: '05',
      icon: Building2,
      label: t.about.businessesLabel,
      desc: t.about.businessesDesc,
      color: 'text-sky-500',
      border: 'border-sky-500',
      bg: 'bg-sky-500',
    },
    {
      num: '06',
      icon: FlaskConical,
      label: t.about.researchersLabel,
      desc: t.about.researchersDesc,
      color: 'text-rose-500',
      border: 'border-rose-500',
      bg: 'bg-rose-500',
    },
  ]

  const TIMELINE = [
    {
      num: '01',
      icon: Rocket,
      title: t.about.missionTitle,
      body: t.about.missionBody,
      color: 'bg-blue-600',
      ring: 'ring-blue-200 dark:ring-blue-900',
      accent: 'text-blue-600 dark:text-blue-400',
      bar: 'bg-blue-600',
      iconBg: 'bg-blue-50 dark:bg-blue-950/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      num: '02',
      icon: Eye,
      title: t.about.visionTitle,
      body: t.about.visionBody,
      color: 'bg-orange-500',
      ring: 'ring-orange-200 dark:ring-orange-900',
      accent: 'text-orange-500 dark:text-orange-400',
      bar: 'bg-orange-500',
      iconBg: 'bg-orange-50 dark:bg-orange-950/40',
      iconColor: 'text-orange-500 dark:text-orange-400',
    },
    {
      num: '03',
      icon: Heart,
      title: t.about.coreValuesTitle,
      body: t.about.coreValuesBody,
      color: 'bg-emerald-600',
      ring: 'ring-emerald-200 dark:ring-emerald-900',
      accent: 'text-emerald-600 dark:text-emerald-400',
      bar: 'bg-emerald-600',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
  ]

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          ABOUT SECTION
      ═══════════════════════════════════════════════════ */}
      <section id="about" className="py-24 bg-white dark:bg-[#050A14] overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl space-y-24">

          {/* ── BLOCK 1: Dominant photo grid left · Text right ── */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT — dominant editorial photo grid (desktop) */}
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block"
            >
              <div className="grid grid-cols-5 gap-3 h-[460px]">
                {/* Left — tall dominant photo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.05 }}
                  className="col-span-3 relative overflow-hidden rounded-2xl group"
                >
                  <Image
                    src={PHOTOS[0].src}
                    alt={PHOTOS[0].alt}
                    fill
                    sizes="(max-width:1280px) 40vw, 380px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-xs font-mono tracking-widest uppercase opacity-80">{PHOTOS[0].alt}</p>
                  </div>
                </motion.div>

                {/* Right — two stacked photos */}
                <div className="col-span-2 flex flex-col gap-3">
                  {[PHOTOS[1], PHOTOS[2]].map((photo, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.97 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.12 + i * 0.1 }}
                      className="relative flex-1 overflow-hidden rounded-2xl group"
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width:1280px) 25vw, 220px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/50 to-transparent">
                        <p className="text-white text-[9px] font-mono tracking-widest uppercase opacity-75">{photo.alt}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Accent line below grid */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 h-[2px] bg-gradient-to-r from-blue-500 via-orange-400 to-transparent origin-left rounded-full"
              />
            </motion.div>

            {/* Mobile — 2-up grid */}
            <div className="lg:hidden grid grid-cols-2 gap-3 h-56">
              <div className="relative row-span-2 rounded-2xl overflow-hidden">
                <Image src={PHOTOS[0].src} alt={PHOTOS[0].alt} fill sizes="50vw" className="object-cover" />
              </div>
              <div className="relative rounded-2xl overflow-hidden">
                <Image src={PHOTOS[1].src} alt={PHOTOS[1].alt} fill sizes="50vw" className="object-cover" />
              </div>
              <div className="relative rounded-2xl overflow-hidden">
                <Image src={PHOTOS[2].src} alt={PHOTOS[2].alt} fill sizes="50vw" className="object-cover" />
              </div>
            </div>

            {/* RIGHT — heading + description */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium">
                <Target className="w-4 h-4" />
                {t.about.badge}
              </div>

              <h2 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight ${barlowCondensed.className}`}>
                {t.about.fullTitle}
              </h2>

              <p className="text-base text-gray-600 dark:text-slate-400 leading-relaxed">
                {t.about.description}
              </p>

              <Link
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 group"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t.about.getInTouch}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          </div>

          {/* ── Divider ── */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700/60" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500">
              {t.about.foundationLabel}
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700/60" />
          </div>

          {/* ── BLOCK 2: Excellence intro ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto space-y-4"
          >
            <h3 className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white ${barlowCondensed.className}`}>
              {t.about.excellenceTitle}
            </h3>
            <p className="text-base text-gray-600 dark:text-slate-400 leading-relaxed">
              {t.about.excellenceDesc}
            </p>
            <div className="flex flex-wrap gap-3 pt-2 justify-center">
              {t.about.tags.split(',').map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* ── BLOCK 3: Horizontal Timeline Rail ── */}
          <div className="relative">
            <div className="hidden md:block absolute top-[26px] left-[calc(16.67%+26px)] right-[calc(16.67%+26px)] h-[2px] bg-gray-200 dark:bg-slate-700/80" />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:block absolute top-[26px] left-[calc(16.67%+26px)] right-[calc(16.67%+26px)] h-[2px] bg-gradient-to-r from-blue-500 via-orange-400 to-emerald-500 origin-left"
            />

            {/* items-stretch makes all column wrappers the same height */}
            <div className="grid md:grid-cols-3 gap-10 md:gap-6 md:items-stretch">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.25 + i * 0.18 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Circle node */}
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={`relative z-10 w-[52px] h-[52px] rounded-full ${item.color} ring-4 ${item.ring} flex items-center justify-center shadow-lg mb-7 flex-shrink-0`}
                  >
                    <span className="text-white text-xs font-bold font-mono tracking-wider">{item.num}</span>
                  </motion.div>

                  <div className={`md:hidden w-px h-5 ${item.bar} opacity-25 -mt-2 mb-5`} />

                  {/* Card — flex-1 so all cards stretch to the tallest */}
                  <div className="w-full flex-1 text-left bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50 group-hover:border-gray-300 dark:group-hover:border-slate-500 group-hover:shadow-lg transition-all duration-300 flex flex-col">

                    {/* Accent bar + icon side by side */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-1 rounded-full ${item.bar}`} />
                      <div className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                      </div>
                    </div>

                    <h4 className={`${barlowCondensed.className} text-xl font-bold mb-2 ${item.accent}`}>
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed flex-1">
                      {item.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHO WE SERVE — Scrolling Spotlight Rows
      ═══════════════════════════════════════════════════ */}
      <section id="who-we-serve" className="py-24 bg-gray-50 dark:bg-[#070D1A] overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
              <GraduationCap className="w-4 h-4" />
              {t.about.whoWeServeBadge}
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 dark:text-white ${barlowCondensed.className}`}>
                {t.about.whoWeServeTitle}
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-500 max-w-xs leading-relaxed">
                {t.about.whoWeServeSubtitle}
              </p>
            </div>
          </motion.div>

          {/* Top border */}
          <div className="mt-8 border-t border-gray-200 dark:border-slate-800" />

          {/* Spotlight rows */}
          <div className="divide-y-0">
            {SERVE_ROWS.map((row, i) => (
              <SpotlightRow key={row.label} row={row} index={i} />
            ))}
          </div>

          {/* Bottom border + CTA */}
          <div className="border-t border-gray-200 dark:border-slate-800 mt-0" />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <p className="text-sm text-gray-500 dark:text-slate-500">
              {t.about.notSure}{' '}
              <span className="text-gray-700 dark:text-slate-300 font-medium">{t.about.notSureHighlight}</span>
            </p>
            <Link
              href="#contact"
              className="shrink-0 inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold shadow-md hover:shadow-xl transition-all duration-300 group"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t.about.whoWeServeCta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>

        </div>
      </section>
    </>
  )
}