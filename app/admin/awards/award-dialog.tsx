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
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

type Award = {
  id?: string
  title: string
  recipient: string
  description: string
  year: string
  category: string
  image_url: string | null
}

type AwardDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  award: Award | null
  onSuccess: () => void
}

const AWARD_CATEGORIES = [
  'Innovation',
  'Competition',
  'Excellence',
  'Research',
  'Community Service',
  'Leadership',
  'Technical Achievement',
  'Best Project'
]

export function AwardDialog({ open, onOpenChange, award, onSuccess }: AwardDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [formData, setFormData] = useState<Award>({
    title: '',
    recipient: '',
    description: '',
    year: '',
    category: '',
    image_url: null,
  })

  useEffect(() => {
    if (award) {
      setFormData({
        title: award.title,
        recipient: award.recipient,
        description: award.description,
        year: award.year,
        category: award.category,
        image_url: award.image_url || null,
      })
      setImagePreview(award.image_url || '')
    } else {
      setFormData({
        title: '',
        recipient: '',
        description: '',
        year: '',
        category: '',
        image_url: null,
      })
      setImagePreview('')
    }
    setImageFile(null)
  }, [award, open])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('news-images')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('news-images')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let imageUrl = formData.image_url

      if (imageFile) {
        setUploadingImage(true)
        imageUrl = await uploadImage(imageFile)
        setUploadingImage(false)
      }

      const dataToSave = {
        title: formData.title,
        recipient: formData.recipient,
        description: formData.description,
        year: formData.year,
        category: formData.category,
        image_url: imageUrl || null,
      }

      if (award?.id) {
        const { error } = await supabase
          .from('awards')
          .update({ ...dataToSave, updated_at: new Date().toISOString() })
          .eq('id', award.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('awards')
          .insert([dataToSave])
        if (error) throw error
      }

      onSuccess()
      onOpenChange(false)
    } catch (error: unknown) {
      console.error('Error saving award:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save award'
      alert(errorMessage)
    } finally {
      setIsLoading(false)
      setUploadingImage(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    setFormData({ ...formData, image_url: null })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200">
          <DialogTitle>{award ? 'Edit Award' : 'Add Award'}</DialogTitle>
          <DialogDescription>
            {award ? 'Update the award details below.' : 'Fill in the details to create a new award.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="px-6 py-4 space-y-4">
            {/* Image + Title/Recipient Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Image Upload */}
              <div className="space-y-1.5">
                <Label className="text-sm">Award Image (optional)</Label>
                {imagePreview ? (
                  <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden group">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
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
                      <span className="font-semibold">Click to upload</span>
                      <br />PNG, JPG up to 5MB
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageSelect}
                      disabled={isLoading}
                    />
                  </label>
                )}
              </div>

              {/* Title + Recipient stacked */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-sm">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Best Innovation Award"
                    disabled={isLoading}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="recipient" className="text-sm">Recipient *</Label>
                  <Input
                    id="recipient"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Team Innovators"
                    disabled={isLoading}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-sm">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Brief description of the achievement..."
                rows={2}
                disabled={isLoading}
                className="text-sm resize-none"
              />
            </div>

            {/* Category and Year */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {AWARD_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="year" className="text-sm">Year / Period *</Label>
                <Input
                  id="year"
                  name="year"
                  type="text"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 2024 or 2023-2024"
                  disabled={isLoading}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || uploadingImage}
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 transition-colors"
            >
              {uploadingImage ? 'Uploading...' : isLoading ? 'Saving...' : award ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}