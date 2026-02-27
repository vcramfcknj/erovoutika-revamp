'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Upload, X, Link as LinkIcon, Send, Clock, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

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

export default function NewNewsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [scheduledDateTime, setScheduledDateTime] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    image_url: '',
    url: '',
  })

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image must be less than 5MB')
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
      setErrorMessage('Scheduled date must be in the future')
      return false
    }
    if (scheduledDate < minimumDate) {
      setErrorMessage('Scheduled date must be at least 5 minutes from now')
      return false
    }
    return true
  }

  const handleSubmit = async (publishNow: boolean) => {
    setErrorMessage(null)

    if (!formData.title.trim()) { setErrorMessage('Title is required'); return }
    if (!formData.excerpt.trim()) { setErrorMessage('Headline is required'); return }
    if (!formData.category) { setErrorMessage('Category is required'); return }
    if (!formData.date) { setErrorMessage('Date is required'); return }

    if (!publishNow && scheduledDateTime && !validateScheduledDate(scheduledDateTime)) return

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
        scheduled_date: (!publishNow && scheduledDateTime) ? new Date(scheduledDateTime).toISOString() : null,
      }

      const { error } = await supabase.from('news_updates').insert([dataToSave])
      if (error) throw error

      router.push('/admin/news')
    } catch (error: unknown) {
      console.error('Error saving news:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save article')
    } finally {
      setIsLoading(false)
      setUploadingImage(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrorMessage(null)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    setFormData({ ...formData, image_url: '' })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/news')}
            className="text-sm"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add News Article</h1>
            <p className="text-sm text-gray-500 mt-0.5">Create a new article or announcement</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* Main Form */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="col-span-2 space-y-4">
          {/* Title */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <Label htmlFor="title" className="text-sm font-semibold mb-2 block">Article Title *</Label>
            <Input
              id="title" name="title"
              value={formData.title} onChange={handleChange}
              placeholder="Enter article title..."
              disabled={isLoading}
              className="text-base"
            />
          </div>

          {/* Headline/Excerpt */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <Label htmlFor="excerpt" className="text-sm font-semibold mb-2 block">Headline / Summary *</Label>
            <Textarea
              id="excerpt" name="excerpt"
              value={formData.excerpt} onChange={handleChange}
              placeholder="Brief summary displayed on cards..."
              rows={2}
              disabled={isLoading}
              className="text-sm resize-none"
            />
            <p className="text-xs text-gray-500 mt-1.5">This appears on the news card preview</p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <Label htmlFor="content" className="text-sm font-semibold mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              Full Article Content
            </Label>
            <Textarea
              id="content" name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write the full article body here..."
              rows={12}
              disabled={isLoading}
              className="text-sm resize-y font-mono"
            />
            <p className="text-xs text-gray-500 mt-1.5">This appears when readers open the full article</p>
          </div>
        </div>

        {/* Right Column - Metadata */}
        <div className="col-span-1 space-y-4">
          {/* Cover Image */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-gray-500" />
              Cover Image
            </Label>
            {imagePreview ? (
              <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden group">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-orange-50 hover:border-orange-300 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-xs text-gray-500 text-center px-2">
                  <span className="font-semibold">Click to upload</span><br />
                  PNG or JPG (max 5MB)
                </p>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} disabled={isLoading} />
              </label>
            )}
          </div>

          {/* Category */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <Label className="text-sm font-semibold mb-3 block">Category *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })} 
              disabled={isLoading}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {NEWS_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-sm">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Article Date */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <Label htmlFor="date" className="text-sm font-semibold mb-3 block">Article Date *</Label>
            <Input
              id="date" name="date" type="date"
              value={formData.date} onChange={handleChange}
              disabled={isLoading}
              className="text-sm"
            />
          </div>

          {/* Source URL */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <Label htmlFor="url" className="text-sm font-semibold mb-3 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-gray-500" />
              Source URL
            </Label>
            <Input
              id="url" name="url" type="url"
              value={formData.url} onChange={handleChange}
              placeholder="https://..."
              disabled={isLoading}
              className="text-sm"
            />
            <p className="text-xs text-gray-500 mt-1.5">Optional external link</p>
          </div>

          {/* Schedule Publishing */}
          <div className="bg-orange-50 rounded-lg border border-orange-200 p-5">
            <Label htmlFor="scheduled_date" className="text-sm font-semibold mb-3 flex items-center gap-2 text-orange-900">
              <Clock className="w-4 h-4" />
              Schedule Publishing
            </Label>
            <Input
              id="scheduled_date" type="datetime-local"
              value={scheduledDateTime}
              onChange={(e) => { setScheduledDateTime(e.target.value); setErrorMessage(null) }}
              min={new Date(Date.now() + 5 * 60000).toISOString().slice(0, 16)}
              disabled={isLoading}
              className="text-sm border-orange-300"
            />
            <p className="text-xs text-orange-700 mt-1.5">Leave empty to publish immediately</p>
          </div>
        </div>
      </div>

      {/* Action Buttons - Sticky Footer */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-6 px-6 flex justify-between items-center shadow-lg rounded-t-lg">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/news')}
          disabled={isLoading}
          className="text-sm"
        >
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isLoading || uploadingImage || !scheduledDateTime}
            variant="outline"
            className="text-sm border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            <Clock className="w-4 h-4 mr-1.5" />
            {uploadingImage ? 'Uploading...' : isLoading ? 'Saving...' : 'Schedule'}
          </Button>
          <Button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isLoading || uploadingImage}
            className="bg-blue-600 hover:bg-blue-700 text-sm"
          >
            <Send className="w-4 h-4 mr-1.5" />
            {uploadingImage ? 'Uploading...' : isLoading ? 'Publishing...' : 'Publish Now'}
          </Button>
        </div>
      </div>
    </div>
  )
}