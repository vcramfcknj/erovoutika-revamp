'use client'

import { Barlow_Condensed } from 'next/font/google'
const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700'], display: 'swap' })

import { Mail, MapPin, Phone, Send, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n/languageContext'

export function Contact() {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          message: formData.message,
          is_read: false,
        }])

      if (error) throw error

      setIsSuccess(true)
      setFormData({ name: '', email: '', message: '' })

      setTimeout(() => setIsSuccess(false), 5000)
    } catch (err: any) {
      setError(t.contact.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-6">
          <h2 className={`text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-slate-100 ${barlowCondensed.className}}`}>
            {t.contact.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-slate-700">

            {/* Success Message */}
            {isSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium">{t.contact.success}</p>
                  <p className="text-green-600 text-sm">{t.contact.successDesc}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">⚠️ {error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t.contact.name}</Label>
                <Input
                  id="name"
                  placeholder={t.contact.namePlaceholder}
                  required
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t.contact.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.contact.emailPlaceholder}
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{t.contact.message}</Label>
                <Textarea
                  id="message"
                  placeholder={t.contact.messagePlaceholder}
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg h-10 font-medium shadow-md hover:shadow-lg transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.contact.sending}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t.contact.send}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-slate-700 space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">{t.contact.contactInfo}</h3>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-1">{t.contact.address}</h4>
                  <p className="text-gray-600 dark:text-slate-400">{t.contact.addressText}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-1">{t.contact.email}</h4>
                  <a href="mailto:info@erovoutika.ph" className="text-orange-600 hover:text-orange-700">
                    info@erovoutika.ph
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-1">{t.contact.phone}</h4>
                  <a href="tel:+639061497307" className="text-orange-600 hover:text-orange-700">
                    +63 906 149 7307
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-slate-700 h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.3087374157746!2d121.04721931484065!3d14.565006989825535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c90264a0cfb5%3A0x2b6e7c4e8c9a5e8!2sEpifanio%20de%20los%20Santos%20Ave%2C%20Makati%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}