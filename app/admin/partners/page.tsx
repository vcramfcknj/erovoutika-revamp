'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Plus, Building2, GraduationCap, Users, TrendingUp, ArrowRight, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { PartnerDialog } from './partner-dialog'

type Partner = {
  id: string
  name: string
  type: 'industry' | 'academe'
  created_at: string
}

export default function PartnersOverview() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('id, name, type, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPartners(data || [])
    } catch (error) {
      console.error('Error fetching partners:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const industryCount = partners.filter(p => p.type === 'industry').length
  const academeCount = partners.filter(p => p.type === 'academe').length

  const now = new Date()
  const thisMonth = partners.filter(p => {
    const date = new Date(p.created_at)
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Partners</h2>
          <p className="text-gray-600 dark:text-slate-400 text-sm mt-1">Manage partners and collaborators</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all dark:bg-slate-800/60 dark:border-slate-700/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-slate-400">
              Total Partners
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-slate-100">{partners.length}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-4 h-4" />
                {thisMonth}
              </span>
              <span className="text-sm text-gray-500 dark:text-slate-500">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all dark:bg-slate-800/60 dark:border-slate-700/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-slate-400">
              Industry Partners
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-slate-100">{industryCount}</div>
            <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">Companies & Organizations</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all dark:bg-slate-800/60 dark:border-slate-700/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-slate-400">
              Academe Partners
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-slate-100">{academeCount}</div>
            <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">Educational Institutions</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all dark:bg-slate-800/60 dark:border-slate-700/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-slate-400">
              Active Partnerships
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-slate-100">{partners.length}</div>
            <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">Current collaborations</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/partners/industry">
            <Card className="group cursor-pointer hover:shadow-lg transition-all border-2 border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 dark:bg-slate-800/60">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg text-gray-900 dark:text-slate-100">Manage Industry Partners</CardTitle>
                <p className="text-sm text-gray-500 dark:text-slate-400">View and manage companies and organizations</p>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-slate-300 text-sm">
                  View All Industry
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/partners/academe">
            <Card className="group cursor-pointer hover:shadow-lg transition-all border-2 border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 dark:bg-slate-800/60">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-950/30 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg text-gray-900 dark:text-slate-100">Manage Academe Partners</CardTitle>
                <p className="text-sm text-gray-500 dark:text-slate-400">View and manage educational institutions</p>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-slate-300 text-sm">
                  View All Academe
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <PartnerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        partner={null}
        onSuccess={fetchPartners}
      />
    </div>
  )
}