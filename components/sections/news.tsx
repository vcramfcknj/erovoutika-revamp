'use client'

import { Tag, X, ArrowUpRight, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
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

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.42, 0, 0.58, 1] } },
}

const modalOverlay = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
}

const modalContent = {
  hidden: { opacity: 0, scale: 0.97, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 28 } },
  exit: { opacity: 0, scale: 0.97, y: 16, transition: { duration: 0.18 } },
}

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
          className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl flex"
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

              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100 leading-tight mb-3">
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

function SmallCard({ item, onClick }: { item: NewsItem; onClick: () => void }) {
  return (
    <motion.article
      variants={fadeUp}
      onClick={onClick}
      className="flex gap-4 group cursor-pointer py-4 border-b border-gray-100 dark:border-slate-700 last:border-0"
    >
      <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            sizes="80px"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Tag className="w-5 h-5 text-gray-300" />
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center gap-1 min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:text-orange-500">{item.category}</span>
        <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 group-hover:text-orange-600 transition-colors leading-snug line-clamp-2">
          {item.title}
        </h4>
        <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
    </motion.article>
  )
}

export function News() {
  const { t, language } = useLanguage() // Get current language
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

  useEffect(() => { 
    fetchNews() 
  }, [language]) // Refetch when language changes

  const fetchNews = async () => {
    setIsLoading(true)
    try {
      // Call translation API instead of direct Supabase
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
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6 flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  const [featured, ...rest] = news

  return (
    <>
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-slate-100">
              {t.news.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 leading-relaxed">
              {t.news.subtitle}
            </p>
          </div>

          {news.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-slate-400">{t.news.noNews}</p>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-0 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm"
            >
              {featured && (
                <motion.article
                  variants={fadeUp}
                  onClick={() => openModal(featured)}
                  className="lg:col-span-2 relative cursor-pointer group border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  {featured.image_url ? (
                    <div className="relative h-72 md:h-[420px] w-full overflow-hidden bg-gray-100">
                      <Image
                        src={featured.image_url}
                        alt={featured.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-8">
                        <span className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-md bg-orange-600 text-white font-bold text-xs uppercase tracking-widest mb-3 shadow">
                          <Tag className="w-3 h-3" /> {featured.category}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-black text-white leading-tight group-hover:text-orange-200 transition-colors">
                          {featured.title}
                        </h3>
                        <p className="mt-2 text-white/70 text-sm line-clamp-2 leading-relaxed">
                          {featured.excerpt}
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-white/60 text-xs">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(featured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-white/30">·</span>
                          <span className="text-xs text-orange-400 font-semibold group-hover:text-orange-300">
                            Read story →
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 min-h-[280px] h-full flex flex-col justify-between bg-gray-900">
                      <span className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-md bg-orange-600 text-white font-bold text-xs uppercase tracking-widest mb-4">
                        <Tag className="w-3 h-3" /> {featured.category}
                      </span>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-black text-white leading-tight group-hover:text-orange-300 transition-colors">
                          {featured.title}
                        </h3>
                        <p className="mt-3 text-white/60 text-sm line-clamp-3 leading-relaxed">{featured.excerpt}</p>
                        <div className="mt-4 flex items-center gap-2 text-white/50 text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(featured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.article>
              )}

              <div className="bg-white dark:bg-slate-900 flex flex-col">
                <div className="px-6 py-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 dark:text-slate-400">More Stories</span>
                </div>
                <div className="px-6 flex-1">
                  {rest.length > 0
                    ? rest.map((item) => (
                        <SmallCard key={item.id} item={item} onClick={() => openModal(item)} />
                      ))
                    : <p className="py-8 text-sm text-gray-400 text-center">No more stories</p>
                  }
                </div>
                {rest.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-900 dark:bg-slate-800 px-6 py-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
                      {rest.length} more article{rest.length !== 1 ? 's' : ''} available
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedNews && (
          <NewsModal
            news={selectedNews}
            allNews={news}
            onClose={closeModal}
            onNavigate={setSelectedNews}
          />
        )}
      </AnimatePresence>
    </>
  )
}