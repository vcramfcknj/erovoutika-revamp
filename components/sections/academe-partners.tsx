'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { Globe, GraduationCap, ChevronLeft, ChevronRight, ArrowUpRight, X } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/languageContext'
import { AnimatePresence, motion } from 'framer-motion'

type Partner = {
  id: string
  name: string
  description: string | null
  website_url: string | null
  image_url: string | null
  category: string | null
}

function PartnerPopup({ partner, onClose }: { partner: Partner; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } }}
        exit={{ opacity: 0, scale: 0.92, y: 16, transition: { duration: 0.18 } }}
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-500 dark:text-slate-400" />
        </button>

        <div className="w-24 h-24 mb-5 flex items-center justify-center">
          {partner.image_url ? (
            <div className="relative w-24 h-24">
              <Image src={partner.image_url} alt={partner.name} fill sizes="96px" className="object-contain" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 border border-orange-100 dark:border-orange-900/30 flex items-center justify-center">
              <span className="text-4xl font-black text-orange-300">{partner.name.charAt(0)}</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-1 leading-tight">{partner.name}</h3>

        {partner.category && (
          <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full mb-4">
            {partner.category}
          </span>
        )}

        <div className="w-10 h-0.5 bg-orange-400 mb-4" />

        {partner.description && (
          <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-6">{partner.description}</p>
        )}

        {partner.website_url && (
          <a
            href={partner.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition-colors group"
          >
            <Globe className="w-4 h-4" />
            Visit Website
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        )}
      </motion.div>
    </motion.div>
  )
}

export function AcademePartners() {
  const { t, language } = useLanguage()
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [selected, setSelected] = useState<Partner | null>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const itemsPerView = 5

  useEffect(() => { fetchPartners() }, [language])

  const fetchPartners = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/partners/translate?lang=${language}&type=academe`)
      if (response.ok) setPartners(await response.json())
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (partners.length > itemsPerView) {
      autoPlayRef.current = setInterval(() => handleNext(), 3000)
    }
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current) }
  }, [partners.length, currentIndex])

  const maxIndex = Math.max(0, partners.length - itemsPerView)

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1))
    setTimeout(() => setIsAnimating(false), 400)
  }

  const handlePrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1))
    setTimeout(() => setIsAnimating(false), 400)
  }

  const resetAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    autoPlayRef.current = setInterval(() => handleNext(), 3000)
  }

  return (
    <>
      <section className="py-24 bg-gray-50 dark:bg-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-orange-50 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="container mx-auto px-6 relative">

          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 text-orange-600 rounded-full text-sm font-semibold">
              <GraduationCap className="w-4 h-4" />
              {t.partners.academeBadge}
            </div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-slate-100">
              {t.partners.academeTitle}
            </h2>
            <p className="text-xl text-gray-500 dark:text-slate-400 leading-relaxed">
              {t.partners.academeSubtitle}
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <button
              onClick={() => { handlePrev(); resetAutoPlay() }}
              disabled={partners.length <= itemsPerView}
              className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-full flex items-center justify-center shadow-md transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>

            <div className="overflow-hidden">
              {isLoading ? (
                <div className="flex gap-8 items-center justify-center">
                  {[...Array(itemsPerView)].map((_, i) => (
                    <div key={i} className="w-32 h-16 bg-gray-100 dark:bg-slate-700 rounded-lg animate-pulse shrink-0" />
                  ))}
                </div>
              ) : partners.length === 0 ? (
                <div className="flex gap-8 items-center justify-center">
                  {[...Array(itemsPerView)].map((_, i) => (
                    <div key={i} className="w-32 h-16 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-8 h-8 text-gray-200" />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="flex gap-8 items-center transition-transform duration-[400ms] ease-in-out"
                  style={{ transform: `translateX(calc(-${currentIndex * (100 / itemsPerView)}% - ${currentIndex * (32 / itemsPerView)}px))` }}
                >
                  {partners.map((partner) => (
                    <button
                      key={partner.id}
                      onClick={() => setSelected(partner)}
                      title={partner.name}
                      className="flex-shrink-0 w-[calc(20%-25.6px)] h-32 flex items-center justify-center cursor-pointer group"
                    >
                      {partner.image_url ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={partner.image_url}
                            alt={partner.name}
                            fill
                            sizes="200px"
                            className="object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                          />
                        </div>
                      ) : (
                        <span className="text-4xl font-black text-gray-200 dark:text-slate-600 group-hover:text-orange-400 group-hover:scale-110 transition-all duration-300">
                          {partner.name.charAt(0)}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => { handleNext(); resetAutoPlay() }}
              disabled={partners.length <= itemsPerView}
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-full flex items-center justify-center shadow-md transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>


          {partners.length > itemsPerView && (
            <div className="flex justify-center gap-2 mt-4">
              {[...Array(maxIndex + 1)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentIndex(i); resetAutoPlay() }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'bg-orange-500 w-6' : 'bg-gray-200 dark:bg-slate-600 hover:bg-orange-300 w-2'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selected && <PartnerPopup partner={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  )
}