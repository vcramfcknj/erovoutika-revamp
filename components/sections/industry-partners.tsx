'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Globe, Building2, ArrowUpRight, MapPin } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/languageContext'
import { Barlow_Condensed } from 'next/font/google'

const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700'], display: 'swap' })

type Partner = {
  id: string
  name: string
  description: string | null
  website_url: string | null
  image_url: string | null
  category: string | null
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
      if (!res.ok) { setPartners([]); return }
      const data = await res.json()
      setPartners(Array.isArray(data) ? data : [])
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

          <h2 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white ${barlowCondensed.className}`}>
            {tr('partners.industry.title', 'Industry Collaborations')}
          </h2>

          <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
            {tr('partners.industry.subtitle', 'Companies we collaborate with to deliver automation, robotics, and real-world engineering solutions.')}
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

        {isLoading ? (
          <div className="flex gap-6 justify-center">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-[280px] h-[280px] rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse flex-shrink-0" />
            ))}
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-600 dark:text-slate-300">
            {tr('partners.industry.empty', 'No industry partners found.')}
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-white dark:from-[#050A14] to-transparent" />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-white dark:from-[#050A14] to-transparent" />

            <motion.div
              className="flex gap-6"
              style={{ width: 'max-content' }}
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: partners.length * 4, ease: 'linear', repeat: Infinity }}
            >
              {[...partners, ...partners].map((partner, idx) => (
                <div
                  key={`${partner.id}-${idx}`}
                  className="group relative w-[280px] h-[280px] flex-shrink-0"
                >
                  {/* Default State - Logo Only */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-700 transition-all duration-300 group-hover:opacity-0">
                    {partner.image_url ? (
<div className="relative w-90 h-90">
  <Image
    src={partner.image_url}
    alt={partner.name}
    fill
    sizes="208px"
    className="object-contain opacity-90 group-hover:opacity-100 transition-opacity"
  />
</div>
                    ) : (
                      <div className={`w-32 h-32 rounded-2xl flex items-center justify-center bg-gradient-to-br ${fallbackBg}`}>
                        <Building2 className={`w-16 h-16 ${fallbackIcon}`} />
                      </div>
                    )}
                  </div>

                  {/* Hover State - Full Details */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${hoverGradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl transform group-hover:scale-105`}>
                    <div className="absolute inset-0 flex flex-col p-6 text-white">
                      {partner.category && (
                        <span className="inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-sm mb-3">
                          <MapPin className="w-2.5 h-2.5" />
                          {partner.category}
                        </span>
                      )}
                      <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2">{partner.name}</h3>
                      {partner.description && (
                        <p className="text-xs leading-relaxed text-white/90 line-clamp-4 flex-1">
                          {partner.description}
                        </p>
                      )}
                      {partner.website_url && (
                        <a
                          href={partner.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold hover:gap-2 transition-all pt-3 border-t border-white/20"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          {tr('partners.industry.visitWebsite', 'Visit Website')}
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  )
}