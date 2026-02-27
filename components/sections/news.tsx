'use client'

import { Libre_Baskerville, Barlow_Condensed } from 'next/font/google'
const libreBaskerville = Libre_Baskerville({ subsets: ['latin'], weight: ['700'], display: 'swap' })
const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700'], display: 'swap' })

import { Tag, X, ArrowUpRight, ChevronLeft, ChevronRight, Calendar, Newspaper } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/lib/i18n/languageContext'
import Image from 'next/image'

type NewsItem = {
  id: string
  title: string
  excerpt: string
  content: string | null
  category: string
  date: string
  image_url: string | null
  url: string | null
}

// ─── Animation variants — unchanged ──────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.42, 0, 0.58, 1] as const } },
}

const modalOverlay = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
}

const modalContent = {
  hidden: { opacity: 0, scale: 0.97, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 28 } },
  exit: { opacity: 0, scale: 0.97, y: 16, transition: { duration: 0.18 } },
}

// ─── NewsModal — completely unchanged ────────────────────────────────────────
function NewsModal({
  news,
  allNews,
  onClose,
  onNavigate,
}: {
  news: NewsItem
  allNews: NewsItem[]
  onClose: () => void
  onNavigate: (item: NewsItem) => void
}) {
  const currentIndex = allNews.findIndex((n) => n.id === news.id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < allNews.length - 1
  const handlePrev = () => hasPrev && onNavigate(allNews[currentIndex - 1])
  const handleNext = () => hasNext && onNavigate(allNews[currentIndex + 1])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentIndex, onClose, handlePrev, handleNext])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const paragraphs = news.content
    ? news.content.split('\n').filter(Boolean)
    : [news.excerpt]

  return (
    <motion.div
      variants={modalOverlay}
      initial="hidden"
      animate="show"
      exit="exit"
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0,0,0,0.68)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div className="flex items-start justify-center min-h-full py-10 px-4">
        <motion.div
          variants={modalContent}
          initial="hidden"
          animate="show"
          exit="exit"
          className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-2xl flex"
          onClick={(e) => e.stopPropagation()}
        >
          {news.image_url && (
            <div className="hidden md:block relative w-80 shrink-0">
              <Image
                src={news.image_url}
                alt={news.title}
                fill
                sizes="320px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-5 right-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-lg">
                  <Tag className="w-3 h-3" />
                  {news.category}
                </span>
              </div>
            </div>
          )}
          <div className="flex flex-col flex-1 min-w-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-slate-400" />
            </button>
            <div className="flex-1 px-8 pt-8 pb-6">
              <div className="flex items-center gap-3 mb-4">
                {!news.image_url && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-widest border border-blue-100">
                    <Tag className="w-3 h-3" />
                    {news.category}
                  </span>
                )}
                {news.image_url && (
                  <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">
                    {news.category}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(news.date).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
              </div>
              <h2 className={`text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100 leading-tight mb-3 ${libreBaskerville.className}`}>
                {news.title}
              </h2>
              <div className="w-10 h-0.5 bg-orange-500 mb-5" />
              <p className="text-gray-500 dark:text-slate-400 text-sm italic leading-relaxed pb-5 mb-5 border-b border-gray-100 dark:border-slate-700">
                {news.excerpt}
              </p>
              <div className="space-y-4">
                {paragraphs.map((para, i) => (
                  <p key={i} className="text-gray-700 dark:text-slate-300 text-[15px] leading-[1.9]">
                    {para}
                  </p>
                ))}
              </div>
              {news.url && (
                <div className="mt-8">
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-600 text-white font-semibold text-sm hover:bg-orange-700 transition-colors group"
                  >
                    View Original Source
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              )}
            </div>
            {allNews.length > 1 && (
              <div className="border-t border-gray-100 dark:border-slate-700 px-8 py-4 flex items-center justify-between bg-gray-50 dark:bg-slate-700">
                <button
                  onClick={handlePrev}
                  disabled={!hasPrev}
                  className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <span className="text-xs text-gray-400 dark:text-slate-500">{currentIndex + 1} / {allNews.length}</span>
                <button
                  onClick={handleNext}
                  disabled={!hasNext}
                  className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─── Main export — all fetch/state/language logic untouched ──────────────────
export function News() {
  const { t, language } = useLanguage()
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

  useEffect(() => {
    fetchNews()
  }, [language])

  const fetchNews = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/news/translate?lang=${language}`)
      if (response.ok) {
        const data = await response.json()
        setNews(data)
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const openModal = useCallback((item: NewsItem) => setSelectedNews(item), [])
  const closeModal = useCallback(() => setSelectedNews(null), [])

  if (isLoading) {
    return (
      <section className="py-20 bg-white dark:bg-[#050A14]">
        <div className="container mx-auto px-6 flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  // Sort newest first
  const sorted = [...news].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const [featured, ...rest] = sorted
  const sideItems = rest.slice(0, 3)
  const hiddenCount = Math.max(0, rest.length - 3)

  return (
    <>
      <section className="py-20 bg-white dark:bg-[#050A14]">
        <div className="container mx-auto px-6 max-w-6xl">

          {/* ===== HEADING (About-style) ===== */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium">
              <Newspaper className="w-4 h-4" />
              {t.news.title}
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 dark:text-white ${barlowCondensed.className}`}>
                Latest News & Updates
              </h2>
              {hiddenCount > 0 && (
                <button
                  onClick={() => featured && openModal(featured)}
                  className="text-[11px] font-bold uppercase tracking-widest text-orange-500 hover:text-orange-600 transition-colors"
                >
                  View all ({news.length})
                </button>
              )}
            </div>
          </motion.div>

          {/* No articles state */}
          {news.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 dark:text-slate-500 text-sm">{t.news.noNews}</p>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-[1.1fr_1px_1fr] gap-0 lg:gap-0"
            >
              {/* ── LEFT — Featured article (most recent) ── */}
              {featured && (
                <motion.div variants={fadeUp} className="lg:pr-10">
                  <div
                    onClick={() => openModal(featured)}
                    className="group cursor-pointer"
                  >
                    <div className="relative w-full overflow-hidden rounded-lg mb-4"
                      style={{ aspectRatio: '16/9' }}
                    >
                      {featured.image_url ? (
                        <Image
                          src={featured.image_url}
                          alt={featured.title}
                          fill
                          priority
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                          <Tag className="w-12 h-12 text-gray-300 dark:text-slate-500" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                        {featured.category}
                      </span>
                      <span className="text-gray-300 dark:text-slate-600">·</span>
                      <span className="text-[11px] text-gray-400 dark:text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(featured.date).toLocaleDateString('en-US', {
                          month: 'long', day: 'numeric', year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h2 className={`text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-snug mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors ${libreBaskerville.className}`}>
                      {featured.title}
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {featured.excerpt}
                    </p>

                    <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 group-hover:text-orange-600 transition-colors">
                      Read story
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Vertical divider */}
              <div className="hidden lg:block w-px bg-gray-200 dark:bg-slate-700/60" />

              {/* ── RIGHT — 3 sub-articles ── */}
              <motion.div variants={fadeUp} className="lg:pl-10 flex flex-col mt-8 lg:mt-0">
                {sideItems.length === 0 ? (
                  <p className="text-sm text-gray-400 dark:text-slate-500 py-4">No more stories</p>
                ) : (
                  sideItems.map((item, i) => (
                    <div
                      key={item.id}
                      onClick={() => openModal(item)}
                      className={`group flex gap-4 cursor-pointer py-5 ${
                        i < sideItems.length - 1
                          ? 'border-b border-gray-100 dark:border-slate-700/50'
                          : ''
                      }`}
                    >
                      <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-slate-700">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            sizes="80px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Tag className="w-5 h-5 text-gray-300 dark:text-slate-500" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                            {item.category}
                          </span>
                          <span className="text-gray-300 dark:text-slate-600 text-xs">·</span>
                          <span className="text-[10px] text-gray-400 dark:text-slate-500">
                            {new Date(item.date).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric',
                            })}
                          </span>
                        </div>
                        <h4 className={`text-sm font-bold text-gray-900 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors ${libreBaskerville.className}`}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {item.excerpt}
                        </p>
                      </div>

                      <div className="shrink-0 self-start pt-1">
                        <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-slate-600 group-hover:text-orange-500 transition-colors" />
                      </div>
                    </div>
                  ))
                )}

                {hiddenCount > 0 && (
                  <button
                    onClick={() => sideItems[0] && openModal(sideItems[0])}
                    className="mt-4 self-start text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 hover:text-orange-500 transition-colors"
                  >
                    + {hiddenCount} more — open reader →
                  </button>
                )}
              </motion.div>

            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedNews && (
          <NewsModal
            news={selectedNews}
            allNews={sorted}
            onClose={closeModal}
            onNavigate={setSelectedNews}
          />
        )}
      </AnimatePresence>
    </>
  )
}