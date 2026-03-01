'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X, Link as LinkIcon, Send, Clock, AlertCircle, FileText } from 'lucide-react'
import Image from 'next/image'
import RichTextEditor from '@/app/admin/RichTextEditor'  // ← adjust path as needed

type NewsItem = {
  id?: string
  title: string
  excerpt: string
  content?: string | null
  category: string
  date: string
  image_url: string | null
  url?: string
  is_published?: boolean
  scheduled_date?: string | null
}

type NewsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  news: NewsItem | null
  onSuccess: () => void
}

const NEWS_CATEGORIES = [
  'Training & Workshops', 'Competition', 'Company News', 'Partnership',
  'Product Launch', 'Event', 'Achievement', 'Research & Development',
]

function NewsDialog({ open, onOpenChange, news, onSuccess }: NewsDialogProps) {
  const [isLoading,        setIsLoading]        = useState(false)
  const [uploadingImage,   setUploadingImage]   = useState(false)
  const [imageFile,        setImageFile]        = useState<File | null>(null)
  const [imagePreview,     setImagePreview]     = useState<string>('')
  const [scheduledDateTime, setScheduledDateTime] = useState('')
  const [errorMessage,     setErrorMessage]     = useState<string | null>(null)
  const [formData, setFormData] = useState<NewsItem>({
    title: '', excerpt: '', content: '', category: '',
    date: new Date().toISOString().split('T')[0],
    image_url: '', url: '', is_published: false, scheduled_date: null,
  })

  useEffect(() => {
    if (news) {
      setFormData({
        title:         news.title,
        excerpt:       news.excerpt,
        content:       news.content ?? '',
        category:      news.category,
        date:          news.date,
        image_url:     news.image_url || '',
        url:           news.url || '',
        is_published:  news.is_published || false,
        scheduled_date: news.scheduled_date || null,
      })
      setImagePreview(news.image_url || '')
      setScheduledDateTime(news.scheduled_date
        ? new Date(news.scheduled_date).toISOString().slice(0, 16)
        : '')
    } else {
      setFormData({
        title: '', excerpt: '', content: '', category: '',
        date: new Date().toISOString().split('T')[0],
        image_url: '', url: '', is_published: false, scheduled_date: null,
      })
      setImagePreview('')
      setScheduledDateTime('')
    }
    setImageFile(null)
    setErrorMessage(null)
  }, [news, open])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setErrorMessage('Image must be less than 5MB'); return }
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
    setErrorMessage(null)
  }

  const uploadImage = async (file: File): Promise<string> => {
    const ext      = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('news-images').upload(fileName, file)
    if (error) throw error
    return supabase.storage.from('news-images').getPublicUrl(fileName).data.publicUrl
  }

  const validateScheduledDate = (dt: string): boolean => {
    const scheduled = new Date(dt)
    const now       = new Date()
    if (scheduled <= now) { setErrorMessage('Scheduled date must be in the future'); return false }
    if (scheduled < new Date(now.getTime() + 5 * 60000)) { setErrorMessage('Must be at least 5 minutes from now'); return false }
    return true
  }

  const handleSubmit = async (publishNow: boolean) => {
    setErrorMessage(null)
    if (!formData.title.trim())   { setErrorMessage('Title is required');    return }
    if (!formData.excerpt.trim()) { setErrorMessage('Headline is required'); return }
    if (!formData.category)       { setErrorMessage('Category is required'); return }
    if (!formData.date)           { setErrorMessage('Date is required');     return }
    if (!publishNow) {
      if (!scheduledDateTime)                           { setErrorMessage('Select a scheduled time or use Publish Now'); return }
      if (!validateScheduledDate(scheduledDateTime))    return
    }

    setIsLoading(true)
    try {
      let imageUrl = formData.image_url as string
      if (imageFile) { setUploadingImage(true); imageUrl = await uploadImage(imageFile); setUploadingImage(false) }

      const payload = {
        title:          formData.title.trim(),
        excerpt:        formData.excerpt.trim(),
        content:        formData.content?.trim() || null,  // ← HTML string from Tiptap
        category:       formData.category,
        date:           formData.date,
        image_url:      imageUrl,
        url:            formData.url?.trim() || null,
        is_published:   publishNow,
        scheduled_date: (!publishNow && scheduledDateTime) ? new Date(scheduledDateTime).toISOString() : null,
      }

      if (news?.id) {
        const { error } = await supabase.from('news_updates').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', news.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('news_updates').insert([payload])
        if (error) throw error
      }

      onSuccess()
      onOpenChange(false)
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save article')
    } finally {
      setIsLoading(false)
      setUploadingImage(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrorMessage(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full p-0 gap-0 overflow-hidden bg-white dark:bg-[#0a1020] border border-gray-200 dark:border-white/[0.08]">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-white/[0.07]">
          <DialogTitle className="text-gray-900 dark:text-slate-100">
            {news ? 'Edit News Article' : 'Add News Article'}
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-slate-500 text-sm">
            {news ? 'Update the article details below.' : 'Fill in the details to create a new article.'}
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/20 rounded flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{errorMessage}</p>
          </div>
        )}

        <div className="px-6 py-4 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto">

          {/* Image + Title/URL row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-gray-700 dark:text-slate-300">Cover Image</Label>
              {imagePreview ? (
                <div className="relative w-full h-32 rounded overflow-hidden group border border-gray-200 dark:border-white/[0.07]">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); setFormData(f => ({ ...f, image_url: '' })) }}
                    className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded cursor-pointer
                  border-gray-300 dark:border-white/[0.1]
                  bg-gray-50 dark:bg-white/[0.02]
                  hover:bg-orange-50 dark:hover:bg-orange-500/[0.04]
                  hover:border-orange-300 dark:hover:border-orange-500/40
                  transition-colors">
                  <Upload className="w-5 h-5 text-gray-400 dark:text-slate-500 mb-1" />
                  <p className="text-xs text-gray-500 dark:text-slate-500 text-center">
                    <span className="font-semibold">Click to upload</span><br />PNG, JPG · max 5MB
                  </p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} disabled={isLoading} />
                </label>
              )}
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="d-title" className="text-sm text-gray-700 dark:text-slate-300">Title *</Label>
                <Input id="d-title" name="title" value={formData.title} onChange={handleChange}
                  placeholder="Article title" disabled={isLoading}
                  className="h-9 text-sm bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-slate-200" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="d-url" className="text-sm text-gray-700 dark:text-slate-300">Source URL</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <Input id="d-url" name="url" type="url" value={formData.url} onChange={handleChange}
                    placeholder="https://..." disabled={isLoading}
                    className="pl-8 h-9 text-sm bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-slate-200" />
                </div>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-1.5">
            <Label htmlFor="d-excerpt" className="text-sm text-gray-700 dark:text-slate-300">Headline / Summary *</Label>
            <textarea
              id="d-excerpt" name="excerpt" rows={2}
              value={formData.excerpt}
              onChange={(e) => { setFormData(f => ({ ...f, excerpt: e.target.value })); setErrorMessage(null) }}
              placeholder="Brief summary shown on cards..."
              disabled={isLoading}
              className="w-full rounded border px-3 py-2 text-sm resize-none
                bg-white dark:bg-white/[0.03]
                border-gray-200 dark:border-white/[0.08]
                text-gray-900 dark:text-slate-200
                placeholder:text-gray-400 dark:placeholder:text-slate-600
                focus:outline-none focus:ring-1 focus:ring-orange-400/40 focus:border-orange-400 dark:focus:border-orange-500/60"
            />
          </div>

          {/* ── Tiptap rich text editor ── */}
          <div className="space-y-1.5">
            <Label className="text-sm text-gray-700 dark:text-slate-300 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              Full Article Content
              <span className="text-xs font-normal text-gray-400 dark:text-slate-600">— shown when readers open the article</span>
            </Label>
            <RichTextEditor
              value={formData.content ?? ''}
              onChange={(html) => setFormData(f => ({ ...f, content: html }))}
              placeholder="Write the full article body here..."
              disabled={isLoading}
            />
          </div>

          {/* Category + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-gray-700 dark:text-slate-300">Category *</Label>
              <Select value={formData.category} onValueChange={(v) => { setFormData(f => ({ ...f, category: v })); setErrorMessage(null) }} disabled={isLoading}>
                <SelectTrigger className="h-9 text-sm bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.08]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {NEWS_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="d-date" className="text-sm text-gray-700 dark:text-slate-300">Article Date *</Label>
              <Input id="d-date" name="date" type="date" value={formData.date} onChange={handleChange}
                disabled={isLoading}
                className="h-9 text-sm bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-slate-200" />
            </div>
          </div>

          {/* Schedule */}
          <div className="p-3 rounded border
            bg-orange-50 dark:bg-orange-500/[0.05]
            border-orange-200 dark:border-orange-500/20">
            <Label htmlFor="d-schedule" className="text-sm font-medium flex items-center gap-2 mb-2 text-orange-900 dark:text-orange-400">
              <Clock className="w-3.5 h-3.5" />
              Schedule Publishing (Optional)
            </Label>
            <Input id="d-schedule" type="datetime-local"
              value={scheduledDateTime}
              onChange={(e) => { setScheduledDateTime(e.target.value); setErrorMessage(null) }}
              min={new Date(Date.now() + 5 * 60000).toISOString().slice(0, 16)}
              disabled={isLoading}
              className="h-9 text-sm border-orange-300 dark:border-orange-500/30 bg-white dark:bg-white/[0.03] text-gray-900 dark:text-slate-200" />
            <p className="text-xs text-orange-700 dark:text-orange-500/80 mt-1.5">Leave empty to publish immediately</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-white/[0.07] bg-gray-50 dark:bg-white/[0.02]">
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={isLoading}
            className="border-gray-200 dark:border-white/[0.08] text-gray-600 dark:text-slate-400">
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={() => handleSubmit(false)}
              disabled={isLoading || uploadingImage || !scheduledDateTime}
              className="bg-orange-500 hover:bg-orange-600 text-white">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              {isLoading ? 'Saving...' : 'Schedule'}
            </Button>
            <Button type="button" size="sm" onClick={() => handleSubmit(true)}
              disabled={isLoading || uploadingImage}
              className="bg-blue-600 hover:bg-blue-700 text-white">
              <Send className="w-3.5 h-3.5 mr-1.5" />
              {uploadingImage ? 'Uploading...' : isLoading ? 'Publishing...' : 'Publish Now'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NewsDialog