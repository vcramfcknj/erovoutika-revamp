'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Newspaper, 
  Award, 
  Users, 
  Mail, 
  TrendingUp, 
  ArrowRight,
  Clock
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

type RecentNews = {
  id: string
  title: string
  category: string
  created_at: string
}

type RecentAward = {
  id: string
  title: string
  year: string
  created_at: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalNews: 0,
    totalAwards: 0,
    totalPartners: 0,
    totalMessages: 0,
    newsThisMonth: 0,
    awardsThisMonth: 0,
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
        totalNews:      newsData?.length     || 0,
        totalAwards:    awardsData?.length   || 0,
        totalPartners:  partnersData?.length || 0,
        totalMessages:  messagesData?.length || 0,
        newsThisMonth:  newsData?.filter(i => thisMonth(i.created_at)).length   || 0,
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
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const statCards = [
    { title: 'Total News',         value: stats.totalNews,      change: stats.newsThisMonth,    changeText: 'this month', icon: Newspaper, color: 'blue',   href: '/admin/news' },
    { title: 'Total Awards',       value: stats.totalAwards,    change: stats.awardsThisMonth,  changeText: 'this month', icon: Award,     color: 'purple', href: '/admin/awards' },
    { title: 'Total Partners',     value: stats.totalPartners,  change: 0,                      changeText: 'active',     icon: Users,     color: 'green',  href: '/admin/partners' },
    { title: 'Contact Messages',   value: stats.totalMessages,  change: 0,                      changeText: 'unread',     icon: Mail,      color: 'orange', href: '/admin/messages' },
  ]

  const quickActions = [
    { title: 'Manage News',     description: 'Create and edit news articles',   icon: Newspaper, href: '/admin/news',     color: 'blue' },
    { title: 'Manage Awards',   description: 'Add and update awards',           icon: Award,     href: '/admin/awards',   color: 'purple' },
    { title: 'Manage Partners', description: 'Update partner information',      icon: Users,     href: '/admin/partners', color: 'green' },
    { title: 'View Messages',   description: 'Form submissions',                icon: Mail,      href: '/admin/messages', color: 'orange' },
  ]

  const colorMap: Record<string, { bg: string; darkBg: string; text: string; darkText: string; hover: string; darkHover: string; badge: string; darkBadge: string }> = {
    blue:   { bg: 'bg-blue-50',   darkBg: 'dark:bg-blue-950/30',   text: 'text-blue-600',   darkText: 'dark:text-blue-400',   hover: 'hover:bg-blue-100',   darkHover: 'dark:hover:bg-blue-900/40',   badge: 'bg-blue-50 text-blue-700',     darkBadge: 'dark:bg-blue-950/40 dark:text-blue-300' },
    purple: { bg: 'bg-purple-50', darkBg: 'dark:bg-purple-950/30', text: 'text-purple-600', darkText: 'dark:text-purple-400', hover: 'hover:bg-purple-100', darkHover: 'dark:hover:bg-purple-900/40', badge: 'bg-purple-50 text-purple-700', darkBadge: 'dark:bg-purple-950/40 dark:text-purple-300' },
    green:  { bg: 'bg-green-50',  darkBg: 'dark:bg-green-950/30',  text: 'text-green-600',  darkText: 'dark:text-green-400',  hover: 'hover:bg-green-100',  darkHover: 'dark:hover:bg-green-900/40',  badge: 'bg-green-50 text-green-700',   darkBadge: 'dark:bg-green-950/40 dark:text-green-300' },
    orange: { bg: 'bg-orange-50', darkBg: 'dark:bg-orange-950/30', text: 'text-orange-600', darkText: 'dark:text-orange-400', hover: 'hover:bg-orange-100', darkHover: 'dark:hover:bg-orange-900/40', badge: 'bg-orange-50 text-orange-700', darkBadge: 'dark:bg-orange-950/40 dark:text-orange-300' },
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <p className="text-gray-600 dark:text-slate-400 mt-2">
          Welcome back! Here&apos;s what&apos;s happening with your site.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          const c    = colorMap[stat.color]
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow dark:bg-slate-800/60 dark:border-slate-700/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-slate-400">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-lg ${c.bg} ${c.darkBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${c.text} ${c.darkText}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-slate-100">{stat.value}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1 text-sm ${c.text} ${c.darkText}`}>
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-slate-500">{stat.changeText}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon
            const c    = colorMap[action.color]
            return (
              <Link key={action.title} href={action.href}>
                <Card className="group cursor-pointer hover:shadow-lg transition-all border-2 border-gray-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600 dark:bg-slate-800/60">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${c.bg} ${c.darkBg} ${c.hover} ${c.darkHover} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${c.text} ${c.darkText}`} />
                    </div>
                    <CardTitle className="text-lg text-gray-900 dark:text-slate-100">{action.title}</CardTitle>
                    <CardDescription className="dark:text-slate-400">{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full justify-between hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-slate-300">
                      Go to section
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent News */}
        <Card className="dark:bg-slate-800/60 dark:border-slate-700/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-slate-100">
                <Newspaper className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Recent News
              </CardTitle>
              <Link href="/admin/news">
                <Button variant="ghost" size="sm" className="dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700">
                  View all <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentNews.length === 0 ? (
              <p className="text-gray-500 dark:text-slate-500 text-center py-8">No news articles yet</p>
            ) : (
              <div className="space-y-4">
                {recentNews.map((news) => (
                  <div key={news.id} className="flex items-start gap-4 pb-4 border-b dark:border-slate-700/60 last:border-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-slate-100 line-clamp-1">{news.title}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colorMap.blue.badge} ${colorMap.blue.darkBadge}`}>
                          {news.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-500">
                          <Clock className="w-3 h-3" />
                          {getTimeAgo(news.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Awards */}
        <Card className="dark:bg-slate-800/60 dark:border-slate-700/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-slate-100">
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Recent Awards
              </CardTitle>
              <Link href="/admin/awards">
                <Button variant="ghost" size="sm" className="dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700">
                  View all <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentAwards.length === 0 ? (
              <p className="text-gray-500 dark:text-slate-500 text-center py-8">No awards yet</p>
            ) : (
              <div className="space-y-4">
                {recentAwards.map((award) => (
                  <div key={award.id} className="flex items-start gap-4 pb-4 border-b dark:border-slate-700/60 last:border-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-slate-100 line-clamp-1">{award.title}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colorMap.purple.badge} ${colorMap.purple.darkBadge}`}>
                          {award.year}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-500">
                          <Clock className="w-3 h-3" />
                          {getTimeAgo(award.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}