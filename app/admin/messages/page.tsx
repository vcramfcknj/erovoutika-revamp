'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Search, Trash2, Eye, EyeOff, Clock, User, Terminal, Inbox, ShieldAlert } from 'lucide-react'
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

type Message = {
  id: string
  name: string
  email: string
  message: string
  is_read: boolean
  created_at: string
}

// ── Mechanical corner brackets ────────────────────────────────────────────────
function CardCorners({ color = 'rgba(245,158,11,0.2)' }: { color?: string }) {
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

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRead, setFilterRead] = useState<'all' | 'read' | 'unread'>('all')

  useEffect(() => { fetchMessages() }, [])
  useEffect(() => { filterMessages() }, [messages, searchQuery, filterRead])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterMessages = () => {
    let filtered = [...messages]
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (filterRead !== 'all') {
      filtered = filtered.filter(item => filterRead === 'read' ? item.is_read : !item.is_read)
    }
    setFilteredMessages(filtered)
  }

  const handleMarkRead = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('contact_messages').update({ is_read: !currentStatus }).eq('id', id)
      if (error) throw error
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: !currentStatus } : m))
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  const handleExpand = async (message: Message) => {
    if (expandedId === message.id) {
      setExpandedId(null)
      return
    }
    setExpandedId(message.id)
    if (!message.is_read) await handleMarkRead(message.id, false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', deleteId)
      if (error) throw error
      setMessages(messages.filter(m => m.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000)
    if (seconds < 60) return 'JUST_NOW'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}M_AGO`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}H_AGO`
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-white/[0.07] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-[9px] tracking-[0.3em] uppercase text-amber-500">
            <Terminal className="w-3 h-3" />
            <span>Root://Comm_Link/Inbound</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
            Inbound Messages
            {messages.filter(m => !m.is_read).length > 0 && (
              <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-amber-500 text-black animate-pulse">
                {messages.filter(m => !m.is_read).length} NEW_PACKETS
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* ── Telemetry Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        {[
          { label: 'TOTAL_TRAFFIC', val: messages.length, icon: Inbox, color: 'text-blue-500' },
          { label: 'UNREAD_FLAGS', val: messages.filter(m => !m.is_read).length, icon: ShieldAlert, color: 'text-amber-500' },
          { label: 'ARCHIVED', val: messages.filter(m => m.is_read).length, icon: Eye, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="relative bg-white dark:bg-[#0d1526] border border-gray-200 dark:border-white/[0.07] p-4 group overflow-hidden">
            <CardCorners color="rgba(255,255,255,0.05)" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold dark:text-white">{stat.val}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color} opacity-20 group-hover:opacity-40 transition-opacity`} />
            </div>
            <div className="absolute bottom-0 left-0 h-[1px] bg-current opacity-20 w-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </div>
        ))}
      </div>

      {/* ── Filter Module ── */}
      <div className="relative bg-white dark:bg-[#0d1526] border border-gray-200 dark:border-white/[0.07] p-4">
        <CardCorners />
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search data packets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-transparent border-gray-200 dark:border-white/[0.05] font-mono text-xs"
            />
          </div>
          <div className="flex bg-gray-100 dark:bg-white/[0.03] p-1 rounded-md border border-gray-200 dark:border-white/[0.05]">
            {(['all', 'unread', 'read'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterRead(f)}
                className={`px-4 py-1.5 rounded text-[10px] font-mono uppercase tracking-tighter transition-all ${
                  filterRead === f ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-500 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Packet List ── */}
      <div className="space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-[#0d1526] border border-dashed border-gray-200 dark:border-white/[0.07] rounded-lg">
            <Terminal className="w-8 h-8 text-gray-600 mx-auto mb-2 opacity-20" />
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Buffer_Empty: No messages detected</p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`relative group bg-white dark:bg-[#0d1526] border transition-all duration-300 ${
                !msg.is_read ? 'border-amber-500/40 shadow-[0_0_15px_-5px_rgba(245,158,11,0.2)]' : 'border-gray-200 dark:border-white/[0.05]'
              }`}
            >
              <div 
                className="flex flex-col md:flex-row md:items-center justify-between p-4 cursor-pointer hover:bg-amber-500/[0.02]"
                onClick={() => handleExpand(msg)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                    !msg.is_read ? 'bg-amber-500/10 border-amber-500/30' : 'bg-gray-100 dark:bg-white/[0.02] border-transparent'
                  }`}>
                    <User className={`w-4 h-4 ${!msg.is_read ? 'text-amber-500' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm dark:text-white uppercase tracking-tight">{msg.name}</span>
                      {!msg.is_read && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />}
                    </div>
                    <span className="font-mono text-[10px] text-gray-500">{msg.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-3 md:mt-0">
                   <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px] italic font-serif">
                     {msg.message}
                   </p>
                   <div className="flex flex-col items-end shrink-0">
                      <span className="font-mono text-[9px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {getTimeAgo(msg.created_at)}
                      </span>
                   </div>
                </div>
              </div>

              {expandedId === msg.id && (
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-white/[0.05] animate-in slide-in-from-top-2">
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/[0.03] rounded font-mono text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                    <div className="mb-2 text-[10px] text-amber-500/50 uppercase tracking-widest border-b border-amber-500/10 pb-1 flex justify-between">
                      <span>Decrypted_Payload:</span>
                      <span>CID: {msg.id.slice(0,8).toUpperCase()}</span>
                    </div>
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                    <span className="text-[9px] font-mono text-gray-500 uppercase">Timestamp: {new Date(msg.created_at).toLocaleString()}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleMarkRead(msg.id, msg.is_read)}
                              className="h-8 px-3 font-mono text-[10px] uppercase border-gray-200 dark:border-white/[0.1] hover:text-amber-500">
                        {msg.is_read ? <EyeOff className="w-3 h-3 mr-2" /> : <Eye className="w-3 h-3 mr-2" />}
                        {msg.is_read ? 'Flag_Unread' : 'Mark_As_Seen'}
                      </Button>
                      <a href={`mailto:${msg.email}`}>
                        <Button variant="outline" size="sm" className="h-8 px-3 font-mono text-[10px] uppercase border-gray-200 dark:border-white/[0.1] hover:text-blue-500">
                          <Mail className="w-3 h-3 mr-2" /> Outbound_Reply
                        </Button>
                      </a>
                      <Button variant="outline" size="sm" onClick={() => setDeleteId(msg.id)}
                              className="h-8 px-3 font-mono text-[10px] uppercase border-gray-200 dark:border-white/[0.1] hover:bg-red-500/10 hover:text-red-500">
                        <Trash2 className="w-3 h-3 mr-2" /> Purge
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ── Purge Dialog ── */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="dark:bg-[#0d1526] dark:border-white/[0.07]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono uppercase text-red-500 text-sm tracking-widest">Confirm_Purge?</AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-[11px]">
              This data packet will be permanently deleted from the communication buffer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono text-[10px] uppercase">Abort</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 font-mono text-[10px] uppercase tracking-widest">
              Execute_Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}