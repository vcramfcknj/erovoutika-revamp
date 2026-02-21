'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, TranslationKeys } from './translations'

type LanguageContextType = {
  language: string
  setLanguage: (lang: string) => void
  t: TranslationKeys
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState('en')
  const [translationsData, setTranslationsData] = useState<TranslationKeys>(translations.en)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en'
    setLanguageState(savedLang)
    if (savedLang !== 'en') {
      loadTranslations(savedLang)
    }
  }, [])

  const loadTranslations = async (lang: string) => {
    if (lang === 'en') {
      setTranslationsData(translations.en)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/translations/${lang}`)
      if (response.ok) {
        const data = await response.json()
        setTranslationsData(data)
      } else {
        console.error('Failed to load translations')
        setTranslationsData(translations.en)
      }
    } catch (error) {
      console.error('Error loading translations:', error)
      setTranslationsData(translations.en)
    } finally {
      setIsLoading(false)
    }
  }

  const setLanguage = (lang: string) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    loadTranslations(lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translationsData, isLoading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}