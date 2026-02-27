'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Pencil, Trash2, Building2, GraduationCap, Search, Filter, Globe } from 'lucide-react'
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
import { PartnerDialog } from './partner-dialog'

type Partner = {
  id: string
  name: string
  description: string | null
  website_url: string | null
  image_url: string | null
  category: string | null
  type: 'industry' | 'academe'
  created_at: string
}

export default function PartnersManagement() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchPartners()
  }, [])

  useEffect(() => {
    filterPartners()
  }, [partners, searchQuery, selectedCategory, selectedType])

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const partnersData = data || []
      setPartners(partnersData)

      const uniqueCategories = Array.from(
        new Set(partnersData.map(item => item.category).filter(Boolean))
      ) as string[]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error fetching partners:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterPartners = () => {
    let filtered = [...partners]

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType)
    }

    setFilteredPartners(filtered)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', deleteId)

      if (error) throw error
      setPartners(partners.filter(item => item.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      console.error('Error deleting partner:', error)
      alert('Failed to delete partner')
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedType('all')
  }

  const handleAdd = () => {
    setEditingPartner(null)
    setDialogOpen(true)
  }

  const handleEdit = (item: Partner) => {
    setEditingPartner(item)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingPartner(null)
  }

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
          <h2 className="text-2xl font-bold text-gray-900">Partners</h2>
          <p className="text-gray-600 text-sm mt-1">Manage partners and collaborators</p>
        </div>
        <Button onClick={handleAdd} className="bg-orange-600 hover:bg-orange-700 text-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search partners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-36 h-9 text-sm">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="industry">Industry</SelectItem>
              <SelectItem value="academe">Academe</SelectItem>
            </SelectContent>
          </Select>

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

          {(searchQuery || selectedCategory !== 'all' || selectedType !== 'all') && (
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
          {filteredPartners.length} of {partners.length} partners
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredPartners.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">
              {searchQuery || selectedCategory !== 'all' || selectedType !== 'all'
                ? 'No partners found.'
                : 'No partners yet.'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Category</TableHead>
                <TableHead className="text-xs">Website</TableHead>
                <TableHead className="text-xs">Description</TableHead>
                <TableHead className="text-right text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((item) => (
                <TableRow key={item.id} className="hover:bg-orange-50 transition-colors">
                  <TableCell className="font-medium text-sm">{item.name}</TableCell>
                  <TableCell>
                    {item.type === 'academe' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        Academe
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                        <Building2 className="w-3 h-3 mr-1" />
                        Industry
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.category ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-orange-50 text-orange-700">
                        {item.category}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.website_url ? (
                      <a href={item.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-orange-600 transition-colors text-xs flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Visit
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-500 text-xs max-w-xs truncate">
                    {item.description || '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
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

      <PartnerDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        partner={editingPartner}
        onSuccess={fetchPartners}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">Delete Partner?</AlertDialogTitle>
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