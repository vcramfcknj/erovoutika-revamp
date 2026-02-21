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
import NewsDialog from './news-dialog'
import { format } from 'date-fns'

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
  const [news, setNews] = useState<NewsItem[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
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

    // Filter by tab
    if (activeTab === 'published') {
      filtered = filtered.filter(item => item.is_published)
    } else {
      filtered = filtered.filter(item => !item.is_published && item.scheduled_date)
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
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

  const handleAdd = () => {
    setEditingNews(null)
    setDialogOpen(true)
  }

  const handleEdit = (item: NewsItem) => {
    setEditingNews(item)
    setDialogOpen(true)
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
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">News & Updates</h2>
          <p className="text-gray-600 mt-1">Manage your news articles and updates</p>
        </div>
        <Button onClick={handleAdd} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Add News
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Articles</p>
              <p className="text-2xl font-bold">{news.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold">{publishedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold">{scheduledCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold">{thisMonth}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by title or headline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48 h-11">
              <Filter className="w-4 h-4 mr-2" />
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
              className="h-11 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300"
            >
              Clear Filters
            </Button>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredNews.length} of {activeTab === 'published' ? publishedCount : scheduledCount} {activeTab} articles
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'published' | 'scheduled')}>
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="published" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Published ({publishedCount})
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
            <Clock className="w-4 h-4 mr-2" />
            Scheduled ({scheduledCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="published" className="mt-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {filteredNews.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No published articles found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'Try adjusting your search or filter'
                    : 'Published articles will appear here'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Published Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNews.map((item) => (
                    <TableRow key={item.id} className="hover:bg-green-50 transition-colors">
                      <TableCell className="font-medium max-w-md">
                        <div className="truncate">{item.title}</div>
                        <div className="text-xs text-gray-500 truncate">{item.excerpt}</div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {item.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="hover:bg-orange-50 hover:text-orange-600"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(item.id)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
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

        <TabsContent value="scheduled" className="mt-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {filteredNews.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No scheduled articles found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'Try adjusting your search or filter'
                    : 'Scheduled articles will appear here'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Scheduled For</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNews.map((item) => (
                    <TableRow key={item.id} className="hover:bg-orange-50 transition-colors">
                      <TableCell className="font-medium max-w-md">
                        <div className="truncate">{item.title}</div>
                        <div className="text-xs text-gray-500 truncate">{item.excerpt}</div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {item.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-orange-600">
                          <Clock className="w-4 h-4" />
                          <div className="text-sm">
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
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="hover:bg-orange-50 hover:text-orange-600"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(item.id)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
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

      <NewsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        news={editingNews}
        onSuccess={fetchNews}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this news article.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}