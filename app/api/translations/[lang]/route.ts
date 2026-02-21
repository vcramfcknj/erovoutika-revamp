import { NextRequest, NextResponse } from 'next/server'
import { Translate } from '@google-cloud/translate/build/src/v2'
import { translations } from '@/lib/i18n/translations'
import { LANGUAGES } from '@/lib/i18n/languages'

// Initialize Google Translate
const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY,
})

// In-memory cache
const translationCache = new Map<string, any>()

async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    const [translation] = await translate.translate(text, targetLang)
    return translation
  } catch (error) {
    console.error('Translation error:', error)
    return text
  }
}

async function translateObject(obj: any, targetLang: string): Promise<any> {
  if (typeof obj === 'string') {
    return await translateText(obj, targetLang)
  }

  if (typeof obj === 'object' && obj !== null) {
    const translated: any = {}
    for (const [key, value] of Object.entries(obj)) {
      translated[key] = await translateObject(value, targetLang)
    }
    return translated
  }

  return obj
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params

  // Return English as-is
  if (lang === 'en') {
    return NextResponse.json(translations.en)
  }

  // Check if language is supported
  const language = LANGUAGES.find(l => l.code === lang)
  if (!language) {
    return NextResponse.json(
      { error: 'Language not supported' },
      { status: 400 }
    )
  }

  // Check cache first
  if (translationCache.has(lang)) {
    return NextResponse.json(translationCache.get(lang))
  }

  try {
    console.log(`Translating to ${lang}...`)
    
    // Translate the base translations
    const translated = await translateObject(translations.en, lang)
    
    // Cache the result
    translationCache.set(lang, translated)
    
    console.log(`Translation to ${lang} complete!`)
    
    return NextResponse.json(translated)
  } catch (error: any) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Translation failed', details: error.message },
      { status: 500 }
    )
  }
}