'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { 
  Newspaper, 
  Award, 
  Users, 
  Mail, 
  TrendingUp, 
  ArrowRight,
  Clock,
  Activity,
  Terminal
} from 'lucide-react'
import Link from 'next/link'

type Stats = {
  totalNews: number
  totalAwards: number
  totalPartners: number
  totalMessages: number
  newsThisMonth: number
  awardsThisMonth: number
}
type RecentNews  = { id: string; title: string; category: string; created_at: string }
type RecentAward = { id: string; title: string; year: string;     created_at: string }

// ── Mini sparkline bars ───────────────────────────────────────────────────────
function MiniSparkline({ color }: { color: string }) {
  const bars = [0.3, 0.6, 0.45, 0.8, 0.55, 0.9, 0.65, 1, 0.75, 0.5, 0.85, 0.7]
  return (
    <div className="flex items-end gap-[2px] h-6" aria-hidden="true">
      {bars.map((h, i) => (
        <span key={i} className="inline-block w-[2px] rounded-sm"
          style={{ height: `${h * 24}px`, background: color, opacity: 0.25 + h * 0.35 }} />
      ))}
    </div>
  )
}

// ── Mechanical corner brackets ────────────────────────────────────────────────
function CardCorners({ color }: { color: string }) {
  const base: React.CSSProperties = {
    position: 'absolute', width: 10, height: 10,
    pointerEvents: 'none', zIndex: 2,
    borderColor: color, borderStyle: 'solid',
  }
  return (
    <>
      <span style={{ ...base, top: 0,    left:  0, borderWidth: '1.5px 0 0 1.5px' }} />
      <span style={{ ...base, top: 0,    right: 0, borderWidth: '1.5px 1.5px 0 0' }} />
      <span style={{ ...base, bottom: 0, left:  0, borderWidth: '0 0 1.5px 1.5px' }} />
      <span style={{ ...base, bottom: 0, right: 0, borderWidth: '0 1.5px 1.5px 0' }} />
    </>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalNews: 0, totalAwards: 0, totalPartners: 0, totalMessages: 0,
    newsThisMonth: 0, awardsThisMonth: 0,
  })
  const [recentNews,   setRecentNews]   = useState<RecentNews[]>([])
  const [recentAwards, setRecentAwards] = useState<RecentAward[]>([])
  const [isLoading,    setIsLoading]    = useState(true)

  useEffect(() => { fetchDashboardData() }, [])

  const fetchDashboardData = async () => {
    try {
      const { data: newsData }     = await supabase.from('news_updates').select('*')
      const { data: awardsData }   = await supabase.from('awards').select('*')
      const { data: partnersData } = await supabase.from('partners').select('*')
      const { data: messagesData } = await supabase.from('contact_messages').select('*')

      const now = new Date()
      const thisMonth = (d: string) => {
        const date = new Date(d)
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      }

      const { data: recentNewsData }   = await supabase
        .from('news_updates').select('id, title, category, created_at')
        .order('created_at', { ascending: false }).limit(3)
      const { data: recentAwardsData } = await supabase
        .from('awards').select('id, title, year, created_at')
        .order('created_at', { ascending: false }).limit(3)

      setStats({
        totalNews:       newsData?.length     || 0,
        totalAwards:     awardsData?.length   || 0,
        totalPartners:   partnersData?.length || 0,
        totalMessages:   messagesData?.length || 0,
        newsThisMonth:   newsData?.filter(i => thisMonth(i.created_at)).length   || 0,
        awardsThisMonth: awardsData?.filter(i => thisMonth(i.created_at)).length || 0,
      })
      setRecentNews(recentNewsData   || [])
      setRecentAwards(recentAwardsData || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
    if (seconds < 60)     return 'Just now'
    if (seconds < 3600)   return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400)  return `${Math.floor(seconds / 3600)}h ago`
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
            <div className="absolute inset-[5px] rounded-full border border-orange-500/10 border-b-orange-400 animate-spin"
              style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
            <div className="w-2 h-2 rounded-full bg-orange-500" />
          </div>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-gray-400 dark:text-slate-600 animate-pulse">Synchronizing Data...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    { title: 'Total News',       value: stats.totalNews,     change: stats.newsThisMonth,     icon: Newspaper, accent: '#3b82f6', cornerColor: 'rgba(59,130,246,0.45)',  href: '/admin/news'     },
    { title: 'Total Awards',     value: stats.totalAwards,   change: stats.awardsThisMonth,   icon: Award,     accent: '#a855f7', cornerColor: 'rgba(168,85,247,0.45)', href: '/admin/awards'   },
    { title: 'Total Partners',   value: stats.totalPartners, change: 0,                       icon: Users,     accent: '#22c55e', cornerColor: 'rgba(34,197,94,0.45)',  href: '/admin/partners' },
    { title: 'Contact Messages', value: stats.totalMessages, change: 0,                       icon: Mail,      accent: '#f97316', cornerColor: 'rgba(249,115,22,0.45)', href: '/admin/messages' },
  ]

  return (
    <div className="space-y-10">

      {/* ── Page Header ── */}
      <div className="flex items-end justify-between border-b border-gray-200 dark:border-white/[0.07] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-3 h-3 text-orange-500" />
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-gray-400 dark:text-slate-600">Root://Dashboard</p>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">Intelligence Overview</h1>
        </div>
        <div className="hidden md:flex items-center gap-4 font-mono text-[9px] tracking-widest text-gray-400 dark:text-slate-700 uppercase">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/[0.03] px-3 py-1.5 rounded-sm border border-gray-200 dark:border-white/[0.05]">
            <Activity className="w-3 h-3 text-orange-500/60" />
            <span>Core Systems: <span className="text-green-500">Nominal</span></span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* ── Metric Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <div className="relative group cursor-pointer p-6 transition-all duration-300
                bg-white dark:bg-[#0d1526]
                border border-gray-200 dark:border-white/[0.07]
                hover:border-white/[0.15] hover:shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                <CardCorners color={stat.cornerColor} />

                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 flex items-center justify-center rounded-sm"
                    style={{ background: `${stat.accent}10`, border: `1px solid ${stat.accent}20` }}>
                    <Icon className="w-5 h-5" style={{ color: stat.accent }} />
                  </div>
                  <MiniSparkline color={stat.accent} />
                </div>

                <div className="mb-2">
                  <span className="text-4xl font-bold tabular-nums text-gray-900 dark:text-slate-100 group-hover:text-white transition-colors">
                    {stat.value}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400 dark:text-slate-600">
                    {stat.title}
                  </span>
                  {stat.change > 0 && (
                    <span className="flex items-center gap-1 font-mono text-[9px]" style={{ color: stat.accent }}>
                      <TrendingUp className="w-2.5 h-2.5" />
                      +{stat.change} NEW
                    </span>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${stat.accent}, transparent)` }} />
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── Main Layout: Activity & Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Activity Feed */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-4">
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-gray-400 dark:text-slate-600 shrink-0">Recent Telemetry</p>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 dark:from-white/[0.06] to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent News Card */}
            <div className="relative bg-white dark:bg-[#0d1526] border border-gray-200 dark:border-white/[0.07]">
              <CardCorners color="rgba(59,130,246,0.3)" />
              <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.05] flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase text-blue-500 tracking-tighter flex items-center gap-2">
                  <Newspaper className="w-3 h-3" /> Data.News_Log
                </span>
                <ArrowRight className="w-3 h-3 text-gray-600" />
              </div>
              <div className="p-5 space-y-4">
                {recentNews.map((news) => (
                  <div key={news.id} className="group cursor-pointer">
                    <p className="text-xs text-gray-500 dark:text-slate-500 font-mono mb-1">{getTimeAgo(news.created_at)}</p>
                    <h4 className="text-sm font-medium dark:text-slate-300 group-hover:text-blue-400 transition-colors line-clamp-1">{news.title}</h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Awards Card */}
            <div className="relative bg-white dark:bg-[#0d1526] border border-gray-200 dark:border-white/[0.07]">
              <CardCorners color="rgba(168,85,247,0.3)" />
              <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.05] flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase text-purple-500 tracking-tighter flex items-center gap-2">
                  <Award className="w-3 h-3" /> Data.Award_Log
                </span>
                <ArrowRight className="w-3 h-3 text-gray-600" />
              </div>
              <div className="p-5 space-y-4">
                {recentAwards.map((award) => (
                  <div key={award.id} className="group cursor-pointer">
                    <p className="text-xs text-gray-500 dark:text-slate-500 font-mono mb-1">{award.year}</p>
                    <h4 className="text-sm font-medium dark:text-slate-300 group-hover:text-purple-400 transition-colors line-clamp-1">{award.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Operations Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-4">
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-gray-400 dark:text-slate-600 shrink-0">Operations</p>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 dark:from-white/[0.06] to-transparent" />
          </div>

          <div className="space-y-3">
            {[
              { label: 'Publish New Article', href: '/admin/news/new', icon: Newspaper, color: '#3b82f6' },
              { label: 'Register New Partner', href: '/admin/partners', icon: Users, color: '#22c55e' },
              { label: 'Check Inbox', href: '/admin/messages', icon: Mail, color: '#f97316' },
            ].map((op) => (
              <Link key={op.label} href={op.href} className="block group">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.05] hover:bg-white/[0.05] transition-all">
                  <div className="flex items-center gap-3">
                    <op.icon className="w-4 h-4" style={{ color: op.color }} />
                    <span className="text-xs font-medium dark:text-slate-300">{op.label}</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-gray-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}