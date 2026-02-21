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
import { Upload, X, Globe, Building2, GraduationCap } from 'lucide-react'
import Image from 'next/image'

type Partner = {
  id?: string
  name: string
  description: string | null
  website_url: string | null
  image_url: string | null
  category: string | null
  type: 'industry' | 'academe'
}

type PartnerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  partner: Partner | null
  onSuccess: () => void
}

export function PartnerDialog({ open, onOpenChange, partner, onSuccess }: PartnerDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [formData, setFormData] = useState<Partner>({
    name: '',
    description: null,
    website_url: null,
    image_url: null,
    category: null,
    type: 'industry',
  })

  useEffect(() => {
    if (partner) {
      setFormData({
        name: partner.name,
        description: partner.description,
        website_url: partner.website_url,
        image_url: partner.image_url,
        category: partner.category,
        type: partner.type || 'industry',
      })
      setImagePreview(partner.image_url || '')
    } else {
      setFormData({
        name: '',
        description: null,
        website_url: null,
        image_url: null,
        category: null,
        type: 'industry',
      })
      setImagePreview('')
    }
    setImageFile(null)
  }, [partner, open])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
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
        name: formData.name,
        description: formData.description || null,
        website_url: formData.website_url || null,
        image_url: imageUrl || null,
        category: formData.category || null,
        type: formData.type,
      }

      if (partner?.id) {
        const { error } = await supabase
          .from('partners')
          .update({ ...dataToSave, updated_at: new Date().toISOString() })
          .eq('id', partner.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('partners')
          .insert([dataToSave])
        if (error) throw error
      }

      onSuccess()
      onOpenChange(false)
    } catch (error: unknown) {
      console.error('Error saving partner:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save partner'
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
          <DialogTitle>{partner ? 'Edit Partner' : 'Add Partner'}</DialogTitle>
          <DialogDescription>
            {partner ? 'Update the partner details below.' : 'Fill in the details to add a new partner.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-6 py-4 space-y-4">

            {/* Image + Name/Type Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Image Upload */}
              <div className="space-y-1.5">
                <Label className="text-sm">Partner Logo (optional)</Label>
                {imagePreview ? (
                  <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden group">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain p-2"
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

              {/* Name + Partner Type stacked */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm">Partner Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Acme Corporation"
                    disabled={isLoading}
                    className="h-9 text-sm"
                  />
                </div>

                {/* Partner Type Dropdown */}
                <div className="space-y-1.5">
                  <Label className="text-sm">Partner Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'industry' | 'academe') =>
                      setFormData({ ...formData, type: value })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Select partner type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="industry">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span>Industry Partner</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="academe">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-green-600" />
                          <span>Academe Partner</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Category + Website Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-sm">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleChange}
                  placeholder="e.g., Technology, Education"
                  disabled={isLoading}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="website_url" className="text-sm">Website URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                  <Input
                    id="website_url"
                    name="website_url"
                    type="url"
                    value={formData.website_url || ''}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    disabled={isLoading}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-sm">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Brief description of the partner..."
                rows={2}
                disabled={isLoading}
                className="text-sm resize-none"
              />
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
              className="bg-blue-600 hover:bg-orange-600 transition-colors"
            >
              {uploadingImage ? 'Uploading...' : isLoading ? 'Saving...' : partner ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}