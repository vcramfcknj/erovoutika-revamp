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
  Activity
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
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
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
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-gray-400 dark:text-slate-600 animate-pulse">Loading data...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    { title: 'Total News',       value: stats.totalNews,     change: stats.newsThisMonth,    changeText: 'this month', icon: Newspaper, accent: '#3b82f6', cornerColor: 'rgba(59,130,246,0.45)',  href: '/admin/news'     },
    { title: 'Total Awards',     value: stats.totalAwards,   change: stats.awardsThisMonth,  changeText: 'this month', icon: Award,     accent: '#a855f7', cornerColor: 'rgba(168,85,247,0.45)', href: '/admin/awards'   },
    { title: 'Total Partners',   value: stats.totalPartners, change: 0,                      changeText: 'active',     icon: Users,     accent: '#22c55e', cornerColor: 'rgba(34,197,94,0.45)',  href: '/admin/partners' },
    { title: 'Contact Messages', value: stats.totalMessages, change: 0,                      changeText: 'unread',     icon: Mail,      accent: '#f97316', cornerColor: 'rgba(249,115,22,0.45)', href: '/admin/messages' },
  ]

  const quickActions = [
    { title: 'News & Updates', description: 'Create and edit news articles', icon: Newspaper, href: '/admin/news',     accent: '#3b82f6', cornerColor: 'rgba(59,130,246,0.35)'  },
    { title: 'Awards',         description: 'Add and update award entries',  icon: Award,     href: '/admin/awards',   accent: '#a855f7', cornerColor: 'rgba(168,85,247,0.35)' },
    { title: 'Partners',       description: 'Update partner information',    icon: Users,     href: '/admin/partners', accent: '#22c55e', cornerColor: 'rgba(34,197,94,0.35)'  },
    { title: 'Messages',       description: 'Review form submissions',       icon: Mail,      href: '/admin/messages', accent: '#f97316', cornerColor: 'rgba(249,115,22,0.35)' },
  ]

  return (
    <div className="space-y-10">

      {/* ── Page header ── */}
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-gray-400 dark:text-slate-600 mb-2">Control Panel</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-slate-600 mt-1">Overview of site content and activity.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 font-mono text-[9px] tracking-widest text-gray-400 dark:text-slate-700 uppercase">
          <Activity className="w-3 h-3 text-orange-500/60" />
          <span>Systems Normal</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <div className="relative group cursor-pointer p-5 transition-all duration-200 hover:-translate-y-0.5
                bg-white dark:bg-[#0d1526]
                border border-gray-200 dark:border-white/[0.07]
                hover:border-gray-300 dark:hover:border-white/[0.12]
                shadow-sm dark:shadow-none">
                <CardCorners color={stat.cornerColor} />

                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-9 h-9 flex items-center justify-center rounded-sm"
                    style={{ background: `${stat.accent}15`, border: `1px solid ${stat.accent}30` }}>
                    <Icon className="w-4 h-4" style={{ color: stat.accent }} />
                  </div>
                  <MiniSparkline color={stat.accent} />
                </div>

                {/* Value */}
                <div className="mb-3">
                  <span className="text-4xl font-bold tabular-nums leading-none text-gray-900 dark:text-slate-100">
                    {stat.value}
                  </span>
                </div>

                {/* Label + change */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-gray-400 dark:text-slate-600">
                    {stat.title}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[10px]" style={{ color: `${stat.accent}bb` }}>
                    <TrendingUp className="w-2.5 h-2.5" />
                    {stat.change} {stat.changeText}
                  </span>
                </div>

                {/* Bottom glow on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${stat.accent}, transparent)` }} />
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── Quick actions ── */}
      <div>
        <div className="flex items-center gap-4 mb-5">
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-gray-400 dark:text-slate-600 shrink-0">Quick Actions</p>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 dark:from-white/[0.06] to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <div className="relative group cursor-pointer p-5 transition-all duration-200 hover:-translate-y-0.5
                  bg-white dark:bg-[#0d1526]
                  border border-gray-200 dark:border-white/[0.07]
                  hover:border-gray-300 dark:hover:border-white/[0.12]
                  shadow-sm dark:shadow-none">
                  <CardCorners color={action.cornerColor} />

                  <div className="w-10 h-10 flex items-center justify-center rounded-sm mb-4 transition-transform duration-200 group-hover:scale-105"
                    style={{ background: `${action.accent}12`, border: `1px solid ${action.accent}25` }}>
                    <Icon className="w-5 h-5" style={{ color: action.accent }} />
                  </div>

                  <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-1">{action.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-600 mb-4 leading-relaxed">{action.description}</p>

                  <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase"
                    style={{ color: `${action.accent}99` }}>
                    <span>Go to section</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(90deg, transparent, ${action.accent}, transparent)` }} />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Recent activity ── */}
      <div>
        <div className="flex items-center gap-4 mb-5">
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-gray-400 dark:text-slate-600 shrink-0">Recent Activity</p>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 dark:from-white/[0.06] to-transparent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Recent News */}
          <div className="relative bg-white dark:bg-[#0d1526] border border-gray-200 dark:border-white/[0.07] shadow-sm dark:shadow-none">
            <CardCorners color="rgba(59,130,246,0.4)" />

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 flex items-center justify-center rounded-sm"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <Newspaper className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                </div>
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-gray-500 dark:text-slate-400">Recent News</span>
              </div>
              <Link href="/admin/news"
                className="flex items-center gap-1 font-mono text-[9px] tracking-widest uppercase text-gray-400 dark:text-slate-600 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-5">
              {recentNews.length === 0 ? (
                <p className="text-gray-400 dark:text-slate-600 text-xs font-mono text-center py-8">No records found</p>
              ) : (
                <div className="space-y-4">
                  {recentNews.map((news, i) => (
                    <div key={news.id} className={`flex items-start gap-3 pb-4 ${i < recentNews.length - 1 ? 'border-b border-gray-100 dark:border-white/[0.04]' : ''}`}>
                      <div className="w-px self-stretch mt-1.5 shrink-0"
                        style={{ background: 'linear-gradient(180deg, rgba(59,130,246,0.5), transparent)' }} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-800 dark:text-slate-300 line-clamp-1 mb-2">{news.title}</h4>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[9px] tracking-[0.12em] uppercase px-2 py-0.5
                            text-blue-600 dark:text-blue-400
                            bg-blue-50 dark:bg-blue-500/10
                            border border-blue-200 dark:border-blue-500/18">
                            {news.category}
                          </span>
                          <span className="flex items-center gap-1 font-mono text-[9px] text-gray-400 dark:text-slate-600">
                            <Clock className="w-2.5 h-2.5" />
                            {getTimeAgo(news.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Awards */}
          <div className="relative bg-white dark:bg-[#0d1526] border border-gray-200 dark:border-white/[0.07] shadow-sm dark:shadow-none">
            <CardCorners color="rgba(168,85,247,0.4)" />

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 flex items-center justify-center rounded-sm"
                  style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                  <Award className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                </div>
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-gray-500 dark:text-slate-400">Recent Awards</span>
              </div>
              <Link href="/admin/awards"
                className="flex items-center gap-1 font-mono text-[9px] tracking-widest uppercase text-gray-400 dark:text-slate-600 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-5">
              {recentAwards.length === 0 ? (
                <p className="text-gray-400 dark:text-slate-600 text-xs font-mono text-center py-8">No records found</p>
              ) : (
                <div className="space-y-4">
                  {recentAwards.map((award, i) => (
                    <div key={award.id} className={`flex items-start gap-3 pb-4 ${i < recentAwards.length - 1 ? 'border-b border-gray-100 dark:border-white/[0.04]' : ''}`}>
                      <div className="w-px self-stretch mt-1.5 shrink-0"
                        style={{ background: 'linear-gradient(180deg, rgba(168,85,247,0.5), transparent)' }} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-800 dark:text-slate-300 line-clamp-1 mb-2">{award.title}</h4>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[9px] tracking-[0.12em] uppercase px-2 py-0.5
                            text-purple-600 dark:text-purple-400
                            bg-purple-50 dark:bg-purple-500/10
                            border border-purple-200 dark:border-purple-500/18">
                            {award.year}
                          </span>
                          <span className="flex items-center gap-1 font-mono text-[9px] text-gray-400 dark:text-slate-600">
                            <Clock className="w-2.5 h-2.5" />
                            {getTimeAgo(award.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}