import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { translateFields } from '@/lib/translateText'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server key
)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lang = searchParams.get('lang') || 'en'

  try {
    const { data, error } = await supabase
      .from('awards')
      .select('*')
      .order('year', { ascending: false })
      .limit(6)

    if (error) throw error

    if (lang !== 'en' && data) {
      const translatedAwards = await Promise.all(
        data.map(item =>
          translateFields(
            item,
            ['title', 'recipient', 'description', 'category'],
            lang
          )
        )
      )

      return NextResponse.json(translatedAwards)
    }

    return NextResponse.json(data || [])
  } catch (error: unknown) {
    console.error('Error fetching/translating awards:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to fetch awards', details: errorMessage },
      { status: 500 }
    )
  }
}