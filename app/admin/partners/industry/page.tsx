'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Pencil, Trash2, Building2, Search, Globe, ArrowLeft } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { PartnerDialog } from '../partner-dialog'
import Link from 'next/link'
import Image from 'next/image'

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

export default function IndustryPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPartners()
  }, [])

  useEffect(() => {
    filterPartners()
  }, [partners, searchQuery])

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('type', 'industry')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPartners(data || [])
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

  const handleAdd = () => {
    setEditingPartner(null)
    setDialogOpen(true)
  }

  const handleEdit = (item: Partner) => {
    setEditingPartner(item)
    setDialogOpen(true)
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
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/partners">
          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-slate-400">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Industry Partners</h2>
            <p className="text-gray-600 dark:text-slate-400 text-sm">Manage companies and organizations</p>
          </div>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Industry Partner
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search industry partners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm dark:bg-slate-900 dark:border-slate-600"
            />
          </div>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={() => setSearchQuery('')}
              className="h-9 text-sm hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 hover:border-blue-300 dark:border-slate-600"
            >
              Clear
            </Button>
          )}
        </div>
        <div className="mt-3 text-xs text-gray-600 dark:text-slate-400">
          Showing {filteredPartners.length} of {partners.length} industry partners
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
        {filteredPartners.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">
              {searchQuery ? 'No industry partners found matching your search' : 'No industry partners yet'}
            </p>
            <p className="text-gray-400 dark:text-slate-500 text-xs mt-1">
              {searchQuery ? 'Try adjusting your search' : 'Add your first industry partner to get started'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="dark:border-slate-700">
                <TableHead className="text-xs dark:text-slate-400">Logo</TableHead>
                <TableHead className="text-xs dark:text-slate-400">Name</TableHead>
                <TableHead className="text-xs dark:text-slate-400">Website</TableHead>
                <TableHead className="text-xs dark:text-slate-400">Description</TableHead>
                <TableHead className="text-xs text-right dark:text-slate-400 w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((item) => (
                <TableRow key={item.id} className="hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors dark:border-slate-700">
                  <TableCell>
                    {item.image_url ? (
                      <div className="relative w-12 h-12">
                        <Image src={item.image_url} alt={item.name} fill className="object-contain rounded" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-sm dark:text-slate-200">{item.name}</TableCell>
                  <TableCell>
                    {item.website_url ? (
                      <a
                        href={item.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-xs flex items-center gap-1"
                      >
                        <Globe className="w-3 h-3" />
                        Visit
                      </a>
                    ) : (
                      <span className="text-gray-400 dark:text-slate-600 text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-500 dark:text-slate-400 text-xs max-w-md truncate">
                    {item.description || '—'}
                  </TableCell>
                  <TableCell className="text-right w-24">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(item.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400"
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
        onOpenChange={() => {
          setDialogOpen(false)
          setEditingPartner(null)
        }}
        partner={editingPartner}
        onSuccess={fetchPartners}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="dark:bg-slate-800 dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base dark:text-slate-100">Delete Industry Partner?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm dark:text-slate-400">
              This action cannot be undone. This will permanently delete this partner.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-sm dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-sm">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}