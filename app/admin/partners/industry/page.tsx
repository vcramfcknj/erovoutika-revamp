'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Pencil, Trash2, Building2, Search, Globe, ArrowLeft, Terminal, Filter } from 'lucide-react'
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

function CardCorners({ color = 'rgba(59,130,246,0.3)' }: { color?: string }) {
  const base: React.CSSProperties = {
    position: 'absolute', width: 8, height: 8,
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

export default function IndustryPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => { fetchPartners() }, [])
  useEffect(() => { filterPartners() }, [partners, searchQuery])

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
      const { error } = await supabase.from('partners').delete().eq('id', deleteId)
      if (error) throw error
      setPartners(partners.filter(item => item.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 font-mono text-blue-500 animate-pulse">
        SYNCING_INDUSTRY_STREAM...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb/Back ── */}
      <div className="flex items-center gap-2 mb-2">
        <Link href="/admin/partners" className="group flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 hover:text-blue-500 transition-colors">
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to Overview
        </Link>
      </div>

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-white/[0.07] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-[9px] tracking-[0.3em] uppercase text-blue-500">
            <Terminal className="w-3 h-3" />
            <span>Root://Directory/Industry</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
            Industry Partners
            <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase">
              {partners.length} Nodes
            </span>
          </h1>
        </div>
        <Button 
          onClick={() => { setEditingPartner(null); setDialogOpen(true); }} 
          className="bg-blue-600 hover:bg-transparent text-white hover:text-blue-500 border border-blue-600 font-mono text-[10px] uppercase tracking-[0.2em] h-10 px-6 transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Industry Partner
        </Button>
      </div>

      {/* ── Filter Bar ── */}
      <div className="relative bg-white dark:bg-[#0d1526] border border-gray-200 dark:border-white/[0.07] p-4">
        <CardCorners color="rgba(59,130,246,0.2)" />
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:flex-1 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              placeholder="Search clusters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-transparent border-gray-200 dark:border-white/[0.05] font-mono text-xs"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
             {searchQuery && (
               <Button 
                 variant="outline" 
                 onClick={() => setSearchQuery('')} 
                 className="h-10 font-mono text-[10px] uppercase border-gray-200 dark:border-white/[0.05] hover:text-red-500 transition-all"
               >
                 Reset_Filter
               </Button>
             )}
             <div className="h-10 px-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-400 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.05]">
                <Filter className="w-3 h-3" />
                <span>{filteredPartners.length} Records</span>
             </div>
          </div>
        </div>
      </div>

      {/* ── Records Table ── */}
      <div className="relative bg-white dark:bg-[#0d1526] border border-gray-200 dark:border-white/[0.07] overflow-hidden">
        <CardCorners color="rgba(59,130,246,0.1)" />
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-white/[0.02]">
            <TableRow className="border-b border-gray-200 dark:border-white/[0.07] hover:bg-transparent">
              <TableHead className="font-mono text-[10px] tracking-widest uppercase py-4 w-20">Identity</TableHead>
              <TableHead className="font-mono text-[10px] tracking-widest uppercase py-4">Entity_Name</TableHead>
              <TableHead className="font-mono text-[10px] tracking-widest uppercase py-4">Domain</TableHead>
              <TableHead className="font-mono text-[10px] tracking-widest uppercase py-4 hidden md:table-cell">Metadata</TableHead>
              <TableHead className="font-mono text-[10px] tracking-widest uppercase py-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPartners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-2 opacity-20">
                    <Terminal className="w-8 h-8" />
                    <p className="font-mono text-[10px] uppercase tracking-widest">No matching nodes found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredPartners.map((item) => (
                <TableRow key={item.id} className="group border-b border-gray-100 dark:border-white/[0.03] hover:bg-blue-500/[0.02] transition-colors">
                  <TableCell>
                    <div className="relative w-10 h-10 rounded border border-gray-100 dark:border-white/[0.05] overflow-hidden bg-white flex items-center justify-center transition-colors group-hover:border-blue-500/30">
                      {item.image_url ? (
                        <Image src={item.image_url} alt={item.name} fill className="object-contain p-1" />
                      ) : (
                        <Building2 className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-gray-900 dark:text-slate-200 uppercase tracking-tight">{item.name}</span>
                      <span className="text-[9px] font-mono text-gray-400 uppercase tracking-tighter">{item.category || 'Standard_Node'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.website_url && (
                      <a href={item.website_url} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center gap-1.5 text-[10px] text-blue-500 font-mono uppercase tracking-tighter hover:underline">
                        <Globe className="w-3 h-3" /> Visit_URL
                      </a>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs hidden md:table-cell">
                    <p className="text-[11px] text-gray-500 dark:text-slate-500 line-clamp-1 italic font-serif">
                      {item.description ? `"${item.description}"` : 'No metadata.'}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => { setEditingPartner(item); setDialogOpen(true); }}
                        className="h-8 w-8 p-0 border-gray-200 dark:border-white/[0.05] hover:border-blue-500/50 hover:text-blue-500 transition-all"
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setDeleteId(item.id)}
                        className="h-8 w-8 p-0 border-gray-200 dark:border-white/[0.05] hover:border-red-500/50 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PartnerDialog
        open={dialogOpen}
        onOpenChange={(open) => { if (!open) { setDialogOpen(false); setEditingPartner(null); } }}
        partner={editingPartner}
        onSuccess={fetchPartners}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="dark:bg-[#0d1526] dark:border-white/[0.07] border-red-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono text-sm tracking-widest uppercase text-red-500">Purge Record?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed font-mono">
              The partner profile will be permanently removed from the directory. This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="font-mono text-[10px] uppercase dark:bg-transparent dark:border-white/[0.05]">Abort</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-600 hover:bg-red-700 text-[10px] uppercase font-mono tracking-widest"
            >
              Execute_Purge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}