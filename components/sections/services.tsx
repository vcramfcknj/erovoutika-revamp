'use client'

import { Barlow_Condensed } from 'next/font/google'
const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700'], display: 'swap' })

import {
  Cpu, Bot, Wrench, ArrowRight, Trophy, BookOpen, ExternalLink,
  HardHat, GitMerge, BarChart3, Handshake, GraduationCap, Globe,
  FlaskConical, Sparkles, CalendarDays, Headset,
} from 'lucide-react'
import { motion, type Variants } from 'framer-motion'
import Image from 'next/image'
import { useLanguage } from '@/lib/i18n/languageContext'

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
}

const SERVICE_IMAGES = {
  training:   '/images/service-training.jpg',
  robotics:   '/images/kits.jpg',
  automation: '/images/service-automation.jpg',
  ai:         '/images/service-ai.jpg',
  support:    '/images/service-support.jpg',
  events:     '/images/service-events.jpg',
}

const ROBOLUTION_HERO = '/images/robolution-hero.jpg'

export function Services() {
  const { t } = useLanguage()

  const services = [
    {
      key: 'training' as const,
      title: t.services.trainingCert,
      description: t.services.trainingCertDesc,
      icon: GraduationCap,
      outcome: t.services.trainingCertOutcome,
    },
    {
      key: 'robotics' as const,
      title: t.services.roboticsKits,
      description: t.services.roboticsKitsDesc,
      icon: Bot,
      outcome: t.services.roboticsKitsOutcome,
    },
    {
      key: 'automation' as const,
      title: t.services.automationSolutions,
      description: t.services.automationSolutionsDesc,
      icon: Cpu,
      outcome: t.services.automationSolutionsOutcome,
    },
    {
      key: 'ai' as const,
      title: t.services.aiSoftware,
      description: t.services.aiSoftwareDesc,
      icon: Sparkles,
      outcome: t.services.aiSoftwareOutcome,
    },
    {
      key: 'support' as const,
      title: t.services.techSupport,
      description: t.services.techSupportDesc,
      icon: Headset,
      outcome: t.services.techSupportOutcome,
    },
    {
      key: 'events' as const,
      title: t.services.eventMgmt,
      description: t.services.eventMgmtDesc,
      icon: CalendarDays,
      outcome: t.services.eventMgmtOutcome,
    },
  ]

  const DIFFERENTIATORS = [
    {
      Icon: HardHat,
      title: t.battleTestedTitle,
      desc: t.battleTestedDesc,
      side: 'left',
    },
    {
      Icon: GitMerge,
      title: t.endToEndTitle,
      desc: t.endToEndDesc,
      side: 'left',
    },
    {
      Icon: BarChart3,
      title: t.trackRecordTitle,
      desc: t.trackRecordDesc,
      side: 'left',
    },
    {
      Icon: Handshake,
      title: t.partnershipsTitle,
      desc: t.partnershipsDesc,
      side: 'right',
    },
    {
      Icon: GraduationCap,
      title: t.stemFocusTitle,
      desc: t.stemFocusDesc,
      side: 'right',
    },
    {
      Icon: Globe,
      title: t.globalTitle,
      desc: t.globalDesc,
      side: 'right',
    },
  ]

  const scrollToContact = () => {
    const el = document.querySelector('#contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const leftItems  = DIFFERENTIATORS.filter(d => d.side === 'left')
  const rightItems = DIFFERENTIATORS.filter(d => d.side === 'right')

  return (
    <section className="bg-gray-50 dark:bg-slate-900 overflow-hidden">

      {/* ══════════════════════════════════════════════════════════
          BLOCK 1 — What Sets Us Apart
      ══════════════════════════════════════════════════════════ */}
      <div className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-3"
          >
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-orange-500">Erovoutika</p>
            <h2 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-slate-100 ${barlowCondensed.className}`}>
              {t.services.sectionApart}
            </h2>
            <p className="text-base text-gray-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              {t.services.sectionApartSub}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px_1fr] gap-6 items-center">

            {/* Left column */}
            <div className="space-y-10">
              {leftItems.map((d, i) => (
                <motion.div
                  key={d.title}
                  initial={{ opacity: 0, x: -28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-4 lg:flex-row-reverse lg:text-right group"
                >
                  <div className="shrink-0 w-14 h-14 rounded-full bg-[#1d3a6e] dark:bg-slate-800 group-hover:bg-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border border-blue-800/30 dark:border-slate-600">
                    <d.Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{d.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">{d.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Center robot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex items-center justify-center py-8 lg:py-0"
            >
              <div className="relative w-64 h-80">
                <div className="absolute inset-0 rounded-full blur-3xl opacity-20 dark:opacity-30"
                  style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
                <motion.svg
                  viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full drop-shadow-2xl relative z-10"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ellipse cx="100" cy="274" rx="46" ry="6" fill="#3b82f6" opacity="0.12" />
                  <rect x="70" y="196" width="22" height="54" rx="11" fill="#1d4ed8" />
                  <rect x="108" y="196" width="22" height="54" rx="11" fill="#1d4ed8" />
                  <rect x="63" y="242" width="34" height="13" rx="6.5" fill="#1e3a8a" />
                  <rect x="103" y="242" width="34" height="13" rx="6.5" fill="#1e3a8a" />
                  <rect x="55" y="108" width="90" height="92" rx="16" fill="#1d4ed8" />
                  <rect x="66" y="120" width="68" height="50" rx="10" fill="#1e3a8a" />
                  <line x1="74" y1="131" x2="126" y2="131" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                  <line x1="74" y1="140" x2="116" y2="140" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                  <line x1="74" y1="149" x2="121" y2="149" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="100" cy="160" r="5.5" fill="#f97316" />
                  <circle cx="100" cy="160" r="3" fill="#fed7aa" />
                  <rect x="86" y="94" width="28" height="16" rx="5" fill="#2563eb" />
                  <g transform="rotate(7, 100, 76)">
                    <rect x="58" y="38" width="84" height="64" rx="20" fill="#2563eb" />
                    <line x1="100" y1="38" x2="100" y2="22" stroke="#60a5fa" strokeWidth="3.5" strokeLinecap="round" />
                    <circle cx="100" cy="17" r="7" fill="#f97316" />
                    <circle cx="100" cy="17" r="4" fill="#fed7aa" />
                    <circle cx="80" cy="66" r="10" fill="#dbeafe" />
                    <circle cx="120" cy="66" r="10" fill="#dbeafe" />
                    <circle cx="82" cy="66" r="5.5" fill="#1d4ed8" />
                    <circle cx="122" cy="66" r="5.5" fill="#1d4ed8" />
                    <circle cx="84" cy="64" r="2.5" fill="white" />
                    <circle cx="124" cy="64" r="2.5" fill="white" />
                    <path d="M85 83 Q100 92 115 83" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <circle cx="62" cy="70" r="4" fill="#1e3a8a" />
                    <circle cx="138" cy="70" r="4" fill="#1e3a8a" />
                  </g>
                  <rect x="28" y="112" width="28" height="14" rx="7" fill="#1d4ed8" transform="rotate(12 42 119)" />
                  <rect x="18" y="124" width="22" height="50" rx="11" fill="#2563eb" transform="rotate(6 29 149)" />
                  <circle cx="24" cy="172" r="10" fill="#2563eb" />
                  <rect x="144" y="104" width="28" height="14" rx="7" fill="#1d4ed8" transform="rotate(-35 158 111)" />
                  <rect x="154" y="72" width="22" height="50" rx="11" fill="#2563eb" transform="rotate(-22 165 97)" />
                  <circle cx="168" cy="52" r="10" fill="#2563eb" />
                  <motion.g
                    animate={{ y: [0, -6, 0], opacity: [0.85, 1, 0.85] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <circle cx="166" cy="30" r="24" fill="#f97316" opacity="0.18" />
                    <circle cx="166" cy="30" r="18" fill="#f97316" opacity="0.28" />
                    <text x="157.5" y="39" fontSize="26" fontWeight="900" fill="#f97316" fontFamily="Georgia, serif">?</text>
                  </motion.g>
                </motion.svg>
                {[
                  { x: '8%', y: '18%', size: 6, delay: 0 },
                  { x: '88%', y: '12%', size: 5, delay: 0.5 },
                  { x: '4%', y: '58%', size: 4, delay: 1.0 },
                  { x: '92%', y: '62%', size: 5, delay: 1.5 },
                  { x: '50%', y: '92%', size: 4, delay: 0.8 },
                ].map((dot, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-blue-400 dark:bg-blue-500"
                    style={{ width: dot.size, height: dot.size, left: dot.x, top: dot.y }}
                    animate={{ opacity: [0.25, 0.7, 0.25], scale: [1, 1.5, 1] }}
                    transition={{ duration: 2.8, repeat: Infinity, delay: dot.delay, ease: 'easeInOut' }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Right column */}
            <div className="space-y-10">
              {rightItems.map((d, i) => (
                <motion.div
                  key={d.title}
                  initial={{ opacity: 0, x: 28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="shrink-0 w-14 h-14 rounded-full bg-[#1d3a6e] dark:bg-slate-800 group-hover:bg-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border border-blue-800/30 dark:border-slate-600">
                    <d.Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{d.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">{d.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          BLOCK 2 — What We Offer + Platforms + CTA
      ══════════════════════════════════════════════════════════ */}
      <div className="py-24 border-t border-gray-200 dark:border-slate-700/60">
        <div className="container mx-auto px-6 max-w-7xl">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-20 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium">
              <Wrench className="w-4 h-4" />
              {t.services.badge}
            </div>
            <h2 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-slate-100 ${barlowCondensed.className}`}>
              {t.services.title}
            </h2>
            <p className="text-base text-gray-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
              We design intelligent systems that bridge hardware, software, and automation.
            </p>
          </motion.div>

          <CategoryLabel label={t.services.sectionOffer} />
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
          >
            {services.map((service) => (
              <motion.div key={service.key} variants={item} className="h-full">
                <div className="group h-full flex flex-col rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500">
                  <div className="relative h-40 overflow-hidden flex-shrink-0">
                    <Image src={SERVICE_IMAGES[service.key]} alt={service.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <service.icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 p-5 gap-2">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 leading-snug" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {service.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed flex-1">{service.description}</p>
                    <div className="pt-3 mt-auto border-t border-gray-100 dark:border-slate-700">
                      <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">{service.outcome}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Platforms & Initiatives */}
          <CategoryLabel label={t.services.sectionPlatforms} />
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── ROBOlution ── */}
            <motion.div variants={item}>
              <div className="group h-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:border-orange-400 dark:hover:border-orange-500">
                <div
                  className="relative h-56 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)' }}
                >
                  <Image
                    src={ROBOLUTION_HERO}
                    alt="ROBOlution Competition"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
                  />
                  <div
                    className="absolute inset-0 opacity-[0.28] group-hover:opacity-[0.44] transition-opacity duration-500"
                    style={{
                      backgroundImage: "url('/robolution.png')",
                      backgroundSize: '52%',
                      backgroundPosition: 'center right 6%',
                      backgroundRepeat: 'no-repeat',
                      maskImage: 'radial-gradient(ellipse 75% 80% at 75% 50%, black 10%, transparent 70%)',
                      WebkitMaskImage: 'radial-gradient(ellipse 75% 80% at 75% 50%, black 10%, transparent 70%)',
                    }}
                  />
                  <div
                    className="absolute bottom-0 right-0 w-44 h-44 rounded-full blur-3xl opacity-40"
                    style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold bg-orange-500 text-white">
                    {t.robolutionBadge}
                  </span>
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <p className={`text-white font-bold text-2xl leading-none ${barlowCondensed.className}`}>ROBOlution</p>
                    <p className="text-orange-200 text-xs mt-1 font-mono">{t.robolutionSubtitle}</p>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                    {t.robolutionDesc}
                  </p>
                  <ul className="space-y-2">
                    {[t.robolutionPoint1, t.robolutionPoint2, t.robolutionPoint3, t.robolutionPoint4].map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-slate-400">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-3 border-t border-gray-100 dark:border-slate-700">
                    <a href="https://robolution.erovoutika.ph/home" target="_blank" rel="noopener noreferrer"
                      className="group/btn self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-xs font-bold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #ea580c, #dc2626)', fontFamily: "'DM Sans', sans-serif" }}>
                      {t.robolutionCta}
                      <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── EIRA ── */}
            <motion.div variants={item}>
              <div className="group h-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500">
                <div
                  className="relative h-56 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 55%, #ea580c 100%)' }}
                >
                  <div
                    className="absolute inset-0 opacity-[0.25] group-hover:opacity-[0.40] transition-opacity duration-500"
                    style={{
                      backgroundImage: "url('/eira.png')",
                      backgroundSize: '58%',
                      backgroundPosition: 'center right 6%',
                      backgroundRepeat: 'no-repeat',
                      maskImage: 'radial-gradient(ellipse 75% 80% at 75% 50%, black 10%, transparent 70%)',
                      WebkitMaskImage: 'radial-gradient(ellipse 75% 80% at 75% 50%, black 10%, transparent 70%)',
                    }}
                  />
                  <div
                    className="absolute bottom-0 right-0 w-44 h-44 rounded-full blur-3xl opacity-30"
                    style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}
                  />
                  <div className="absolute inset-0 opacity-[0.05]">
                    <svg className="w-full h-full">
                      <defs>
                        <pattern id="eiragrid" width="30" height="30" patternUnits="userSpaceOnUse">
                          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.6" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#eiragrid)" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold bg-blue-600 text-white">
                    {t.eiraBadge}
                  </span>
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <p className={`text-white font-bold text-2xl leading-none ${barlowCondensed.className}`}>EIRA</p>
                    <p className="text-orange-200 text-xs mt-1 font-mono">{t.eiraSubtitle}</p>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                    {t.eiraDesc}
                  </p>
                  <ul className="space-y-2">
                    {[t.eiraPoint1, t.eiraPoint2, t.eiraPoint3, t.eiraPoint4].map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-slate-400">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-3 border-t border-gray-100 dark:border-slate-700">
                    <a href="https://eira-erovoutika.vercel.app/" target="_blank" rel="noopener noreferrer"
                      className="group/btn self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-xs font-bold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #1d4ed8, #6366f1)', fontFamily: "'DM Sans', sans-serif" }}>
                      {t.eiraCta}
                      <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

          </motion.div>

          {/* CTA banner */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-16 relative rounded-2xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 50%, #312e81 100%)' }}
          >
            <div className="absolute inset-0 opacity-[0.06]">
              <svg className="w-full h-full"><defs><pattern id="ctugrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.8" /></pattern></defs><rect width="100%" height="100%" fill="url(#ctugrid)" /></svg>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-10 py-10">
              <div className="text-center md:text-left space-y-2">
                <h3 className={`text-2xl md:text-3xl font-bold text-white ${barlowCondensed.className}`}>
                  {t.ctaTitle}
                </h3>
                <p className="text-blue-200 text-sm max-w-md">
                  {t.ctaSubtitle}
                </p>
              </div>
              <button
                onClick={scrollToContact}
                className="group flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-orange-500 text-blue-700 hover:text-white rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-[1.02]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t.ctaButton}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>

    </section>
  )
}

function CategoryLabel({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 mb-8 ${className}`}>
      <span className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500">{label}</span>
      <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
    </div>
  )
}