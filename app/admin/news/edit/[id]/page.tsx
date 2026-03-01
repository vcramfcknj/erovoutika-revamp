'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Upload, X, Link as LinkIcon, Send, Clock, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import RichTextEditor from '../../../../admin/RichTextEditor'  // ← adjust path as needed

const NEWS_CATEGORIES = [
  'Training & Workshops', 'Competition', 'Company News', 'Partnership',
  'Product Launch', 'Event', 'Achievement', 'Research & Development',
]

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [isLoading,        setIsLoading]        = useState(false)
  const [uploadingImage,   setUploadingImage]   = useState(false)
  const [imageFile,        setImageFile]        = useState<File | null>(null)
  const [imagePreview,     setImagePreview]     = useState('')
  const [scheduledDateTime, setScheduledDateTime] = useState('')
  const [errorMessage,     setErrorMessage]     = useState<string | null>(null)
  const [fetchingNews,     setFetchingNews]     = useState(true)
  const [formData, setFormData] = useState({
    title: '', excerpt: '', content: '', category: '',
    date: '', image_url: '', url: '', is_published: false,
  })

  useEffect(() => { fetchNews() }, [id])

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase.from('news_updates').select('*').eq('id', id).single()
      if (error) throw error
      setFormData({
        title:        data.title,
        excerpt:      data.excerpt,
        content:      data.content || '',
        category:     data.category,
        date:         data.date,
        image_url:    data.image_url || '',
        url:          data.url || '',
        is_published: data.is_published,
      })
      setImagePreview(data.image_url || '')
      if (data.scheduled_date) setScheduledDateTime(new Date(data.scheduled_date).toISOString().slice(0, 16))
    } catch {
      router.push('/admin/news')
    } finally {
      setFetchingNews(false)
    }
  }

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
    if (!publishNow && scheduledDateTime && !validateScheduledDate(scheduledDateTime)) return

    setIsLoading(true)
    try {
      let imageUrl = formData.image_url
      if (imageFile) { setUploadingImage(true); imageUrl = await uploadImage(imageFile); setUploadingImage(false) }

      const { error } = await supabase.from('news_updates').update({
        title:          formData.title.trim(),
        excerpt:        formData.excerpt.trim(),
        content:        formData.content?.trim() || null,  // ← HTML from Tiptap
        category:       formData.category,
        date:           formData.date,
        image_url:      imageUrl,
        url:            formData.url?.trim() || null,
        is_published:   publishNow,
        scheduled_date: (!publishNow && scheduledDateTime) ? new Date(scheduledDateTime).toISOString() : null,
        updated_at:     new Date().toISOString(),
      }).eq('id', id)

      if (error) throw error
      router.push('/admin/news')
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save article')
    } finally {
      setIsLoading(false)
      setUploadingImage(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrorMessage(null)
  }

  if (fetchingNews) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
          <div className="absolute inset-[5px] rounded-full border border-orange-500/10 border-b-orange-400 animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
          <div className="w-2 h-2 rounded-full bg-orange-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/admin/news')}
          className="text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">Edit Article</h1>
          <p className="text-xs text-gray-500 dark:text-slate-500 mt-0.5 font-mono">ID: {id}</p>
        </div>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="p-3 rounded border flex items-start gap-2 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-400">{errorMessage}</p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-3 gap-6">

        {/* ── Left: main content ── */}
        <div className="col-span-2 space-y-4">

          {/* Title */}
          <div className="p-5 rounded border bg-white dark:bg-[#0d1526] border-gray-200 dark:border-white/[0.07]">
            <Label htmlFor="title" className="text-sm font-semibold mb-2 block text-gray-700 dark:text-slate-300">Article Title *</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange}
              placeholder="Enter article title..." disabled={isLoading}
              className="text-base bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-slate-200" />
          </div>

          {/* Excerpt */}
          <div className="p-5 rounded border bg-white dark:bg-[#0d1526] border-gray-200 dark:border-white/[0.07]">
            <Label htmlFor="excerpt" className="text-sm font-semibold mb-2 block text-gray-700 dark:text-slate-300">Headline / Summary *</Label>
            <textarea
              id="excerpt" name="excerpt" rows={2}
              value={formData.excerpt} onChange={handleChange}
              placeholder="Brief summary displayed on cards..."
              disabled={isLoading}
              className="w-full rounded border px-3 py-2 text-sm resize-none
                bg-white dark:bg-white/[0.03]
                border-gray-200 dark:border-white/[0.08]
                text-gray-900 dark:text-slate-200
                placeholder:text-gray-400 dark:placeholder:text-slate-600
                focus:outline-none focus:ring-1 focus:ring-orange-400/40 focus:border-orange-400 dark:focus:border-orange-500/60"
            />
            <p className="text-xs text-gray-400 dark:text-slate-600 mt-1.5">Appears on the news card preview</p>
          </div>

          {/* ── Tiptap rich text editor ── */}
          <div className="p-5 rounded border bg-white dark:bg-[#0d1526] border-gray-200 dark:border-white/[0.07]">
            <Label className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-700 dark:text-slate-300">
              <FileText className="w-4 h-4" />
              Full Article Content
            </Label>
            <RichTextEditor
              value={formData.content}
              onChange={(html) => setFormData(f => ({ ...f, content: html }))}
              placeholder="Write the full article body here..."
              disabled={isLoading}
            />
            <p className="text-xs text-gray-400 dark:text-slate-600 mt-2">Shown when readers open the full article</p>
          </div>
        </div>

        {/* ── Right: metadata ── */}
        <div className="col-span-1 space-y-4">

          {/* Cover image */}
          <div className="p-5 rounded border bg-white dark:bg-[#0d1526] border-gray-200 dark:border-white/[0.07]">
            <Label className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-slate-300">
              <ImageIcon className="w-4 h-4" />
              Cover Image
            </Label>
            {imagePreview ? (
              <div className="relative w-full aspect-video rounded overflow-hidden group border border-gray-200 dark:border-white/[0.07]">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                <button type="button"
                  onClick={() => { setImageFile(null); setImagePreview(''); setFormData(f => ({ ...f, image_url: '' })) }}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded cursor-pointer transition-colors
                border-gray-300 dark:border-white/[0.1]
                bg-gray-50 dark:bg-white/[0.02]
                hover:bg-orange-50 dark:hover:bg-orange-500/[0.04]
                hover:border-orange-300 dark:hover:border-orange-500/40">
                <Upload className="w-7 h-7 text-gray-400 dark:text-slate-500 mb-2" />
                <p className="text-xs text-gray-500 dark:text-slate-500 text-center px-2">
                  <span className="font-semibold">Click to upload</span><br />PNG or JPG (max 5MB)
                </p>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} disabled={isLoading} />
              </label>
            )}
          </div>

          {/* Category */}
          <div className="p-5 rounded border bg-white dark:bg-[#0d1526] border-gray-200 dark:border-white/[0.07]">
            <Label className="text-sm font-semibold mb-3 block text-gray-700 dark:text-slate-300">Category *</Label>
            <Select value={formData.category} onValueChange={(v) => setFormData(f => ({ ...f, category: v }))} disabled={isLoading}>
              <SelectTrigger className="text-sm bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.08]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {NEWS_CATEGORIES.map(cat => <SelectItem key={cat} value={cat} className="text-sm">{cat}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="p-5 rounded border bg-white dark:bg-[#0d1526] border-gray-200 dark:border-white/[0.07]">
            <Label htmlFor="date" className="text-sm font-semibold mb-3 block text-gray-700 dark:text-slate-300">Article Date *</Label>
            <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange}
              disabled={isLoading}
              className="text-sm bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-slate-200" />
          </div>

          {/* Source URL */}
          <div className="p-5 rounded border bg-white dark:bg-[#0d1526] border-gray-200 dark:border-white/[0.07]">
            <Label htmlFor="url" className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-slate-300">
              <LinkIcon className="w-4 h-4" />
              Source URL
            </Label>
            <Input id="url" name="url" type="url" value={formData.url} onChange={handleChange}
              placeholder="https://..." disabled={isLoading}
              className="text-sm bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-slate-200" />
            <p className="text-xs text-gray-400 dark:text-slate-600 mt-1.5">Optional external link</p>
          </div>

          {/* Schedule */}
          <div className="p-5 rounded border bg-orange-50 dark:bg-orange-500/[0.05] border-orange-200 dark:border-orange-500/20">
            <Label htmlFor="scheduled_date" className="text-sm font-semibold mb-3 flex items-center gap-2 text-orange-900 dark:text-orange-400">
              <Clock className="w-4 h-4" />
              Schedule Publishing
            </Label>
            <Input id="scheduled_date" type="datetime-local"
              value={scheduledDateTime}
              onChange={(e) => { setScheduledDateTime(e.target.value); setErrorMessage(null) }}
              min={new Date(Date.now() + 5 * 60000).toISOString().slice(0, 16)}
              disabled={isLoading}
              className="text-sm border-orange-300 dark:border-orange-500/30 bg-white dark:bg-white/[0.03] text-gray-900 dark:text-slate-200" />
            <p className="text-xs text-orange-700 dark:text-orange-500/70 mt-1.5">Leave empty to publish immediately</p>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 -mx-6 px-6 py-4 flex justify-between items-center
        bg-white dark:bg-[#080d18]
        border-t border-gray-200 dark:border-white/[0.07]
        shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        <Button variant="outline" onClick={() => router.push('/admin/news')} disabled={isLoading}
          className="text-sm border-gray-200 dark:border-white/[0.08] text-gray-600 dark:text-slate-400">
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button type="button" onClick={() => handleSubmit(false)}
            disabled={isLoading || uploadingImage || !scheduledDateTime}
            className="text-sm bg-orange-500 hover:bg-orange-600 text-white border-orange-300 dark:border-orange-500/30">
            <Clock className="w-4 h-4 mr-1.5" />
            {uploadingImage ? 'Uploading...' : isLoading ? 'Saving...' : 'Schedule'}
          </Button>
          <Button type="button" onClick={() => handleSubmit(true)}
            disabled={isLoading || uploadingImage}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white">
            <Send className="w-4 h-4 mr-1.5" />
            {uploadingImage ? 'Uploading...' : isLoading ? 'Publishing...' : 'Update & Publish'}
          </Button>
        </div>
      </div>
    </div>
  )
}