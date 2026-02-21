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
import { Textarea } from '@/components/ui/textarea'
import { Upload, X, Link as LinkIcon, Send, Clock, AlertCircle, FileText } from 'lucide-react'
import Image from 'next/image'
import { NewsItem } from '@/types/news';

type NewsItem = {
  id?: string
  title: string
  excerpt: string
  content?: string | null   // ← Main Article body
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
  'Training & Workshops',
  'Competition',
  'Company News',
  'Partnership',
  'Product Launch',
  'Event',
  'Achievement',
  'Research & Development'
]

function NewsDialog({ open, onOpenChange, news, onSuccess }: NewsDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [scheduledDateTime, setScheduledDateTime] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState<NewsItem>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    image_url: '',
    url: '',
    is_published: false,
    scheduled_date: null,
  })

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title,
        excerpt: news.excerpt,
        content: news.content ?? '',
        category: news.category,
        date: news.date,
        image_url: news.image_url || '',
        url: news.url || '',
        is_published: news.is_published || false,
        scheduled_date: news.scheduled_date || null,
      })
      setImagePreview(news.image_url || '')
      if (news.scheduled_date) {
        setScheduledDateTime(new Date(news.scheduled_date).toISOString().slice(0, 16))
      } else {
        setScheduledDateTime('')
      }
    } else {
      const today = new Date().toISOString().split('T')[0]
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        date: today,
        image_url: '',
        url: '',
        is_published: false,
        scheduled_date: null,
      })
      setImagePreview('')
      setScheduledDateTime('')
    }
    setImageFile(null)
    setErrorMessage(null)
  }, [news, open])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image file size must be less than 5MB. Please choose a smaller image.')
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
      setErrorMessage(null)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from('news-images').upload(fileName, file)
    if (uploadError) throw uploadError
    const { data } = supabase.storage.from('news-images').getPublicUrl(fileName)
    return data.publicUrl
  }

  const validateScheduledDate = (dateTime: string): boolean => {
    const scheduledDate = new Date(dateTime)
    const now = new Date()
    const minimumDate = new Date(now.getTime() + 5 * 60000)

    if (scheduledDate <= now) {
      const pastBy = Math.round((now.getTime() - scheduledDate.getTime()) / 60000)
      setErrorMessage(
        `The scheduled date/time is ${pastBy} minute${pastBy !== 1 ? 's' : ''} in the past. ` +
        `Please select a future date and time, or use "Publish Now" to publish immediately.`
      )
      return false
    }
    if (scheduledDate < minimumDate) {
      setErrorMessage(
        'The scheduled date/time is too soon. Please select a time at least 5 minutes from now, ' +
        'or use "Publish Now" to publish immediately.'
      )
      return false
    }
    return true
  }

  const handleSubmit = async (publishNow: boolean) => {
    setErrorMessage(null)

    if (!formData.title.trim()) { setErrorMessage('Article title is required.'); return }
    if (!formData.excerpt.trim()) { setErrorMessage('Headline/summary is required.'); return }
    if (!formData.category) { setErrorMessage('Please select a category.'); return }
    if (!formData.date) { setErrorMessage('Article date is required.'); return }

    if (!publishNow) {
      if (!scheduledDateTime) {
        setErrorMessage('Please select a scheduled date and time, or use "Publish Now" to publish immediately.')
        return
      }
      if (!validateScheduledDate(scheduledDateTime)) return
    }

    setIsLoading(true)

    try {
      let imageUrl = formData.image_url
      if (imageFile) {
        setUploadingImage(true)
        imageUrl = await uploadImage(imageFile)
        setUploadingImage(false)
      }

      const dataToSave = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content?.trim() || null,
        category: formData.category,
        date: formData.date,
        image_url: imageUrl,
        url: formData.url?.trim() || null,
        is_published: publishNow,
        scheduled_date: (!publishNow && scheduledDateTime)
          ? new Date(scheduledDateTime).toISOString()
          : null,
      }

      if (news?.id) {
        const { error } = await supabase
          .from('news_updates')
          .update({ ...dataToSave, updated_at: new Date().toISOString() })
          .eq('id', news.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('news_updates').insert([dataToSave])
        if (error) throw error
      }

      onSuccess()
      onOpenChange(false)
    } catch (error: unknown) {
      console.error('Error saving news:', error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to save the article. Please check your connection and try again.'
      )
    } finally {
      setIsLoading(false)
      setUploadingImage(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrorMessage(null)
  }

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value })
    setErrorMessage(null)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    setFormData({ ...formData, image_url: '' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200">
          <DialogTitle>{news ? 'Edit News Article' : 'Add News Article'}</DialogTitle>
          <DialogDescription>
            {news
              ? 'Update the news article details below.'
              : 'Fill in the details to create a new news article.'}
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}

        <div className="px-6 py-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">

          {/* Image Upload + Title/URL Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm">Cover Image</Label>
              {imagePreview ? (
                <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden group">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-orange-50 hover:border-orange-300 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500 text-center">
                    <span className="font-semibold">Click to upload</span><br />PNG, JPG up to 5MB
                  </p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} disabled={isLoading} />
                </label>
              )}
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-sm">Title *</Label>
                <Input
                  id="title" name="title"
                  value={formData.title} onChange={handleChange}
                  required placeholder="Enter news title"
                  disabled={isLoading} className="h-9 text-sm"
                  suppressHydrationWarning
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="url" className="text-sm">Article URL</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                  <Input
                    id="url" name="url" type="url"
                    value={formData.url} onChange={handleChange}
                    placeholder="https://example.com/article"
                    disabled={isLoading} className="pl-9 h-9 text-sm"
                    suppressHydrationWarning
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-1.5">
            <Label htmlFor="excerpt" className="text-sm">Headline *</Label>
            <Textarea
              id="excerpt" name="excerpt"
              value={formData.excerpt} onChange={handleChange}
              required placeholder="Brief headline or summary shown on the news card…"
              rows={2} disabled={isLoading} className="text-sm resize-none"
            />
          </div>

          {/* ── Main Article ── */}
          <div className="space-y-1.5">
            <Label htmlFor="content" className="text-sm flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-gray-500" />
              Main Article
              <span className="text-xs font-normal text-gray-400 ml-1">
                — displayed when readers open the article
              </span>
            </Label>
            <Textarea
              id="content" name="content"
              value={formData.content ?? ''}
              onChange={handleChange}
              placeholder="Write the full article body here. Readers will see this when they click to open the article…"
              rows={7}
              disabled={isLoading}
              className="text-sm resize-y leading-relaxed"
            />
          </div>

          {/* Category + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm">Category *</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange} disabled={isLoading}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {NEWS_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date" className="text-sm">Article Date *</Label>
              <Input
                id="date" name="date" type="date"
                value={formData.date} onChange={handleChange}
                required disabled={isLoading} className="h-9 text-sm"
                suppressHydrationWarning
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-1.5 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <Label htmlFor="scheduled_date" className="text-sm font-medium text-orange-900 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Schedule Publishing (Optional)
            </Label>
            <Input
              id="scheduled_date" type="datetime-local"
              value={scheduledDateTime}
              onChange={(e) => { setScheduledDateTime(e.target.value); setErrorMessage(null) }}
              min={new Date(Date.now() + 5 * 60000).toISOString().slice(0, 16)}
              disabled={isLoading}
              className="h-9 text-sm border-orange-300 focus:border-orange-500"
              suppressHydrationWarning
            />
            <p className="text-xs text-orange-700">
              Set a future date/time to schedule publication, or leave empty to publish now
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} size="sm">
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isLoading || uploadingImage || !scheduledDateTime}
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Clock className="w-4 h-4 mr-1" />
              {uploadingImage ? 'Uploading...' : isLoading ? 'Saving...' : 'Schedule'}
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isLoading || uploadingImage}
              size="sm"
              className="bg-blue-600 hover:bg-orange-600 transition-colors"
            >
              <Send className="w-4 h-4 mr-1" />
              {uploadingImage ? 'Uploading...' : isLoading ? 'Publishing...' : 'Publish Now'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NewsDialog