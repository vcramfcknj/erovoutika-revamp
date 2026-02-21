'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, MapPin, Mail, Phone } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/admin')
      }
    }
    checkUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      if (data.user) {
        router.push('/admin')
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-2 bg-white dark:bg-gray-950 transition-colors">

      {/* Left Side */}
      <div className="hidden lg:flex relative bg-linear-to-br from-blue-600 via-blue-700 to-blue-900 flex-col justify-between p-12 lg:p-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <Image 
              src="/e_logo.svg"
              alt="E Logo"
              width={800}
              height={800}
              className="w-full max-w-4xl h-auto"
              priority
            />
          </div>
        </div>

        <div className="absolute top-20 -left-20 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse z-0"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000 z-0"></div>

        <div className="relative z-20">
          <div className="max-w-lg">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
              WELCOME
            </h1>
            <div className="w-32 h-1 bg-linear-to-r from-orange-400 to-orange-600 mb-8"></div>
            <p className="text-2xl text-blue-50 font-light mb-4">
              Admin Content Management System
            </p>
            <p className="text-lg text-blue-100 leading-relaxed">
              Manage your website content, news, awards, and partners all in one secure dashboard.
            </p>
          </div>
        </div>

        <div className="relative z-20 flex items-end gap-8">
          <div className="shrink-0">
            <Image 
              src="/footer_logo.png"
              alt="Erovoutika"
              width={200}
              height={60}
              className="h-16 w-auto brightness-0 invert"
            />
          </div>

          <div className="w-px h-20 bg-white/30 shrink-0"></div>

          <div className="space-y-3 text-white">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-300 shrink-0 mt-0.5" />
              <p className="text-blue-100 text-xs leading-relaxed">
                PARC HOUSE II, Unit 703, EDSA, Makati City, 1212
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-300 shrink-0" />
              <a 
                href="mailto:info@erovoutika.ph" 
                className="text-blue-100 hover:text-orange-300 transition-colors text-xs"
              >
                info@erovoutika.ph
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-300 shrink-0" />
              <a 
                href="tel:+639061497307" 
                className="text-blue-100 hover:text-orange-300 transition-colors text-xs"
              >
                +63 906 149 7307
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-16 bg-white dark:bg-gray-950 transition-colors">
        <div className="w-full max-w-md">

          <div className="flex justify-center mb-8 lg:mb-12">
            <Image 
              src="/erovoutika-logo.png" 
              alt="Erovoutika" 
              width={200} 
              height={70}
              className="h-16 sm:h-20 w-auto"
            />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Sign in
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
              to continue to Erovoutika CMS
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@erovoutika.ph"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="h-11 sm:h-12 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 rounded-lg transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <button
                  type="button"
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="h-11 sm:h-12 pr-12 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 rounded-lg transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-orange-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-orange-600 hover:to-orange-700 text-white h-11 sm:h-12 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all text-base mt-6"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'SIGN IN'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              🔒 Secure admin-only access
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}