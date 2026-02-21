import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { translateFields } from '@/lib/translateText'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lang = searchParams.get('lang') || 'en'

  try {
    // Fetch news from database
    const { data, error } = await supabase
      .from('news_updates')
      .select('*')
      .eq('is_published', true)
      .order('date', { ascending: false })
      .limit(4)

    if (error) throw error

    // Translate if not English
    if (lang !== 'en' && data) {
      const translatedNews = await Promise.all(
        data.map(item => translateFields(
          item, 
          ['title', 'excerpt', 'category', 'content'], // Added 'content' here
          lang
        ))
      )
      return NextResponse.json(translatedNews)
    }

    return NextResponse.json(data || [])
  } catch (error: unknown) {
    console.error('Error fetching/translating news:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Failed to fetch news', details: errorMessage },
      { status: 500 }
    )
  }
}