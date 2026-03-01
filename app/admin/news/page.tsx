'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Plus, Pencil, Trash2, Newspaper, Search, Filter, 
  CheckCircle, Clock, TrendingUp
} from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs"
import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ── TYPES ───────────────────────────────────────────────────────────────────
type NewsItem = {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  image_url: string | null
  is_published: boolean
  scheduled_date: string | null
  created_at: string
}

// ── VISUAL COMPONENTS ───────────────────────────────────────────────────────

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

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function NewsManagement() {
  const router = useRouter()
  const [news, setNews] = useState<NewsItem[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'published' | 'scheduled'>('published')

  useEffect(() => { fetchNews() }, [])
  useEffect(() => { filterNews() }, [news, searchQuery, selectedCategory, activeTab])

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news_updates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      const newsData = data || []
      setNews(newsData)

      const uniqueCategories = Array.from(
        new Set(newsData.map(item => item.category).filter(Boolean))
      ) as string[]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterNews = () => {
    let filtered = [...news]
    if (activeTab === 'published') {
      filtered = filtered.filter(item => item.is_published)
    } else {
      filtered = filtered.filter(item => !item.is_published && item.scheduled_date)
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.excerpt.toLowerCase().includes(query)
      )
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }
    setFilteredNews(filtered)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const { error } = await supabase.from('news_updates').delete().eq('id', deleteId)
      if (error) throw error
      setNews(news.filter(item => item.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      alert('Failed to delete news article')
    }
  }

  const publishedCount = news.filter(n => n.is_published).length
  const scheduledCount = news.filter(n => !n.is_published && n.scheduled_date).length
  const thisMonthCount = news.filter(n => {
    const itemDate = new Date(n.created_at)
    const now = new Date()
    return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
  }).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
            <div className="w-2 h-2 rounded-full bg-orange-500" />
          </div>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-gray-400 dark:text-slate-500 animate-pulse">Accessing Archives...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* ── Page Header ── */}
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-gray-400 dark:text-slate-500 mb-2">System // Content_Module</p>
          <h1 className="text-2xl font-bold tracking-tight">News & Updates</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage editorial content and release schedules.</p>
        </div>
        <Link href="/admin/news/new">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-500 dark:hover:bg-orange-400 shadow-none rounded-none border border-orange-500/50 font-mono text-[11px] uppercase tracking-widest px-6 transition-all hover:-translate-y-0.5">
            <Plus className="w-3.5 h-3.5 mr-2" /> Initialize_Article
          </Button>
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard title="Total Volume" value={news.length} icon={Newspaper} accent="#3b82f6" />
        <DashboardStatCard title="Published" value={publishedCount} icon={CheckCircle} accent="#22c55e" />
        <DashboardStatCard title="Scheduled" value={scheduledCount} icon={Clock} accent="#f97316" />
        <DashboardStatCard title="Monthly_Index" value={thisMonthCount} icon={TrendingUp} accent="#a855f7" />
      </div>

      {/* ── Search & Filters ── */}
      <div className="relative p-5 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-white/[0.08] shadow-sm backdrop-blur-sm">
        <CardCorners color="rgba(150,150,150,0.1)" />
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4" />
            <Input
              placeholder="Query database for titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border-gray-200 dark:border-white/10 dark:bg-slate-950/50 rounded-none focus:ring-orange-500 font-mono text-xs"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48 h-10 rounded-none dark:border-white/10 dark:bg-slate-950/50 font-mono text-xs">
              <div className="flex items-center">
                <Filter className="w-3.5 h-3.5 mr-2 text-gray-400" />
                <SelectValue placeholder="Categories" />
              </div>
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-900 dark:border-white/10">
              <SelectItem value="all">All_Categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Main Content Tabs ── */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <div className="flex items-center gap-4 mb-5">
           <TabsList className="bg-gray-100 dark:bg-white/5 p-1 rounded-none border border-gray-200 dark:border-white/10">
            <TabsTrigger value="published" className="rounded-none font-mono text-[10px] uppercase tracking-wider px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400">
              Active_Stream
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="rounded-none font-mono text-[10px] uppercase tracking-wider px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400">
              Queue
            </TabsTrigger>
          </TabsList>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 dark:from-white/10 to-transparent" />
        </div>

        <TabsContent value="published" className="mt-0">
          <NewsTableUI data={filteredNews} type="published" onEdit={(id: string) => router.push(`/admin/news/edit/${id}`)} onDelete={setDeleteId} />
        </TabsContent>
        <TabsContent value="scheduled" className="mt-0">
          <NewsTableUI data={filteredNews} type="scheduled" onEdit={(id: string) => router.push(`/admin/news/edit/${id}`)} onDelete={setDeleteId} />
        </TabsContent>
      </Tabs>

      {/* ── Delete Confirmation ── */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-none border-2 border-red-500/20 dark:bg-slate-900 dark:border-red-900/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono uppercase text-sm tracking-widest">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-xs italic dark:text-slate-400">
              Warning: This action will purge the record from the central database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none font-mono text-[10px] uppercase">Abort</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 dark:bg-red-900 dark:hover:bg-red-800 rounded-none font-mono text-[10px] uppercase">
              Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ── REUSABLE SUB-COMPONENTS ──────────────────────────────────────────────────

function DashboardStatCard({ title, value, icon: Icon, accent }: any) {
  return (
    <div className="relative group p-5 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-white/[0.08] shadow-sm transition-all hover:-translate-y-0.5">
      <CardCorners color={`${accent}30`} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 flex items-center justify-center rounded-sm"
          style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
        <MiniSparkline color={accent} />
      </div>
      <div className="mb-3">
        <span className="text-4xl font-bold tabular-nums leading-none">{value}</span>
      </div>
      <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-gray-400 dark:text-slate-500">{title}</span>
    </div>
  )
}

function NewsTableUI({ data, type, onEdit, onDelete }: any) {
  if (data.length === 0) {
    return (
      <div className="bg-gray-50/50 dark:bg-white/[0.02] border border-dashed border-gray-200 dark:border-white/10 py-20 text-center">
        <p className="font-mono text-[10px] text-gray-400 dark:text-slate-600 uppercase tracking-widest">Null_Set: No records in {type} stream</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-white/[0.08] overflow-hidden relative">
      <CardCorners color="rgba(150,150,150,0.05)" />
      <Table>
        <TableHeader className="bg-gray-50/50 dark:bg-white/[0.02] border-b dark:border-white/5">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="font-mono text-[10px] uppercase tracking-wider h-10">Record_ID</TableHead>
            <TableHead className="font-mono text-[10px] uppercase tracking-wider h-10">Classification</TableHead>
            <TableHead className="font-mono text-[10px] uppercase tracking-wider h-10">{type === 'published' ? 'Timestamp' : 'Release_Gate'}</TableHead>
            <TableHead className="text-right font-mono text-[10px] uppercase tracking-wider h-10">Operation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item: NewsItem) => (
            <TableRow key={item.id} className="group border-b dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
              <TableCell>
                <div className="max-w-md">
                  <div className="font-bold truncate mb-0.5 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{item.title}</div>
                  <div className="text-[11px] text-gray-500 dark:text-slate-400 line-clamp-1 italic">{item.excerpt}</div>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-mono text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  {item.category}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
                  <Clock className="w-3 h-3 text-gray-400 dark:text-slate-600" />
                  {type === 'published' ? format(new Date(item.date), 'yyyy.MM.dd') : format(new Date(item.scheduled_date!), 'yyyy.MM.dd HH:mm')}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(item.id)} className="h-7 w-7 p-0 rounded-none dark:border-white/10 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(item.id)} className="h-7 w-7 p-0 rounded-none dark:border-white/10 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}