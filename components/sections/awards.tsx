'use client'

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

// Container animation for staggered cards
const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

// Individual card animation
const cardVariant: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

export function Awards() {
  const { t, language } = useLanguage()
  const [awards, setAwards] = useState<AwardItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch awards from API in a typed way
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
      <section className="py-24 bg-gray-50 dark:bg-slate-800 relative overflow-hidden">
        <div className="container mx-auto px-6 flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-gray-50 dark:bg-slate-800 relative overflow-hidden">
      {/* Orange glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-125 bg-orange-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-6 relative">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 text-orange-600 rounded-full text-sm font-semibold">
            <Trophy className="w-4 h-4" />
            {t.awards.badge}
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-slate-100">
            Awards & Accreditation
          </h2>
          <p className="text-xl text-gray-500 dark:text-slate-400 leading-relaxed">
            {t.awards.subtitle}
          </p>
        </div>

        {/* Awards cards */}
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
          >
            {awards.map((award) => (
              <motion.div
                key={award.id}
                variants={cardVariant}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Top accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Image or fallback */}
                {award.image_url ? (
                  <div className="relative h-48 overflow-hidden bg-orange-50 dark:bg-slate-700">
                    <Image
                      src={award.image_url}
                      alt={award.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="relative h-48 bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/10 flex items-center justify-center overflow-hidden">
                    <div className="absolute w-32 h-32 rounded-full border border-orange-200/60" />
                    <div className="absolute w-20 h-20 rounded-full border border-orange-300/40" />
                    <Medal className="w-14 h-14 text-orange-300 group-hover:text-orange-500 transition-colors duration-300 relative z-10" />
                  </div>
                )}

                {/* Card body */}
                <div className="p-6 flex flex-col flex-1 space-y-3">
                  {/* Category + Year */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-orange-50 text-orange-600 border border-orange-100">
                      <Star className="w-3 h-3" />
                      {award.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {award.year}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 group-hover:text-orange-600 transition-colors leading-snug line-clamp-2">
                    {award.title}
                  </h3>

                  {/* Recipient */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-px bg-orange-400" />
                    <p className="text-sm font-semibold text-orange-600">{award.recipient}</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-400 dark:text-slate-500 leading-relaxed line-clamp-3 flex-1">
                    {award.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}