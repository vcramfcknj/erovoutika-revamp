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
  const [recentNews, setRecentNews] = useState<RecentNews[]>([])
  const [recentAwards, setRecentAwards] = useState<RecentAward[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch news stats
      const { data: newsData } = await supabase
        .from('news_updates')
        .select('*')
      
      const now = new Date()
      const newsThisMonth = newsData?.filter(item => {
        const createdDate = new Date(item.created_at)
        return createdDate.getMonth() === now.getMonth() && 
               createdDate.getFullYear() === now.getFullYear()
      }).length || 0

      // Fetch awards stats
      const { data: awardsData } = await supabase
        .from('awards')
        .select('*')
      
      const awardsThisMonth = awardsData?.filter(item => {
        const createdDate = new Date(item.created_at)
        return createdDate.getMonth() === now.getMonth() && 
               createdDate.getFullYear() === now.getFullYear()
      }).length || 0

      // Fetch partners stats
      const { data: partnersData } = await supabase
        .from('partners')
        .select('*')

      // Fetch messages stats
      const { data: messagesData } = await supabase
        .from('contact_messages')
        .select('*')

      // Fetch recent news
      const { data: recentNewsData } = await supabase
        .from('news_updates')
        .select('id, title, category, created_at')
        .order('created_at', { ascending: false })
        .limit(3)

      // Fetch recent awards
      const { data: recentAwardsData } = await supabase
        .from('awards')
        .select('id, title, year, created_at')
        .order('created_at', { ascending: false })
        .limit(3)

      setStats({
        totalNews: newsData?.length || 0,
        totalAwards: awardsData?.length || 0,
        totalPartners: partnersData?.length || 0,
        totalMessages: messagesData?.length || 0,
        newsThisMonth,
        awardsThisMonth,
      })

      setRecentNews(recentNewsData || [])
      setRecentAwards(recentAwardsData || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total News',
      value: stats.totalNews,
      change: stats.newsThisMonth,
      changeText: 'this month',
      icon: Newspaper,
      color: 'blue',
      href: '/admin/news'
    },
    {
      title: 'Total Awards',
      value: stats.totalAwards,
      change: stats.awardsThisMonth,
      changeText: 'this month',
      icon: Award,
      color: 'purple',
      href: '/admin/awards'
    },
    {
      title: 'Total Partners',
      value: stats.totalPartners,
      change: 0,
      changeText: 'active',
      icon: Users,
      color: 'green',
      href: '/admin/partners'
    },
    {
      title: 'Contact Messages',
      value: stats.totalMessages,
      change: 0,
      changeText: 'unread',
      icon: Mail,
      color: 'orange',
      href: '/admin/messages'
    },
  ]

  const quickActions = [
    {
      title: 'Manage News',
      description: 'Create and edit news articles',
      icon: Newspaper,
      href: '/admin/news',
      color: 'blue'
    },
    {
      title: 'Manage Awards',
      description: 'Add and update awards',
      icon: Award,
      href: '/admin/awards',
      color: 'purple'
    },
    {
      title: 'Manage Partners',
      description: 'Update partner information',
      icon: Users,
      href: '/admin/partners',
      color: 'green'
    },
    {
      title: 'View Messages',
      description: ' Form submissions',
      icon: Mail,
      href: '/admin/messages',
      color: 'orange'
    },
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; hover: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', hover: 'hover:bg-blue-100' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', hover: 'hover:bg-purple-100' },
      green: { bg: 'bg-green-50', text: 'text-green-600', hover: 'hover:bg-green-100' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', hover: 'hover:bg-orange-100' },
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-gray-600 mt-2">Welcome back! Here&apos;s what&apos;s happening with your site.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          const colors = getColorClasses(stat.color)
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1 text-sm ${colors.text}`}>
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500">{stat.changeText}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon
            const colors = getColorClasses(action.color)
            return (
              <Link key={action.title} href={action.href}>
                <Card className={`group cursor-pointer hover:shadow-lg transition-all border-2 border-gray-200 hover:border-${action.color}-300`}>
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${colors.bg} ${colors.hover} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <CardTitle className="text-lg group-hover:text-gray-900">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full justify-between group-hover:bg-gray-50">
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent News */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-blue-600" />
                Recent News
              </CardTitle>
              <Link href="/admin/news">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentNews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No news articles yet</p>
            ) : (
              <div className="space-y-4">
                {recentNews.map((news) => (
                  <div key={news.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 line-clamp-1">{news.title}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                          {news.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Recent Awards
              </CardTitle>
              <Link href="/admin/awards">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentAwards.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No awards yet</p>
            ) : (
              <div className="space-y-4">
                {recentAwards.map((award) => (
                  <div key={award.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 line-clamp-1">{award.title}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700">
                          {award.year}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
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