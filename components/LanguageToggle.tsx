'use client'

import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/lib/i18n/languageContext'
import { LANGUAGES, getLanguageByCode, getPopularLanguages } from '@/lib/i18n/languages'
import { Globe, Search, Check } from 'lucide-react'
import * as flags from 'country-flag-icons/react/3x2'

// ---------------------------
// Move FlagIcon outside the component
// ---------------------------
const FlagIcon = ({ code }: { code: string }) => {
  const FlagComponent = (flags as Record<string, React.ComponentType<{ className?: string }>>)[code]

  if (!FlagComponent) {
    return (
      <div className="w-5 h-4 rounded-sm bg-gray-200 flex items-center justify-center">
        <span className="text-[8px]">{code}</span>
      </div>
    )
  }

  return (
    <div className="w-5 h-4 rounded-sm overflow-hidden shrink-0 shadow-sm">
      <FlagComponent className="w-full h-full object-cover" />
    </div>
  )
}

// ---------------------------
// LanguageToggle Component
// ---------------------------
export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLang = getLanguageByCode(language)
  const popularLanguages = getPopularLanguages()

  const filteredLanguages = LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode)
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <FlagIcon code={currentLang.flag} />
        <span className="text-sm font-medium text-gray-700">{currentLang.code.toUpperCase()}</span>
        <Globe className="w-4 h-4 text-gray-500" />
      </button>

      {/* Dropdown */}
      {isOpen && (
         <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-125 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Language</h3>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          {/* Languages List */}
          <div className="overflow-y-auto flex-1">
            {!searchQuery && (
              <>
                {/* Popular Languages */}
                <div className="p-2">
                  <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Popular</p>
                  {popularLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-orange-50 transition-colors ${
                        language === lang.code ? 'bg-orange-50' : ''
                      }`}
                    >
                      <FlagIcon code={lang.flag} />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">{lang.name}</p>
                        <p className="text-xs text-gray-500">{lang.nativeName}</p>
                      </div>
                      {language === lang.code && <Check className="w-4 h-4 text-orange-600" />}
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-200 my-2"></div>
              </>
            )}

            {/* All Languages */}
            <div className="p-2">
              {!searchQuery && (
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                  All Languages ({LANGUAGES.length})
                </p>
              )}
              {filteredLanguages.length === 0 ? (
                <p className="px-3 py-4 text-sm text-gray-500 text-center">No languages found</p>
              ) : (
                filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-orange-50 transition-colors ${
                      language === lang.code ? 'bg-orange-50' : ''
                    }`}
                  >
                    <FlagIcon code={lang.flag} />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900">{lang.name}</p>
                      <p className="text-xs text-gray-500">{lang.nativeName}</p>
                    </div>
                    {language === lang.code && <Check className="w-4 h-4 text-orange-600" />}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <p className="text-xs text-gray-500 text-center">Powered by Google Translate</p>
          </div>
        </div>
      )}
    </div>
  )
}