'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Pencil, Trash2, Newspaper, Search, Filter, Calendar, CheckCircle, Clock } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type NewsItem = {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  image_url: string | null
  url: string | undefined
  is_published: boolean
  scheduled_date: string | null
  created_at: string
}

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

  useEffect(() => {
    fetchNews()
  }, [])

  useEffect(() => {
    filterNews()
  }, [news, searchQuery, selectedCategory, activeTab])

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
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
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
      const { error } = await supabase
        .from('news_updates')
        .delete()
        .eq('id', deleteId)

      if (error) throw error
      setNews(news.filter(item => item.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      console.error('Error deleting news:', error)
      alert('Failed to delete news article')
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/news/edit/${id}`)
  }

  const publishedCount = news.filter(n => n.is_published).length
  const scheduledCount = news.filter(n => !n.is_published && n.scheduled_date).length
  const thisMonth = news.filter(n => {
    const itemDate = new Date(n.created_at)
    const now = new Date()
    return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
  }).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">News & Updates</h2>
          <p className="text-gray-600 text-sm mt-1">Manage news articles</p>
        </div>
<Link href="/admin/news/new">
  <Button className="bg-orange-600 hover:bg-orange-700 text-sm">
    <Plus className="w-4 h-4 mr-2" />
    Add News
  </Button>
</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total</p>
              <p className="text-xl font-bold">{news.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Published</p>
              <p className="text-xl font-bold">{publishedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Scheduled</p>
              <p className="text-xl font-bold">{scheduledCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">This Month</p>
              <p className="text-xl font-bold">{thisMonth}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-40 h-9 text-sm">
              <Filter className="w-3 h-3 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(searchQuery || selectedCategory !== 'all') && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="h-9 text-sm hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300"
            >
              Clear
            </Button>
          )}
        </div>
        <div className="mt-3 text-xs text-gray-600">
          {filteredNews.length} of {activeTab === 'published' ? publishedCount : scheduledCount} {activeTab}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'published' | 'scheduled')}>
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="published" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 text-sm">
            <CheckCircle className="w-3 h-3 mr-2" />
            Published ({publishedCount})
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 text-sm">
            <Clock className="w-3 h-3 mr-2" />
            Scheduled ({scheduledCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="published" className="mt-3">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {filteredNews.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-medium">No published articles</p>
                <p className="text-gray-400 text-xs mt-1">
                  {searchQuery || selectedCategory !== 'all' ? 'Try adjusting filters' : 'Published articles appear here'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Title</TableHead>
                    <TableHead className="text-xs">Category</TableHead>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-right text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNews.map((item) => (
                    <TableRow key={item.id} className="hover:bg-green-50 transition-colors">
                      <TableCell className="font-medium max-w-md text-sm">
                        <div className="truncate">{item.title}</div>
                        <div className="text-xs text-gray-500 truncate">{item.excerpt}</div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                          {item.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-gray-600">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item.id)}
                            className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600"
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(item.id)}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="mt-3">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {filteredNews.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-medium">No scheduled articles</p>
                <p className="text-gray-400 text-xs mt-1">
                  {searchQuery || selectedCategory !== 'all' ? 'Try adjusting filters' : 'Scheduled articles appear here'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Title</TableHead>
                    <TableHead className="text-xs">Category</TableHead>
                    <TableHead className="text-xs">Scheduled For</TableHead>
                    <TableHead className="text-right text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNews.map((item) => (
                    <TableRow key={item.id} className="hover:bg-orange-50 transition-colors">
                      <TableCell className="font-medium max-w-md text-sm">
                        <div className="truncate">{item.title}</div>
                        <div className="text-xs text-gray-500 truncate">{item.excerpt}</div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                          {item.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-orange-600">
                          <Clock className="w-3 h-3" />
                          <div className="text-xs">
                            <div className="font-medium">
                              {item.scheduled_date && format(new Date(item.scheduled_date), 'MMM dd, yyyy')}
                            </div>
                            <div className="text-xs text-orange-500">
                              {item.scheduled_date && format(new Date(item.scheduled_date), 'h:mm a')}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item.id)}
                            className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600"
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(item.id)}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">Delete Article?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-sm">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}