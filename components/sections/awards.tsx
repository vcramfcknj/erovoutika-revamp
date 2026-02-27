'use client'

import { Cormorant_Garamond } from 'next/font/google'
const cormorantGaramond = Cormorant_Garamond({ subsets: ['latin'], weight: ['700'], display: 'swap' })

import { Trophy, Star, Calendar, Medal } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/lib/i18n/languageContext'

type AwardItem = {
  id: string
  title: string
  recipient: string
  description: string
  year: string
  category: string
  image_url: string | null
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

export function Awards() {
  const { t, language } = useLanguage()
  const [awards, setAwards] = useState<AwardItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchAwards = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/awards/translate?lang=${language}`)
      if (!response.ok) throw new Error('Failed to fetch awards')
      const data: AwardItem[] = await response.json()
      setAwards(data)
    } catch (error: unknown) {
      console.error('Error fetching awards:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAwards()
  }, [language])

  if (isLoading) {
    return (
      <section className="py-24 bg-white dark:bg-[#050A14] relative overflow-hidden">
        <div className="container mx-auto px-6 flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-white dark:bg-[#050A14] relative overflow-hidden">
      {/* Ambient background glow */}
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

      <div className="container mx-auto px-6 max-w-7xl relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 text-orange-600 dark:text-orange-400 rounded-full text-sm font-semibold">
            <Trophy className="w-4 h-4" />
            {t.awards.badge}
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white ${cormorantGaramond.className}`}>
            {t.awards.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
            {t.awards.subtitle}
          </p>
        </motion.div>

        {/* Empty state */}
        {awards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-slate-400">{t.awards.noAwards}</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative overflow-hidden"
          >
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-white dark:from-[#050A14] to-transparent" />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-white dark:from-[#050A14] to-transparent" />

            {/* Marquee track */}
            <motion.div
              className="flex gap-6"
              style={{ width: 'max-content' }}
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: awards.length * 4, ease: 'linear', repeat: Infinity }}
            >
              {[...awards, ...awards].map((award, idx) => (
                <div
                  key={`${award.id}-${idx}`}
                  className="group relative w-[280px] h-[280px] flex-shrink-0"
                >
                  {/* Default State - Logo Only */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-700 transition-all duration-300 group-hover:opacity-0">
                    {award.image_url ? (
                      <div className="relative w-40 h-40">
                        <Image
                          src={award.image_url}
                          alt={award.title}
                          fill
                          className="object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                          sizes="160px"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-2xl flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-950/40 dark:to-orange-900/40">
                        <Medal className="w-16 h-16 text-orange-500 dark:text-orange-400" />
                      </div>
                    )}
                  </div>

                  {/* Hover State - Full Details */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl transform group-hover:scale-105">
                    <div className="absolute inset-0 flex flex-col p-6 text-white">
                      {/* Top - Category & Year */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-sm">
                          <Star className="w-2.5 h-2.5" />
                          {award.category}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium tabular-nums bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                          <Calendar className="w-3 h-3" />
                          {award.year}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2">
                        {award.title}
                      </h3>

                      {/* Recipient */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-px bg-white/40" />
                        <p className="text-sm font-semibold truncate">{award.recipient}</p>
                      </div>

                      {/* Description */}
                      <p className="text-xs leading-relaxed text-white/90 line-clamp-4 flex-1">
                        {award.description}
                      </p>

                      {/* Bottom decoration */}
                      <div className="mt-auto pt-3 border-t border-white/20">
                        <Trophy className="w-5 h-5 opacity-40" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}