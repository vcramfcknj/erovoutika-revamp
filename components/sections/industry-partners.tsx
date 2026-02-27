'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Globe, Building2, ChevronLeft, ChevronRight, ArrowUpRight, MapPin } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/languageContext'
import { Cormorant_Garamond } from 'next/font/google'

const cormorantGaramond = Cormorant_Garamond({ subsets: ['latin'], weight: ['700'], display: 'swap' })

type Partner = {
  id: string
  name: string
  description: string | null
  website_url: string | null
  image_url: string | null
  category: string | null
}

function getVisibleLoop<T>(arr: T[], start: number, count: number) {
  if (arr.length === 0) return []
  if (arr.length <= count) return arr
  const out: T[] = []
  for (let i = 0; i < count; i++) out.push(arr[(start + i) % arr.length])
  return out
}

export function IndustryPartners() {
  const lang = useLanguage() as any
  const language: string = typeof lang?.language === 'string' ? lang.language : 'en'

  const tr = useMemo(() => {
    const maybeT = lang?.t
    if (typeof maybeT === 'function') {
      return (key: string, fallback?: string) => {
        try {
          const out = maybeT(key)
          if (typeof out === 'string' && out !== key) return out
          return fallback ?? out ?? key
        } catch {
          return fallback ?? key
        }
      }
    }
    return (_key: string, fallback?: string) => fallback ?? _key
  }, [lang])

  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [startIndex, setStartIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const itemsPerView = 5

  const navHoverBorder = 'hover:border-orange-400'
  const navHoverBg = 'hover:bg-orange-50 dark:hover:bg-orange-950/25'
  const hoverGradient = 'from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700'
  const fallbackBg = 'from-orange-100 to-orange-200 dark:from-orange-950/30 dark:to-orange-900/30'
  const fallbackIcon = 'text-orange-600 dark:text-orange-400'

  const fetchPartners = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `/api/partners/translate?lang=${encodeURIComponent(language)}&type=industry`,
        { cache: 'no-store' }
      )
      if (!res.ok) {
        setPartners([])
        return
      }
      const data = await res.json()
      setPartners(Array.isArray(data) ? data : [])
      setStartIndex(0)
    } catch (e) {
      console.error(e)
      setPartners([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [language])

  const resetAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    if (partners.length <= itemsPerView) return
    autoPlayRef.current = setInterval(() => {
      setStartIndex((prev) => (partners.length === 0 ? 0 : (prev + 1) % partners.length))
    }, 3200)
  }

  useEffect(() => {
    resetAutoPlay()
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [partners.length])

  const handlePrev = () => {
    if (isAnimating || partners.length <= itemsPerView) return
    setIsAnimating(true)
    setStartIndex((prev) => (prev - 1 + partners.length) % partners.length)
    setTimeout(() => setIsAnimating(false), 260)
  }

  const handleNext = () => {
    if (isAnimating || partners.length <= itemsPerView) return
    setIsAnimating(true)
    setStartIndex((prev) => (prev + 1) % partners.length)
    setTimeout(() => setIsAnimating(false), 260)
  }

  const visiblePartners = getVisibleLoop(partners, startIndex, itemsPerView)

  return (
    <section className="py-24 bg-white dark:bg-[#050A14] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl opacity-[0.06] dark:opacity-[0.10]"
          style={{ background: 'radial-gradient(ellipse, #f97316 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-[0.04] dark:opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #fb923c 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 text-orange-600 dark:text-orange-400 rounded-full text-sm font-semibold">
            <Building2 className="w-4 h-4" />
            {tr('partners.industry.badge', 'Industry Partners')}
          </div>

          <h2
            className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white ${cormorantGaramond.className}`}
          >
            {tr('partners.industry.title', 'Industry Collaborations')}
          </h2>

          <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
            {tr(
              'partners.industry.subtitle',
              'Companies we collaborate with to deliver automation, robotics, and real-world engineering solutions.'
            )}
          </p>

          <div className="pt-2 flex flex-col items-center gap-1">
            <span className="text-5xl md:text-6xl font-black text-orange-500 dark:text-orange-400 tabular-nums leading-none">
              {isLoading ? '—' : partners.length}
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500">
              {tr('partners.industry.totalLabel', 'Total Companies')}
            </span>
          </div>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => {
              handlePrev()
              resetAutoPlay()
            }}
            disabled={partners.length <= itemsPerView}
            className={`absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 ${navHoverBorder} ${navHoverBg} rounded-full flex items-center justify-center shadow-md transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed`}
          >
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>

          <div className="overflow-hidden px-2">
            {isLoading ? (
              <div className="flex gap-6 justify-center">
                {[...Array(itemsPerView)].map((_, i) => (
                  <div
                    key={i}
                    className="w-[calc(20%-25.6px)] h-52 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse"
                  />
                ))}
              </div>
            ) : partners.length === 0 ? (
              <div className="text-center py-12 text-sm text-gray-600 dark:text-slate-300">
                {tr('partners.industry.empty', 'No industry partners found.')}
              </div>
            ) : (
              <div className="flex gap-6 justify-center">
                {visiblePartners.map((partner) => (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28 }}
                    className="group relative flex-shrink-0 w-[calc(20%-25.6px)] h-52"
                  >
                    <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 sm:group-hover:opacity-0">
                      {partner.image_url ? (
                        <div className="relative w-[clamp(120px,18vw,176px)] h-[clamp(120px,18vw,176px)] shrink-0">
                          <Image
                            src={partner.image_url}
                            alt={partner.name}
                            fill
                            sizes="176px"
                            className="object-contain opacity-100"
                          />
                        </div>
                      ) : (
                        <div
                          className={`w-32 h-32 rounded-2xl flex items-center justify-center bg-gradient-to-br ${fallbackBg}`}
                        >
                          <Building2 className={`w-12 h-12 ${fallbackIcon}`} />
                        </div>
                      )}
                    </div>

                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${hoverGradient} rounded-2xl opacity-0 sm:group-hover:opacity-100 transition-all duration-300 shadow-2xl transform sm:group-hover:scale-105`}
                    >
                      <div className="absolute inset-0 flex flex-col p-5 text-white">
                        {partner.category && (
                          <span className="inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-sm mb-3">
                            <MapPin className="w-2.5 h-2.5" />
                            {partner.category}
                          </span>
                        )}
                        <h3 className="text-base font-bold leading-tight mb-3 line-clamp-2">{partner.name}</h3>
                        {partner.description && (
                          <p className="text-xs leading-relaxed text-white/90 line-clamp-3 flex-1 mb-4">
                            {partner.description}
                          </p>
                        )}
                        {partner.website_url && (
                          <a
                            href={partner.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold hover:gap-2 transition-all"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            {tr('partners.industry.visitWebsite', 'Visit Website')}
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            aria-label="Next"
            onClick={() => {
              handleNext()
              resetAutoPlay()
            }}
            disabled={partners.length <= itemsPerView}
            className={`absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 ${navHoverBorder} ${navHoverBg} rounded-full flex items-center justify-center shadow-md transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed`}
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </section>
  )
}